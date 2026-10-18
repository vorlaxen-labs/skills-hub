# skills-hub

Git repository for the default Vorlaxen [Agent Skills](https://github.com/vorlaxen-labs/Agent-Skills) hub catalog: `agent-skills.hub.json` plus installable skill trees under `skills/`.

| Field | Value |
|-------|--------|
| Hub catalog `id` | `vorlaxen-skills-hub` |
| Manifest | [`agent-skills.hub.json`](./agent-skills.hub.json) (schema version `1`) |
| CLI | [`@vorlaxen-labs/agent-skills`](https://github.com/vorlaxen-labs/Agent-Skills) |
| Repository | [`vorlaxen-labs/skills-hub`](https://github.com/vorlaxen-labs/skills-hub) |
| Release | [`v1.0.1`](https://github.com/vorlaxen-labs/skills-hub/releases/tag/v1.0.1) |

[![Release](https://img.shields.io/github/v/release/vorlaxen-labs/skills-hub?display_name=tag)](https://github.com/vorlaxen-labs/skills-hub/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## How the CLI uses this repo

`hub add <id>` resolves shorthand ids to `vorlaxen-labs/<id>` (see Agent-Skills `defaultHubRepoSource`). For this catalog, the stable subscription key is the manifest **`id`**, not the GitHub repo name:

```bash
npx @vorlaxen-labs/agent-skills hub add vorlaxen-skills-hub
# equivalent explicit source:
npx @vorlaxen-labs/agent-skills hub add vorlaxen-labs/skills-hub
```

Skills install from the cached catalog:

```bash
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -s huk-js -y
```

Each entry in `agent-skills.hub.json` points at a directory with a root `SKILL.md` (see [SKILL-SPEC](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md)). Reference material lives beside the skill under `references/`.

## Catalog (current)

| Alias | Upstream package | Skill entry |
|-------|------------------|-------------|
| `bar-js` | [@vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) | [`skills/bar-js/SKILL.md`](./skills/bar-js/SKILL.md) |
| `huk-js` | [@vorlaxen-labs/huk-js](https://github.com/vorlaxen-labs/huk-js) | [`skills/huk-js/SKILL.md`](./skills/huk-js/SKILL.md) |

`bar-js` covers BaR envelopes, `ResponseBuilder`, Express/Fastify adapters, validation error mapping, and cross-package use with HuK. `huk-js` covers module subpaths, Turkish slugify, SSR/storage constraints, and BaR boundary patterns.

## Layout

```
agent-skills.hub.json
skills/<alias>/SKILL.md
skills/<alias>/references/*.md
scripts/validate-hub.mjs
```

## Local checkout

```bash
npx @vorlaxen-labs/agent-skills hub add /path/to/skills-hub
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -y
```

## Validation

`npm run check` loads the manifest, asserts `version === 1` and `id === vorlaxen-skills-hub`, and verifies each catalog `source` contains `SKILL.md`.

```bash
npm run check
```

## Troubleshooting

`hub show` or `hub list --skills` lists only `bar-js` while this repo’s manifest has two entries: the CLI is using a **stale hub catalog cache**, not the current `agent-skills.hub.json`.

Refresh the cache, then list again:

```bash
npx @vorlaxen-labs/agent-skills hub update vorlaxen-skills-hub
npx @vorlaxen-labs/agent-skills hub list --skills
```

Install into a project (Cursor reads `.cursor/skills/<name>/SKILL.md`):

```bash
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s huk-js -y
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Loader and hub protocol changes belong in [Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills), not here.

## License

MIT — [LICENSE](./LICENSE).
