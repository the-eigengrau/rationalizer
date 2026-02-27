import { number } from '@inquirer/prompts';
import { colors } from '../ui/theme.js';
import { promptTheme } from '../ui/prompt-theme.js';
import { vimInput } from '../ui/vim-input.js';

export async function promptActivatingEvent(): Promise<string> {
  console.log(colors.white('\n  Activating Event'));
  console.log(colors.dim('  Describe the situation that triggered your emotional response.'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe what happened.',
  });
}

export async function promptEmotionBefore(): Promise<string> {
  console.log(colors.white('\n  Emotional Response'));
  console.log(colors.dim('  What emotions did you feel? e.g., anxious, angry, sad, guilty.'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe your emotions.',
  });
}

export async function promptEmotionIntensity(): Promise<number> {
  console.log(colors.white('\n  Intensity'));
  console.log(colors.dim('  How intense was the emotion? (1-100)'));

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
  console.log(colors.white('\n  Beliefs'));
  console.log(colors.dim('  What were you telling yourself? Look for demands: must, should, have to.'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe your beliefs.',
  });
}

export async function promptConsequences(): Promise<string> {
  console.log(colors.white('\n  Consequences'));
  console.log(colors.dim('  How did you act? What did you do or avoid doing?'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe the consequences.',
  });
}

export async function promptDisputation(): Promise<string> {
  console.log(colors.white('\n  Disputation'));
  console.log(colors.dim('  Challenge your beliefs. Where is the evidence?'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please try to dispute your beliefs.',
  });
}

export async function promptEffectiveNewPhilosophy(): Promise<string> {
  console.log(colors.white('\n  Effective New Philosophy'));
  console.log(colors.dim('  Turn your demands into preferences. What is a healthier perspective?'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe a new perspective.',
  });
}

export async function promptEmotionAfter(): Promise<string> {
  console.log(colors.white('\n  After Reflection'));
  console.log(colors.dim('  How do you feel now, after working through this?'));

  return vimInput({
    validate: (val) => val.trim().length > 0 || 'Please describe how you feel.',
  });
}
