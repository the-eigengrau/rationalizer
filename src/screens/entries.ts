import { select } from '@inquirer/prompts';
import boxen from 'boxen';
import { listEntries, getConversation } from '../storage/index.js';
import { colors, headerStyle, BOX_COLOR } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import { formatDate } from '../utils/date.js';
import type { REBTEntry } from '../questionnaire/types.js';

export async function viewPastEntries(): Promise<void> {
  const entries = listEntries(20);

  if (entries.length === 0) {
    console.log(colors.dim('\n  No entries yet.\n'));
    return;
  }

  while (true) {
    const choices = entries.map((entry) => ({
      value: entry.id,
      name: `${colors.dim(formatDate(entry.createdAt))}  ${entry.emotionBefore}  ${colors.dim(`(${entry.emotionIntensity}/100)`)}`,
    }));

    choices.push({ value: '__back', name: colors.dim('← Back') });

    const chosen = await select({
      message: '',
      theme: { ...promptTheme, prefix: { idle: '', done: '' } },
      choices,
      pageSize: 15,
    });

    if (chosen === '__back') return;

    const entry = entries.find(e => e.id === chosen);
    if (entry) {
      displayEntry(entry);

      const convo = getConversation(entry.id);
      if (convo) {
        console.log(colors.white('\n  Conversation\n'));
        for (const msg of convo.messages) {
          const label = msg.role === 'user' ? colors.white('You') : colors.primary('Rationalizer');
          console.log(`  ${label}  ${colors.white(msg.content)}`);
          console.log();
        }
      }

      await select({
        message: '',
        theme: { ...promptTheme, prefix: { idle: '', done: '' } },
        choices: [{ value: 'back', name: colors.dim('← Back') }],
      });
    }
  }
}

function displayEntry(entry: REBTEntry): void {
  const content = [
    `${colors.dim(formatDate(entry.createdAt))}`,
    '',
    `${colors.white('Activating Event')}`,
    `${colors.dim(entry.activatingEvent)}`,
    '',
    `${colors.white('Emotions')}  ${colors.dim(`${entry.emotionBefore} → ${entry.emotionAfter}`)}  ${colors.dim(`(${entry.emotionIntensity}/100)`)}`,
    '',
    `${colors.white('Beliefs')}`,
    `${colors.dim(entry.beliefs)}`,
    '',
    `${colors.white('Consequences')}`,
    `${colors.dim(entry.consequences)}`,
    '',
    `${colors.white('Disputation')}`,
    `${colors.dim(entry.disputation)}`,
    '',
    `${colors.white('New Philosophy')}`,
    `${colors.dim(entry.effectiveNewPhilosophy)}`,
  ].join('\n');

  console.log();
  console.log(boxen(content, {
    padding: 1,
    borderColor: BOX_COLOR,
    borderStyle: 'round',
    dimBorder: true,
  }));
}
