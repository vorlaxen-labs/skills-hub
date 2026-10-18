# HuK examples (copy-paste patterns)

## Slug + validate email

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';

const slug = string.slugify('Merhaba Dünya');
const ok = string.isEmail('user@example.com');
```

## DTO for API response (use with BaR .as.ok)

```typescript
import { object } from '@vorlaxen-labs/huk-js/object';

const publicUser = object.pick(user, ['id', 'email', 'name']);
```

## Sanitize user HTML bio

```typescript
import { string } from '@vorlaxen-labs/huk-js/string';
import { is } from '@vorlaxen-labs/huk-js/is';

const safe = string.escapeHtml(rawInput.trim());
if (is.empty(safe)) throw new ValidationError('bio');
```

## Mask PAN in UI

```typescript
HuK.string.mask('4444555566667777', { visibleEnd: 4 });
// ************7777
```

## Currency (client)

```typescript
import { currency } from '@vorlaxen-labs/huk-js/number';
currency(1999.5, { currency: 'TRY', locale: 'tr-TR' });
```

## Relative time

```typescript
import { relative } from '@vorlaxen-labs/huk-js/date';
relative(new Date(Date.now() - 3600_000), 'tr-TR');
```

## Debounced search (React)

```typescript
import { debounce } from '@vorlaxen-labs/huk-js/fn';
const onSearch = debounce((q: string) => fetch(`/api?q=${q}`), 300);
```

## Storage preference (client only)

```typescript
HuK.storage.set('theme', 'dark');
const theme = HuK.storage.get('theme', 'light');
```

## UUID + hash

```typescript
const id = await HuK.crypto.generateUuid();
const digest = await HuK.crypto.hash('payload', 'salt');
```

## groupBy

```typescript
import { groupBy } from '@vorlaxen-labs/huk-js/array';
const byStatus = groupBy(tasks, t => t.status);
```

## retry fetch

```typescript
import { retry } from '@vorlaxen-labs/huk-js/fn';
const data = await retry(() => fetchJson(url), 3, 500);
```

## Full handler with BaR

See [integration-bar-js.md](./integration-bar-js.md).
