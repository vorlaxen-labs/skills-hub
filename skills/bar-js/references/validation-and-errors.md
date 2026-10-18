# BaR validation and errors

## validationError preset

```typescript
res.builder.as.validationError(errors, 'Validation failed').build();
```

- Status **422**
- `error.code` **`VALIDATION_ERROR`**
- `error.details` from `normalizeValidationErrors(errors)`

Import standalone:

```typescript
import { normalizeValidationErrors } from '@vorlaxen-labs/bar-js';
```

## ErrorDetail shape

```typescript
type ErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};
```

## normalizeValidationErrors(input) — input shapes

### Already ErrorDetail[]

If every item has `message: string` and optional `field`/`code` — returned as-is.

### Zod

Object with `issues[]` — each issue: `path` → dotted `field`, `message`, optional `code`.

### Joi

Object with `details[]` — `path` → field, `message`, `type` → `code`.

### class-validator

Nested array — flattens `constraints` on `property`, recurses `children` with dotted paths.

### Plain record

```typescript
{ email: 'Invalid', name: ['Too short', 'Required'] }
```

String values and string arrays per field → multiple details.

### String

`"Validation failed"` → single detail without field.

### Fallback

Empty/unrecognized → `[{ message: 'Validation failed' }]`.

## Choosing 400 vs 422

| Situation | Typical preset |
|-----------|----------------|
| Malformed JSON / wrong content-type | Often middleware → 400 |
| Schema / field validation | `validationError` → 422 |
| Simple missing param (project convention) | `badRequest` → 400 |

**Match sibling routes** in the repo.

## withError

Low-level structured error when presets are not enough:

```typescript
res.builder
  .status(418)
  .forceSuccess(false)
  .data(null)
  .withError({ code: 'TEAPOT', message: '...' })
  .build();
```

Presets use internal `clientError` / `serverError` helpers with `errorCodeForStatus`.

## errorCodeForStatus

Maps known statuses to strings like `BAD_REQUEST`, `NOT_FOUND`, `VALIDATION_ERROR` (via preset), unknown → `HTTP_${status}`.

## Global exception filters

If errors bypass the builder:

1. Read `req.bar?.ctx?.request_id` for correlation
2. Emit BaR-compatible JSON if the API uses BaR elsewhere
3. Map `details` to `error.details`, not top-level sibling keys

## Testing assertions

Integration tests should assert:

- `success`, `metadata.request_id`, `metadata.status_code`
- Errors: `error.code`, `error.details[].field` when applicable
- 204: body may be absent per `shouldSendResponseBody`
