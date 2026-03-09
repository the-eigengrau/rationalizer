import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export enum SoundEffect {
  Startup = 'seikilos',
  MenuSelect = 'menu-select',
  StepComplete = 'step-complete',
  AIReady = 'ai-ready',
  LevelUp = 'level-up',
  Thunder = 'thunder',
  Clearing = 'clearing',
  Sunny = 'sunny',
  Error = 'error',
  Farewell = 'farewell',
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = join(__dirname, '..', '..', 'assets', 'audio');

export function getSoundPath(sound: SoundEffect): string {
  return join(assetsDir, `${sound}.wav`);
}
