import chalk from 'chalk';

export const colors = {
  primary: chalk.hex('#FC5830'),
  primaryDim: chalk.hex('#a33a20'),
  white: chalk.white,
  bold: chalk.bold,
  dim: chalk.dim,
  muted: chalk.gray,
  dimWhite: chalk.hex('#888888'),
  subtle: chalk.hex('#555555'),
  error: chalk.hex('#FC5830'),
};

export const BOX_COLOR = '#444444';

export const headerStyle = (text: string) => colors.bold(colors.white(text));
export const dimText = (text: string) => colors.dim(text);
export const successText = (text: string) => colors.primary(text);
export const warningText = (text: string) => colors.primary(text);
export const errorText = (text: string) => colors.error(text);
