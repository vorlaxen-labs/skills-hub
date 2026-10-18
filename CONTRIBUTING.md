# Contributing to vorlaxen-skills-hub

This repo is a **hub**, not the loader CLI. The CLI lives in [Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills).

## Add a skill

1. Create `skills/<alias>/SKILL.md` following [SKILL-SPEC.md](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md).
2. Set frontmatter `name` to match the hub alias (or set `"skill"` in the catalog entry when they differ).
3. Add an entry to `agent-skills.hub.json`:

   ```json
   "<alias>": {
     "source": "./skills/<alias>",
     "description": "Third-person summary with trigger terms."
   }
   ```

4. Run `npm run check` and test install in a scratch project:

   ```bash
   npx @vorlaxen-labs/agent-skills hub add .
   npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s <alias> -y
   ```

## Catalog rules

- `id` in `agent-skills.hub.json` must stay **`vorlaxen-skills-hub`** so `hub add vorlaxen-skills-hub` matches subscriptions.
- `source` paths are relative to this repository root when the hub is installed from a local path, or resolved from the hub repo root on GitHub.
