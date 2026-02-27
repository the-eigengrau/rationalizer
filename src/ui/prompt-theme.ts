import { colors } from './theme.js';

export const promptTheme = {
  prefix: { idle: ' ', done: ' ' },
  style: {
    message: (text: string) => colors.dimWhite(text),
    answer: (text: string) => colors.white(text),
    highlight: (text: string) => colors.primary(text),
  },
  keybindings: ['vim' as const],
  helpMode: 'never' as const,
};
