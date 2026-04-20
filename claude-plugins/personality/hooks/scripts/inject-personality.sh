#!/bin/bash
# UserPromptSubmit hook: initialize personality files on first run, inject PERSONALITY.md as context

set -euo pipefail

PERSONALITY_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude"
PERSONALITY_FILE="$PERSONALITY_DIR/PERSONALITY.md"
TALLY_FILE="$PERSONALITY_DIR/personality_tally.md"
ARCHIVE_FILE="$PERSONALITY_DIR/personality_archive.md"
DRAFT_FILE="$PERSONALITY_DIR/style-draft.md"
CONFIG_FILE="$PERSONALITY_DIR/personality.local.md"

# Initialize files if PERSONALITY.md doesn't exist yet
if [ ! -f "$PERSONALITY_FILE" ]; then
  mkdir -p "$PERSONALITY_DIR"

  cat > "$PERSONALITY_FILE" << 'EOF'
# Developer Personality

<!-- Rules will appear here as patterns are detected from your commits -->
EOF

  cat > "$TALLY_FILE" << 'EOF'
# Style Tally

| Rule | Count |
|------|-------|
EOF

  cat > "$ARCHIVE_FILE" << 'EOF'
# Personality Archive

<!-- Superseded rules are recorded here -->
EOF

  touch "$DRAFT_FILE"

  cat > "$CONFIG_FILE" << 'EOF'
---
threshold: 5
---

# Personality Plugin Config

Edit `threshold` above to change how many deviations are needed before a rule is promoted to PERSONALITY.md.
EOF

  # Exit cleanly — no rules to inject yet
  exit 0
fi

# Check if PERSONALITY.md has actual rules (not just the placeholder)
CONTENT=$(grep -v '^#\|^<!--\|^-->\|^$' "$PERSONALITY_FILE" 2>/dev/null || true)

if [ -z "$CONTENT" ]; then
  # No rules yet — nothing to inject
  exit 0
fi

# Inject PERSONALITY.md as system context
PERSONALITY_CONTENT=$(cat "$PERSONALITY_FILE")

cat << EOF
{"systemMessage": "The following are this developer's coding style preferences learned from past commits. Apply them to all code suggestions:\n\n$PERSONALITY_CONTENT"}
EOF
