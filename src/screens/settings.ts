import { select, input, password, confirm } from '@inquirer/prompts';
import { saveConfig, clearCachedKey, type Config } from '../config/index.js';
import { getMemories, deleteMemory, deleteAllMemories, setEncryptionKey } from '../storage/index.js';
import { getDb } from '../storage/database.js';
import { generateSalt, deriveKey, createSentinel } from '../storage/encryption.js';
import { cacheKey } from '../config/index.js';
import { colors, headerStyle } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import type { AIProvider, EncryptionMode } from '../questionnaire/types.js';

export async function settingsMenu(config: Config): Promise<Config> {
  while (true) {
    const choice = await select({
      message: '',
      theme: { ...promptTheme, prefix: { idle: '', done: '' } },
      choices: [
        { value: 'ai', name: `AI provider  ${colors.dim(config.ai.provider)}` },
        { value: 'encryption', name: `Encryption  ${colors.dim(config.encryption.mode)}` },
        { value: 'memories', name: 'Memories' },
        { value: 'preferences', name: 'Preferences' },
        { value: 'reset', name: colors.dim('Reset all data') },
        { value: 'back', name: colors.dim('← Back') },
      ],
    });

    switch (choice) {
      case 'ai':
        config = await configureAI(config);
        break;
      case 'encryption':
        config = await configureEncryption(config);
        break;
      case 'memories':
        await manageMemories();
        break;
      case 'preferences':
        config = await configurePreferences(config);
        break;
      case 'reset':
        await resetAllData();
        break;
      case 'back':
        return config;
    }
  }
}

async function configureAI(config: Config): Promise<Config> {
  const provider = await select<AIProvider>({
    message: 'AI provider',
    theme: promptTheme,
    choices: [
      { value: 'ollama' as const, name: 'Local AI (Ollama)' },
      { value: 'anthropic' as const, name: 'Cloud AI (Claude)' },
      { value: 'none' as const, name: 'No AI' },
    ],
  });

  config.ai.provider = provider;

  if (provider === 'anthropic') {
    const apiKey = await input({
      message: 'Anthropic API key',
      theme: promptTheme,
      default: config.ai.anthropicApiKey || undefined,
    });
    config.ai.anthropicApiKey = apiKey;
  } else if (provider === 'ollama') {
    const model = await input({
      message: 'Ollama model',
      theme: promptTheme,
      default: config.ai.ollamaModel,
    });
    config.ai.ollamaModel = model;

    const url = await input({
      message: 'Ollama URL',
      theme: promptTheme,
      default: config.ai.ollamaUrl,
    });
    config.ai.ollamaUrl = url;
  }

  saveConfig(config);
  console.log(colors.dim('  Updated.'));
  return config;
}

async function configureEncryption(config: Config): Promise<Config> {
  const mode = await select<EncryptionMode>({
    message: 'Encryption mode',
    theme: promptTheme,
    choices: [
      { value: 'cached' as const, name: 'Cached (ask once, remember 1hr)' },
      { value: 'always' as const, name: 'Always ask' },
      { value: 'none' as const, name: 'No encryption' },
    ],
  });

  if (mode !== 'none' && config.encryption.mode === 'none') {
    const passphrase = await password({
      message: 'Choose a passphrase',
      theme: promptTheme,
      validate: (val) => val.length >= 8 || 'At least 8 characters.',
    });

    await password({
      message: 'Confirm passphrase',
      theme: promptTheme,
      validate: (val) => val === passphrase || 'Passphrases do not match.',
    });

    const salt = generateSalt();
    config.encryption.salt = salt;
    const key = deriveKey(passphrase, salt, config.encryption.iterations);
    const sentinel = createSentinel(key);
    config.encryption.sentinel = sentinel.ciphertext;
    config.encryption.sentinelIv = sentinel.iv;
    config.encryption.sentinelAuthTag = sentinel.authTag;

    setEncryptionKey(key);
    if (mode === 'cached') {
      cacheKey(key, config.encryption.cacheTTLMinutes);
    }

    console.log(colors.dim('  Only new entries will be encrypted.'));
  } else if (mode === 'none') {
    setEncryptionKey(null);
    clearCachedKey();
  }

  config.encryption.mode = mode;
  saveConfig(config);
  console.log(colors.dim('  Updated.'));
  return config;
}

async function manageMemories(): Promise<void> {
  const memories = getMemories(50);

  if (memories.length === 0) {
    console.log(colors.dim('\n  No memories yet.\n'));
    return;
  }

  console.log();
  const grouped: Record<string, typeof memories> = {};
  for (const m of memories) {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m);
  }

  for (const [category, items] of Object.entries(grouped)) {
    console.log(colors.white(`  ${category}`));
    for (const item of items) {
      console.log(colors.dim(`    ${item.content}`));
    }
    console.log();
  }

  const action = await select({
    message: '',
    theme: { ...promptTheme, prefix: { idle: '', done: '' } },
    choices: [
      { value: 'delete_one', name: 'Delete a memory' },
      { value: 'delete_all', name: 'Delete all' },
      { value: 'back', name: colors.dim('← Back') },
    ],
  });

  if (action === 'delete_one') {
    const memChoice = await select({
      message: 'Select',
      theme: promptTheme,
      choices: [
        ...memories.map(m => ({
          value: m.id,
          name: `${colors.dim(`[${m.category}]`)} ${m.content.slice(0, 60)}`,
        })),
        { value: '__cancel', name: colors.dim('← Cancel') },
      ],
      pageSize: 15,
    });

    if (memChoice !== '__cancel') {
      deleteMemory(memChoice);
      console.log(colors.dim('  Deleted.'));
    }
  } else if (action === 'delete_all') {
    const sure = await confirm({
      message: 'Delete all memories? Cannot be undone.',
      theme: promptTheme,
      default: false,
    });
    if (sure) {
      deleteAllMemories();
      console.log(colors.dim('  All memories deleted.'));
    }
  }
}

async function configurePreferences(config: Config): Promise<Config> {
  const tips = await confirm({
    message: 'Show REBT tips?',
    theme: promptTheme,
    default: config.preferences.showTips,
  });

  const animations = await confirm({
    message: 'Enable animations?',
    theme: promptTheme,
    default: config.preferences.animationsEnabled,
  });

  config.preferences.showTips = tips;
  config.preferences.animationsEnabled = animations;

  saveConfig(config);
  console.log(colors.dim('  Updated.'));
  return config;
}

async function resetAllData(): Promise<void> {
  const sure = await confirm({
    message: 'Delete all entries, conversations, and memories?',
    theme: promptTheme,
    default: false,
  });

  if (!sure) return;

  const db = getDb();
  db.exec('DELETE FROM entries');
  db.exec('DELETE FROM conversations');
  db.exec('DELETE FROM memories');
  console.log(colors.dim('  Data cleared.'));
}
