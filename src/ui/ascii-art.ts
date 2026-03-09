import { sleep } from '../utils/sleep.js';
import { colors } from './theme.js';
import { t } from '../i18n/index.js';

const PARTHENON = `|     .-.
|    /   \\         .-.
|   /     \\       /   \\       .-.     .-.     _   _
+--/-------\\-----/-----\\-----/---\\---/---\\---/-\\-/-\\/\\/---
| /         \\   /       \\   /     '-'     '-'
|/           '-'         '-'`;

export async function animateParthenon(enabled = true): Promise<void> {
  if (!enabled) {
    console.log(colors.white(PARTHENON));
    return;
  }

  const lines = PARTHENON.split('\n');
  for (const line of lines) {
    console.log(colors.white(line));
    await sleep(80);
  }
}

export function getParthenon(): string {
  return colors.white(PARTHENON);
}

export async function animateLevelUp(levelName: string, title: string): Promise<void> {
  console.log();
  console.log(colors.primary(`  ${t().levelUp(levelName, title)}`));
  console.log();
  await sleep(1500);
}
