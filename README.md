# Vorlaxen Agent Skills Hub (`vorlaxen-skills-hub`)

**Official default skill catalog for [Vorlaxen Agent Skills CLI](https://github.com/vorlaxen-labs/Agent-Skills)** — curated `SKILL.md` packs for **Cursor**, **Claude Code**, **GitHub Copilot**, and other **AI coding agents**. Subscribe once with `hub add vorlaxen-skills-hub`, then install **`bar-js`** (BaR API responses) and **`huk-js`** (TypeScript utilities) into `.cursor/skills/` or your agent’s skills directory.

This repo is the **remote Agent Skills hub** (`vorlaxen-skills-hub`): a versioned catalog of installable agent knowledge for TypeScript backends and shared utilities. Use [`npx @vorlaxen-labs/agent-skills`](https://www.npmjs.com/package/@vorlaxen-labs/agent-skills) to subscribe, cache the manifest [`agent-skills.hub.json`](./agent-skills.hub.json), and copy skill trees into your project — the same workflow for **Cursor Agent Skills**, **Claude Code skills**, and **Copilot-compatible** layouts documented in the CLI.

| | |
|---|---|
| **Hub id** | `vorlaxen-skills-hub` |
| **Manifest** | [`agent-skills.hub.json`](./agent-skills.hub.json) (schema v1) |
| **CLI** | [`@vorlaxen-labs/agent-skills`](https://www.npmjs.com/package/@vorlaxen-labs/agent-skills) |
| **GitHub** | [`vorlaxen-labs/skills-hub`](https://github.com/vorlaxen-labs/skills-hub) |
| **Latest release** | [`v1.0.1`](https://github.com/vorlaxen-labs/skills-hub/releases/latest) |

[![Release](https://img.shields.io/github/v/release/vorlaxen-labs/skills-hub?display_name=tag&label=release)](https://github.com/vorlaxen-labs/skills-hub/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Vorlaxen-0ea5e9)](https://github.com/vorlaxen-labs/Agent-Skills)

## Table of contents

- [Quick start (Cursor & agents)](#quick-start-cursor--agents)
- [What’s in this hub](#whats-in-this-hub)
- [How the CLI uses this repo](#how-the-cli-uses-this-repo)
- [Catalog](#catalog)
- [Repository layout](#repository-layout)
- [Local development](#local-development)
- [Validation](#validation)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Ecosystem & links](#ecosystem--links)
- [Contributing & license](#contributing--license)

## Quick start (Cursor & agents)

```bash
# 1) Subscribe to the official Vorlaxen hub (cached catalog)
npx @vorlaxen-labs/agent-skills hub add vorlaxen-skills-hub

# 2) Install skill packs into your project
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -s huk-js -y
```

Equivalent explicit GitHub source (same catalog):

```bash
npx @vorlaxen-labs/agent-skills hub add vorlaxen-labs/skills-hub
```

After install, agents read skill instructions from paths such as `.cursor/skills/bar-js/SKILL.md`. See the [Agent Skills quick start](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/docs/quick-start.md) for `init`, `doctor`, and platform flags.

## What’s in this hub

This repository is the **remote hub catalog** referenced by the Agent Skills loader — not the CLI itself. It ships:

- **`agent-skills.hub.json`** — stable hub id `vorlaxen-skills-hub` and skill alias → directory mapping
- **`skills/*/SKILL.md`** — agent-facing knowledge (API envelopes, adapters, utilities, integration patterns)
- **`skills/*/references/`** — deep-dive markdown the agent loads on demand

Use it when you want **repeatable, versioned agent knowledge** for [@vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) and [@vorlaxen-labs/huk-js](https://github.com/vorlaxen-labs/huk-js) without copying docs into every repo.

## How the CLI uses this repo

`hub add <id>` resolves shorthand ids to `vorlaxen-labs/<id>` (see Agent-Skills `defaultHubRepoSource`). The subscription key is the manifest **`id`**, not the GitHub repository name:

| Command | Meaning |
|---------|---------|
| `hub add vorlaxen-skills-hub` | Subscribe using catalog id (recommended) |
| `hub add vorlaxen-labs/skills-hub` | Same catalog via full GitHub coordinates |
| `add hub:vorlaxen-skills-hub -s <alias>` | Install one or more skills from the cached hub |

Each catalog entry points at a directory with a root [`SKILL.md`](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md). Reference files live beside the skill under `references/`.

## Catalog

| Skill alias | NPM / upstream | Agent entry | Topics covered |
|-------------|----------------|-------------|----------------|
| **`bar-js`** | [@vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) | [`skills/bar-js/SKILL.md`](./skills/bar-js/SKILL.md) | BaR JSON envelope, `ResponseBuilder`, Express/Fastify adapters, pagination, validation errors, HuK integration |
| **`huk-js`** | [@vorlaxen-labs/huk-js](https://github.com/vorlaxen-labs/huk-js) | [`skills/huk-js/SKILL.md`](./skills/huk-js/SKILL.md) | Tree-shakable utilities, Turkish slugify, SSR/storage, crypto, `fn`/`is` helpers, BaR boundary patterns |

## Repository layout

```
agent-skills.hub.json    # hub catalog (id: vorlaxen-skills-hub)
skills/<alias>/SKILL.md
skills/<alias>/references/*.md
scripts/validate-hub.mjs
```

## Local development

Point the CLI at a checkout instead of GitHub:

```bash
npx @vorlaxen-labs/agent-skills hub add /path/to/skills-hub
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -y
```

## Validation

```bash
npm run check
```

Loads the manifest, asserts `version === 1` and `id === vorlaxen-skills-hub`, and verifies each `source` contains `SKILL.md`.

## FAQ

### What is `vorlaxen-skills-hub`?

It is the **default Vorlaxen remote hub id** declared in [`agent-skills.hub.json`](./agent-skills.hub.json). The Agent Skills CLI caches this catalog so you can install skills with `add hub:vorlaxen-skills-hub -s <alias>`.

### How do I add Agent Skills to Cursor?

Run `npx @vorlaxen-labs/agent-skills init --platform cursor` (see [CLI docs](https://github.com/vorlaxen-labs/Agent-Skills)), then subscribe to this hub and `add` the skill aliases you need. Skills land under `.cursor/skills/<name>/`.

### Does this work with Claude Code or Copilot?

Yes. The CLI supports multiple agent platforms; this hub only supplies **skill content**. Platform wiring is handled by `@vorlaxen-labs/agent-skills` during `init` / `add`.

### What is the difference between Agent-Skills and skills-hub?

| Repository | Role |
|------------|------|
| [Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills) | CLI, loader, schemas, bundled global skills |
| **skills-hub** (this repo) | Official **remote catalog** of Vorlaxen library skills (`bar-js`, `huk-js`) |

### Which skill should I install?

- Building or migrating **HTTP APIs** with a consistent JSON envelope → **`bar-js`**
- **Shared TypeScript utilities**, Turkish slugs, sanitization, client storage → **`huk-js`**
- Full-stack Vorlaxen stack → **both** (skills include cross-integration references)

## Troubleshooting

`hub show` or `hub list --skills` lists only `bar-js` while this repo’s manifest has two entries: the CLI is using a **stale hub catalog cache**, not the current `agent-skills.hub.json`.

```bash
npx @vorlaxen-labs/agent-skills hub update vorlaxen-skills-hub
npx @vorlaxen-labs/agent-skills hub list --skills
```

Install into a project:

```bash
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s huk-js -y
```

## Ecosystem & links

| Resource | URL |
|----------|-----|
| Agent Skills CLI & loader | [vorlaxen-labs/Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills) |
| CLI on npm | [@vorlaxen-labs/agent-skills](https://www.npmjs.com/package/@vorlaxen-labs/agent-skills) |
| Quick start (init, doctor, platforms) | [docs/quick-start.md](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/docs/quick-start.md) |
| SKILL.md specification | [SKILL-SPEC.md](https://github.com/vorlaxen-labs/Agent-Skills/blob/main/SKILL-SPEC.md) |
| BaR (JSON API envelope) | [vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) · npm [@vorlaxen-labs/bar-js](https://www.npmjs.com/package/@vorlaxen-labs/bar-js) |
| HuK (TypeScript utilities) | [vorlaxen-labs/huk-js](https://github.com/vorlaxen-labs/huk-js) · npm [@vorlaxen-labs/huk-js](https://www.npmjs.com/package/@vorlaxen-labs/huk-js) |
| This hub (catalog + skill packs) | [vorlaxen-labs/skills-hub](https://github.com/vorlaxen-labs/skills-hub) · latest [release](https://github.com/vorlaxen-labs/skills-hub/releases/latest) |

**Common searches:** install Cursor skills from GitHub hub · `SKILL.md` skill pack · Vorlaxen default hub id · Express/Fastify BaR agent skill · TypeScript utility skill for LLM coding agents.

## Contributing & license

See [CONTRIBUTING.md](./CONTRIBUTING.md). Loader and hub protocol changes belong in [Agent-Skills](https://github.com/vorlaxen-labs/Agent-Skills), not here.

MIT — [LICENSE](./LICENSE).
