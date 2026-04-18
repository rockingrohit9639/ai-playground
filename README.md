# AI Playground

A personal sandbox for experimenting with Claude plugins and AI agents.

## What's here

- **Claude plugins** — custom skills and tools for Claude Code, built and tested here before publishing
- **AI agent experiments** — prototypes exploring different agent patterns and workflows

## Claude Plugins

Plugins live under `claude-plugins/<name>/`. Each has a `.claude-plugin/plugin.json` manifest.

| Plugin                              | Description                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`commit`](./claude-plugins/commit) | Structured git commits with configurable message formats (Conventional Commits, simple, or custom templates) |

### Installing plugins from this marketplace

```
/plugin marketplace add
/plugin
/reload-plugins
```

## Structure

```
claude-plugins/
  <plugin-name>/
    .claude-plugin/
      plugin.json       # plugin metadata
    skills/
      <skill-name>/
        SKILL.md        # skill prompt
.claude-plugin/
  marketplace.json      # marketplace listing
```

## Author

Rohit Saini — [rohitsaini.codes@gmail.com](mailto:rohitsaini.codes@gmail.com)
