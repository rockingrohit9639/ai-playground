---
name: commit
description: Commits current git changes with a structured, user-configurable commit message format. Use this skill whenever the user wants to commit changes, stage and commit, or write a git commit message — even if they just say "commit my changes", "make a commit", or "commit this". Also use it when the user asks to configure their commit format or preferences.
allowed-tools: Bash(git add .), Bash(git commit *), Bash(git status *), Bash(git diff *), Bash(git push *)
---

# Commit Skill

Commit the current git changes using the user's configured format. If no config exists, use Conventional Commits as the default and offer to save preferences.

## Step 1: Load config

Look for a config file at `.claude/commit-config.json` in the repo root. If it doesn't exist, use these defaults:

```json
{
  "format": "conventional",
  "auto_stage": true,
  "auto_push": false
}
```

**Config fields:**

- `format`: `"conventional"` | `"simple"` | `"custom"` — commit message style (see formats below)
- `auto_stage`: `true` | `false` — whether to run `git add .` before committing
- `auto_push`: `true` | `false` — whether to run `git push` automatically after a successful commit (default: `false`)
- `custom_template`: (only when `format: "custom"`) — a string template, e.g. `"[{type}] {subject}"` or `"{emoji} {subject}"`. Include `{scope}` in the template only if you want scope in your messages.

## Step 2: Check git status

Run `git status --short` and `git diff --stat HEAD` to understand what changed. If `auto_stage` is true and there are unstaged changes, run `git add .` first.

If there is nothing to commit, tell the user and stop.

## Step 3: Analyze the diff

Run `git diff --cached` (staged diff) to understand what actually changed. Focus on:

- What files changed and in what way
- Whether it's a new feature, fix, refactor, docs, style, test, or chore
- Whether any breaking changes were introduced (API changes, removed exports, changed behavior)
- A good short summary (imperative, present tense, max 50 chars for the subject)

## Step 4: Compose the commit message

Use the configured format:

### `conventional` (default)

```
<type>(<scope>): <subject>

<body>
```

- **type**: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore`
- **scope**: inferred from the diff (e.g. the module, directory, or feature area affected) — omit if the change is too broad to scope
- **subject**: imperative, lowercase, no period, max 50 chars
- **body**: optional, explains the _why_, wrap at 72 chars

### `simple`

```
<subject>
```

Just a single clear line. No type prefix, no footer.

### `custom`

Use the `custom_template` string from config. Replace `{type}`, `{scope}`, `{subject}`, `{body}`, `{emoji}` with appropriate values. Infer a fitting emoji if `{emoji}` is in the template.

## Step 5: Show and confirm

Present the proposed commit message to the user clearly, then ask: **"Commit with this message? (yes / edit / cancel)"**

- **yes** → run `git commit -m "..."`, then if `auto_push` is `true`, run `git push`
- **edit** → let the user type their preferred message, then commit (and push if `auto_push` is `true`)
- **cancel** → stop, don't commit

## Step 6: Handle arguments

If the user invoked the skill with arguments (e.g. `/commit fix the login bug`), use the argument as a strong hint for the subject line or to fill in missing context. Don't ignore it.

Special argument: if the user says `/commit --config`, walk them through setting up or updating `.claude/commit-config.json` interactively, then save it.

## Examples

**conventional:**

```
feat(auth): add JWT refresh token support

Tokens now auto-refresh before expiry to prevent session drops.
```

**simple:**

```
add JWT refresh token support
```

**custom template `"{emoji} {type}: {subject}"`:**

```
✨ feat: add JWT refresh token support
```
