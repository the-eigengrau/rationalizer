import { colors } from './theme.js';
import { t } from '../i18n/index.js';

export function getRandomTip(): string {
  const tips = t().tips;
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return colors.dim(tip);
}

export function getRandomTipRaw(): string {
  const tips = t().tips;
  return tips[Math.floor(Math.random() * tips.length)];
}
