# Rationalizer

**A Stoic AI journal that teaches you to think clearly when life hits hard.**

Rationalizer is a terminal-based therapist powered by Rational Emotive Behavior Therapy (REBT) — the oldest and most battle-tested form of cognitive behavioral therapy. It walks you through a structured framework for dismantling irrational beliefs, then drops you into a Socratic dialogue with an AI that remembers your patterns across sessions.

Your data stays on your machine. Encrypted. No cloud required.

```
npm install -g rationalizer
```

---

## Why REBT

In 1955, Albert Ellis created Rational Emotive Behavior Therapy — the original cognitive behavioral therapy, a decade before Beck's CBT existed. Ellis didn't invent the core idea. He borrowed it from the Stoics.

Epictetus, writing in 135 AD: *"Men are disturbed not by things, but by the views which they take of them."*

That's the entire theory. Bad events don't cause your suffering — your **beliefs** about those events do. Specifically, your irrational demands: "This **must** not happen," "I **should** be better," "They **have** to treat me fairly." REBT teaches you to find these demands and replace them with preferences. Not suppression. Not positive thinking. Rational flexibility.

### The research backs it up

REBT has 70 years of clinical evidence behind it:

- **David et al. (2018)** — Meta-analysis of 84 studies across 50 years. Significant effect sizes for outcomes (d=0.58) and belief change (d=0.70), with effects sustained at follow-up. Conclusion: REBT is "a sound psychological intervention." ([Journal of Clinical Psychology](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836900/))
- **Lyons & Woods (1991)** — 27 studies, pre-post effect size of d=1.37. ([Clinical Psychology Review](https://www.sciencedirect.com/science/article/abs/pii/0272735891901139))
- **King et al. (2024)** — Systematic review of 162 REBT intervention studies. Medium-to-large effects across behavioral, cognitive, emotional, and health outcomes. ([PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0306835))
- **David et al. (2008)** — RCT with 170 patients: REBT matched both cognitive therapy and pharmacotherapy for major depressive disorder. ([Journal of Clinical Psychology](https://onlinelibrary.wiley.com/doi/abs/10.1002/jclp.20487))

Demonstrated effective for depression, anxiety, PTSD, OCD, anger, substance use, and performance contexts.

### How it works: the ABCDE model

Every session walks you through five steps:

| Step | What you do |
|------|-------------|
| **A** — Activating Event | Describe what happened |
| **B** — Beliefs | Find the demands: must, should, have to |
| **C** — Consequences | How you felt and acted |
| **D** — Disputation | Challenge those beliefs with evidence |
| **E** — Effective New Philosophy | Replace demands with preferences |

The structured writing alone is therapeutic. The AI conversation that follows deepens it.

---

## Features

### AI therapist that learns about you

After each journal entry, you enter a Socratic dialogue with an AI trained in the Albert Ellis tradition — warm, direct, and curious. It asks questions rather than lectures. It challenges your "musts" and "shoulds" gently.

The AI extracts memories from each session — personal details, recurring patterns, breakthroughs, themes — and carries them forward. By your tenth session, it knows your tendencies. By your thirtieth, it catches patterns you don't see yourself.

### Local-first, encrypted by default

All data lives in `~/.rationalizer/data.db`. Journal entries, conversations, and AI memories are encrypted with **AES-256-GCM** (PBKDF2 key derivation, 100k iterations, SHA-512). Your passphrase never leaves your machine.

### Run any LLM

| Provider | Privacy | Setup |
|----------|---------|-------|
| **Ollama** (local) | Nothing leaves your machine | `ollama pull llama3.2 && ollama serve` |
| **Claude** (cloud) | Entries sent over HTTPS | Set `ANTHROPIC_API_KEY` |
| **None** | Maximum privacy | Self-guided REBT only |

### Vim mode

Press `Ctrl+G` during any journal prompt to open your `$EDITOR`. Write long-form entries in vim, emacs, or whatever you use. The app picks up your text when you save and quit.

---

## Install

```bash
npm install -g rationalizer
rationalizer
```

From source:

```bash
git clone https://github.com/the-eigengrau/rationalizer.git
cd rationalizer
npm install
npm run dev
```

The setup wizard handles AI provider and encryption configuration on first run.

## Privacy

- **With Ollama**: Zero network traffic. Everything runs locally.
- **With Claude**: Only journal content is sent to the Anthropic API over HTTPS. Encrypted at rest.
- **No telemetry. No analytics. No tracking.**

## Development

```bash
npm run dev        # Run with tsx
npm run build      # Compile TypeScript
npm test           # Run tests
```

## License

MIT
