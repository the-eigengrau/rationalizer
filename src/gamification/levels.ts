import type { LevelInfo } from '../questionnaire/types.js';

export const LEVELS: LevelInfo[] = [
  { requiredDays: 0,   name: 'Neophyte',      title: 'The Beginner',       description: 'The journey begins',        icon: '○' },
  { requiredDays: 3,   name: 'Asketes',       title: 'The Practitioner',   description: 'Discipline takes root',     icon: '◎' },
  { requiredDays: 7,   name: 'Philosophos',   title: 'Lover of Wisdom',    description: 'The love of wisdom grows',  icon: '◈' },
  { requiredDays: 14,  name: 'Mathematikos',  title: 'The Learner',        description: 'Patterns emerge from chaos',icon: '◇' },
  { requiredDays: 30,  name: 'Dialektikos',   title: 'Master of Reason',   description: 'Logic is your sword',       icon: '△' },
  { requiredDays: 60,  name: 'Sophron',       title: 'The Temperate One',  description: 'Balance in all things',     icon: '⬡' },
  { requiredDays: 90,  name: 'Ataraxos',      title: 'The Unshakeable',    description: 'Inner peace achieved',      icon: '◆' },
  { requiredDays: 180, name: 'Sophos',        title: 'The Sage',           description: 'Wisdom flows through you',  icon: '✦' },
  { requiredDays: 365, name: 'Epistemon',     title: 'The Knower',         description: 'True knowledge attained',   icon: '★' },
];

export function getLevel(totalDays: number): LevelInfo {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (totalDays >= level.requiredDays) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getNextLevel(totalDays: number): LevelInfo | null {
  for (const level of LEVELS) {
    if (totalDays < level.requiredDays) {
      return level;
    }
  }
  return null;
}

export function getLevelProgress(totalDays: number): { current: LevelInfo; next: LevelInfo | null; progress: number } {
  const current = getLevel(totalDays);
  const next = getNextLevel(totalDays);

  if (!next) {
    return { current, next: null, progress: 1 };
  }

  const progressRange = next.requiredDays - current.requiredDays;
  const progressMade = totalDays - current.requiredDays;
  const progress = Math.min(progressMade / progressRange, 1);

  return { current, next, progress };
}
