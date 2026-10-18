# @vorlaxen-labs/bar-js — exports checklist

## Subpaths

| Subpath | Role |
|---------|------|
| `@vorlaxen-labs/bar-js` | Core builder, hooks, factories, constants, `normalizeValidationErrors`, types |
| `@vorlaxen-labs/bar-js/adapters/express` | `BarExpressAdapter`, `ExpressDispatcher`, side-effect TS augmentation |
| `@vorlaxen-labs/bar-js/adapters/fastify` | `registerBarFastify`, `BarFastifyPlugin`, `FastifyDispatcher`, augmentation |

## sideEffects (package.json)

Adapter entry points are side-effectful for bundlers — import adapter subpath once for types.

## Peers (install in app)

| Adapter | Packages |
|---------|----------|
| Express | `express` ^4.21 \|\| ^5 |
| Fastify | `fastify` ^4.28 \|\| ^5, `@fastify/cookie` ^9 \|\| ^10 \|\| ^11 |

BaR published package: **zero runtime dependencies**.

## Engines

Node **>= 18**.

## Common import patterns

```typescript
// Core
import { BaR, BaRHooks, normalizeValidationErrors, StatusCodes } from '@vorlaxen-labs/bar-js';

// Express
import '@vorlaxen-labs/bar-js/adapters/express';
import { BarExpressAdapter } from '@vorlaxen-labs/bar-js/adapters/express';

// Fastify
import '@vorlaxen-labs/bar-js/adapters/fastify';
import { registerBarFastify } from '@vorlaxen-labs/bar-js/adapters/fastify';
```

## Upstream

- npm: https://www.npmjs.com/package/@vorlaxen-labs/bar-js
- Repository: https://github.com/vorlaxen-labs/bar-js
- Docs in repo: `docs/getting-started.md`, `docs/adapters.md`, `docs/api-reference.md`, `docs/advanced-chaining.md`
