import boxen from 'boxen';
import { colors, BOX_COLOR } from './theme.js';
import { t } from '../i18n/index.js';

export function showHelp(key: string): void {
  const help = t().help as Record<string, string>;
  const content = help[key];
  if (!content) return;

  const width = Math.min(process.stdout.columns || 80, 80) - 4;

  const formatted = content
    .split('\n')
    .map((line) => {
      const wrapped = wrapLine(line, width - 4);
      if (/^\d+\.\s/.test(line)) return wrapped.map((l) => colors.white(l));
      if (line === '') return [''];
      return wrapped.map((l) => colors.dim(l));
    })
    .flat()
    .join('\n');

  console.log();
  console.log(boxen(formatted, {
    padding: { top: 1, bottom: 1, left: 2, right: 2 },
    borderColor: BOX_COLOR,
    borderStyle: 'round',
    dimBorder: true,
  }));
  console.log();
}

function wrapLine(line: string, maxWidth: number): string[] {
  if (line.length <= maxWidth) return [line];

  const words = line.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
