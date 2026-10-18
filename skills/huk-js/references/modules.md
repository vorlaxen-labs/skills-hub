# HuK modules (index)

Full signatures and behavior: [api-complete.md](./api-complete.md).

| Module | Subpath | Primary APIs |
|--------|---------|--------------|
| String | `/string` | slugify, mask, escapeHtml, isEmail, isStrongPassword, case transforms |
| Number | `/number` | clamp, format, currency, bytes, validation |
| Date | `/date` | isValid, add, format, relative, toISODate |
| Array | `/array` | compact, unique, flatten, groupBy, shuffle |
| Object | `/object` | clone, merge, get, pick |
| Crypto | `/crypto` | generateUuid, hash, base64, validate.* |
| Fn | `/fn` | debounce, throttle, retry, memoize, pipe |
| Is | `/is` | type guards, empty |
| Storage | `/storage` | get/set/remove/clear (browser) |

Facade: `import { HuK } from '@vorlaxen-labs/huk-js'`.
