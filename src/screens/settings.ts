import { select, input, password, confirm } from '@inquirer/prompts';
import { saveConfig, clearCachedKey, type Config } from '../config/index.js';
import { getMemories, deleteMemory, deleteAllMemories, setEncryptionKey } from '../storage/index.js';
import { getDb } from '../storage/database.js';
import { generateSalt, deriveKey, createSentinel } from '../storage/encryption.js';
import { cacheKey } from '../config/index.js';
import { colors, headerStyle } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import type { AIProvider, EncryptionMode } from '../questionnaire/types.js';
import { t, setLanguage, getLanguageName } from '../i18n/index.js';
import type { Language } from '../i18n/types.js';

export async function settingsMenu(config: Config): Promise<Config> {
  while (true) {
    console.clear();
    console.log();
    const choice = await select({
      message: '',
      theme: { ...promptTheme, prefix: { idle: '', done: '' } },
      choices: [
        { value: 'back', name: colors.dim(t().common.back) },
        { value: 'language', name: `${t().settings.language}  ${colors.dim(getLanguageName(config.preferences.language))}` },
        { value: 'ai', name: `${t().settings.aiProvider}  ${colors.dim(config.ai.provider)}` },
        { value: 'encryption', name: `${t().settings.encryption}  ${colors.dim(t().settings.encryptionStatus[config.encryption.mode])}` },
        { value: 'memories', name: t().settings.memories },
        { value: 'reset', name: colors.dim(t().settings.resetAllData) },
      ],
    });

    switch (choice) {
      case 'language':
        config = await configureLanguage(config);
        break;
      case 'ai':
        config = await configureAI(config);
        break;
      case 'encryption':
        config = await configureEncryption(config);
        break;
      case 'memories':
        await manageMemories();
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
    message: '',
    theme: { ...promptTheme, prefix: { idle: '', done: '' } },
    choices: [
      { value: 'ollama' as const, name: t().settings.localAI },
      { value: 'anthropic' as const, name: t().settings.cloudAI },
      { value: 'none' as const, name: t().settings.noAI },
    ],
  });

  config.ai.provider = provider;

  if (provider === 'anthropic') {
    const apiKey = await input({
      message: t().settings.anthropicApiKey,
      theme: promptTheme,
      default: config.ai.anthropicApiKey || undefined,
    });
    config.ai.anthropicApiKey = apiKey;
  } else if (provider === 'ollama') {
    const model = await input({
      message: t().settings.ollamaModel,
      theme: promptTheme,
      default: config.ai.ollamaModel,
    });
    config.ai.ollamaModel = model;

    const url = await input({
      message: t().settings.ollamaUrl,
      theme: promptTheme,
      default: config.ai.ollamaUrl,
    });
    config.ai.ollamaUrl = url;
  }

  saveConfig(config);
  console.log(colors.dim(`  ${t().common.updated}`));
  return config;
}

async function configureEncryption(config: Config): Promise<Config> {
  const mode = await select<EncryptionMode>({
    message: '',
    theme: { ...promptTheme, prefix: { idle: '', done: '' } },
    choices: [
      { value: 'cached' as const, name: t().settings.cached },
      { value: 'always' as const, name: t().settings.alwaysAsk },
      { value: 'none' as const, name: t().settings.noEncryption },
    ],
  });

  if (mode !== 'none' && config.encryption.mode === 'none') {
    const passphrase = await password({
      message: t().passphrase.choose,
      mask: '●',
      theme: promptTheme,
      validate: (val) => val.length >= 8 || t().passphrase.tooShort,
    });

    await password({
      message: t().passphrase.confirm,
      mask: '●',
      theme: promptTheme,
      validate: (val) => val === passphrase || t().passphrase.mismatch,
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

    console.log(colors.dim(`  ${t().settings.newEntriesOnly}`));
  } else if (mode === 'none') {
    setEncryptionKey(null);
    clearCachedKey();
  }

  config.encryption.mode = mode;
  saveConfig(config);
  console.log(colors.dim(`  ${t().common.updated}`));
  return config;
}

async function manageMemories(): Promise<void> {
  const memories = getMemories(50);

  if (memories.length === 0) {
    console.log(colors.dim(`\n  ${t().settings.noMemories}\n`));
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
      { value: 'delete_one', name: t().settings.deleteOne },
      { value: 'delete_all', name: t().settings.deleteAll },
      { value: 'back', name: colors.dim(t().common.back) },
    ],
  });

  if (action === 'delete_one') {
    const memChoice = await select({
      message: t().settings.select,
      theme: promptTheme,
      choices: [
        ...memories.map(m => ({
          value: m.id,
          name: `${colors.dim(`[${m.category}]`)} ${m.content.slice(0, 60)}`,
        })),
        { value: '__cancel', name: colors.dim(t().common.cancel) },
      ],
      pageSize: 15,
    });

    if (memChoice !== '__cancel') {
      deleteMemory(memChoice);
      console.log(colors.dim(`  ${t().common.deleted}`));
    }
  } else if (action === 'delete_all') {
    const sure = await confirm({
      message: t().settings.deleteAllConfirm,
      theme: promptTheme,
      default: false,
    });
    if (sure) {
      deleteAllMemories();
      console.log(colors.dim(`  ${t().settings.allDeleted}`));
    }
  }
}

async function configureLanguage(config: Config): Promise<Config> {
  const language = await select<Language>({
    message: '',
    theme: { ...promptTheme, prefix: { idle: '', done: '' } },
    choices: [
      { value: 'en' as const, name: getLanguageName('en') },
      { value: 'la' as const, name: getLanguageName('la') },
      { value: 'grc' as const, name: getLanguageName('grc') },
    ],
    default: config.preferences.language,
  });

  config.preferences.language = language;
  setLanguage(language);
  saveConfig(config);
  console.log(colors.dim(`  ${t().common.updated}`));
  return config;
}

async function resetAllData(): Promise<void> {
  const sure = await confirm({
    message: t().settings.resetConfirm,
    theme: promptTheme,
    default: false,
  });

  if (!sure) return;

  const db = getDb();
  db.exec('DELETE FROM entries');
  db.exec('DELETE FROM conversations');
  db.exec('DELETE FROM memories');
  console.log(colors.dim(`  ${t().settings.dataCleared}`));
}
