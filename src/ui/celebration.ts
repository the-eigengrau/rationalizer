import { colors } from './theme.js';
import { sleep } from '../utils/sleep.js';

const ANSI = {
  up: (n: number) => `\x1b[${n}A`,
  clearLine: '\x1b[2K',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
};

const CANVAS_HEIGHT = 10;

// Cloud shapes (weathr-inspired)
const CLOUD_LINES = [
  '    .--.    ',
  ' .-(    ).  ',
  '(___.__)__) ',
];

const SUN_LINES = [
  '    \\   |   /    ',
  '      .---.      ',
  '   -(       )-   ',
  "      '---'      ",
  '    /   |   \\    ',
];

interface Raindrop {
  x: number;
  y: number;
  char: string;
}

interface LightningSegment {
  x: number;
  y: number;
  char: string;
}

type Cell = { char: string; color: (s: string) => string } | null;

function createCanvas(width: number): Cell[][] {
  return Array.from({ length: CANVAS_HEIGHT }, () => Array(width).fill(null));
}

function renderCanvas(canvas: Cell[][], width: number): void {
  process.stdout.write(ANSI.up(CANVAS_HEIGHT));
  for (let row = 0; row < CANVAS_HEIGHT; row++) {
    process.stdout.write(ANSI.clearLine);
    let line = '';
    for (let col = 0; col < width; col++) {
      const cell = canvas[row][col];
      line += cell ? cell.color(cell.char) : ' ';
    }
    process.stdout.write(line + '\n');
  }
}

function clearCanvas(): void {
  process.stdout.write(ANSI.up(CANVAS_HEIGHT));
  for (let i = 0; i < CANVAS_HEIGHT; i++) {
    process.stdout.write(ANSI.clearLine + '\n');
  }
  process.stdout.write(ANSI.up(CANVAS_HEIGHT));
}

function drawText(canvas: Cell[][], text: string, row: number, col: number, color: (s: string) => string): void {
  const width = canvas[0].length;
  for (let i = 0; i < text.length; i++) {
    const x = col + i;
    if (x >= 0 && x < width && row >= 0 && row < CANVAS_HEIGHT && text[i] !== ' ') {
      canvas[row][x] = { char: text[i], color };
    }
  }
}

function spawnRaindrops(count: number, width: number): Raindrop[] {
  const chars = ['|', ':', '.'];
  const drops: Raindrop[] = [];
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * CANVAS_HEIGHT),
      char: chars[Math.floor(Math.random() * chars.length)],
    });
  }
  return drops;
}

function generateLightning(startX: number, startY: number, endY: number): LightningSegment[] {
  const segments: LightningSegment[] = [];
  let x = startX;
  for (let y = startY; y <= endY; y++) {
    const chars = ['/', '\\', '|'];
    const drift = Math.floor(Math.random() * 3) - 1;
    x += drift;
    segments.push({ x, y, char: chars[Math.floor(Math.random() * chars.length)] });
  }
  return segments;
}

export async function animateSessionComplete(animationsEnabled: boolean): Promise<void> {
  if (!animationsEnabled || (process.stdout.columns || 80) < 45) {
    return;
  }

  const width = process.stdout.columns || 80;

  process.stdout.write(ANSI.hideCursor);
  const cleanup = () => process.stdout.write(ANSI.showCursor);
  process.on('SIGINT', cleanup);

  try {
    // Print canvas space
    for (let i = 0; i < CANVAS_HEIGHT; i++) process.stdout.write('\n');

    // Cloud positions
    const cloud1X = Math.floor(width * 0.2);
    const cloud2X = Math.floor(width * 0.6);

    // Rain
    let raindrops = spawnRaindrops(22, width);

    // === STORM PHASE (10 frames @ 90ms) ===
    for (let frame = 0; frame < 10; frame++) {
      const canvas = createCanvas(width);

      // Draw clouds
      for (let i = 0; i < CLOUD_LINES.length; i++) {
        drawText(canvas, CLOUD_LINES[i], i, cloud1X, colors.dimWhite);
        drawText(canvas, CLOUD_LINES[i], i, cloud2X, colors.dimWhite);
      }

      // Draw rain
      for (const drop of raindrops) {
        if (drop.y >= 0 && drop.y < CANVAS_HEIGHT && drop.x >= 0 && drop.x < width) {
          canvas[drop.y][drop.x] = { char: drop.char, color: colors.subtle };
        }
      }

      // Lightning on frames 4 and 8
      if (frame === 4 || frame === 8) {
        const lx = frame === 4 ? cloud1X + 5 : cloud2X + 5;
        const bolt = generateLightning(lx, 3, CANVAS_HEIGHT - 1);
        for (const seg of bolt) {
          if (seg.y >= 0 && seg.y < CANVAS_HEIGHT && seg.x >= 0 && seg.x < width) {
            canvas[seg.y][seg.x] = { char: seg.char, color: colors.white };
          }
        }
      }

      // Dim lightning afterglow on frames 5 and 9
      if (frame === 5 || frame === 9) {
        const lx = frame === 5 ? cloud1X + 5 : cloud2X + 5;
        const bolt = generateLightning(lx, 3, CANVAS_HEIGHT - 1);
        for (const seg of bolt) {
          if (seg.y >= 0 && seg.y < CANVAS_HEIGHT && seg.x >= 0 && seg.x < width) {
            canvas[seg.y][seg.x] = { char: seg.char, color: colors.subtle };
          }
        }
      }

      renderCanvas(canvas, width);

      // Move rain down, respawn at top
      raindrops = raindrops.map(d => {
        const newY = d.y + 1 + Math.floor(Math.random() * 2);
        if (newY >= CANVAS_HEIGHT) {
          return { x: Math.floor(Math.random() * width), y: 0, char: d.char };
        }
        return { ...d, y: newY };
      });

      await sleep(90);
    }

    // === CLEARING PHASE (6 frames @ 100ms) ===
    for (let frame = 0; frame < 6; frame++) {
      const canvas = createCanvas(width);

      // Clouds fade then disappear
      if (frame < 4) {
        const cloudColor = frame < 2 ? colors.subtle : colors.subtle;
        for (let i = 0; i < CLOUD_LINES.length; i++) {
          drawText(canvas, CLOUD_LINES[i], i, cloud1X, cloudColor);
          if (frame < 3) {
            drawText(canvas, CLOUD_LINES[i], i, cloud2X, cloudColor);
          }
        }
      }

      // Thin rain: remove ~4 drops per frame
      const keepCount = Math.max(0, raindrops.length - 4);
      raindrops = raindrops.slice(0, keepCount);

      for (const drop of raindrops) {
        if (drop.y >= 0 && drop.y < CANVAS_HEIGHT && drop.x >= 0 && drop.x < width) {
          canvas[drop.y][drop.x] = { char: drop.char, color: colors.subtle };
        }
      }

      // Bottom rows hint warm color in later frames
      if (frame >= 3) {
        const warmRow = CANVAS_HEIGHT - 1;
        for (let col = Math.floor(width * 0.3); col < Math.floor(width * 0.7); col++) {
          if (!canvas[warmRow][col]) {
            canvas[warmRow][col] = { char: '─', color: colors.primaryDim };
          }
        }
      }

      renderCanvas(canvas, width);

      raindrops = raindrops.map(d => ({
        ...d,
        y: d.y + 1 + Math.floor(Math.random() * 2),
      }));

      await sleep(100);
    }

    // === SUNRISE PHASE (10 frames @ 100ms) ===
    const sunX = Math.floor(width / 2) - Math.floor(SUN_LINES[2].length / 2);
    const sunTotalHeight = SUN_LINES.length;

    for (let frame = 0; frame < 10; frame++) {
      const canvas = createCanvas(width);

      // Sun rises from bottom — reveal more lines each frame
      const revealedLines = Math.min(sunTotalHeight, Math.floor((frame + 1) * sunTotalHeight / 10) + 1);
      const sunStartRow = CANVAS_HEIGHT - revealedLines;

      const sunColor = frame < 5 ? colors.primaryDim : colors.primary;

      for (let i = 0; i < revealedLines; i++) {
        const lineIdx = sunTotalHeight - revealedLines + i;
        if (lineIdx >= 0 && lineIdx < sunTotalHeight) {
          drawText(canvas, SUN_LINES[lineIdx], sunStartRow + i, sunX, sunColor);
        }
      }

      // Rays extend outward in final frames
      if (frame >= 7) {
        const centerY = sunStartRow + Math.floor(revealedLines / 2);
        const centerX = Math.floor(width / 2);
        const rayLen = (frame - 6) * 3;
        for (let r = 1; r <= rayLen; r++) {
          const leftX = centerX - Math.floor(SUN_LINES[2].length / 2) - r;
          const rightX = centerX + Math.floor(SUN_LINES[2].length / 2) + r;
          if (leftX >= 0 && centerY >= 0 && centerY < CANVAS_HEIGHT) {
            canvas[centerY][leftX] = { char: '─', color: colors.primary };
          }
          if (rightX < width && centerY >= 0 && centerY < CANVAS_HEIGHT) {
            canvas[centerY][rightX] = { char: '─', color: colors.primary };
          }
        }
      }

      renderCanvas(canvas, width);
      await sleep(100);
    }

    // === HOLD PHASE (5 frames @ 100ms) ===
    await sleep(500);

    // Cleanup: clear canvas area
    clearCanvas();

  } finally {
    process.stdout.write(ANSI.showCursor);
    process.removeListener('SIGINT', cleanup);
  }
}
