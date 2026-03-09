import { colors } from './theme.js';
import { sleep } from '../utils/sleep.js';
import { play, SoundEffect } from '../audio/index.js';

const ANSI = {
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
};

// Weathr cloud shapes
const CLOUDS = [
  [
    '   .--.    ',
    '.-(    ).  ',
    '(___.__)_) ',
  ],
  [
    '    .--.     ',
    ' .-(    ).   ',
    '(___.__)__)  ',
  ],
  [
    '   _  _      ',
    '  ( `   )_   ',
    ' (    )    `)',
    '  \\_  (___  )',
  ],
  [
    '  .--.   ',
    '.-(    ). ',
    '(___.__)) ',
  ],
];

// Weathr sunny art — two alternating frames for twinkling
const SUN_FRAME_1 = [
  '    ;   :   ;    ',
  ' .   \\_,!,_/   , ',
  "  `.,'     `.,`  ",
  '   /         \\   ',
  '~ -- :         : -- ~',
  '   \\         /   ',
  "  ,'`._   _.'`.  ",
  " '   / `!` \\   ` ",
  '    ;   :   ;    ',
];

const SUN_FRAME_2 = [
  '    .   |   .    ',
  ' ;   \\_,|,_/   ; ',
  "  `.,'     `.,`  ",
  '   /         \\   ',
  '~ -- |         | -- ~',
  '   \\         /   ',
  "  ,'`._   _.'`.  ",
  " ;   / `|` \\   ; ",
  '    .   |   .    ',
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

interface CloudInstance {
  shape: string[];
  x: number;
  y: number;
}

type Cell = { char: string; color: (s: string) => string } | null;

function createCanvas(height: number, width: number): Cell[][] {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

function renderCanvas(canvas: Cell[][], width: number): void {
  process.stdout.write('\x1b[H');
  const height = canvas.length;
  for (let row = 0; row < height; row++) {
    let line = '';
    for (let col = 0; col < width; col++) {
      const cell = canvas[row][col];
      line += cell ? cell.color(cell.char) : ' ';
    }
    process.stdout.write(line + (row < height - 1 ? '\n' : ''));
  }
}

function drawText(
  canvas: Cell[][],
  text: string,
  row: number,
  col: number,
  color: (s: string) => string,
): void {
  const height = canvas.length;
  const width = canvas[0].length;
  for (let i = 0; i < text.length; i++) {
    const x = col + i;
    if (x >= 0 && x < width && row >= 0 && row < height && text[i] !== ' ') {
      canvas[row][x] = { char: text[i], color };
    }
  }
}

// Draw text but clip at maxCol (exclusive) — characters at x >= maxCol are not drawn
function drawTextClipped(
  canvas: Cell[][],
  text: string,
  row: number,
  col: number,
  color: (s: string) => string,
  maxCol: number,
): void {
  const height = canvas.length;
  const width = canvas[0].length;
  for (let i = 0; i < text.length; i++) {
    const x = col + i;
    if (x >= 0 && x < width && x < maxCol && row >= 0 && row < height && text[i] !== ' ') {
      canvas[row][x] = { char: text[i], color };
    }
  }
}

function placeClouds(width: number, height: number): CloudInstance[] {
  const instances: CloudInstance[] = [];
  const count = Math.min(4, Math.max(3, Math.floor(width / 30)));
  const spacing = Math.floor(width / count);

  for (let i = 0; i < count; i++) {
    const shape = CLOUDS[i % CLOUDS.length];
    const maxW = Math.max(...shape.map(l => l.length));
    const x = Math.floor(spacing * i + (spacing - maxW) / 2);
    const y = Math.floor(Math.random() * Math.min(2, height - shape.length));
    instances.push({ shape, x, y });
  }
  return instances;
}

function drawClouds(
  canvas: Cell[][],
  clouds: CloudInstance[],
  color: (s: string) => string,
): void {
  for (const cloud of clouds) {
    for (let i = 0; i < cloud.shape.length; i++) {
      drawText(canvas, cloud.shape[i], cloud.y + i, cloud.x, color);
    }
  }
}

function spawnRaindrops(count: number, width: number, height: number): Raindrop[] {
  const chars = ['|', ':', '.'];
  const drops: Raindrop[] = [];
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      char: chars[Math.floor(Math.random() * chars.length)],
    });
  }
  return drops;
}

function generateLightning(
  startX: number,
  startY: number,
  endY: number,
): LightningSegment[] {
  const segments: LightningSegment[] = [];
  let x = startX;
  segments.push({ x, y: startY, char: '+' });

  for (let y = startY + 1; y <= endY; y++) {
    const drift = Math.floor(Math.random() * 3) - 1;
    x += drift;
    const mainChars = ['/', '\\', '|'];
    segments.push({ x, y, char: mainChars[Math.floor(Math.random() * mainChars.length)] });
    // 20% branch chance
    if (Math.random() < 0.2) {
      const branchDir = Math.random() < 0.5 ? -1 : 1;
      const branchChar = branchDir < 0 ? '/' : '\\';
      segments.push({ x: x + branchDir, y, char: branchChar });
      if (y + 1 <= endY) {
        segments.push({ x: x + branchDir * 2, y: y + 1, char: '|' });
      }
    }
  }
  return segments;
}

export async function animateSessionComplete(animationsEnabled: boolean): Promise<void> {
  if (!animationsEnabled || (process.stdout.columns || 80) < 45) {
    return;
  }

  const width = process.stdout.columns || 80;
  const height = process.stdout.rows || 24;

  process.stdout.write(ANSI.hideCursor);
  const cleanup = () => process.stdout.write(ANSI.showCursor);
  process.on('SIGINT', cleanup);

  try {
    // Claim fullscreen
    console.clear();

    // Place storm clouds
    const clouds = placeClouds(width, height);
    const maxCloudBottom = Math.max(...clouds.map(c => c.y + c.shape.length));

    // Rain
    const dropCount = Math.max(30, Math.floor(width * height / 60));
    let raindrops = spawnRaindrops(dropCount, width, height);

    // Store lightning bolts for afterglow
    let lastBolt: LightningSegment[] = [];

    // === STORM PHASE (12 frames @ 85ms) ===
    play(SoundEffect.Thunder);
    for (let frame = 0; frame < 12; frame++) {
      const canvas = createCanvas(height, width);

      drawClouds(canvas, clouds, colors.dimWhite);

      for (const drop of raindrops) {
        if (drop.y >= 0 && drop.y < height && drop.x >= 0 && drop.x < width) {
          canvas[drop.y][drop.x] = { char: drop.char, color: colors.subtle };
        }
      }

      // Lightning on frames 4 and 9
      if (frame === 4 || frame === 9) {
        play(SoundEffect.Thunder);
        const cloudIdx = frame === 4 ? 0 : Math.min(1, clouds.length - 1);
        const cloud = clouds[cloudIdx];
        const lx = cloud.x + Math.floor(cloud.shape[0].length / 2);
        lastBolt = generateLightning(lx, maxCloudBottom, height - 1);
        for (const seg of lastBolt) {
          if (seg.y >= 0 && seg.y < height && seg.x >= 0 && seg.x < width) {
            canvas[seg.y][seg.x] = { char: seg.char, color: colors.white };
          }
        }
      }

      // Dim lightning afterglow on frames 5 and 10
      if (frame === 5 || frame === 10) {
        for (const seg of lastBolt) {
          if (seg.y >= 0 && seg.y < height && seg.x >= 0 && seg.x < width) {
            canvas[seg.y][seg.x] = { char: seg.char, color: colors.subtle };
          }
        }
      }

      renderCanvas(canvas, width);

      raindrops = raindrops.map(d => {
        const newY = d.y + 1 + Math.floor(Math.random() * 2);
        if (newY >= height) {
          return { x: Math.floor(Math.random() * width), y: 0, char: d.char };
        }
        return { ...d, y: newY };
      });

      await sleep(85);
    }

    // === CLEARING PHASE (8 frames @ 100ms) ===
    play(SoundEffect.Clearing);
    for (let frame = 0; frame < 8; frame++) {
      const canvas = createCanvas(height, width);

      if (frame < 6) {
        const visibleClouds = frame < 3
          ? clouds
          : clouds.slice(0, Math.max(1, clouds.length - Math.floor((frame - 2) * clouds.length / 4)));
        const cloudColor = frame < 2 ? colors.dimWhite : colors.subtle;
        const drift = frame;
        const drifted = visibleClouds.map(c => ({ ...c, x: c.x + drift }));
        drawClouds(canvas, drifted, cloudColor);
      }

      const keepCount = Math.max(0, raindrops.length - 4);
      raindrops = raindrops.slice(0, keepCount);

      for (const drop of raindrops) {
        if (drop.y >= 0 && drop.y < height && drop.x >= 0 && drop.x < width) {
          canvas[drop.y][drop.x] = { char: drop.char, color: colors.subtle };
        }
      }

      renderCanvas(canvas, width);

      raindrops = raindrops.map(d => ({
        ...d,
        y: d.y + 1 + Math.floor(Math.random() * 2),
      }));

      await sleep(100);
    }

    // === SUNNY PHASE (18 frames @ 100ms) ===
    play(SoundEffect.Sunny);
    // Sun centered on screen
    const sunMaxW = Math.max(...SUN_FRAME_1.map(l => l.length));
    const sunCol = Math.floor((width - sunMaxW) / 2);
    const sunRow = Math.floor((height - SUN_FRAME_1.length) / 2);

    // Cover cloud: starts over the sun, drifts right to reveal it
    const coverShape = CLOUDS[2];
    const coverW = Math.max(...coverShape.map(l => l.length));
    const coverVisualRow = sunRow + Math.floor((SUN_FRAME_1.length - coverShape.length) / 2);
    const revealStartX = sunCol;

    // Ambient clouds for the sunny scene
    const ambientClouds: CloudInstance[] = [
      { shape: CLOUDS[0], x: 3, y: 1 },
      { shape: CLOUDS[3], x: width - CLOUDS[3][0].length - 4, y: 0 },
      { shape: CLOUDS[1], x: Math.floor(width * 0.12), y: height - 5 },
    ];

    // Drift speed: reveal sun + push cloud off in ~12 frames
    const driftPerFrame = Math.ceil((sunMaxW + coverW) / 12);

    for (let frame = 0; frame < 18; frame++) {
      const canvas = createCanvas(height, width);

      const sunArt = frame % 2 === 0 ? SUN_FRAME_1 : SUN_FRAME_2;
      const sunColor = frame < 5 ? colors.primaryDim : colors.primary;

      const revealEdge = revealStartX + frame * driftPerFrame;

      // Draw sun, clipped at the reveal edge (hidden behind cloud)
      for (let i = 0; i < sunArt.length; i++) {
        if (frame >= 13) {
          drawText(canvas, sunArt[i], sunRow + i, sunCol, sunColor);
        } else {
          drawTextClipped(canvas, sunArt[i], sunRow + i, sunCol, sunColor, revealEdge);
        }
      }

      // Ambient scene clouds
      drawClouds(canvas, ambientClouds, colors.dimWhite);

      // Cover cloud at the reveal edge, drifting right
      if (frame < 13) {
        for (let i = 0; i < coverShape.length; i++) {
          drawText(canvas, coverShape[i], coverVisualRow + i, revealEdge, colors.dimWhite);
        }
      }

      renderCanvas(canvas, width);
      await sleep(100);
    }

    // === HOLD PHASE (~0.5s) ===
    const holdCanvas = createCanvas(height, width);
    drawClouds(holdCanvas, ambientClouds, colors.dimWhite);
    for (let i = 0; i < SUN_FRAME_1.length; i++) {
      drawText(holdCanvas, SUN_FRAME_1[i], sunRow + i, sunCol, colors.primary);
    }

    const credit = 'github.com/Veirt/weathr';
    const creditCol = width - credit.length - 1;
    drawText(holdCanvas, credit, height - 1, creditCol, colors.subtle);

    renderCanvas(holdCanvas, width);
    await sleep(500);

    // Clean up fullscreen
    console.clear();

  } finally {
    process.stdout.write(ANSI.showCursor);
    process.removeListener('SIGINT', cleanup);
  }
}
