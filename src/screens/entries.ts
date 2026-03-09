import { select } from '@inquirer/prompts';
import boxen from 'boxen';
import { listEntries, getConversation } from '../storage/index.js';
import { colors, headerStyle, BOX_COLOR } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import { showHelp } from '../ui/help.js';
import { formatDate } from '../utils/date.js';
import type { REBTEntry } from '../questionnaire/types.js';
import { t } from '../i18n/index.js';

export async function viewPastEntries(): Promise<void> {
  const entries = listEntries(20);

  if (entries.length === 0) {
    console.log(colors.dim(`\n  ${t().entries.noEntries}\n`));
    return;
  }

  while (true) {
    const choices = entries.map((entry) => ({
      value: entry.id,
      name: `${colors.dim(formatDate(entry.createdAt))}  ${entry.emotionBefore}  ${colors.dim(`(${entry.emotionIntensity}/100)`)}`,
    }));

    choices.push({ value: '__help', name: colors.dim('? Help') });
    choices.push({ value: '__back', name: colors.dim(t().common.back) });

    const chosen = await select({
      message: '',
      theme: { ...promptTheme, prefix: { idle: '', done: '' } },
      choices,
      pageSize: 15,
    });

    if (chosen === '__help') {
      showHelp('pastEntries');
      continue;
    }
    if (chosen === '__back') return;

    const entry = entries.find(e => e.id === chosen);
    if (entry) {
      displayEntry(entry);

      const convo = getConversation(entry.id);
      if (convo) {
        console.log(colors.white(`\n  ${t().entries.conversation}\n`));
        for (const msg of convo.messages) {
          const label = msg.role === 'user' ? colors.white(t().entries.you) : colors.primary(t().entries.rationalizer);
          console.log(`  ${label}  ${colors.white(msg.content)}`);
          console.log();
        }
      }

      await select({
        message: '',
        theme: { ...promptTheme, prefix: { idle: '', done: '' } },
        choices: [{ value: 'back', name: colors.dim(t().common.back) }],
      });
    }
  }
}

function displayEntry(entry: REBTEntry): void {
  const content = [
    `${colors.dim(formatDate(entry.createdAt))}`,
    '',
    `${colors.white(t().entries.activatingEvent)}`,
    `${colors.dim(entry.activatingEvent)}`,
    '',
    `${colors.white(t().entries.emotions)}  ${colors.dim(`${entry.emotionBefore}`)}  ${colors.dim(`(${entry.emotionIntensity}/100)`)}`,
    '',
    `${colors.white(t().entries.earlyWarningSigns)}`,
    `${colors.dim(entry.earlyWarningSigns)}`,
    '',
    `${colors.white(t().entries.beliefs)}`,
    `${colors.dim(entry.beliefs)}`,
    '',
    `${colors.white(t().entries.consequences)}`,
    `${colors.dim(entry.consequences)}`,
    '',
    `${colors.white(t().entries.disputation)}`,
    `${colors.dim(entry.disputation)}`,
    '',
    `${colors.white(t().entries.newPhilosophy)}`,
    `${colors.dim(entry.effectiveNewPhilosophy)}`,
    '',
    `${colors.white(t().entries.motivation)}`,
    `${colors.dim(entry.motivation)}`,
  ].join('\n');

  console.log();
  console.log(boxen(content, {
    padding: 1,
    borderColor: BOX_COLOR,
    borderStyle: 'round',
    dimBorder: true,
  }));
}
