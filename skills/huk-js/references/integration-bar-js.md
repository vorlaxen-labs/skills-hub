# HuK + BaR integration (HuK perspective)

Mirror: [../../bar-js/references/integration-huk-js.md](../../bar-js/references/integration-huk-js.md).

## Rules

1. HuK functions are **pure** — inputs → outputs.
2. BaR **`.build()`** is the only HTTP response exit on BaR routes.
3. Never import BaR adapters in client bundles for HuK-only UI apps that consume JSON manually.

## Layering

```
Controller/Handler
  ├─ HuK (input, DTO)
  ├─ Service (HuK only)
  └─ res.builder.as.*().build()
```

## Module pick list for typical REST apps

| Step | HuK |
|------|-----|
| Query/path cleanup | `string.slugify`, trim via `isEmpty` |
| Body light checks | `isEmail`, `isStrongPassword` |
| XSS before save | `escapeHtml` |
| Response DTO | `object.pick`, `clone` |
| List prep | `array.compact`, `unique` |
| Logs | `string.mask` |
| Client UI after fetch | `number.currency`, `date.relative`, `storage` |

## Express handler template

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';
import { object } from '@vorlaxen-labs/huk-js/object';
import type { Request, Response } from 'express';

export function getProfile(req: Request, res: Response) {
  const user = userService.find(req.userId);
  if (!user) {
    return res.builder.as.notFound('User not found').build();
  }
  const data = object.pick(user, ['id', 'email', 'displayName']);
  return res.builder.as.ok(data).build();
}
```

## Validation → BaR

Pure helper:

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';

export function signupFieldErrors(body: unknown): Record<string, string> {
  const err: Record<string, string> = {};
  if (!body || typeof body !== 'object') return { _: 'Invalid body' };
  const { email, password, name } = body as Record<string, unknown>;
  if (typeof name !== 'string' || string.isEmpty(name)) err.name = 'Required';
  if (typeof email !== 'string' || !string.isEmail(email)) err.email = 'Invalid email';
  if (typeof password !== 'string' || !string.isStrongPassword(password)) {
    err.password = 'Policy not met';
  }
  return err;
}
```

Handler:

```typescript
const errors = signupFieldErrors(req.body);
if (Object.keys(errors).length) {
  return res.builder.as.validationError(errors).build();
}
```

## Slug service (domain util)

Keep BaR out of util file:

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';

export function slugFromTitle(title: string, maxLen: number, pattern: RegExp): string {
  const slug = string.slugify(title).slice(0, maxLen).replace(/-+$/g, '');
  if (!slug || !pattern.test(slug)) {
    throw new SlugError('Invalid slug');
  }
  return slug;
}
```

Map `SlugError` in controller to `.as.badRequest` or project `APIError`.

## Client after BaR fetch

```typescript
const body = await res.json();
if (!body.success) {
  applyFormErrors(body.error?.details);
  return;
}
setTitle(HuK.string.truncate(body.data.title, 60));
HuK.storage.set('lastViewedId', body.data.id);
```

## IDs

| ID type | Source |
|---------|--------|
| HTTP request correlation | `req.bar.ctx.request_id` (BaR) |
| New row primary key | `HuK.crypto.generateUuid()` or DB |

## Anti-patterns

- `HuK.storage` for JWT/session on server
- `hash()` for password storage without dedicated KDF
- Duplicating `slugify` locally when HuK already maps Turkish chars
- Returning HuK output without BaR envelope on API routes

## Related

[bar-js SKILL.md](../../bar-js/SKILL.md) — [api-reference.md](../../bar-js/references/api-reference.md)
