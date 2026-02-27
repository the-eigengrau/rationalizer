import { colors, BOX_COLOR } from './theme.js';
import { sleep } from '../utils/sleep.js';
import { getLevel, getLevelProgress } from '../gamification/levels.js';
import { displayStatus } from '../gamification/index.js';
import chalk from 'chalk';

type ColorFn = (text: string) => string;

interface CelebrationData {
  beforeDays: number;
  afterDays: number;
  beforeStreak: number;
  afterStreak: number;
  animationsEnabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  life: number;
  maxLife: number;
}

const ANSI = {
  up: (n: number) => `\x1b[${n}A`,
  down: (n: number) => `\x1b[${n}B`,
  column: (n: number) => `\x1b[${n}G`,
  clearLine: '\x1b[2K',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
};

const BAR_WIDTH = 16;
const CANVAS_HEIGHT = 5;
const PARTICLE_CHARS = ['·', '·', '·', '∙', '∙', '*', '✦'];

export async function animateSessionComplete(data: CelebrationData): Promise<void> {
  if (!data.animationsEnabled || (process.stdout.columns || 80) < 45) {
    // Static fallback
    const prevLevel = getLevel(data.beforeDays);
    const currLevel = getLevel(data.afterDays);
    if (currLevel.requiredDays > prevLevel.requiredDays) {
      console.log(colors.primary(`  ▲ ${currLevel.name} — ${currLevel.title}`));
      console.log();
    }
    displayStatus();
    return;
  }

  const prevLevel = getLevel(data.beforeDays);
  const currLevel = getLevel(data.afterDays);
  const isLevelUp = currLevel.requiredDays > prevLevel.requiredDays;

  const prevProgress = getLevelProgress(data.beforeDays);
  const currProgress = getLevelProgress(data.afterDays);

  const prevFilled = Math.round(prevProgress.progress * BAR_WIDTH);
  const currFilled = Math.round(currProgress.progress * BAR_WIDTH);

  process.stdout.write(ANSI.hideCursor);
  const cleanup = () => process.stdout.write(ANSI.showCursor);
  process.on('SIGINT', cleanup);

  try {
    // Print canvas space + initial box
    for (let i = 0; i < CANVAS_HEIGHT; i++) console.log();

    let currentIcon = prevLevel.icon;
    let currentName = prevLevel.name;
    let currentFilled = prevFilled;
    let currentStreak = data.beforeStreak;
    const borderColor = chalk.hex(BOX_COLOR);

    const boxWidth = calcBoxWidth(currentName);
    printBox(currentIcon, currentName, currentFilled, currentStreak, borderColor);

    const totalLines = CANVAS_HEIGHT + 3; // canvas + 3 box lines

    if (isLevelUp) {
      // Fill to 100%
      await animateBar(currentFilled, BAR_WIDTH, currentIcon, currentName, currentStreak, borderColor, totalLines);
      currentFilled = BAR_WIDTH;
      await sleep(200);

      // Border flash
      for (let i = 0; i < 2; i++) {
        moveTo(totalLines, CANVAS_HEIGHT);
        printBox(currentIcon, currentName, currentFilled, currentStreak, colors.primary);
        await sleep(100);
        moveTo(totalLines, CANVAS_HEIGHT);
        printBox(currentIcon, currentName, currentFilled, currentStreak, borderColor);
        await sleep(100);
      }

      // Swap level identity
      currentIcon = currLevel.icon;
      currentName = currLevel.name;
      moveTo(totalLines, CANVAS_HEIGHT);
      printBox(currentIcon, currentName, BAR_WIDTH, currentStreak, borderColor);
      await sleep(300);

      // Level-up text above box
      const levelText = `▲ ${currLevel.name} — ${currLevel.title}`;
      process.stdout.write(ANSI.up(totalLines));
      process.stdout.write(ANSI.clearLine);
      process.stdout.write(`  ${colors.primary(levelText)}`);
      process.stdout.write(ANSI.down(totalLines));
      process.stdout.write('\r');
      await sleep(400);

      // Animate bar down to new position
      await animateBar(BAR_WIDTH, currFilled, currentIcon, currentName, currentStreak, borderColor, totalLines);
      currentFilled = currFilled;
    } else if (currFilled !== prevFilled) {
      await animateBar(prevFilled, currFilled, currentIcon, currentName, currentStreak, borderColor, totalLines);
      currentFilled = currFilled;
    }

    // Streak animation
    if (data.afterStreak > data.beforeStreak) {
      const steps = Math.min(data.afterStreak - data.beforeStreak, 10);
      const increment = Math.max(1, Math.floor((data.afterStreak - data.beforeStreak) / steps));

      for (let s = data.beforeStreak + increment; s <= data.afterStreak; s += increment) {
        currentStreak = Math.min(s, data.afterStreak);
        moveTo(totalLines, CANVAS_HEIGHT);
        printBox(currentIcon, currentName, currentFilled, currentStreak, borderColor);
        await sleep(80);
      }
      if (currentStreak !== data.afterStreak) {
        currentStreak = data.afterStreak;
        moveTo(totalLines, CANVAS_HEIGHT);
        printBox(currentIcon, currentName, currentFilled, currentStreak, borderColor);
      }
      await sleep(100);
    }

    // Particle burst
    if (data.afterStreak > 0) {
      const particleCount = isLevelUp ? 16 : 10;
      await animateParticles(totalLines, particleCount);
    }

    // Clean render: erase everything and re-render with displayStatus
    process.stdout.write(ANSI.up(totalLines));
    for (let i = 0; i < totalLines; i++) {
      process.stdout.write(ANSI.clearLine + '\n');
    }
    process.stdout.write(ANSI.up(totalLines));

    if (isLevelUp) {
      console.log(colors.primary(`  ▲ ${currLevel.name} — ${currLevel.title}`));
      console.log();
    }
    displayStatus();

  } finally {
    process.stdout.write(ANSI.showCursor);
    process.removeListener('SIGINT', cleanup);
  }
}

function calcBoxWidth(name: string): number {
  // icon(1) + space(1) + name + 2spaces + bar(16) + 2spaces + fire(1) + space(1) + number(~3) + padding(2) + borders(2)
  return name.length + BAR_WIDTH + 14;
}

function buildContentLine(icon: string, name: string, filled: number, streak: number, highlight = false): string {
  const bar = (highlight ? chalk.hex('#FF6347') : colors.primary)('━'.repeat(filled))
    + colors.subtle('━'.repeat(BAR_WIDTH - filled));

  const fireSection = streak > 0
    ? `${colors.primary('▲')} ${colors.white(String(streak))}`
    : colors.subtle('▲ 0');

  return `${colors.primary(icon)} ${colors.white(name)}  ${bar}  ${fireSection}`;
}

function printBox(icon: string, name: string, filled: number, streak: number, border: ColorFn, highlight = false): void {
  const content = buildContentLine(icon, name, filled, streak, highlight);
  // We need the visual width for the border
  const innerWidth = stripAnsi(content).length + 2; // 1 padding each side
  const top = border('╭' + '─'.repeat(innerWidth) + '╮');
  const mid = border('│') + ' ' + content + ' ' + border('│');
  const bot = border('╰' + '─'.repeat(innerWidth) + '╯');

  console.log(top);
  console.log(mid);
  console.log(bot);
}

function moveTo(totalLines: number, canvasHeight: number): void {
  // Move cursor up to the box top (3 lines from bottom of our region)
  process.stdout.write(ANSI.up(3));
  // Clear and rewrite the 3 box lines
  for (let i = 0; i < 3; i++) {
    process.stdout.write(ANSI.clearLine + '\n');
  }
  process.stdout.write(ANSI.up(3));
}

async function animateBar(
  from: number, to: number,
  icon: string, name: string, streak: number,
  border: ColorFn, totalLines: number,
): Promise<void> {
  const step = from < to ? 1 : -1;
  const steps = Math.abs(to - from);
  const delayPerStep = Math.max(40, Math.min(100, 600 / Math.max(steps, 1)));

  for (let i = from + step; step > 0 ? i <= to : i >= to; i += step) {
    moveTo(totalLines, CANVAS_HEIGHT);
    const highlight = (i === from + step); // flash on first new segment
    printBox(icon, name, i, streak, border, highlight);
    await sleep(delayPerStep);
  }
}

function spawnParticles(count: number, originX: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI * 0.8) + Math.PI * 0.1; // fan upward
    const speed = 0.8 + Math.random() * 1.5;
    particles.push({
      x: originX + (Math.random() - 0.5) * 4,
      y: CANVAS_HEIGHT - 1,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.sin(angle) * speed * 0.6,
      char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
      life: 4 + Math.floor(Math.random() * 4),
      maxLife: 8,
    });
  }
  return particles;
}

async function animateParticles(totalLines: number, count: number): Promise<void> {
  const termWidth = (process.stdout.columns || 80);
  const originX = Math.floor(termWidth / 2);
  let particles = spawnParticles(count, originX);

  for (let frame = 0; frame < 8; frame++) {
    // Build canvas
    const canvas: (null | { char: string; color: ColorFn })[][] =
      Array.from({ length: CANVAS_HEIGHT }, () => Array(termWidth).fill(null));

    for (const p of particles) {
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      if (x >= 0 && x < termWidth && y >= 0 && y < CANVAS_HEIGHT) {
        const frac = p.life / p.maxLife;
        const color = frac > 0.6 ? colors.primary : frac > 0.3 ? colors.primaryDim : colors.subtle;
        canvas[y][x] = { char: p.char, color };
      }
    }

    // Render canvas
    process.stdout.write(ANSI.up(totalLines));
    for (let row = 0; row < CANVAS_HEIGHT; row++) {
      process.stdout.write(ANSI.clearLine);
      let line = '';
      for (let col = 0; col < termWidth; col++) {
        const cell = canvas[row][col];
        line += cell ? cell.color(cell.char) : ' ';
      }
      process.stdout.write(line + '\n');
    }
    // Move back down past the box
    process.stdout.write(ANSI.down(3));
    process.stdout.write('\r');

    // Update particles
    particles = particles
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.05, // slight gravity
        life: p.life - 1,
      }))
      .filter(p => p.life > 0);

    await sleep(100);
  }

  // Clear canvas
  process.stdout.write(ANSI.up(totalLines));
  for (let i = 0; i < CANVAS_HEIGHT; i++) {
    process.stdout.write(ANSI.clearLine + '\n');
  }
  process.stdout.write(ANSI.down(3));
  process.stdout.write('\r');
}

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export type { CelebrationData };
