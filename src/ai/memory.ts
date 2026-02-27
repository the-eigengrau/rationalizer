import type { AIProvider } from './anthropic.js';
import type { Memory, ConversationMessage, REBTEntry } from '../questionnaire/types.js';
import { getMemories, saveMemory, getRecentEntries, generateId } from '../storage/index.js';
import { buildMemoryExtractionPrompt, summarizeEntry } from './prompt.js';

export function loadMemories(limit = 30): Memory[] {
  return getMemories(limit);
}

export function loadRecentSummaries(limit = 3): string[] {
  const entries = getRecentEntries(limit);
  return entries.map(summarizeEntry);
}

export async function extractAndSaveMemories(
  provider: AIProvider,
  conversationMessages: ConversationMessage[],
  entryId: string,
): Promise<void> {
  const existingMemories = getMemories();
  const extractionPrompt = buildMemoryExtractionPrompt(existingMemories);

  // Ask the AI to extract memories from the conversation
  const messages: ConversationMessage[] = [
    ...conversationMessages,
    { role: 'user', content: extractionPrompt },
  ];

  let response = '';
  try {
    response = await provider.chat(
      messages,
      'You are a memory extraction assistant. Extract facts and return ONLY valid JSON.',
      (_text) => { /* silent — no streaming output for background extraction */ },
    );
  } catch {
    // Memory extraction is best-effort, don't crash the app
    return;
  }

  // Parse the JSON response
  try {
    // Try to find JSON array in the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return;

    const newMemories = JSON.parse(jsonMatch[0]) as Array<{
      category: string;
      content: string;
    }>;

    if (!Array.isArray(newMemories)) return;

    for (const mem of newMemories) {
      if (mem.category && mem.content && mem.content.length <= 500 && ['personal', 'pattern', 'progress', 'theme'].includes(mem.category)) {
        saveMemory({
          id: generateId(),
          createdAt: new Date().toISOString(),
          category: mem.category as Memory['category'],
          content: mem.content,
          sourceEntryId: entryId,
        });
      }
    }
  } catch {
    // Best-effort parsing
  }
}
