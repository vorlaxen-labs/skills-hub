# BaR adapters and dispatchers

**BaR builds; the dispatcher delivers.**

1. `ResponseBuilder` assembles body, status, headers, cookies.
2. `IBaRDispatcher.dispatch(result)` writes to HTTP.
3. Adapters attach per-request `ctx` + `builder`.

## BarAdapterOptions (Express & Fastify)

| Option | Default | Description |
|--------|---------|-------------|
| `withDefaultHeaders` | effective `true` | Security/cache headers on raw response before route |
| `defaultHeaders` | `DEFAULT_SECURITY_HEADERS` | Override map |
| `logger` | — | Optional `Logger` |
| `hooks` | — | Shared `BaRHooks` |
| `environment` | — | `'production'` masks `wrap()` client messages |
| `includeStack` | — | Dev stack in `wrap()` message when not production |
| `requestIdHeaders` | `x-request-id`, `x-correlation-id`, `traceparent` | Incoming correlation |

## Express

```typescript
import '@vorlaxen-labs/bar-js/adapters/express';
import { BarExpressAdapter } from '@vorlaxen-labs/bar-js/adapters/express';

app.use(new BarExpressAdapter(options).handler());
```

| Injected | Location |
|----------|----------|
| `ctx` | `req.bar.ctx` — `request_id`, `start_time` |
| `builder` | `res.builder` — bound to `ExpressDispatcher` |

### `.build()` on Express

1. Hooks before/after build
2. `ExpressDispatcher`: headers, `res.cookie()` per queued cookie, `res.status().json(body)` or `res.end()` for no-body statuses
3. Dispatch hooks
4. If headers already sent → skip dispatch, warn

## Fastify

Peers: `fastify`, `@fastify/cookie`. Register **cookie before BaR**.

```typescript
import '@vorlaxen-labs/bar-js/adapters/fastify';
import { registerBarFastify } from '@vorlaxen-labs/bar-js/adapters/fastify';

await app.register(cookie);
await registerBarFastify(app, options);
// or app.register(BarFastifyPlugin, options)
```

| Injected | Location |
|----------|----------|
| `ctx` | `request.bar.ctx` |
| `builder` | `reply.builder` |

`FastifyDispatcher`: `reply.setCookie` when cookie plugin present; else cookies skipped with warning.

**Async routes:** `.build()` is sync and may call `reply.send()` internally; returning `reply` prevents double payload.

## Request ID resolution

From first usable header in `requestIdHeaders`:

- **x-request-id / x-correlation-id:** trimmed; valid UUID kept; other non-empty strings accepted
- **traceparent:** W3C trace id parsed to UUID-like form when valid
- Else: new UUID generated (`resolveRequestId` / `CryptoUtil` inside package)

Use `req.bar.ctx.request_id` in handlers and logs — do not regenerate in the same pipeline.

## TypeScript augmentations

Side-effect import required:

- Express: `req.bar`, `res.builder`
- Fastify: `request.bar`, `reply.builder`

## Vanilla Node / custom framework

```typescript
import { BaR, IBaRDispatcher, BaRFinalResult } from '@vorlaxen-labs/bar-js';

class MyDispatcher implements IBaRDispatcher {
  dispatch(result: BaRFinalResult): BaRFinalResult {
    // writeHead, end(JSON.stringify(result.body)), cookies...
    return result;
  }
}

const ctx = { request_id: '...', start_time: Date.now() };
const builder = new BaR(new MyDispatcher(res), { logger }, ctx);
builder.as.ok({}).build();
```

No dispatcher: `.build()` returns `BaRFinalResult` only — useful for tests and serverless assembly.

## When to custom adapter

Non-Express/Fastify (Hono, Koa), edge handlers, custom cookie semantics. Otherwise use built-in adapters for no-body statuses, hooks, and context factory.

## Integration matrix

| Approach | Context | Builder | Dispatch |
|----------|---------|---------|----------|
| `BarExpressAdapter` | `req.bar.ctx` | `res.builder` | `ExpressDispatcher` |
| `registerBarFastify` | `request.bar.ctx` | `reply.builder` | `FastifyDispatcher` |
| Custom middleware | You define | `new BaR(dispatcher, opts, ctx)` | Your dispatcher |
| No dispatcher | Optional | `new BaR()` | Result object only |
