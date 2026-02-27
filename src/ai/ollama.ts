import type { AIProvider } from './anthropic.js';
import type { ConversationMessage } from '../questionnaire/types.js';

export function createOllamaProvider(model: string, baseUrl: string): AIProvider {
  return {
    async chat(messages, systemPrompt, onText) {
      const ollamaMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ];

      let response: Response;
      try {
        response = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: ollamaMessages,
            stream: true,
          }),
        });
      } catch (error) {
        throw new Error(
          'Could not connect to Ollama. Make sure it\'s running with: ollama serve'
        );
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Ollama error (${response.status}): ${body}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body from Ollama');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Ollama streams NDJSON — one JSON object per line
        const lines = chunk.split('\n').filter(l => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              const text = data.message.content;
              fullResponse += text;
              onText(text);
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }

      return fullResponse;
    },
  };
}
