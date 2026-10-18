# Changelog

All notable releases of the **skills-hub** repository (`hub` id `vorlaxen-skills-hub`) use [Semantic Versioning](https://semver.org/). The catalog schema version in `agent-skills.hub.json` remains `1` (hub format v1).

## [1.0.1] - 2026-03-22

- GitHub repository renamed to [`vorlaxen-labs/skills-hub`](https://github.com/vorlaxen-labs/skills-hub) (hub catalog id unchanged).

## [1.0.0] - 2026-03-22

Initial public release of the official Vorlaxen Agent Skills hub.

### Skills

- **bar-js** — BaR envelopes, ResponseBuilder, adapters, validation, huk-js integration
- **huk-js** — HuK modules, Turkish slugify, SSR/storage, bar-js integration

### Install

```bash
npx @vorlaxen-labs/agent-skills hub add vorlaxen-skills-hub
npx @vorlaxen-labs/agent-skills add hub:vorlaxen-skills-hub -s bar-js -s huk-js -y
```

Pin this catalog snapshot with git ref `v1.0.0` when cloning or referencing the hub repository.

[1.0.1]: https://github.com/vorlaxen-labs/skills-hub/releases/tag/v1.0.1
[1.0.0]: https://github.com/vorlaxen-labs/skills-hub/releases/tag/v1.0.0
