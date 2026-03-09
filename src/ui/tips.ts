import { colors } from './theme.js';
import { t } from '../i18n/index.js';

// Shuffle-based rotation — cycles through all tips before any repeats
let tipQueue: number[] = [];

function nextTipIndex(): number {
  const tips = t().tips;
  if (tipQueue.length === 0) {
    // Refill and shuffle (Fisher-Yates)
    tipQueue = Array.from({ length: tips.length }, (_, i) => i);
    for (let i = tipQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tipQueue[i], tipQueue[j]] = [tipQueue[j], tipQueue[i]];
    }
  }
  return tipQueue.pop()!;
}

export function getRandomTip(): string {
  const tips = t().tips;
  return colors.dim(tips[nextTipIndex()]);
}

export function getRandomTipRaw(): string {
  const tips = t().tips;
  return tips[nextTipIndex()];
}
