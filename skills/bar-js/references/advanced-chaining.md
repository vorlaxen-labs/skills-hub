# BaR advanced chaining

## Fundamentals

Every chain method returns the same builder. Terminal step: `.build()` (sync).

```typescript
return res.builder.as.ok(data).setHeaders('X-Custom', 'v').build();
```

## Status overrides

```typescript
res.builder.as.ok({ task: 'queued' }).status(202).message('Queued').build();
```

`.status()` clears prior `forceSuccess()` override.

## forceSuccess

Default success: `200 <= status < 400`. Error presets force `false`.

```typescript
res.builder.status(200).forceSuccess(false).message('No action').data(null).build();
```

## Headers

- Adapter sets `defaultHeaders` **before** route runs
- Builder `setHeaders` / `header` applied at **dispatch** — can override adapter keys

```typescript
res.builder.as.ok(data).setHeaders({ 'X-Service': 'auth', 'X-Env': 'prod' }).build();
```

## Cookies

```typescript
res.builder.as.ok({ loggedIn: true })
  .setCookies('session', 'abc', { httpOnly: true, secure: true })
  .build();

res.builder.as.ok(data).setCookies({ theme: 'dark', lang: 'en' }).build();
```

Express: `res.cookie`. Fastify: needs `@fastify/cookie`.

## Metadata

```typescript
res.builder.as.ok(data).setMeta({ version: '1.0.0', cluster: 'eu' }).build();
res.builder.withMetadata({ status_code: 200 }).build();
```

At build time, `request_id` from ctx is always merged into metadata.

## Pagination

See [api-reference.md](./api-reference.md#pagination). Chain after data:

```typescript
res.builder.paginate(users, { strategy: 'offset', total: 100, page: 2, limit: 20 })
  .message('Users loaded')
  .build();
```

## wrap() — async

```typescript
app.get('/api/users/:id', async (req, res) => {
  await res.builder.wrap(userService.findById(req.params.id));
  return res.builder.build();
});
```

- Resolve → sets `data`
- Reject → 500, `success: false`, emits `error` hook

### Production masking

Adapter `environment: 'production'` → client sees `"Internal Server Error"` on rejection.

Non-production + `includeStack: true` → may expose `error.stack` as message.

## transform()

Runs when `data !== null`; chainable:

```typescript
res.builder.data(10).transform(n => n * 2).transform(n => `Value: ${n}`).build();
```

## when()

```typescript
res.builder.as.ok(user)
  .when(isAdmin, b => b.setHeaders('X-Admin', 'true'))
  .when(isPaginated, b => b.paginate(rows, { strategy: 'offset', total, page, limit }))
  .build();
```

## Hooks example

```typescript
import { BaRHooks } from '@vorlaxen-labs/bar-js';

const hooks = new BaRHooks();
hooks.on('after_dispatch', (result) => { /* metrics */ });

new BarExpressAdapter({ hooks, environment: 'production' });
```

## Common mistakes

| Mistake | Fix |
|---------|-----|
| `await res.builder.build()` | Only `await wrap()` |
| Double send on Fastify | Return `reply` after `.build()` |
| Chaining after `.build()` | `.build()` is terminal for dispatch |
| Expect top-level error `message` | Use `error.message` |
