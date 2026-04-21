#!/bin/bash
# SessionStart hook: installs .git/hooks/post-commit in the current project

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
GIT_HOOKS_DIR="$PROJECT_DIR/.git/hooks"
POST_COMMIT_HOOK="$GIT_HOOKS_DIR/post-commit"

# Not a git repo — skip silently
if [ ! -d "$GIT_HOOKS_DIR" ]; then
  exit 0
fi

# Already installed and up to date — skip
if [ -f "$POST_COMMIT_HOOK" ] && grep -q "personality-plugin" "$POST_COMMIT_HOOK" 2>/dev/null; then
  exit 0
fi

# If a post-commit hook already exists but isn't ours, append to it
if [ -f "$POST_COMMIT_HOOK" ] && ! grep -q "personality-plugin" "$POST_COMMIT_HOOK"; then
  cat >> "$POST_COMMIT_HOOK" << 'HOOK'

# personality-plugin: flag next Claude session for style analysis
CLAUDE_DIR="$(git rev-parse --show-toplevel)/.claude"
mkdir -p "$CLAUDE_DIR"
touch "$CLAUDE_DIR/pending-analysis.flag"
HOOK
  exit 0
fi

# No existing hook — create one
cat > "$POST_COMMIT_HOOK" << 'HOOK'
#!/bin/bash
# personality-plugin: flag next Claude session for style analysis
CLAUDE_DIR="$(git rev-parse --show-toplevel)/.claude"
mkdir -p "$CLAUDE_DIR"
touch "$CLAUDE_DIR/pending-analysis.flag"
HOOK

chmod +x "$POST_COMMIT_HOOK"
exit 0
