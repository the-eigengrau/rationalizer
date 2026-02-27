import {
  promptActivatingEvent,
  promptEmotionBefore,
  promptEmotionIntensity,
  promptBeliefs,
  promptConsequences,
  promptDisputation,
  promptEffectiveNewPhilosophy,
  promptEmotionAfter,
} from './prompts.js';
import type { REBTEntry } from './types.js';
import { generateId, saveEntry } from '../storage/index.js';
import { todayKey } from '../utils/date.js';
import { colors } from '../ui/theme.js';

export async function runQuestionnaire(): Promise<REBTEntry> {
  console.clear();

  const activatingEvent = await promptActivatingEvent();
  const emotionBefore = await promptEmotionBefore();
  const emotionIntensity = await promptEmotionIntensity();
  const beliefs = await promptBeliefs();
  const consequences = await promptConsequences();
  const disputation = await promptDisputation();
  const effectiveNewPhilosophy = await promptEffectiveNewPhilosophy();
  const emotionAfter = await promptEmotionAfter();

  const entry: REBTEntry = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    dateKey: todayKey(),
    emotionIntensity,
    activatingEvent,
    beliefs,
    consequences,
    disputation,
    effectiveNewPhilosophy,
    emotionBefore,
    emotionAfter,
  };

  saveEntry(entry);

  return entry;
}
