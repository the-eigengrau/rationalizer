import { colors } from './theme.js';

const REBT_TIPS = [
  "You feel the way you think. Change your thinking, change your feeling.",
  "There's a difference between wanting something and demanding it.",
  "Unconditional self-acceptance: you are worthy regardless of performance.",
  "Replace 'I must' with 'I prefer' — feel the difference.",
  "Awfulizing makes bad situations feel catastrophic. Rate it on a real scale.",
  "Low frustration tolerance says 'I can't stand it.' But you can — and you have.",
  "Other people don't make you angry. Your beliefs about their behavior do.",
  "Shoulding on yourself is the quickest path to misery.",
  "Disputing irrational beliefs isn't positive thinking — it's realistic thinking.",
  "The goal isn't to feel nothing. It's to feel appropriately.",
  "You don't need approval to be worthwhile.",
  "Humans are fallible. All of us. Including you. That's okay.",
  "Discomfort is not the same as danger.",
  "Your worth as a person is not determined by any single event.",
  "Preferences lead to disappointment. Demands lead to disturbance.",
  "Ask yourself: 'Where is the evidence for this belief?'",
  "Albert Ellis: 'The best years of your life are the ones in which you decide your problems are your own.'",
  "Emotional responsibility: nobody can upset you without your philosophical permission.",
  "Practice unconditional other-acceptance: people will act the way they act.",
  "The elegant solution: change the demand, not the world.",
];

export function getRandomTip(): string {
  const tip = REBT_TIPS[Math.floor(Math.random() * REBT_TIPS.length)];
  return colors.dim(tip);
}

export function getRandomTipRaw(): string {
  return REBT_TIPS[Math.floor(Math.random() * REBT_TIPS.length)];
}
