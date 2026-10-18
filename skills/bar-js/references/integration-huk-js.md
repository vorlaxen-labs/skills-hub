# BaR + HuK integration (BaR perspective)

Mirror: [../../huk-js/references/integration-bar-js.md](../../huk-js/references/integration-bar-js.md).

Packages have **no npm dependency**. Integration is application wiring only.

## Ownership

| BaR | HuK |
|-----|-----|
| Envelope, status, dispatch | slugify, mask, pick, clone, light validators |
| `.as.validationError`, `normalizeValidationErrors` | `{ field: message }` records, pre-schema checks |
| `metadata.request_id`, `.paginate` | Entity UUID, `secureRandom`, hash |
| `wrap()` for async services | `fn.retry` in clients/workers — not per-request Express |

## Handler order

1. BaR adapter already ran → `req.bar.ctx`, `res.builder`
2. HuK (or service using HuK) on input/body
3. Domain logic
4. `res.builder.as.*(...).build()` once

## Validation recipes

### Zod

```typescript
const parsed = Schema.safeParse(req.body);
if (!parsed.success) {
  return res.builder.as.validationError(parsed.error).build();
}
```

### HuK guards

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';

const errors: Record<string, string> = {};
if (typeof req.body?.email !== 'string' || !string.isEmail(req.body.email)) {
  errors.email = 'Invalid email';
}
if (Object.keys(errors).length) {
  return res.builder.as.validationError(errors).build();
}
```

### HuK after Zod (policy)

```typescript
if (!HuK.string.isStrongPassword(parsed.data.password)) {
  return res.builder.as.validationError({ password: 'Password does not meet policy' }).build();
}
```

### Sanitize → validate

```typescript
const bio = HuK.string.escapeHtml(String(req.body?.bio ?? '').trim());
if (HuK.is.empty(bio)) {
  return res.builder.as.validationError({ bio: 'Bio is required' }).build();
}
return res.builder.as.ok({ bio }).build();
```

## Canonical slug pipeline (production pattern)

HuK slugify + domain regex + BaR error preset:

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX = 80;

export function slugifyName(value: string): string {
  const slug = string.slugify(value).slice(0, MAX).replace(/-+$/g, '');
  if (!slug || !SLUG_PATTERN.test(slug)) {
    throw new DomainBadRequest('Name cannot be turned into a slug.');
  }
  return slug;
}

// handler / filter maps DomainBadRequest → res.builder.as.badRequest(msg).build()
// success → res.builder.as.created({ slug }, 'Created.').build()
```

Opaque drafts: Node `crypto.randomBytes` or `HuK.crypto.generateUuid` — not BaR.

## Pagination + DTO

```typescript
const publicItems = items.map(row => HuK.object.pick(row, ['id', 'title', 'slug']));
return paginatedOk(res.builder, publicItems, { total, page, limit }).build();
```

## Request ID

Logs and `X-Request-Id`: `req.bar.ctx.request_id`. Exception filter fallback order should prefer ctx over new UUID.

## Client consumption

Parse BaR JSON; map `error.details` to form fields; use HuK for display only:

```typescript
HuK.number.currency(price, { currency: 'TRY', locale: 'tr-TR' });
HuK.string.mask(pan, { visibleEnd: 4 });
```

## Global exception filter alignment

Legacy shape example (avoid for new routes):

```json
{ "success": false, "code": "...", "message": "...", "requestId": "..." }
```

BaR shape (target for BaR-enabled APIs):

```json
{
  "success": false,
  "timestamp": "...",
  "data": null,
  "error": { "code": "...", "message": "...", "details": [] },
  "metadata": { "request_id": "...", "status_code": 400, "server_time": "..." }
}
```

When migrating filters, map `APIError.details` → `error.details`.

## Anti-patterns

- `res.json({ slug: HuK.string.slugify(x) })` without envelope
- HuK inside BaR hooks for business rules
- Second request ID per request
- `await .build()`

## Related

[huk-js SKILL.md](../../huk-js/SKILL.md) — [api-complete.md](../../huk-js/references/api-complete.md)
