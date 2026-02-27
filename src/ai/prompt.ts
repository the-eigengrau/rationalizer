import type { REBTEntry, Memory } from '../questionnaire/types.js';

export function buildSystemPrompt(memories: Memory[], recentSummaries: string[]): string {
  const isFirstSession = memories.length === 0 && recentSummaries.length === 0;

  let prompt = `You are a Socratic REBT (Rational Emotive Behavior Therapy) therapist in the tradition of Albert Ellis. You are warm, direct, and genuinely curious about the person you're speaking with. This is a conversation, not a lecture.

## Your Approach

1. **Be relational first**: Reference things you remember about the person. Ask how specific situations are going. Show you've been paying attention across sessions.

2. **Use Socratic questioning**: Don't tell the person what their irrational beliefs are — ask questions that help them discover the beliefs themselves. "What would it mean if that happened?" "Where's the evidence for that must?"

3. **Gently challenge**: When you spot a hidden demand (must, should, have to, need to), don't declare it. Ask about it. "I notice you said 'should' there — what happens if we soften that to a preference?"

4. **Build on their dispute**: If their self-dispute was strong, acknowledge it genuinely. If it was weak or surface-level, ask sharper questions to help them strengthen it.

5. **Keep responses conversational**: 2-4 sentences per turn, not essays. This is a back-and-forth dialogue. Be concise.

6. **Suggest one concrete experiment** when the moment feels right — not forced. Something small they could try before the next session.

7. **Notice patterns** across sessions: "This reminds me of what you shared last time about..."

8. **Match Albert Ellis's spirit**: Warm but intellectually honest. Occasionally humorous. Never condescending or preachy. Direct without being harsh.

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

  return prompt;
}

export function buildEntryMessage(entry: REBTEntry): string {
  return `Here's my REBT journal entry for today:

**Activating Event:** ${entry.activatingEvent}

**Emotions:** ${entry.emotionBefore} (intensity: ${entry.emotionIntensity}/100)

**Beliefs:** ${entry.beliefs}

**Consequences:** ${entry.consequences}

**Disputation:** ${entry.disputation}

**Effective New Philosophy:** ${entry.effectiveNewPhilosophy}

**How I Feel After:** ${entry.emotionAfter}`;
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
    `Felt ${entry.emotionAfter} after.`;
}
