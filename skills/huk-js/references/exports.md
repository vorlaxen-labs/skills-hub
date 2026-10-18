# @vorlaxen-labs/huk-js — exports

## Root

`@vorlaxen-labs/huk-js` — `HuK` facade, module namespace exports.

## Subpaths (package.json exports)

| Subpath | Module object |
|---------|---------------|
| `./string` | `string` + named fns |
| `./number` | `number` + named fns |
| `./date` | `date` + named fns |
| `./array` | `array` + named fns |
| `./object` | `object` + named fns |
| `./storage` | `storage` |
| `./crypto` | `crypto` |
| `./fn` | `fn` |
| `./is` | `is` |

`typesVersions` mirrors subpaths for TypeScript resolution.

## Install

```bash
npm install @vorlaxen-labs/huk-js
```

With BaR in same app:

```bash
npm install @vorlaxen-labs/huk-js @vorlaxen-labs/bar-js
```

## v1 → v2

- Public **`HuK`** facade name
- No Express peer on HuK (never required at runtime)
- MIT / Vorlaxen Labs

## Engines

Node **>= 18** (dev and server hash fallback).

## sideEffects

`false` — prefer subpath imports in production bundles.

## Upstream

- npm: https://www.npmjs.com/package/@vorlaxen-labs/huk-js
- Repository: https://github.com/vorlaxen-labs/huk-js
- Docs: `docs/getting-started.md`, `docs/api-reference.md`, `docs/production.md`
- Tests: `tests/unit/modules/`, `tests/scenarios/`

Complete API listing for agents: [api-complete.md](./api-complete.md).
