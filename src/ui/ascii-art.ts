import { sleep } from '../utils/sleep.js';
import { colors } from './theme.js';

const COLUMN = `  .-----...-----.
 / .-._______.-. \\
 \\  \` /_____\\ \`  /
  '--'| | | |'--'
      | | | |
      | | | |
      | | | |
      | | | |
      | | | |
      | | | |
      |_|_|_|
    _/_______\\_
   |___________|`;

export async function animateParthenon(enabled = true): Promise<void> {
  if (!enabled) {
    console.log(colors.white(COLUMN));
    return;
  }

  const lines = COLUMN.split('\n');
  for (const line of lines) {
    console.log(colors.white(line));
    await sleep(60);
  }
}

export function getParthenon(): string {
  return colors.white(COLUMN);
}

export async function animateLevelUp(levelName: string, title: string): Promise<void> {
  console.log();
  console.log(colors.primary(`  ▲ Level up — ${levelName}, ${title}`));
  console.log();
  await sleep(1500);
}
