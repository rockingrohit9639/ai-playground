# personality

A Claude Code plugin that learns your coding style over time — silently, transparently, and entirely under your control.

## The Problem

Claude gives generic, convention-following code suggestions. You end up correcting the same things repeatedly: renaming variables, restructuring loops, removing comments. Claude never learns because it never sees the corrections.

## How It Works

Every time you commit, the plugin compares what Claude wrote against what you actually committed. That delta — the difference between Claude's suggestion and your final code — is the signal. Over time, patterns emerge. Once a pattern crosses a threshold (default: 5 occurrences), it graduates into a `PERSONALITY.md` file that gets prepended to every future Claude prompt. Claude now knows your style before it writes a single line.

```
Claude writes code
       ↓
You edit it your way
       ↓
You git commit
       ↓
style-analyzer compares Claude's draft vs committed diff
       ↓
Deviations accumulate in personality_tally.md
       ↓
At threshold → rule promoted to PERSONALITY.md
       ↓
PERSONALITY.md injected into every future prompt
       ↓
Claude writes code (now knowing your style)
```

## Components

| Component | Purpose |
|-----------|---------|
| `hooks/hooks.json` | 3 hooks: capture edits, trigger analysis on commit, inject personality |
| `agents/style-analyzer.md` | LLM agent that diffs Claude's output against commits and manages the personality files |

## Files (per project, all gitignored)

| File | Purpose |
|------|---------|
| `.claude/PERSONALITY.md` | Active style rules — injected into every prompt |
| `.claude/personality_tally.md` | Deviation counts — rules accumulate here before graduating |
| `.claude/personality_archive.md` | Superseded rules — full history, never deleted |
| `.claude/style-draft.md` | Ephemeral — Claude's suggestions captured during a session, cleared after each commit |
| `.claude/personality.local.md` | Your config (threshold, future settings) |

All files are gitignored so each developer maintains their own personality independently.

## Installation

```bash
/plugin install personality
/reload-plugins
```

Or from this repo:

```bash
cc --plugin-dir /path/to/claude-plugins/personality
```

## First Run

On your first prompt after installation, the plugin automatically initializes all five files with placeholders. No manual setup needed.

## Configuration

Edit `.claude/personality.local.md` in your project:

```yaml
---
threshold: 5
---
```

Change `threshold` to control how many observed deviations are needed before a pattern is promoted to an active rule. Lower = faster learning, higher = more confident rules.

## Transparency & Control

Every file is plain markdown — human-readable, directly editable. You can:

- **Read** `personality_tally.md` to see what patterns are accumulating
- **Edit** `PERSONALITY.md` to add, remove, or rephrase rules manually
- **Review** `personality_archive.md` to see what rules were superseded and why
- **Clear** `style-draft.md` to discard the current session's draft before committing

The plugin never modifies your code and never blocks anything. It only observes and suggests.
