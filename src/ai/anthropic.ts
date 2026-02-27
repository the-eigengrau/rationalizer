import Anthropic from '@anthropic-ai/sdk';
import type { ConversationMessage } from '../questionnaire/types.js';

export interface AIProvider {
  chat(messages: ConversationMessage[], systemPrompt: string, onText: (text: string) => void): Promise<string>;
}

export function createAnthropicProvider(apiKey: string): AIProvider {
  const client = new Anthropic({ apiKey });

  return {
    async chat(messages, systemPrompt, onText) {
      let fullResponse = '';

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const text = event.delta.text;
          fullResponse += text;
          onText(text);
        }
      }

      return fullResponse;
    },
  };
}
