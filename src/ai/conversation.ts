import { createInterface } from 'node:readline';
import type { AIProvider } from './anthropic.js';
import type { REBTEntry, ConversationMessage, Conversation } from '../questionnaire/types.js';
import { buildSystemPrompt, buildEntryMessage } from './prompt.js';
import { loadMemories, loadRecentSummaries, extractAndSaveMemories } from './memory.js';
import { saveConversation, generateId } from '../storage/index.js';
import { colors } from '../ui/theme.js';
import { t } from '../i18n/index.js';

const THINKING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const MAX_LINE_WIDTH = 72;

function startThinking(): { stop: () => void } {
  let frameIndex = 0;
  let stopped = false;

  const interval = setInterval(() => {
    if (stopped) return;
    const frame = THINKING_FRAMES[frameIndex % THINKING_FRAMES.length];
    process.stdout.write(`\r  ${colors.subtle(frame)}`);
    frameIndex++;
  }, 80);

  return {
    stop() {
      stopped = true;
      clearInterval(interval);
      process.stdout.write('\r\x1b[2K');
    },
  };
}

function wrapText(text: string, width: number, indent: string): string {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';
    for (const word of words) {
      if (currentLine.length + word.length + 1 > width) {
        lines.push(indent + currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      }
    }
    if (currentLine) lines.push(indent + currentLine);
  }
  return lines.join('\n');
}

export async function runConversation(
  provider: AIProvider,
  entry: REBTEntry,
): Promise<void> {
  const memories = loadMemories();
  const recentSummaries = loadRecentSummaries();
  const systemPrompt = buildSystemPrompt(memories, recentSummaries);

  const messages: ConversationMessage[] = [
    { role: 'user', content: buildEntryMessage(entry) },
  ];

  console.clear();
  console.log();
  console.log(colors.dim(`  ${t().conversation.doneHint}`));

  // Get initial response
  await streamResponse(provider, messages, systemPrompt);

  // Multi-turn conversation loop
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const getInput = (): Promise<string | null> => {
    return new Promise((resolve) => {
      process.stdout.write(colors.dimWhite('\n  › '));

      const onLine = (line: string) => {
        // Overwrite the › prompt with "Me" label
        process.stdout.write(`\x1b[1A\x1b[2K`);
        process.stdout.write(`  ${colors.dimWhite(t().conversation.me)}\n  ${line}\n`);
        rl.removeListener('line', onLine);
        rl.removeListener('close', onClose);
        resolve(line);
      };

      const onClose = () => {
        rl.removeListener('line', onLine);
        resolve(null);
      };

      rl.once('line', onLine);
      rl.once('close', onClose);
    });
  };

  while (true) {
    const userInput = await getInput();

    if (userInput === null || userInput.trim().toLowerCase() === '/done') {
      console.log();
      break;
    }

    if (userInput.trim() === '') continue;

    messages.push({ role: 'user', content: userInput });
    await streamResponse(provider, messages, systemPrompt);
  }

  rl.close();

  // Save conversation
  const conversation: Conversation = {
    id: generateId(),
    entryId: entry.id,
    createdAt: new Date().toISOString(),
    messages,
  };
  saveConversation(conversation);

  // Extract memories
  const thinking = startThinking();
  try {
    await extractAndSaveMemories(provider, messages, entry.id);
    thinking.stop();
  } catch {
    thinking.stop();
  }
}

async function streamResponse(
  provider: AIProvider,
  messages: ConversationMessage[],
  systemPrompt: string,
): Promise<void> {
  const thinking = startThinking();
  let firstToken = true;
  let buffer = '';
  let col = 0;
  const indent = '  ';

  let fullResponse = '';
  try {
    fullResponse = await provider.chat(messages, systemPrompt, (text) => {
      if (firstToken) {
        thinking.stop();
        process.stdout.write(`\n  ${colors.primary(t().conversation.rationalizer)}\n  `);
        col = 0;
        firstToken = false;
      }

      // Word-wrap streaming output
      for (const ch of text) {
        if (ch === '\n') {
          process.stdout.write(`\n${indent}`);
          col = 0;
        } else {
          if (col >= MAX_LINE_WIDTH && ch === ' ') {
            process.stdout.write(`\n${indent}`);
            col = 0;
          } else {
            process.stdout.write(colors.white(ch));
            col++;
          }
        }
      }
    });
  } catch (error) {
    thinking.stop();
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.log(colors.error(`  ${t().conversation.error(msg)}`));
    return;
  }

  if (firstToken) thinking.stop();
  console.log();
  messages.push({ role: 'assistant', content: fullResponse });
}
