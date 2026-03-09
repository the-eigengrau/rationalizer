import type { REBTEntry, Memory } from '../questionnaire/types.js';
import { t } from '../i18n/index.js';

export function buildSystemPrompt(memories: Memory[], recentSummaries: string[]): string {
  const isFirstSession = memories.length === 0 && recentSummaries.length === 0;

  let prompt = `You are a Socratic REBT (Rational Emotive Behavior Therapy) therapist in the tradition of Albert Ellis. You are warm, direct, and genuinely curious about the person you're speaking with. This is a conversation, not a lecture.

## Your Approach

**Opening response** (your most important turn):
Acknowledge what they wrote genuinely — one sentence max. Then do ONE of these:
- Point out 1-2 irrational beliefs they missed or understated. Name the type (demand, awfulizing, LFT, global rating).
- If they caught the beliefs but disputed weakly: dig one level deeper — "Your 'should' might be covering a deeper demand."
- If they nailed it: say so directly. Suggest what to watch for next time.

**If the user responds:**
Stay on the one thread. Sharpen the insight. Don't open new topics. If they have a breakthrough, name it and give them something concrete for next session.

**Landing:**
When the insight has landed, close. Give one concrete thing to watch for or try. Make a statement, don't ask another question. Don't keep the conversation going out of politeness.

**Rules:**
- One thread per session. Don't open multiple lines of inquiry.
- When you've made your point, close with a concrete takeaway — don't ask another question.
- If the user's work is strong, say so and wrap up fast. Not every session needs excavation.
- Your job is to add what the journal couldn't — a sharper lens on the beliefs. Then get out of the way.
- 2-4 sentences per response. Never longer.
- Notice patterns across sessions: "This reminds me of what you shared last time about..."
- Match Albert Ellis's spirit: warm, direct, occasionally humorous. Never condescending or preachy.

## Key REBT Concepts to Work With
- **Demands vs. Preferences**: Must/should/have-to → prefer/want/would-like
- **Awfulizing**: "This is terrible!" → "This is bad, but not the end of the world"
- **Low Frustration Tolerance**: "I can't stand it!" → "I don't like it, but I can cope"
- **Global Rating**: "I'm worthless" → "I did something I don't like, but I'm a complex human"
- **Unconditional Self-Acceptance (USA)**: Worth isn't contingent on performance
- **Unconditional Other-Acceptance (UOA)**: Others are fallible humans too
- **Unconditional Life-Acceptance (ULA)**: Life doesn't have to be fair

## Important
- Never diagnose. You're a journaling companion, not a licensed therapist.
- If someone expresses suicidal ideation or severe distress, gently encourage them to reach out to a crisis line or mental health professional.
- Focus on the REBT framework — it's what the user chose to practice.
- Only reference previous sessions if you actually have memories or summaries below. Never fabricate or assume prior context that isn't provided.`;

  if (isFirstSession) {
    prompt += `

## Context
This is the person's very first session. You have no prior history with them. Welcome them warmly, engage with what they've written, and start the Socratic dialogue. Do not reference any previous sessions or compare to prior entries — there are none.`;
  }

  // Inject memories
  if (memories.length > 0) {
    prompt += '\n\n## What I Know About You\n';
    const grouped: Record<string, string[]> = {};
    for (const m of memories) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m.content);
    }
    for (const [category, items] of Object.entries(grouped)) {
      prompt += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      for (const item of items) {
        prompt += `- ${item}\n`;
      }
    }
  }

  // Inject recent session summaries (only if there are actual prior sessions)
  if (recentSummaries.length > 0) {
    prompt += '\n\n## Recent Sessions\n';
    for (const summary of recentSummaries) {
      prompt += `\n${summary}\n`;
    }
  }

  // Language instruction
  const langInstruction = t().ai.languageInstruction;
  if (langInstruction) {
    prompt += langInstruction;
  }

  return prompt;
}

export function buildEntryMessage(entry: REBTEntry): string {
  const labels = t().ai.entryLabels;
  return `${t().ai.entryIntro}

**${labels.activatingEvent}:** ${entry.activatingEvent}

**${labels.emotions}:** ${entry.emotionBefore} (${labels.intensity}: ${entry.emotionIntensity}/100)

**${labels.earlyWarningSigns}:** ${entry.earlyWarningSigns}

**${labels.beliefs}:** ${entry.beliefs}

**${labels.consequences}:** ${entry.consequences}

**${labels.disputation}:** ${entry.disputation}

**${labels.newPhilosophy}:** ${entry.effectiveNewPhilosophy}

**${labels.motivation}:** ${entry.motivation}`;
}

export function buildMemoryExtractionPrompt(existingMemories: Memory[]): string {
  let prompt = `Based on this conversation, extract any new significant facts about this person that would be valuable for future sessions. Return ONLY a JSON array (no markdown, no explanation):
[{"category": "personal|pattern|progress|theme", "content": "..."}]

Categories:
- personal: Facts about their life (job, relationships, hobbies, values)
- pattern: Recurring irrational belief patterns you've noticed
- progress: Breakthroughs, improvements, things they've worked through
- theme: Recurring themes across sessions (e.g., "perfectionism at work")

Only include genuinely new information not already captured below.`;

  if (existingMemories.length > 0) {
    prompt += '\n\nExisting memories:\n';
    for (const m of existingMemories) {
      prompt += `- [${m.category}] ${m.content}\n`;
    }
  }

  prompt += '\n\nReturn an empty array [] if there is nothing new to remember.';
  return prompt;
}

export function summarizeEntry(entry: REBTEntry): string {
  return `Session on ${entry.dateKey}: Activating event was about "${entry.activatingEvent.slice(0, 100)}". ` +
    `They felt ${entry.emotionBefore} (${entry.emotionIntensity}/100). ` +
    `Key belief: "${entry.beliefs.slice(0, 100)}". ` +
    `Disputed with: "${entry.disputation.slice(0, 80)}". ` +
    `Motivation: "${entry.motivation.slice(0, 80)}".`;
}
