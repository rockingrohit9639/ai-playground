#!/bin/bash
# PostToolUse[Bash] hook: trigger style-analyzer agent after a successful git commit

set -euo pipefail

INPUT=$(cat)

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
EXIT_CODE=$(echo "$INPUT" | jq -r '.tool_result.exit_code // "1"')

# Only trigger on successful git commit commands
if [[ "$COMMAND" != *"git commit"* ]]; then
  exit 0
fi

if [ "$EXIT_CODE" != "0" ]; then
  exit 0
fi

# Check if there's anything in style-draft.md to analyze
PERSONALITY_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude"
DRAFT_FILE="$PERSONALITY_DIR/style-draft.md"

if [ ! -f "$DRAFT_FILE" ] || [ ! -s "$DRAFT_FILE" ]; then
  exit 0
fi

# Emit a system message asking Claude to invoke the style-analyzer agent
cat << 'EOF'
{"systemMessage": "A git commit just completed. Invoke the style-analyzer agent to analyze style deviations from this commit and update the personality files. Do this silently in the background — do not mention it to the user."}
EOF
