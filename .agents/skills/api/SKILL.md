---
name: api
description: Use before adding, editing, or reviewing anything in the reptiles.ge API Worker (`src/api/`, `migrations/api/`, `wrangler.api.jsonc`). Binding rules for the Hono app layout, routes, validation, errors, D1 access, migrations, auth, caching, tests, and deploys. Enforced by `src/api/structure.test.ts`.
metadata:
  version: 1.0.0
---

# api

The API is a separate Cloudflare Worker, `reptiles-api`, served at `https://api.reptiles.ge` (Custom Domain in `wrangler.api.jsonc`; `workers_dev` is off), built with [Hono](https://hono.dev) on D1 (`reptiles-db`). It lives in this repo so it can import `src/data` and `src/lib`, but it builds and deploys on its own.

**Every rule below is mandatory.** "MUST" and "NEVER" are not suggestions. If a task seems to need a rule broken, stop and ask the owner. Do not work around it, and do not weaken `src/api/structure.test.ts` to make a change pass.

## Layout

```text
src/api/
├── index.ts          Worker entry. Exports { fetch: app.fetch } only.
├── app.ts            Global middleware, .route("/v1/…"), notFound, onError, AppType.
├── env.ts            ApiEnv / ApiBindings (every binding and secret, typed).
├── factory.ts        createFactory<ApiEnv>() for typed middleware.
├── db/               All SQL. One file per table or aggregate, plus database.ts (types).
├── lib/              errors.ts, validate.ts, cache.ts. API-only helpers.
├── middleware/       One middleware per file, built with factory.createMiddleware.
├── routes/           One Hono sub-app per resource. {name}.ts + {name}.test.ts.
├── schemas/          Zod schemas for query, param, and json input.
└── testing/          Test helpers only (SQLite D1 stand-in, request helpers).
migrations/api/       NNNN_snake_case.sql, applied in order.
wrangler.api.jsonc    Worker config: main src/api/index.ts, D1 binding DB.
```

- MUST NOT add any other top-level file or folder in `src/api/`. The guard test lists the allowed names.
- Code shared with the site (validation rules, locale lists, catalog access) MUST live in `src/lib`, `src/data`, or `src/i18n` and be imported. NEVER copy it into `src/api`.
- `src/api` MUST NOT import from `next`, `next-intl` runtime APIs, React, or `src/components`. Type-only imports from `@/i18n/routing` are allowed. Use `@/i18n/locales` for runtime locale values.

## Routes

- One resource = one file in `routes/`, exporting `new Hono<ApiEnv>()` with chained methods (`.get().post()`), so `AppType` keeps the RPC types.
- Mount it in `app.ts` with `.route("/v1/{resource}", …)`. Every path MUST start with `/v1/`. A breaking change goes to `/v2/`, never in place.
- Write handlers inline after the path. NEVER write Rails-style controllers `(c: Context) => …`, because they lose path-param types. If a handler must be shared, use `factory.createHandlers()`.
- Pass an explicit status to `c.json(body, status)`.
- Success shape: `{ data, …meta }`. Lists add `total` and the resolved `locale`.
- JSON keys are camelCase. Dates are ISO 8601 in UTC.
- Non-critical side work (Telegram, analytics) MUST run in `c.executionCtx.waitUntil()`, never before the response.

## Validation

- Every input MUST go through `validate(target, schema)` from `lib/validate.ts` (wraps `@hono/zod-validator`). Read it with `c.req.valid(target)`.
- NEVER call `c.req.json()`, `c.req.query()`, `c.req.param()`, `c.req.parseBody()`, or similar in `routes/`. The guard test fails on them.
- Schemas live in `schemas/`. If the site validates the same input, the schema lives in `src/lib` and both use it (example: `src/lib/ratingInput.ts`).
- Locale input is `localeQuery` from `schemas/common.ts`: the four site locales, default `ka`.
- Tests that send JSON MUST set `Content-Type: application/json`. Without it Hono validates `{}`.

## Errors

- One error shape everywhere: `{ "error": { "code", "message", "details"? } }`.
- Codes come only from `ApiErrorCode` in `lib/errors.ts`. Add a code there before using it.
- For an expected failure, throw `new ApiError(status, code, message, details?)`. `app.onError(handleError)` renders it. `notFound` returns `not_found`.
- NEVER build an error with `c.json({ error … })` outside `lib/errors.ts`.
- Unknown errors are logged with `console.error` and answered with a generic `internal_error` 500. NEVER put stack traces, SQL, or binding names in a response.

## Database (D1)

- All SQL lives in `db/`. NEVER call `.prepare()` or `.batch()` anywhere else.
- Always `prepare(sql).bind(...values)`. NEVER build SQL with template strings or concatenation from input.
- NEVER `SELECT *`. Name the columns.
- Every column used in `WHERE`, `JOIN`, or `ORDER BY` on a growing table MUST have an index in a migration. D1 bills rows read, not rows returned.
- Several writes that belong together go in one `db.batch()`.
- Columns are snake_case; map to camelCase in `db/` or the route.
- Business rules are enforced twice: Zod in the API and `CHECK` / `NOT NULL` / foreign keys in SQL.
- Do not store IP addresses, user agents, or other personal data unless the owner asks for it.
- AI agents get read-only access to production data. Every AI write goes through the API, through validation, and lands as a draft for human approval. NEVER write to production D1 with raw SQL from an agent.

## Species data in D1

- Migration `0002_species.sql` holds the whole species catalog: `species` (taxonomy, group, danger, status, catalog order, KA slug), `species_texts` (one row per species and locale), `species_list_items` (facts and identification traits), `species_faq`, `species_stats`, `species_identification_colors`, `species_sources`, `species_habitats`, `species_lookalikes`, `species_slugs` (every public, legacy and alias slug), `species_media` (hero, mobile, gallery, audio with credits) and `species_media_overlays` (per-locale credit and order overrides).
- Values that can grow live in lookup tables with foreign keys: `locales`, `animal_groups`, `habitats`, `danger_levels`, `photo_confidences`. Add a value with an `INSERT` in a new migration. Do not turn them into `CHECK` lists; SQLite cannot change a `CHECK` without rebuilding the table.
- **For now MDX stays the source of truth.** D1 is a copy built by `pnpm db:import:species` (local) or `pnpm db:import:species:remote` (production, owner asks only). The import deletes and rewrites only the species tables. Re-run it after content changes. NEVER edit species rows by hand.
- `src/api/db/speciesImport.ts` builds the SQL. `src/api/db/speciesCatalog.ts` reads it back. `speciesCatalog.test.ts` imports every species into SQLite and requires `toStrictEqual` with the compiled MDX catalog (`src/lib/speciesImportSource.ts`). A schema or import change that loses a field fails it.
- Add a new species field in this order: migration (new column or table), `speciesSchema.ts` columns, import builder, reader. The round-trip test tells you what is missing.
- Statements stay under 90 KB of UTF-8 (D1 rejects statements over 100 KB; Georgian text is 3 bytes per letter).

- File name: `migrations/api/NNNN_snake_case.sql`, numbered from `0001` with no gaps.
- Add-only. NEVER edit, rename, or delete a migration that has been applied anywhere. Fix forward with a new one.
- Migrations run **only** when a person runs a script on purpose. NEVER apply them from `dev`, `dev:api`, `build`, `deploy:api`, a `pre*`/`post*` hook, `scripts/`, CI, or app code. The guard test fails if anything other than `db:migrate` and `db:migrate:remote` applies migrations.
- Local: `pnpm db:migrations:list`, then `pnpm db:migrate`.
- Production: `pnpm db:migrate:remote`, only when the owner asks, by hand, after the change is merged.
- Tests run every migration on an in-memory Node SQLite (`testing/sqliteDatabase.ts`). That never touches the local or remote D1, and a broken migration fails CI.

## Auth and security

- Public `GET` routes serve data that is already public on the site.
- A write route is one of two kinds, and the guard test checks every `.post/.put/.patch/.delete` in `routes/`:
  - **Private** (admin, AI, internal): `requireToken` (`Authorization: Bearer <API_WRITE_TOKEN>`, constant-time compare, 401 when the secret is missing).
  - **Public from the browser** (site forms such as ratings): `requireSiteOrigin` (Origin must be in `ALLOWED_ORIGINS`, else 403 `forbidden`) **and** a Cloudflare rate limit middleware (429 `rate_limited`, fails open when the binding errors), then Zod validation. The Origin check alone is not protection; the rate limit is.
- NEVER put `API_WRITE_TOKEN` or any secret in browser code or a `NEXT_PUBLIC_*` variable.
- Secrets: `.dev.vars` locally (gitignored) and `wrangler secret put … --config wrangler.api.jsonc` in production. NEVER put a secret in code, config, tests, commits, PR text, or chat. Never read `process.env`; use `c.env`.
- `app.ts` keeps `secureHeaders()`, `noindex` (`X-Robots-Tag: noindex`), CORS (`GET`/`POST`/`OPTIONS`, echoes an `ALLOWED_ORIGINS` origin, `*` otherwise, preflight cached 24 h), `bodyLimit` (16 KB), `etag()`, and `onError(handleError)`. Do not remove them. The guard test checks each one.
- The D1 `database_id` in `wrangler.api.jsonc` is an identifier, not a secret. It stays in the repo.

## Caching

- `etag()` runs on every response. A repeated `GET` with a matching `If-None-Match` gets `304` with no body. Keep responses deterministic (no timestamps or random values in a cacheable body) so the ETag stays stable.
- Public `GET`: `Cache-Control: PUBLIC_CACHE` from `lib/cache.ts`.
- Authenticated or personal responses: `NO_STORE`.
- When D1-backed content changes, purge the affected cache entries. Do not shorten cache times as a workaround.

## Calling the API from the site

- The site calls the API only through `src/lib/apiClient.ts`: `createApiClient({ fetch?, origin?, token? })` returns a typed `hc<AppType>` client. The origin comes from `NEXT_PUBLIC_API_ORIGIN` (via `publicEnv()`), default `https://api.reptiles.ge`.
- NEVER call the API with raw `fetch("https://api.reptiles.ge/…")`, and NEVER import `@/api/…` runtime code into the site. `apiClient.ts` imports only `type { AppType }`. The guard test fails otherwise.
- Because the client is typed from `AppType`, a changed route, query, or body breaks `pnpm typecheck` on the site side. Fix the caller; do not cast around it.
- Routes MUST keep chained methods and an explicit status in `c.json(body, status)`, or the client loses its types.

### Ratings flow

- `SiteRating.tsx` posts straight to `https://api.reptiles.ge/v1/ratings` with `createApiClient()`. There is no `/api/rating` route on the site any more, and the site Worker has no rating code or bindings.
- The API owns the whole flow: origin check, `RATING_VISITOR_LIMITER` (3/min per IP) and `RATING_GLOBAL_LIMITER` (30/min), validation with `src/lib/ratingInput.ts`, the D1 insert (country from `cf-ipcountry`, never from the body), and the Telegram notice in `c.executionCtx.waitUntil` (`inBackground`).
- Telegram secrets live on `reptiles-api`: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (`wrangler secret put … --config wrangler.api.jsonc`). Without them the rating is still stored and the miss is logged.
- `ALLOWED_ORIGINS` is a var in `wrangler.api.jsonc` (`https://reptiles.ge`). For local work, add your dev origin in `.dev.vars`, and point the site at the local API with `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787`.
- The site CSP `connect-src` allows `https://api.reptiles.ge` (and `http://localhost:8787` in development). Keep it in sync if the API origin changes.

## Types

- Bindings are typed by hand in `env.ts` (same approach as `src/lib/ratingRateLimit.ts`). Do not add `@cloudflare/workers-types` or a generated `worker-configuration.d.ts`; they clash with the Next DOM types.
- Keep `hono` and `@hono/zod-validator` pinned to exact versions in `package.json`.

## Tests

- Every `routes/{name}.ts` has `routes/{name}.test.ts`.
- Call the app with `app.request(url, init, env)`. For D1 use `createTestDatabase()`, which runs the real migrations.
- Each route covers: success, validation error (400 + `invalid_request`), auth (401) when protected, and not-found where it applies.
- `src/api/structure.test.ts` enforces this layout. Keep it passing; do not loosen it.
- Coverage thresholds in `vitest.config.ts` apply. Never lower them.

## Commands

```bash
pnpm dev:api              # species:compile, then wrangler dev on :8787 (local D1, no migrations)
pnpm db:migrations:list   # pending migrations on the local D1
pnpm db:migrate           # apply pending migrations to the local D1
pnpm db:migrate:remote    # apply to production reptiles-db (owner asks only)
pnpm db:import:species    # rebuild species tables in local D1 from MDX
pnpm db:import:species:remote  # same on production (owner asks only)
pnpm deploy:api           # species:compile, then wrangler deploy (no migrations)
pnpm exec vitest run src/api
```

Before a PR: `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage`, `pnpm knip`, `pnpm cpd`.

## Adding an endpoint (checklist)

1. Schema in `schemas/{resource}.ts` (or `src/lib` if the site shares it).
2. SQL in `db/{resource}.ts` with `bind()` and named columns. New table or index: a new migration.
3. Route in `routes/{resource}.ts`, mounted under `/v1/` in `app.ts`.
4. Errors through `ApiError`, cache header from `lib/cache.ts`. A write route needs `requireToken`, or `requireSiteOrigin` plus a rate limit if browsers call it.
5. `routes/{resource}.test.ts` covering success, 400, 401, and 404.
6. Run the checks above. Apply a new migration locally with `pnpm db:migrate`. Production waits for the owner (`pnpm db:migrate:remote`).
