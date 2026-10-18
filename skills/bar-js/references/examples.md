# BaR examples (copy-paste patterns)

## Express CRUD

```typescript
app.get('/api/items/:id', async (req, res) => {
  await res.builder.wrap(itemService.get(req.params.id));
  return res.builder.build();
});

app.post('/api/items', (req, res) => {
  const item = itemService.create(req.body);
  return res.builder.as.created(item, 'Item created').build();
});

app.delete('/api/items/:id', (req, res) => {
  itemService.delete(req.params.id);
  return res.builder.as.ok({ message: 'Deleted.' }).build();
});
```

## Validation (Zod)

```typescript
if (!parsed.success) {
  return res.builder.as.validationError(parsed.error).build();
}
```

## Pagination offset

```typescript
return res.builder
  .paginate(rows, { strategy: 'offset', total: 100, page: 1, limit: 20 })
  .message('Items loaded')
  .build();
```

## Fastify

```typescript
app.get('/api/x', async (_request, reply) => {
  reply.builder.as.ok({ ok: true }).build();
  return reply;
});
```

## Hooks + production wrap

```typescript
const bar = new BarExpressAdapter({
  environment: 'production',
  includeStack: false,
  hooks: auditHooks,
});
```

## Custom metadata

```typescript
return res.builder
  .as.ok(data)
  .setMeta({ api_version: 'v1', feature_flags: ['beta'] })
  .build();
```

## Cookies (session)

```typescript
return res.builder
  .as.ok({ user: publicUser })
  .setCookies('session', token, { httpOnly: true, secure: true, sameSite: 'lax' })
  .build();
```

## Test without HTTP

```typescript
const result = new BaR()
  .as.ok({ id: '1' })
  .build();
expect(result.body.success).toBe(true);
expect(result.statusCode).toBe(200);
```

## With HuK in same handler

See [integration-huk-js.md](./integration-huk-js.md).
