import { getStreakData as getStreakDataFromDb } from '../storage/index.js';
import type { StreakData } from '../questionnaire/types.js';
import { t } from '../i18n/index.js';

export function getStreakData(): StreakData {
  return getStreakDataFromDb();
}

export function formatStreak(streak: number): string {
  if (streak === 0) return t().streak.noActive;
  if (streak === 1) return t().streak.oneDay;
  return t().streak.nDays(streak);
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '⚡🔥🔥🔥';
  return '⚡⚡🔥🔥🔥';
}
