# HuK complete API reference

Access via `HuK.<module>.<fn>` or subpath named imports. Module objects merge `createModule` static classes.

## String (`@vorlaxen-labs/huk-js/string`)

### Transform

| Function | Signature / behavior |
|----------|----------------------|
| `slugify(str)` | Turkish `TURKISH_CHAR_MAP` replace → lower → trim → strip non-word → hyphen collapse |
| `truncate(str, length=30, suffix='...')` | Length cap with suffix |
| `truncateWords(str, limit=20, suffix='...')` | Word boundary truncate |
| `toPascalCase`, `toCamelCase`, `toTitleCase`, `toSentenceCase` | Case transforms |
| `removeWhitespace`, `removeNumbers`, `reverse` | String ops |
| `interpolate(template, values)` | `{{key}}` style replacement |

### Security

| Function | Behavior |
|----------|----------|
| `mask(str, { visibleStart=0, visibleEnd=4, char='*' })` | Middle mask; short strings unchanged |
| `secureRandom(length=16)` | Node `randomBytes` hex slice |
| `escapeHtml(str)` | `& < > " '` entity escape |

### Validation

| Function | Rule |
|----------|------|
| `isEmail(str)` | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `isStrongPassword(str)` | 8+ chars, upper, lower, digit, special `@$!%*?&` |
| `isEmpty(str \| null \| undefined)` | falsy or trim empty |

## Number (`/number`)

### Validation

`isNumber`, `isInteger`, `isFloat`, `isFinite`, `isPositive`, `isNegative`, `isZero`, `isBetween(value, min, max, inclusive=true)`, `isMultipleOf`, `isSafeInteger`.

### Transform

`clamp`, `round`, `floor`, `ceil` (optional decimals), `lerp`, `normalize`, `toFixed`, `abs`, `sum`, `average`, `median`, `percentage(value, total, decimals=1)`.

### Format

| Function | Notes |
|----------|-------|
| `format(value, { locale, decimals, notation })` | `Intl.NumberFormat` |
| `currency(value, { currency='USD', locale, decimals=2 })` | Currency style |
| `compact(value, locale)` | Compact notation |
| `ordinal(value, locale)` | 1st, 2nd, … |
| `bytes(value, decimals=2)` | B, KB, … |
| `pad(value, length, char='0')` | padStart |

Types: `CurrencyOptions`, `FormatOptions`.

## Date (`/date`)

### Validation

`isValid`, `isLeapYear`, `isBefore`, `isAfter`, `isSameDay`, `isWeekend`, `isToday`.

### Transform

`add(date, amount, 'day'|'month'|'year')`, `subtract(...)`, `startOf(date, 'day'|'month'|'year')`.

### Format

| Function | Notes |
|----------|-------|
| `format(date, { locale, dateStyle, timeStyle })` | Intl date/time |
| `toISODate(date)` | `YYYY-MM-DD` from ISO split |
| `relative(date, locale)` | seconds/minutes/hours/days via `RelativeTimeFormat` |
| `part(date, part, locale)` | Intl part long format |

Uses internal `createDate` helper for normalization.

## Array (`/array`)

| Function | Behavior |
|----------|----------|
| `compact(arr)` | `filter(Boolean)` |
| `unique(arr)` | `Set` |
| `flatten(arr)` | `flat(Infinity)` |
| `shuffle(arr)` | Fisher-Yates copy |
| `first`, `last` | Edge elements |
| `groupBy(arr, keyFn)` | Record of arrays |

## Object (`/object`)

| Function | Behavior |
|----------|----------|
| `clone(obj)` | JSON deep clone |
| `merge(target, source)` | Deep merge plain objects |
| `get(obj, path, default?)` | Dot path |
| `pick(obj, keys[])` | Allowlist keys |

## Crypto (`/crypto`)

| Function | Behavior |
|----------|----------|
| `generateUuid()` | `randomUUID()` or v4-like fallback |
| `toBase64` / `fromBase64` | Buffer or `btoa`/`atob` |
| `hash(data, salt='')` | SHA-256 hex; Web Crypto or Node dynamic import |
| `validate.isUuid` | UUID v4 regex |
| `validate.isSha256` | 64 hex chars |
| `validate.isBase64` | Base64 regex |
| `validate.isStrongSalt(salt, minLength=16)` | Length check |

## Fn (`/fn`)

| Function | Behavior |
|----------|----------|
| `debounce(fn, delay)` | Trailing debounce |
| `throttle(fn, limit)` | Throttle window |
| `sleep(ms)` | Promise delay |
| `pipe(...fns)` | Left-to-right |
| `compose(...fns)` | Right-to-left |
| `once(fn)` | First call cached |
| `memoize(fn)` | JSON args key cache |
| `retry(fn, attempts=3, delayMs=300)` | Async retry with delay |

## Is (`/is`)

| Function | Behavior |
|----------|----------|
| `string`, `number`, `boolean`, `array`, `object` | Type guards |
| `empty(val)` | null/undefined, blank string, `[]`, `{}` |

## Storage (`/storage`)

| Function | SSR / server |
|----------|----------------|
| `set(key, value)` | no-op |
| `get(key, default?)` | returns default |
| `remove`, `clear` | no-op |

Browser: JSON serialize; corrupt/quota → silent fail / default.

## Facade root (`@vorlaxen-labs/huk-js`)

```typescript
HuK.string | .number | .date | .array | .object | .is | .storage | .fn | .crypto
```

Named re-exports exist on several subpath index files (e.g. `slugify` from `/string`).

## Turkish slugify map (built-in)

`ç Ç → c`, `ğ Ğ → g`, `ı İ → i`, `ö Ö → o`, `ş Ş → s`, `ü Ü → u`.

Example: `İstanbul'da Yazılım` → ASCII slug without Turkish letters in output.

## createModule pattern

Internal: static class methods exposed as plain functions on module object — agents should call exported functions only.
