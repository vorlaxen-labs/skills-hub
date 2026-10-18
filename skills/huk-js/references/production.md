# HuK production usage

## SSR and storage

On Node/SSR:

- `storage.set`, `remove`, `clear` — no-op (no throw)
- `storage.get` — always returns **default** when not in browser or on parse error
- Quota / private mode on `set` — silent failure

Design: never rely on storage write success feedback without reading back.

## Crypto

- **UUID:** `crypto.randomUUID()` when available; v4-style fallback otherwise
- **hash:** Web Crypto `subtle.digest('SHA-256')` when available; else Node `createHash` via dynamic `import('node:crypto')`
- **secureRandom (string):** uses Node `randomBytes` in Node environments

Target **Node 18+** for server hash fallback.

## Bundlers

```typescript
import { slugify } from '@vorlaxen-labs/huk-js/string';
```

Package `sideEffects: false` — tree-shake unused modules.

## clone() limitation

JSON clone — does not preserve `Date`, `undefined`, `Map`, `Set`, functions. Use for plain DTOs only.

## API server with BaR

Run HuK in services; register `BarExpressAdapter` per app docs. See [integration-bar-js.md](./integration-bar-js.md).

## Browser

No Node requirement beyond bundler. `localStorage` only when `isBrowser()` true.
