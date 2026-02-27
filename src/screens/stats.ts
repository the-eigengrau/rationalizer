import boxen from 'boxen';
import { getStreakData } from '../storage/index.js';
import { getLevelProgress, LEVELS } from '../gamification/levels.js';
import { formatStreak } from '../gamification/streak.js';
import { colors, headerStyle, BOX_COLOR } from '../ui/theme.js';

export async function viewStats(): Promise<void> {
  const streakData = getStreakData();
  const { current, next, progress } = getLevelProgress(streakData.totalDays);

  const barWidth = 24;
  const filled = Math.round(progress * barWidth);
  const empty = barWidth - filled;
  const progressBar = colors.primary('━'.repeat(filled)) + colors.subtle('━'.repeat(empty));
  const pct = Math.round(progress * 100);

  const content = [
    `${colors.white(current.name)}  ${colors.dim(current.title)}`,
    '',
    `${progressBar}  ${colors.dim(`${pct}%`)}`,
    next
      ? colors.dim(`${streakData.totalDays}/${next.requiredDays} days to ${next.name}`)
      : colors.dim('Max level'),
    '',
    `${colors.white('Streak')}   ${formatStreak(streakData.currentStreak)}`,
    `${colors.white('Longest')}  ${formatStreak(streakData.longestStreak)}`,
    `${colors.white('Entries')}  ${streakData.totalEntries}`,
    `${colors.white('Days')}     ${streakData.totalDays}`,
    '',
    ...LEVELS.map(level => {
      const unlocked = streakData.totalDays >= level.requiredDays;
      const icon = unlocked ? colors.primary(level.icon) : colors.subtle(level.icon);
      const name = unlocked ? colors.white(level.name) : colors.subtle(level.name);
      const days = colors.dim(`${level.requiredDays}d`);
      return `${icon} ${name}  ${days}`;
    }),
  ].join('\n');

  console.log();
  console.log(boxen(content, {
    padding: 1,
    borderColor: BOX_COLOR,
    borderStyle: 'round',
    dimBorder: true,
  }));
}
