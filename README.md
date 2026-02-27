# Rationalizer

An elegant CLI tool for **Rational Emotive Behavior Therapy (REBT)** journaling with AI feedback and gamification.

```
▄▖▄▖▄▖▄▖▄▖▖ ▖▄▖▖ ▄▖▄▖▄▖▄▖
▙▘▌▌▐ ▐ ▌▌▛▖▌▌▌▌ ▐ ▗▘▙▖▙▘
▌▌▛▌▐ ▟▖▙▌▌▝▌▛▌▙▖▟▖▙▖▙▖▌▌
```

Rationalizer guides you through the **ABCDE model** — a structured approach to identifying and disputing irrational beliefs:

- **A**ctivating Event — What happened?
- **B**eliefs — What were you telling yourself?
- **C**onsequences — How did you feel and act?
- **D**isputation — Challenge those beliefs
- **E**ffective New Philosophy — A healthier perspective

## Features

- **Guided REBT sessions** — Walk through the ABCDE model step by step
- **AI conversation** — Socratic dialogue with a virtual REBT therapist (cloud or local)
- **Long-term memory** — The AI remembers you across sessions and notices patterns
- **Encrypted storage** — AES-256-GCM encryption for all journal entries
- **Gamification** — Streaks, Stoic-themed levels, and fire animations
- **Fully local-first** — No cloud services required

## Install

```bash
npm install -g rationalizer
rationalizer
```

Or run from source:

```bash
git clone <repo-url> && cd rationalizer
npm install
npm run dev
```

## AI Setup

Rationalizer supports three modes:

### Local AI (Ollama) — Free & Private

Everything stays on your machine. Install [Ollama](https://ollama.ai), then:

```bash
brew install ollama
ollama pull llama3.2
ollama serve
```

The setup wizard will detect Ollama and configure it automatically.

### Cloud AI (Claude) — More Capable

Uses Claude Opus 4.6 via the Anthropic API. Get an API key at [console.anthropic.com](https://console.anthropic.com).

Set it as an environment variable or enter it during setup:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### No AI

Self-guided journaling only. The REBT questionnaire works perfectly on its own.

## Encryption

Your journal entries are encrypted with **AES-256-GCM**. On first run, you choose a passphrase — all sensitive data is encrypted before it hits the SQLite database.

- **Cached mode** (default): Passphrase asked once, derived key cached for 1 hour
- **Always mode**: Passphrase asked every session
- **None**: Plaintext storage

Data is stored at `~/.rationalizer/data.db`.

## Level System

A Stoic/Greek-themed progression system based on total active journaling days:

| Days | Name | Title |
|------|------|-------|
| 0 | Neophyte | The Beginner |
| 3 | Asketes | The Practitioner |
| 7 | Philosophos | Lover of Wisdom |
| 14 | Mathematikos | The Learner |
| 30 | Dialektikos | Master of Reason |
| 60 | Sophron | The Temperate One |
| 90 | Ataraxos | The Unshakeable |
| 180 | Sophos | The Sage |
| 365 | Epistemon | The Knower |

## Privacy

- All data stored locally in `~/.rationalizer/`
- With Ollama: nothing leaves your machine
- With Anthropic: only journal content is sent to the API (encrypted at rest, sent over HTTPS)
- No telemetry, no analytics, no tracking

## Development

```bash
npm run dev        # Run with tsx
npm run build      # Compile TypeScript
npm test           # Run tests
npm run test:watch # Watch mode
```

## License

MIT
