import chalk from 'chalk';
import { sleep } from '../utils/sleep.js';

const FIRE_FRAMES = [
  `  (  )
 (    )
  (  )
   ()
   ||`,
  ` (    )
  (  )
 (    )
   ()
   ||`,
  `(      )
 (    )
  (  )
   ()
   ||`,
  ` (    )
(      )
 (    )
   ()
   ||`,
];

const FIRE_COLORS = [
  chalk.hex('#FF4500'),  // Red-orange
  chalk.hex('#FF6347'),  // Tomato
  chalk.hex('#FFD700'),  // Gold
  chalk.hex('#FFA500'),  // Orange
];

export async function animateFire(durationMs = 2000): Promise<void> {
  const startTime = Date.now();
  let frameIndex = 0;

  while (Date.now() - startTime < durationMs) {
    const frame = FIRE_FRAMES[frameIndex % FIRE_FRAMES.length];
    const color = FIRE_COLORS[frameIndex % FIRE_COLORS.length];
    const lines = frame.split('\n');

    // Move cursor up to overwrite previous frame
    if (frameIndex > 0) {
      process.stdout.write(`\x1b[${lines.length}A`);
    }

    for (const line of lines) {
      console.log(color(line));
    }

    frameIndex++;
    await sleep(200);
  }
}

export function getStaticFire(): string {
  return chalk.hex('#FF4500')(FIRE_FRAMES[0]);
}
