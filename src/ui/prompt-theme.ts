import { colors } from './theme.js';

export const promptTheme = {
  prefix: { idle: ' ', done: ' ' },
  style: {
    message: (text: string) => colors.dimWhite(text),
    answer: (text: string) => colors.white(text),
  },
  keybindings: ['vim' as const],
};
