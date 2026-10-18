---
name: bar-js
description: >-
  Complete agent knowledge for @vorlaxen-labs/bar-js (BaR Build a Response): JSON
  envelope schema, ResponseBuilder chain, .as presets, paginate, wrap, hooks,
  normalizeValidationErrors, Express BarExpressAdapter, Fastify registerBarFastify,
  IBaRDispatcher, request_id, security headers, NO_BODY statuses. Use for any
  API handler, middleware, error mapping, pagination, or BaR migration. Pairs with
  huk-js skill when apps use both Vorlaxen packages.
---
# Core principle

**Constrain decisions, not implementations.**

BaR (**Build a Response**) is a zero runtime dependency TypeScript library: fluent `ResponseBuilder`, consistent JSON envelope, optional Express/Fastify adapters. **`BaR` is an alias for `ResponseBuilder`.**

---

# Agent protocol — read before coding

Match the task to references (read the file, do not guess APIs):

| Task | Read |
|------|------|
| Envelope, `.as`, builder methods, pagination, hooks | [references/api-reference.md](./references/api-reference.md) |
| Express/Fastify setup, ctx, dispatch, request ID | [references/adapters-and-dispatchers.md](./references/adapters-and-dispatchers.md) |
| Headers, cookies, wrap, transform, when, production masking | [references/advanced-chaining.md](./references/advanced-chaining.md) |
| Zod/Joi/class-validator → `error.details` | [references/validation-and-errors.md](./references/validation-and-errors.md) |
| Imports and published exports | [references/exports.md](./references/exports.md) |
| Same app as HuK | [references/integration-huk-js.md](./references/integration-huk-js.md) |
| Copy-paste handlers | [references/examples.md](./references/examples.md) |

Upstream repos: [github.com/vorlaxen-labs/bar-js](https://github.com/vorlaxen-labs/bar-js) — when behavior is ambiguous, inspect installed `node_modules/@vorlaxen-labs/bar-js` version.

---

# Hard rules

1. **Never invent envelope fields.** Success: `success`, `timestamp`, `message`, `data`, `metadata`. Failure: `success: false`, `data: null`, `error: { code, message, details? }`, `metadata`, `timestamp` — no top-level `message` on errors.
2. **Side-effect adapter imports** for TS: `import '@vorlaxen-labs/bar-js/adapters/express'` or `/adapters/fastify`.
3. **`.build()` is synchronous** — do not `await` it. **`wrap()` is async** — `await res.builder.wrap(promise)` then `.build()`.
4. **Fastify:** `.build()` calls `reply.send()` inside dispatcher; in `async` handlers often `return reply` after `.build()`.
5. **One dispatch per request** — no second JSON after `.build()`.
6. **Stop and ask** before changing global error contract, `DEFAULT_SECURITY_HEADERS`, or adapter order for the whole app.

---

# Quick reference — envelope

```json
{
  "success": true,
  "timestamp": "2026-05-04T13:52:00.000Z",
  "message": "Success",
  "data": {},
  "metadata": {
    "status_code": 200,
    "request_id": "uuid",
    "server_time": "2026-05-04T13:52:00.000Z"
  }
}
```

Error: `error.code` from preset or `errorCodeForStatus`; `validationError` uses code `VALIDATION_ERROR` and 422.

---

# Quick reference — `.as` presets

| Preset | HTTP |
|--------|------|
| `ok`, `created`, `accepted`, `noContent` | 2xx |
| `badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `unprocessable`, `validationError`, `tooManyRequests` | 4xx |
| `internalServerError`, `serviceUnavailable`, `gatewayTimeout` | 5xx |

All error presets: `forceSuccess(false)`, `data: null`.

---

# Quick reference — chain methods

`status`, `forceSuccess`, `message`, `data`, `setMeta`, `withMetadata`, `paginate`, `withError`, `setHeaders` / `header`, `setCookies`, `wrap`, `transform`, `when`, `as`, `build`.

`NO_BODY_STATUS_CODES`: 204, 205, 304 — dispatchers may omit JSON body.

---

# Decision: Response transport

Use `res.builder` / `reply.builder` from the adapter on BaR-enabled routes. Preserve `req.bar.ctx.request_id` in logs and metadata.

---

# Decision: Package imports

| Need | Import |
|------|--------|
| Core | `@vorlaxen-labs/bar-js` |
| Express | `@vorlaxen-labs/bar-js/adapters/express` |
| Fastify | `@vorlaxen-labs/bar-js/adapters/fastify` |

Peers in **app**: `express`; or `fastify` + `@fastify/cookie` (cookie plugin **before** BaR).

---

# Decision: Errors and validation

- Field errors → `.as.validationError(input)`; export `normalizeValidationErrors` for custom filters.
- Read sibling routes for message tone and status choice (400 vs 422).
- Global exception filters on BaR APIs should emit the same `error` object shape, not legacy `{ code, message, requestId }` mixes.

---

# Decision: With @vorlaxen-labs/huk-js

HuK computes; BaR sends. See [references/integration-huk-js.md](./references/integration-huk-js.md) and [../huk-js/SKILL.md](../huk-js/SKILL.md).

---

# Express minimal setup

```typescript
import express from 'express';
import '@vorlaxen-labs/bar-js/adapters/express';
import { BarExpressAdapter } from '@vorlaxen-labs/bar-js/adapters/express';

const app = express();
app.use(new BarExpressAdapter({ withDefaultHeaders: true }).handler());
app.get('/api/x', (_req, res) => res.builder.as.ok({ ok: true }).build());
```

Middleware order: **match the repo** (many apps register BaR before `express.json()`).

---

# References (full detail)

- [api-reference.md](./references/api-reference.md)
- [adapters-and-dispatchers.md](./references/adapters-and-dispatchers.md)
- [advanced-chaining.md](./references/advanced-chaining.md)
- [validation-and-errors.md](./references/validation-and-errors.md)
- [exports.md](./references/exports.md)
- [integration-huk-js.md](./references/integration-huk-js.md)
