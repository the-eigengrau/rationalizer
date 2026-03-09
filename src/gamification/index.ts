import boxen from 'boxen';
import { getStreakData, formatStreak } from './streak.js';
import { getLevelProgress } from './levels.js';
import { colors, BOX_COLOR } from '../ui/theme.js';
import { animateLevelUp } from '../ui/ascii-art.js';
import { getLevel } from './levels.js';
import type { StreakData } from '../questionnaire/types.js';
import { play, SoundEffect } from '../audio/index.js';

export function displayStatus(): StreakData {
  const streakData = getStreakData();
  const { current, next, progress } = getLevelProgress(streakData.totalDays);

  // Progress bar
  const barWidth = 16;
  const filled = Math.round(progress * barWidth);
  const empty = barWidth - filled;
  const bar = colors.primary('━'.repeat(filled)) + colors.subtle('━'.repeat(empty));

  // Single row: icon level  ━━━━━━━━━━━━━━━━  🔥 streak
  const streakNum = streakData.currentStreak;
  const fireSection = streakNum > 0
    ? `🔥 ${colors.white(String(streakNum))}`
    : colors.subtle('🔥 0');

  const line = `${colors.primary(current.icon)} ${colors.white(current.name)}  ${bar}  ${fireSection}`;

  console.log(boxen(line, {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderColor: BOX_COLOR,
    borderStyle: 'round',
    dimBorder: true,
  }));

  return streakData;
}

export async function checkLevelUp(previousDays: number, currentDays: number): Promise<void> {
  const prevLevel = getLevel(previousDays);
  const currLevel = getLevel(currentDays);

  if (currLevel.requiredDays > prevLevel.requiredDays) {
    play(SoundEffect.LevelUp);
    await animateLevelUp(currLevel.name, currLevel.title);
  }
}

export { getStreakData, formatStreak } from './streak.js';
export { getLevel, getNextLevel, getLevelProgress } from './levels.js';
