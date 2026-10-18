# Vorlaxen Skills Hub

**The official, default skill hub for [Vorlaxen Agent Skills](https://github.com/vorlaxen-labs/Agent-Skills)** — a curated catalog of agent skill packs for AI coding assistants (Cursor, Claude Code, and any client that supports the Agent Skills format).

| | |
|---|---|
| **Hub ID** | `vorlaxen-skills-hub` |
| **Catalog file** | [`agent-skills.hub.json`](./agent-skills.hub.json) |
| **CLI** | [`@vorlaxen-labs/agent-skills`](https://github.com/vorlaxen-labs/Agent-Skills) |
| **Default GitHub source** | [`vorlaxen-labs/vorlaxen-skills-hub`](https://github.com/vorlaxen-labs/vorlaxen-skills-hub) |

When you run `npx @vorlaxen-labs/agent-skills hub add vorlaxen-skills-hub`, the CLI resolves **this repository**. It is the central distribution point for Vorlaxen-maintained skills — not a fork, mirror, or third-party collection.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Spec](https://img.shields.io/badge/Spec-SKILL--SPEC-blue)](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md)

## Why this hub exists

Agent skills teach coding agents **how to use libraries correctly** (APIs, envelopes, validation, integrations) without guessing. This hub bundles production-ready skills for the Vorlaxen JavaScript stack and follows the [Agent Skills hub schema](https://github.com/vorlaxen-labs/Agent-Skills).

Use this repo when you want:

- One command to subscribe to the **canonical** Vorlaxen skill catalog
- Versioned skill packs under `skills/` with deep `references/` docs
- A hub `id` that stays stable across machines and CI

## Skill catalog

| Alias | Package / topic | Install alias |
|-------|-----------------|---------------|
| [`bar-js`](./skills/bar-js/) | [@vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) — JSON API envelopes, ResponseBuilder, Express/Fastify adapters | `-s bar-js` |
| [`huk-js`](./skills/huk-js/) | [@vorlaxen-labs/huk-js](https://github.com/vorlaxen-labs/huk-js) — tree-shakable utilities, Turkish slugify, SSR-safe helpers | `-s huk-js` |

Summaries live in [`agent-skills.hub.json`](./agent-skills.hub.json); each skill’s entry point is `skills/<alias>/SKILL.md`.

## Quick start

Subscribe to the hub and install skills (GitHub default):

```bash
npx @vorlaxen-labs/agent-skills hub add vorlaxen-skills-hub
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -s huk-js -y
```

Install only what you need:

```bash
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -y
```

Local development (this checkout):

```bash
npx @vorlaxen-labs/agent-skills hub add /path/to/vorlaxen-skills-hub
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -s huk-js -y
```

## Repository layout

```
agent-skills.hub.json    # Hub manifest (required); id must remain vorlaxen-skills-hub
skills/
  bar-js/
    SKILL.md
    references/          # api-reference, adapters, chaining, validation, huk integration
  huk-js/
    SKILL.md
    references/          # api-complete, scenarios, production, bar integration
scripts/
  validate-hub.mjs       # npm run check
```

Authoring rules: [Agent-Skills SKILL-SPEC](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md).

## Validate locally

```bash
npm run check
```

## Related projects

- **[Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills)** — CLI, hub protocol, and skill installation
- **[bar-js](https://github.com/vorlaxen-labs/bar-js)** — BaR (Build a Response) for consistent JSON APIs
- **[huk-js](https://github.com/vorlaxen-labs/huk-js)** — HuK utility toolkit

## Contributing

This repository **is the hub**; the loader lives in Agent-Skills. To add or update a skill, follow [CONTRIBUTING.md](./CONTRIBUTING.md): add `skills/<alias>/`, register in `agent-skills.hub.json`, run `npm run check`, open a PR.

## License

MIT — see [LICENSE](./LICENSE).
