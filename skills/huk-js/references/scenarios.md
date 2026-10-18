# HuK scenarios (from package tests)

Use these as expected behavior when implementing app features.

## User input pipeline

1. `isEmail(email)` → true for valid sample
2. `slugify(displayName)` → `/^[a-z0-9-]+$/`
3. `mask(card, { visibleEnd: 4 })` → ends with last 4 digits
4. `pick(user, ['email'])` → subset object

## Turkish slug routing

Fixed fixture: Turkish input slugifies to expected ASCII hyphen form (see `tests/shared/fixtures` in huk-js repo).

Blog-style: title `İstanbul'da Yazılım Geliştirme 101` → no Turkish chars in slug; `truncate(slug, 40)` length bound.

## Data sanitization

1. `escapeHtml('<img onerror="x" />')` → safe string; not `is.empty`
2. `clone({ nested })` → deep copy; mutating clone does not affect original

## SSR hydration storage

Server render: `storage.get` returns default; `set` no-op. Client hydrate: round-trip JSON values.

## Crypto runtime

- UUID format validates with `crypto.validate.isUuid`
- Hash produces 64-char hex validateable with `isSha256`
- Node without subtle uses hash fallback (integration tests)

## Fn resilience

`retry` succeeds after transient failure; `debounce`/`throttle` timing behavior in unit tests.

## i18n + routing

Combine `slugify` + app route param `[slug]` — always validate slug param with domain regex after decode.

## With BaR (app-level)

Scenarios above stop at data; HTTP layer uses BaR `.as.ok` / `.validationError` — see [integration-bar-js.md](./integration-bar-js.md).
