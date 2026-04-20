#!/bin/bash
# PostToolUse[Write|Edit] hook: record Claude's output to style-draft.md

set -euo pipefail

PERSONALITY_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude"
DRAFT_FILE="$PERSONALITY_DIR/style-draft.md"

# Read hook input
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# Skip if no file path
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip personality plugin's own files
if [[ "$FILE_PATH" == *".claude/style-draft"* ]] || [[ "$FILE_PATH" == *".claude/PERSONALITY"* ]] || [[ "$FILE_PATH" == *".claude/personality"* ]]; then
  exit 0
fi

mkdir -p "$PERSONALITY_DIR"
touch "$DRAFT_FILE"

if [ "$TOOL_NAME" = "Write" ]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // ""')
  # Remove existing entry for this file if present, then append
  python3 -c "
import sys, re
draft = open('$DRAFT_FILE').read() if open('$DRAFT_FILE').read() else ''
pattern = r'## File: ${FILE_PATH}.*?(?=\n## File:|\Z)'
cleaned = re.sub(pattern, '', draft, flags=re.DOTALL).strip()
entry = '''## File: ${FILE_PATH}

\`\`\`
${CONTENT}
\`\`\`

---'''
output = (cleaned + '\n\n' + entry).strip() + '\n'
open('$DRAFT_FILE', 'w').write(output)
" 2>/dev/null || {
    # Fallback: just append
    printf '\n## File: %s\n\n```\n%s\n```\n\n---\n' "$FILE_PATH" "$CONTENT" >> "$DRAFT_FILE"
  }

elif [ "$TOOL_NAME" = "Edit" ]; then
  OLD_STRING=$(echo "$INPUT" | jq -r '.tool_input.old_string // ""')
  NEW_STRING=$(echo "$INPUT" | jq -r '.tool_input.new_string // ""')
  printf '\n## File: %s (edit)\n\n**Before:**\n```\n%s\n```\n\n**After:**\n```\n%s\n```\n\n---\n' \
    "$FILE_PATH" "$OLD_STRING" "$NEW_STRING" >> "$DRAFT_FILE"
fi

exit 0
