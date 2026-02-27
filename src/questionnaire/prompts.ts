import { number } from '@inquirer/prompts';
import { colors } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import { vimInput } from '../ui/vim-input.js';
import { t } from '../i18n/index.js';

export async function promptActivatingEvent(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.activatingEvent.title}`));
  console.log(colors.dim(`  ${t().prompts.activatingEvent.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.activatingEvent.validation,
  });
}

export async function promptEmotionBefore(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.emotionBefore.title}`));
  console.log(colors.dim(`  ${t().prompts.emotionBefore.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.emotionBefore.validation,
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
  });
}

export async function promptConsequences(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.consequences.title}`));
  console.log(colors.dim(`  ${t().prompts.consequences.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.consequences.validation,
  });
}

export async function promptDisputation(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.disputation.title}`));
  console.log(colors.dim(`  ${t().prompts.disputation.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.disputation.validation,
  });
}

export async function promptEffectiveNewPhilosophy(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.newPhilosophy.title}`));
  console.log(colors.dim(`  ${t().prompts.newPhilosophy.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.newPhilosophy.validation,
  });
}

export async function promptEmotionAfter(): Promise<string> {
  console.log(colors.white(`\n  ${t().prompts.emotionAfter.title}`));
  console.log(colors.dim(`  ${t().prompts.emotionAfter.description}`));

  return vimInput({
    validate: (val) => val.trim().length > 0 || t().prompts.emotionAfter.validation,
  });
}
