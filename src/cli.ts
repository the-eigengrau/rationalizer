import { select, password as passwordPrompt } from '@inquirer/prompts';
import { loadConfig, configExists, readCachedKey, cacheKey, type Config } from './config/index.js';
import { runSetupWizard } from './config/setup.js';
import { getDb, closeDb } from './storage/database.js';
import { setEncryptionKey, getStreakData as getDbStreakData } from './storage/index.js';
import { deriveKey, verifySentinel } from './storage/encryption.js';
import { animateParthenon } from './ui/ascii-art.js';
import { displayStatus } from './gamification/index.js';
import { runQuestionnaire } from './questionnaire/index.js';
import { runAISession, generateFarewell } from './ai/index.js';
import { viewPastEntries } from './screens/entries.js';
import { viewStats } from './screens/stats.js';
import { settingsMenu } from './screens/settings.js';
import { colors } from './ui/theme.js';
import { promptTheme } from './ui/prompt-theme.js';
import { animateSessionComplete } from './ui/celebration.js';
import { getRecentEntries } from './storage/index.js';
import { getRandomTip, getRandomTipRaw } from './ui/tips.js';
import { sleep } from './utils/sleep.js';

export async function main(): Promise<void> {
  let config: Config;

  if (!configExists()) {
    config = await runSetupWizard();
  } else {
    config = loadConfig();
  }

  await setupEncryption(config);
  getDb();

  console.clear();
  console.log();
  await animateParthenon(config.preferences.animationsEnabled);
  console.log();

  displayStatus();

  await mainMenuLoop(config);
  closeDb();
}

async function setupEncryption(config: Config): Promise<void> {
  if (config.encryption.mode === 'none') {
    setEncryptionKey(null);
    return;
  }

  if (config.encryption.mode === 'cached') {
    const cachedKey = readCachedKey();
    if (cachedKey) {
      setEncryptionKey(cachedKey);
      return;
    }
  }

  const passphrase = await passwordPrompt({
    message: 'Passphrase',
    theme: promptTheme,
  });

  const key = deriveKey(passphrase, config.encryption.salt, config.encryption.iterations);

  if (config.encryption.sentinel) {
    const valid = verifySentinel({
      ciphertext: config.encryption.sentinel,
      iv: config.encryption.sentinelIv || '',
      authTag: config.encryption.sentinelAuthTag || '',
    }, key);

    if (!valid) {
      console.log(colors.error('\n  Incorrect passphrase.\n'));
      process.exit(1);
    }
  }

  setEncryptionKey(key);

  if (config.encryption.mode === 'cached') {
    cacheKey(key, config.encryption.cacheTTLMinutes);
  }
}

async function mainMenuLoop(config: Config): Promise<void> {
  let firstRun = true;
  while (true) {
    if (!firstRun) {
      console.clear();
      console.log();
      displayStatus();
    }
    firstRun = false;

    console.log();
    const choice = await select({
      message: '',
      theme: { ...promptTheme, prefix: { idle: '', done: '' } },
      choices: [
        { value: 'session', name: 'Begin session' },
        { value: 'entries', name: 'Past entries' },
        { value: 'stats', name: 'Stats & level' },
        { value: 'settings', name: 'Settings' },
        { value: 'exit', name: 'Exit' },
      ],
    });

    switch (choice) {
      case 'session':
        await runSession(config);
        break;
      case 'entries':
        await viewPastEntries();
        break;
      case 'stats':
        await viewStats();
        break;
      case 'settings':
        config = await settingsMenu(config);
        break;
      case 'exit':
        await showFarewell(config);
        return;
    }
  }
}

async function runSession(config: Config): Promise<void> {
  const beforeData = getDbStreakData();

  const entry = await runQuestionnaire();

  if (config.ai.provider !== 'none') {
    await runAISession(config, entry);
  }

  const afterData = getDbStreakData();

  console.clear();
  console.log();
  await animateSessionComplete({
    beforeDays: beforeData.totalDays,
    afterDays: afterData.totalDays,
    beforeStreak: beforeData.currentStreak,
    afterStreak: afterData.currentStreak,
    animationsEnabled: config.preferences.animationsEnabled,
  });
}

async function typewriter(text: string, enabled: boolean): Promise<void> {
  if (!enabled) {
    process.stdout.write(colors.white(text));
    return;
  }
  for (const char of text) {
    process.stdout.write(colors.white(char));
    await sleep(30);
  }
}

async function showFarewell(config: Config): Promise<void> {
  const recent = getRecentEntries(1);
  const entry = recent.length > 0 ? recent[0] : null;

  if (entry && config.ai.provider !== 'none') {
    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frame = 0;
    process.stdout.write('\n');
    const spinner = setInterval(() => {
      process.stdout.write(`\r  ${colors.dim(spinnerFrames[frame++ % spinnerFrames.length])}`);
    }, 80);

    const farewell = await generateFarewell(config, entry);

    clearInterval(spinner);
    process.stdout.write('\r\x1b[2K');

    if (farewell) {
      process.stdout.write('\n  ');
      await typewriter(farewell, config.preferences.animationsEnabled);
      process.stdout.write('\n\n');
      return;
    }
  }

  // Fallback: random REBT tip
  const tip = getRandomTipRaw();
  process.stdout.write('\n  ');
  await typewriter(tip, config.preferences.animationsEnabled);
  process.stdout.write('\n\n');
}

