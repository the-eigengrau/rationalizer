import { number } from '@inquirer/prompts';
import { colors } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import { vimInput } from '../ui/vim-input.js';
import { wrapText } from '../ui/text.js';
import { t } from '../i18n/index.js';

export async function promptActivatingEvent(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.activatingEvent.title}`));
  console.log(colors.dim(`  ${t().prompts.activatingEvent.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.activatingEvent.validation,
    helpKey: 'activatingEvent',
  });
}

export async function promptEmotionBefore(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.emotionBefore.title}`));
  console.log(colors.dim(`  ${t().prompts.emotionBefore.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.emotionBefore.validation,
    helpKey: 'emotionBefore',
  });
}

export async function promptEmotionIntensity(): Promise<number> {
  console.log(colors.white(`\n  ${t().prompts.emotionIntensity.title}`));
  console.log(colors.dim(`  ${t().prompts.emotionIntensity.description}`));

  const result = await number({
    message: '',
    theme: { ...promptTheme, prefix: { idle: '  ›', done: '  ›' } },
    min: 1,
    max: 100,
    required: true,
  });
  return result ?? 50;
}

export async function promptBeliefs(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.beliefs.title}`));
  console.log(colors.dim(`  ${t().prompts.beliefs.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.beliefs.validation,
    helpKey: 'beliefs',
  });
}

export async function promptConsequences(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.consequences.title}`));
  console.log(colors.dim(`  ${t().prompts.consequences.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.consequences.validation,
    helpKey: 'consequences',
  });
}

export async function promptDisputation(beliefs: string): Promise<string> {
  // Show beliefs recall block so user can see what they wrote
  const wrapped = wrapText(beliefs, 68, '  ');
  console.log(colors.dim(`\n  ${t().prompts.beliefs.title}`));
  console.log(colors.dim('  ────────────'));
  console.log(colors.dim(wrapped));

  console.log(colors.white(`\n  ${t().prompts.disputation.title}`));
  console.log(colors.dim(`  ${t().prompts.disputation.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.disputation.validation,
    helpKey: 'disputation',
  });
}

export async function promptEffectiveNewPhilosophy(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.newPhilosophy.title}`));
  console.log(colors.dim(`  ${t().prompts.newPhilosophy.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.newPhilosophy.validation,
    helpKey: 'newPhilosophy',
  });
}

export async function promptEarlyWarningSigns(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.earlyWarningSigns.title}`));
  console.log(colors.dim(`  ${t().prompts.earlyWarningSigns.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.earlyWarningSigns.validation,
    helpKey: 'earlyWarningSigns',
  });
}

export async function promptMotivation(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.motivation.title}`));
  console.log(colors.dim(`  ${t().prompts.motivation.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.motivation.validation,
    helpKey: 'motivation',
  });
}
