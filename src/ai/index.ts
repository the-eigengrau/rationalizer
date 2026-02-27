import type { AIProvider } from './anthropic.js';
import { createAnthropicProvider } from './anthropic.js';
import { createOllamaProvider } from './ollama.js';
import { runConversation } from './conversation.js';
import { summarizeEntry } from './prompt.js';
import type { AppConfig } from '../questionnaire/types.js';
import type { REBTEntry } from '../questionnaire/types.js';

export function createProvider(config: AppConfig): AIProvider | null {
  switch (config.ai.provider) {
    case 'anthropic': {
      const apiKey = config.ai.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return null;
      return createAnthropicProvider(apiKey);
    }
    case 'ollama':
      return createOllamaProvider(config.ai.ollamaModel, config.ai.ollamaUrl);
    case 'none':
    default:
      return null;
  }
}

export async function runAISession(config: AppConfig, entry: REBTEntry): Promise<void> {
  const provider = createProvider(config);
  if (!provider) return;

  await runConversation(provider, entry);
}

export async function generateFarewell(config: AppConfig, entry: REBTEntry): Promise<string | null> {
  const provider = createProvider(config);
  if (!provider) return null;

  const systemPrompt = `You generate a single concise Stoic-inspired one-liner to close a journaling session. The line should subtly reinforce the lesson from the person's reflection. No quotes, no attribution, no preamble — just the line itself. One sentence, maximum 15 words. Warm but grounded.`;

  const summary = summarizeEntry(entry);
  const userMessage = `Here's what they worked through today:\n\n${summary}\n\nGenerate the closing one-liner.`;

  try {
    let result = '';
    await provider.chat(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      (text) => { result += text; },
    );
    return result.trim();
  } catch {
    return null;
  }
}

export type { AIProvider } from './anthropic.js';
