import { z } from 'zod';

export const configSchema = z.object({
  version: z.number().default(1),
  encryption: z.object({
    mode: z.enum(['cached', 'always', 'none']).default('cached'),
    salt: z.string().default(''),
    iterations: z.number().default(100000),
    cacheTTLMinutes: z.number().default(60),
    sentinel: z.string().optional(),
    sentinelIv: z.string().optional(),
    sentinelAuthTag: z.string().optional(),
  }),
  ai: z.object({
    provider: z.enum(['anthropic', 'ollama', 'none']).default('none'),
    anthropicApiKey: z.string().default(''),
    ollamaModel: z.string().default('llama3.2'),
    ollamaUrl: z.string().default('http://localhost:11434'),
  }),
  preferences: z.object({
    showTips: z.boolean().default(true),
    animationsEnabled: z.boolean().default(true),
  }),
});

export type Config = z.infer<typeof configSchema>;

export function defaultConfig(): Config {
  return configSchema.parse({
    encryption: {},
    ai: {},
    preferences: {},
  });
}
