# BaR API reference (agent knowledge base)

Reflects public `@vorlaxen-labs/bar-js` API. `BaR` === `ResponseBuilder`.

## Root package exports

| Symbol | Role |
|--------|------|
| `ResponseBuilder`, `BaR` | Fluent builder |
| `ResponseAs` | `.as` preset implementation |
| `BaRHooks` | Lifecycle hooks |
| `BaRContextFactory`, `MetadataFactory` | Context and metadata |
| `normalizeValidationErrors` | Map Zod/Joi/class-validator/records → `ErrorDetail[]` |
| `StatusCodes`, `HttpConstant` helpers | Status groupings |
| `DEFAULT_SECURITY_HEADERS` | Adapter default header map |
| `NO_BODY_STATUS_CODES`, `shouldSendResponseBody` | 204/205/304 body rules |
| `errorCodeForStatus` | Map status → `error.code` string |
| `IBaRDispatcher`, `BaRFinalResult`, `IResponse`, `ErrorDetail`, `ResponseError` | Types |

## Response schema

```typescript
type SuccessBody<T> = {
  success: true;
  timestamp: string;
  message: string;
  data: T | null;
  metadata: Metadata;
};

type ErrorBody = {
  success: false;
  timestamp: string;
  data: null;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string; code?: string }>;
  };
  metadata: Metadata;
};
```

| Field | Rule |
|-------|------|
| `success` | `true` when `200 <= status < 400` unless `forceSuccess()` overrides |
| `message` | **Success only** |
| `error` | **Failure only** — from `.as.*`, `.withError()`, or `wrap()` rejection |
| `metadata` | Always `request_id`, `server_time`, `status_code`; plus `setMeta` / `paginate` |

Default success message from builder: `"Operation successful"` if not set.

## Constructor

```typescript
new ResponseBuilder(
  dispatcher?: IBaRDispatcher,
  options?: ResponseBuilderOptions,
  context?: BaRContext,
)
```

`BaRContext`: `{ request_id: string; start_time: number }`.

### ResponseBuilderOptions

| Field | Effect |
|-------|--------|
| `environment` | `'development' \| 'production' \| 'test'` — `wrap()` masks errors in production |
| `includeStack` | Non-production: `wrap()` may use `error.stack` as message |
| `logger` | Build/dispatch logging |
| `hooks` | `BaRHooks` instance |

## Chain methods

| Method | Behavior |
|--------|----------|
| `status(code)` | Sets HTTP status; **clears** prior `forceSuccess()` override |
| `forceSuccess(value)` | Override inferred success flag |
| `message(msg)` | Success message string |
| `data(data)` | Payload; errors often `null` |
| `setMeta(meta)` | Shallow merge into metadata |
| `withMetadata(options?)` | Merge from `MetadataFactory.create` |
| `paginate(data, options)` | Sets `data` + `metadata.pagination`; throws if `limit <= 0` |
| `withError(error)` | Structured failure |
| `setHeaders(key, value)` / `setHeaders(record)` / `header` | Outbound headers at dispatch |
| `setCookies(name, value, opts?)` / `setCookies(record, opts?)` | Queued cookies |
| `wrap(promise)` | **Async** — resolve → data; reject → 500 + `forceSuccess(false)` + `error` hook |
| `transform(fn)` | Map `data` when not `null` |
| `when(condition, fn)` | Conditional chain |
| `as` | `ResponseAs` presets |
| `build()` | **Sync** — assemble + dispatch if dispatcher bound; returns `BaRFinalResult` |

## `.as` presets

### 2xx

| Method | Status | Default message | Notes |
|--------|--------|-----------------|-------|
| `ok(data?, message?)` | 200 | `"Success"` | `data` → `null` if omitted |
| `created(data?, message?)` | 201 | `"Resource created"` | |
| `accepted(message?)` | 202 | `"Request accepted"` | Does not set data |
| `noContent()` | 204 | `""` | `data: null`; body may be omitted on wire |

### 4xx

All: `forceSuccess(false)`, `data: null`.

| Method | Status | Default message |
|--------|--------|-----------------|
| `badRequest(message?)` | 400 | `"Bad Request"` |
| `unauthorized(message?)` | 401 | `"Unauthorized access"` |
| `forbidden(message?)` | 403 | `"Access forbidden"` |
| `notFound(message?)` | 404 | `"Resource not found"` |
| `conflict(message?)` | 409 | `"Conflict detected"` |
| `unprocessable(message?)` | 422 | `"Unprocessable entity"` |
| `validationError(errors, message?)` | 422 | `"Validation failed"` | code `VALIDATION_ERROR`, `details` normalized |
| `tooManyRequests(message?)` | 429 | `"Too many requests, please slow down"` |

### 5xx

| Method | Status | Default message |
|--------|--------|-----------------|
| `internalServerError(message?)` | 500 | `"Internal server error"` |
| `serviceUnavailable(message?)` | 503 | `"Service temporarily unavailable"` |
| `gatewayTimeout(message?)` | 504 | `"Gateway timeout"` |

## Pagination

```typescript
// Offset
.paginate(items, { strategy: 'offset', total, page, limit });
// metadata.pagination: total, page, limit, total_pages, has_next, has_prev, strategy

// Cursor
.paginate(items, { strategy: 'cursor', limit, next_cursor, prev_cursor });
// metadata.pagination: limit, next_cursor, prev_cursor, has_next, has_prev, strategy
```

## BaRFinalResult

```typescript
interface BaRFinalResult {
  body: IResponse<unknown>;
  statusCode: number;
  headers: Record<string, HeaderValue>;
  cookies: QueuedCookie[];
}
```

Without dispatcher, `.build()` returns result only — no HTTP write.

## BaRHooks events

| Event | Payload |
|-------|---------|
| `before_build` | `{ statusCode }` |
| `after_build` | `BaRFinalResult` clone |
| `before_dispatch` | `BaRFinalResult` clone |
| `after_dispatch` | `BaRFinalResult` clone |
| `error` | `wrap()` rejection: `{ error, message, statusCode }`; hook failure: `{ sourceEvent, error, payload }` |

Order: `before_build` → assemble → `after_build` → `before_dispatch` → dispatch → `after_dispatch`.

## DEFAULT_SECURITY_HEADERS (adapter)

When `withDefaultHeaders !== false`:

| Header | Value |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | `default-src 'none'; frame-ancestors 'none';` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cache-Control` | `no-store` |
| `Pragma` | `no-cache` |
| `X-DNS-Prefetch-Control` | `off` |

Override via adapter `defaultHeaders`.

## Logger interface

```typescript
interface Logger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  debug?(message: string, meta?: unknown): void;
}
```

## Adapter subpaths

| Subpath | Exports |
|---------|---------|
| `/adapters/express` | `BarExpressAdapter`, `ExpressDispatcher`, `BarExpressOptions` |
| `/adapters/fastify` | `BarFastifyPlugin`, `registerBarFastify`, `FastifyDispatcher`, `BarFastifyOptions` |

`BarAdapterOptions`: `withDefaultHeaders`, `defaultHeaders`, `logger`, `hooks`, `requestIdHeaders`, `environment`, `includeStack`.
