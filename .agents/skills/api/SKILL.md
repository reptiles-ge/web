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

## OpenAPI and Scalar

- `GET /v1/docs` serves the Scalar API reference (`@scalar/hono-api-reference`, pinned; the `@scalar/api-reference` bundle loads from jsDelivr at the exact version in `SCALAR_CDN`). `GET /v1/docs/openapi.json` serves the OpenAPI 3.1 document. Both are public and send `PUBLIC_CACHE`.
- The document is built in `lib/openapi.ts` from the same Zod schemas the routes validate with (`z.toJSONSchema`, input side). NEVER write a request schema by hand there; import it from `schemas/`.
- The spec is public-only. Admin (`/v1/admin/…`) and ratings (`/v1/ratings…`) routes are listed in `UNDOCUMENTED_PATH_PREFIXES` and MUST NOT appear in it, along with any token scheme.
- Every other route MUST have an entry in `OPERATIONS` (`lib/openapi.ts`) with its method, path, tag, inputs, success status and error statuses. `routes/docs.test.ts` fails when a public route is missing, a documented one no longer exists, path params do not match, or an admin or ratings path leaks into the spec.
- Responses are typed: `schemas/responses.ts` holds strict Zod schemas for every public response, registered as named components (`responseSchemas`), with a `description` (and `examples` where useful) on every field. `schemas/responses.test.ts` parses every real response (all species, all four locales, every catalog view, all field records) against them, so a new or renamed field fails until the schema and its description are updated. Descriptions follow the content rules: state only what the data shows, never invent meaning.
- Examples live in `lib/openapiExamples.ts`. They use real atlas values, shortened to whole sentences and the first array items. The test checks them against the schemas, and the `400`/`404` examples against the real responses.
- The developer guide is `DESCRIPTION` in `lib/openapi.ts` (quick start, versioning, locales, ids and slugs, text format, credits, caching, errors). The docs are public and open source: keep it accurate when behaviour changes.
- Servers are `/` (whatever origin serves the page, so "Test Request" in `pnpm dev:api` hits the local Worker) and `https://api.reptiles.ge`.

## Validation

- Every input MUST go through `validate(target, schema)` from `lib/validate.ts` (wraps `@hono/zod-validator`). Read it with `c.req.valid(target)`.
- NEVER call `c.req.json()`, `c.req.query()`, `c.req.param()`, `c.req.parseBody()`, or similar in `routes/`. The guard test fails on them.
- Schemas live in `schemas/`. If the site validates the same input, the schema lives in `src/lib` and both use it (example: `src/lib/ratingInput.ts`).
- Locale input is the `X-Locale` request header, validated with `validate("header", localeHeader)` from `schemas/common.ts`: the four site locales, default `ka`, and anything else is 400 `invalid_request`. NEVER take locale from the query string or path. Localized responses also send `Content-Language`. The site passes it through the typed client: `{ header: { "x-locale": locale } }`. Use `X-Locale`, not `Accept-Language`: browsers send `Accept-Language` on their own in many forms, and every distinct value would be a separate edge-cache entry.
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
- **D1 is the source of truth for species.** It was copied once from MDX, and species MDX was deleted afterwards (S5). Change content only through `PUT /v1/admin/species/:id` or an approved draft. NEVER edit species rows by hand, and NEVER add a file-based species source back.
- `src/api/db/speciesCatalog.ts` reads the catalog; `db/speciesRows.ts` builds the rows for writes. `speciesCatalog.test.ts` reads every species from the test seed, writes the records back into an empty database with the row builder, and requires `toStrictEqual` with the first read. A schema, row or reader change that loses a field fails it.
- Add a new species field in this order: migration (new column or table), `speciesSchema.ts` columns, row builder, reader, and the test seed (`tests/fixtures/speciesSeed.sql`). The round-trip test tells you what is missing.
- `GET /v1/species` and `GET /v1/species/:slug` read only from D1 (`db/species.ts`). The API runtime MUST NOT import site species modules (`speciesPublish`, `speciesSlugTable`, `speciesSlugs.generated`, `speciesRoutes`); the guard test fails if it does, and the Worker stays small (about 190 KB gzip). Localization reuses the pure `applySpeciesTranslation` (`src/i18n/speciesTranslation.ts`), the same code the site uses.
- `:slug` accepts only the public slug of the requested locale (`X-Locale`, the `slug` field): `slug_ka` (or the id when it is null) for `ka`, the id for `en`/`ru`/`tr`. Case-insensitive. No ids in `ka`, no aliases from `species_slugs` (the site's 301s handle old slugs). Unpublished species answer 404. The site's loader (`src/lib/speciesProfileApi.ts`) maps the id to that slug with `getSpeciesPublicSlug`.
- Public species responses are cached at the edge with `edgeCache()` (`lib/cache.ts`, Hono `cache` with `vary: Origin, X-Locale`) for `s-maxage=3600`, so a public API client sees a write within an hour. The site does not wait: see "Species writes" below.
- `routes/species.test.ts` compares the D1 list and every published profile in all four locales with the test fixture (`toStrictEqual`), including lookalike order. Reverse lookalikes are ordered by id.
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
- `app.ts` keeps `secureHeaders()`, `noindex` (`X-Robots-Tag: noindex`), CORS (`GET`/`POST`/`OPTIONS`, echoes an `ALLOWED_ORIGINS` origin with `Access-Control-Allow-Credentials: true`, `*` otherwise, preflight cached 24 h), `bodyLimit` (16 KB), `etag()`, and `onError(handleError)`. Do not remove them. The guard test checks each one.
- The D1 `database_id` in `wrangler.api.jsonc` is an identifier, not a secret. It stays in the repo.

### Admin users and sessions

- Migration `0009_users.sql`: `users` (UUID id, lowercased unique `email`, `name`, `role_id`, `password_hash`, `disabled`), the `user_roles` lookup (`admin` for now; a new role is an `INSERT` in a new migration) and `user_sessions`. No IP addresses or user agents.
- Passwords: PBKDF2-SHA256, 100,000 iterations (the Workers maximum), a random 16-byte salt per hash, stored as `pbkdf2-sha256$100000$salt$hash` (`lib/passwords.ts`). Never store, log or return a plain password.
- `POST /v1/admin/users` (`requireToken`) creates a user: `{ email, name, password (12–256), role }`, 409 `conflict` for an existing email. There is no sign-up route. The owner creates admins with the write token.
- `POST /v1/auth/login` (`requireSiteOrigin`, `rateLimitLogin`: `LOGIN_LIMITER`, 5/min per IP) answers one 401 `Invalid email or password` for a wrong password, an unknown email or a disabled user, and verifies against a dummy hash when the email is unknown so timing does not reveal it.
- A session is a random 32-byte token in the `__Host-reptiles_admin_session` cookie (`HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, 7 days). D1 keeps only its SHA-256 (`token_hash`). The browser never sees `API_WRITE_TOKEN`.
- `requireAdminSession` reads the cookie, rejects a missing, unknown, expired or disabled session (401) and a non-admin role (403), and sets `c.var.user`. `GET /v1/auth/me` returns that user; `POST /v1/auth/logout` (`requireSiteOrigin`, `rateLimitLogin`) deletes the session and clears the cookie.
- The admin app (`admin.reptiles.ge`) sends these requests with `credentials: "include"`. Its origin is in `ALLOWED_ORIGINS`; for local work add `http://localhost:3002` in `.dev.vars`.
- `/v1/auth/` is in `UNDOCUMENTED_PATH_PREFIXES`, like `/v1/admin/`. Every `/v1/admin/…` route stays out of the OpenAPI document and Scalar; `routes/docs.test.ts` fails if one leaks.
- `requireAdmin` (`middleware/requireAdmin.ts`) accepts the write token when an `Authorization` header is present, and otherwise an admin session (`requireAdminSession`). Use it only on admin **reads** the admin app needs. Admin writes stay `requireToken`, except `POST /v1/admin/site/revalidate`, which has its own session and origin checks (below).
- `POST /v1/admin/site/revalidate` (`routes/adminSite.ts`) is the admin app's **Clear site cache** button. It is guarded like logout: `requireSiteOrigin`, `rateLimitAdmin` (`ADMIN_LIMITER`, 5/min per IP), then `requireAdminSession` (no token). It reads every species with a revision in the last 24 hours (`readSpeciesIdsRevisedSince`, index `species_revisions_created` from migration `0012`) and calls the site's `/api/revalidate` with `species` plus `species:<id>` for each, in requests of at most 20 tags. It answers `{ data: { species } }`, or 502 `site_unavailable` when the site cannot be revalidated.
- `GET /v1/admin/species` (`requireAdmin`, `NO_STORE`) lists every species, whatever its status, in catalog order: `id`, KA and EN common names, scientific name, group, status, danger, KA slug, version, hero image, gallery photo count, pending drafts and the last revision time. It is registered before `.use(requireToken)` in `routes/adminSpecies.ts`, so the token-only routes after it never accept a session (tested).
- `GET /v1/admin/ratings` (`requireAdmin`, `NO_STORE`, `routes/adminRatings.ts`) lists site ratings newest first: `id`, `rating`, `path`, `locale`, `feedback`, `country`, `createdAt`. `limit` (1–100, default 50), `cursor` (the `id` of the last rating on the previous page) and `rating` (1–5). It returns `nextCursor`, `total` (matches for the filter) and an all-time `summary` (`average`, `byRating`, `count`). Migration `0011` indexes `site_ratings (rating, id)`.

## Caching

- Public D1-backed `GET` routes use `edgeCache(name)` from `lib/cache.ts`, which stores responses in the Workers Cache API keyed by URL, `Origin` and `X-Locale` (Hono `cache` puts each `vary` header value into the key). A cache hit never touches D1. Never cache an authenticated or `no-store` response.
- `etag()` runs on every response. A repeated `GET` with a matching `If-None-Match` gets `304` with no body. Keep responses deterministic (no timestamps or random values in a cacheable body) so the ETag stays stable.
- Public `GET`: `Cache-Control: PUBLIC_CACHE` from `lib/cache.ts`.
- Authenticated or personal responses: `NO_STORE`.
- The Workers Cache API is per data centre: a Worker can only purge entries in the colo it runs in, so a write cannot clear every edge copy. Do not shorten cache times as a workaround. Instead, the site's `/api/revalidate` refetches the affected responses with `X-Cache-Bypass: <REVALIDATE_TOKEN>` (`refreshSpeciesApiCache` in `src/lib/speciesApiRefresh.ts`), which `edgeCache` checks with a constant-time compare. Normal server renders do not send it; they read the edge cache. A plain `Cache-Control: no-cache` from the public never skips the cache.

## Calling the API from the site

- The site calls the API only through `src/lib/apiClient.ts`: `createApiClient({ fetch?, origin?, token? })` returns a typed `hc<AppType>` client. The origin comes from `NEXT_PUBLIC_API_ORIGIN` (via `publicEnv()`), default `https://api.reptiles.ge`.
- NEVER call the API with raw `fetch("https://api.reptiles.ge/…")`, and NEVER import `@/api/…` runtime code into the site. `apiClient.ts` imports only `type { AppType }`. The guard test fails otherwise.
- Because the client is typed from `AppType`, a changed route, query, or body breaks `pnpm typecheck` on the site side. Fix the caller; do not cast around it.
- Routes MUST keep chained methods and an explicit status in `c.json(body, status)`, or the client loses its types.

### Ratings flow

- `SiteRating.tsx` posts straight to `https://api.reptiles.ge/v1/ratings` with `createApiClient()`. There is no `/api/rating` route on the site any more, and the site Worker has no rating code or bindings.
- The API owns the whole flow: origin check, `RATING_VISITOR_LIMITER` (3/min per IP) and `RATING_GLOBAL_LIMITER` (30/min), validation with `src/lib/ratingInput.ts`, the D1 insert (country from `cf-ipcountry`, never from the body), and the Telegram notice in `c.executionCtx.waitUntil` (`inBackground`).
- Telegram secrets live on `reptiles-api`: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (`wrangler secret put … --config wrangler.api.jsonc`). Without them the rating is still stored and the miss is logged.
- `ALLOWED_ORIGINS` is a var in `wrangler.api.jsonc` (`https://reptiles.ge,https://admin.reptiles.ge`). For local work, add your dev origin in `.dev.vars`, and point the site at the local API with `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787`.
- The site CSP `connect-src` allows `https://api.reptiles.ge` (and `http://localhost:8787` in development). Keep it in sync if the API origin changes.

### Species writes (phase 2)

- **D1 is the source of truth for species.** Change content only through `PUT /v1/admin/species/:id` or an approved draft. Never with raw SQL.
- `GET /v1/admin/species/:id` returns `{ record, version }`. `PUT` takes `{ record, expectedVersion, actor, source: admin|ai|api, summary }`. Both need `requireToken`. Admin bodies may be up to 1 MB; every other route stays at 16 KB.
- `schemas/speciesRecord.ts` enforces every rule the old MDX compiler had:
  - strict keys;
  - required fields and dates;
  - photo credits with paired lat/lng;
  - colors from `SPECIES_COLORS`;
  - `sourcesAreValid` (`src/lib/speciesSources.ts`, shared with the compiler);
  - `danger` only for groups with a venom concept;
  - a KA slug when published;
  - faq/facts/stats/traits count parity across locales;
  - colors equal across locales;
  - overlay gallery srcs that exist in KA;
  - no duplicates or self lookalikes.
- `db/speciesWrite.ts` writes the whole record in **one D1 batch** (one transaction):
  1. a `species_revisions` row, whose `version` comes from `(SELECT version + 1 … WHERE version = expected)`, so a stale version fails `NOT NULL` and aborts the batch;
  2. the `species` update;
  3. child deletes and parameterized inserts (≤ 99 bound values each).

  A stale version answers 409 `version_conflict` with `currentVersion`, both when the pre-check sees it and when a concurrent write wins the race between check and batch. Any database error rolls everything back.

- `db/speciesRows.ts` is the single row builder used by both the import and the writes. Overlays point at media with a subquery, so media ids are never assigned by hand.
- Species writes **do not** revalidate the site. The `species` tag is on every catalog fetch, so revalidating after each write purged most of the site (owner decision, #1574). The admin presses **Clear site cache** in the admin app when a batch of edits is done. That calls `POST /v1/admin/site/revalidate` (see "Admin users and sessions"), which calls the site through the `SITE` Service Binding: `POST /api/revalidate` with `REVALIDATE_TOKEN`, run with `revalidateTag(tag, "max")`. Before purging, the site refetches the catalog and the edited profiles with `X-Cache-Bypass: <REVALIDATE_TOKEN>`, so the next render reads fresh D1 data. Until then, an edited page catches up within the fetch TTL (3600 s) plus up to 3600 s in the API edge cache.
- Photo actions: `POST /v1/admin/species/:id/photos/{cover,order,remove,coordinates}` (body includes `actor`). Each one reads the record, applies a pure operation from `lib/speciesPhotos.ts`, validates the whole record, and saves through the same versioned path as `PUT`, so it gets a revision and a 409 on a race. Like `PUT`, it does not revalidate the site.
- The local admin (`/admin`, dev only) reads species through `src/lib/adminSpeciesApi.ts`. It calls these endpoints with `API_WRITE_TOKEN` from the developer's local env. Cover, crop, reorder, remove and coordinates no longer open PRs. A crop still opens a catalog-only PR for the AVIF/WebP manifest when it creates new derivatives.

### Catalog (list consumers)

- `GET /v1/catalog?view=card|photos|quiz|full` (locale in `X-Locale`) returns every **published** species in catalog order, localized with `applySpeciesTranslation`, plus `group`, `habitats`, `slug` (KA slug or id) and `lookalikes` (bidirectional ids: the species' own list first, then reverse links ordered by id, unpublished peers left out). The site reads lookalikes only from this field; there is no list in code. It is edge-cached and supports `X-Cache-Bypass`.
  - `card` (default, about 130–210 KB per locale) is for hubs, lists, home, cards and stats. Its fields are `SPECIES_CARD_KEYS` (`commonName, danger, description, family, genus, id, image, imageCredit, location, mobileImage, mobileImageCredit, publishedAt, scientificName, stats, updatedAt`) plus `photoCount`.
  - `photos` (about 0.47–0.59 MB per locale) is the card fields plus `gallery` (`SPECIES_PHOTO_KEYS`), for photo credits: contributor pages, photo-use, news image rights. Credit matching uses the KA view (`getCreditPhotoCatalog()`), because translations localize photographer names.
  - `quiz` (about 0.8–1.4 MB per locale) is the card fields plus `facts`, `gallery` and `identification` (`SPECIES_QUIZ_KEYS`), for the identification quizzes.
  - `full` (up to about 3.6 MB for KA) is only for consumers that need every text, such as search and `llms-full`. **Never** fetch `full` for a normal page render; add the field you need to `card` instead, or add a narrow view the way `quiz` was added. Next does not cache fetch responses over 2 MB.
- Pagination is opt-in: `limit` (1–100) and `cursor` (the `id` of the last entry on the previous page). The response always has `total` (all published species) and `nextCursor` (`null` on the last page or without `limit`). An unknown or unpublished cursor id answers 400 `invalid_request`. Without `limit` the whole catalog comes back in one response, which is what the site uses: every site consumer needs the full list, and the reader loads every row from D1 either way.
- Site loader: `getSpeciesCatalog(locale, view?)` in `src/lib/speciesCatalogApi.ts`. It uses React `cache`, the `species` tag and `revalidate: 3600` (shared `speciesFetchOptions`), and has no fallback.
- `routes/catalog.test.ts` checks every view against the test fixture in all locales (`toStrictEqual`).

### Field records

- `species_field_records` (migration `0005`) holds observation, literature and specimen locations: about 13.8k rows for 96 species. It is **a separate resource**, not part of `SpeciesRecord`, so record writes never rewrite them.
- Public read: `GET /v1/species/:slug/field-records` (same slug and `X-Locale` rule) returns `{ data, id, total }`, edge-cached.
- They were copied once from MDX. The site reads them through `getSpeciesFieldRecords(id)` (`src/lib/speciesFieldRecordsApi.ts`) for the profile map, and through `/api/occurrences/{id}/{locale}` for the map's records.

### Authors

- Migration `0006_authors.sql` adds `authors` (id = contributor page slug, `kind`, `role`, `job_title`, **`is_contributor`**, portrait, links), `author_texts` (name, bio and meta description per locale; `ka` required), `author_aliases` (every spelling used in photo credits) and `author_affiliations`, with lookup tables for kinds, roles, job titles and affiliations. `species_media` and `species_media_overlays` gain a nullable `author_id`.
- `is_contributor = 1` means the author has a contributor page on reptiles.ge. Everyone else credited on a photo is an author too, with `is_contributor = 0`.
- `author_id` is derived, never sent by clients: it is the `author_aliases` owner of the row's `credit_person`. Every species write relinks that species in the same batch (`relinkSpeciesAuthors`), and every author write relinks all photos (`RELINK_MEDIA_AUTHORS`). The credit text itself is unchanged.
- `0007_authors_backfill.sql` was a one-off backfill from the contributor registry, the old credit-name translations and the photo credits. Its generator was deleted once it was applied; new authors and aliases go through `PUT /v1/admin/authors/:id`.
- Every photo credit in API responses carries `authorId`. Outside Georgian, `photographer` is the author's name in that locale (`author_texts`) when there is one, looked up by the credit text through `author_aliases` (`readCreditPersonNames`, passed to `applySpeciesTranslation`); otherwise the credit text is kept. Place names are still localized in code (`creditNames.ts`).
- Public: `GET /v1/authors` (`?contributor=true`) and `GET /v1/authors/:id`, edge-cached, localized by `X-Locale` with the Georgian name as fallback. Admin (token): `GET` and `PUT /v1/admin/authors/:id` (whole record; an alias owned by another author is a 400). A write revalidates the site with `authors`, `author:<id>`, `species` and `news`, because relinking photo credits changes species and news responses too. The site's `/api/revalidate` refreshes `/v1/contributors` and `/v1/contributors/:id` in every locale at the edge.
- `GET /v1/contributors` (`routes/contributors.ts`, `listContributors` in `db/authors.ts`) returns every contributor as a full profile (the `/v1/authors/:id` fields plus `speciesCount`) in one response, most credited photos first (ties by id), edge-cached. Optional `limit` (1–100) keeps the first ones; `total` always counts all contributors. `GET /v1/contributors/:id` returns one contributor in the same shape, and 404 for an author without a contributor page. The counts match the site's contributor cards (tested). Never load contributors one profile at a time.
- The site reads contributors only from these endpoints (`src/lib/authorsApi.ts`: `getContributors(locale)` and `getContributorDirectory(locale)` from one `/v1/contributors` request, `getContributor(id, locale)` (contributor pages) from `/v1/contributors/:id`). Contributor pages, credit links, photo alt text, image rights JSON-LD, search, the sitemap and photo-use all take that data; client components read the directory from `ContributorsProvider`. A credit links to a contributor by `authorId`, or by its spelling when it has none (news MDX credits).

### News

- Migration `0008_news.sql` adds `news_articles`, `news_texts`, `news_sections` (blocks as a JSON array), `news_media` + `news_media_alts`, `news_sources`, `news_hubs`, `news_regions`, `news_species` and the `news_series` lookup. `docs/NEWS-D1-MIGRATION.md` is the plan.
- `db/newsRows.ts` is the single row builder (`NewsRecord = { article: NewsArticle, position }`); `db/news.ts` reads (`readNewsRecords`). `news.test.ts` requires the import of `news.generated.ts` to read back `toStrictEqual`.
- `news_media.author_id` is derived like `species_media.author_id`: `RELINK_MEDIA_AUTHORS` includes `RELINK_NEWS_MEDIA_AUTHORS`.
- `db:import:news` is a one-off with a guard (`news_import_runs`): it fails when `news_articles` has rows. News MDX is still the live source until the site reads from the API (phase 3).
- Writes are validated with `schemas/newsRecord.ts` (`newsArticleSchema`), which runs the shared rules in `src/lib/newsRules.ts`.
- Public read (`routes/news.ts`, `db/newsView.ts`), edge-cached:
  - `GET /v1/news` lists published articles that have text in the `X-Locale` locale, newest first (ties by `position`), without `sections`, with `readMinutes` (title, lead and body at 150 words a minute, `src/lib/newsReadTime.ts`, the same count the site uses). Filters `hub`, `region`, `species` (related, or linked in that locale's text), `series` and `author` (id or credit spelling, the same text match as the site, `src/lib/newsAuthorMentions.ts`) combine. `limit` / `cursor` (a slug) work like `/v1/catalog`; `total` counts every match.
  - `GET /v1/news/:slug` returns one published article with `sections` and `gallery`. Without text in the requested locale it falls back to Georgian, and `locale` and `Content-Language` say `ka`. Drafts and unknown slugs answer 404.
  - Texts, photo `alt`, source names and the series name are localized. Photo credits are returned as published (not translated), with `authorId`. Paragraphs are `NewsMark` arrays, not the Markdown text format of species.
- `routes/news.test.ts` compares the list, every filter and every article in all four locales with the site's own news functions (`src/data/news.ts`). Tests get a seeded database from `createNewsTestDatabase()`.
- Writes (`routes/adminNews.ts`, `db/newsWrite.ts`, `requireToken`). Migration `0010_news_revisions.sql` adds `news_articles.version` and `news_revisions`:
  - `POST /v1/admin/news` with `{ actor, article, source, summary }` validates the article (`newsArticleSchema`, then `newsReferenceIssues` against published species and contributors in D1, hubs and `REGION_IDS`), refuses an existing slug with 409 `conflict`, and creates it as a **draft** at the end of the order, version 1, with its first revision and author links, in one batch. `?dryRun=true` runs every check and answers 200 without writing.
  - `POST /v1/admin/news/:slug/status` with `{ actor, expectedVersion, source, status, summary }` publishes or unpublishes. A stale version is 409 `version_conflict` with `currentVersion`. It revalidates the site with the `news` and `news:<slug>` tags; the site's `/api/revalidate` accepts them and refreshes the news list and that article in every locale at the edge.
  - `pnpm news:import <slug> [--dry-run] [--publish] [--actor <name>]` (`scripts/news-import.ts`, through `src/lib/adminNewsApi.ts`) parses `src/content/news/<slug>/*.mdx` with `newsArticleFromMdx` and calls these endpoints with `API_WRITE_TOKEN`. It uses `NEXT_PUBLIC_API_ORIGIN` when set, production otherwise. It does not delete the MDX while the site still lists news from it.

### Drafts (AI changes need approval)

- Migration `0004_species_drafts.sql` adds `species_drafts`: a full proposed record, plus its `base_version`, `source`, `actor`, `summary` and a `status` of pending, approved or rejected.
- Endpoints, all token-only:
  - `POST /v1/admin/species/:id/drafts` validates the record and needs `baseVersion` to equal the current version (409 otherwise).
  - `GET /v1/admin/species/:id/drafts` lists the pending drafts.
  - `POST …/drafts/:draftId/approve` saves through the normal versioned path. The revision keeps the draft's `source`/`summary`, the approver becomes the `actor`, and the draft is marked approved **in the same batch**. A draft whose base version is no longer current answers 409 and stays pending.
  - `POST …/drafts/:draftId/reject`.
- **Every AI change MUST land as a draft.** NEVER let AI output call `PUT` or a photo action directly. The selection editor (`src/lib/contentEditorSpecies.ts`) and AI page texts (`processSpeciesTexts`) build the draft record from the API record (`src/lib/speciesRecordFields.ts`) and return `reviewUrl` (`/admin/:id#draft-N`).
- The local admin page lists pending drafts with a field-level diff (`src/lib/speciesDraftDiff.ts`, `AdminSpeciesDrafts`) and approves or rejects them through `/api/admin/species-drafts`.
- Not yet on the API: adding a photo, adding field records, AI analysis and workflow, and new species creation. Their local admin routes answer 503 until the admin phase.

### Species pages (SSR from the API)

- Species profile pages render on the server from the API. `createSpeciesRoute.tsx` calls `getSpeciesProfile(id, locale)` (`src/lib/speciesProfileApi.ts`, wrapped in React `cache`) for the page and for `generateMetadata`. It fetches `ka` (for the Taxon, citations and hero) and the page locale before rendering.
- There is **no fallback**. A 404 from the API is `notFound()`, and any other error fails the render, which vinext does not cache.
- NEVER add `loading.tsx`, `Suspense` fallbacks or client-side fetching for page content. The HTML must arrive complete, as before. Browser requests (forms such as ratings) go to `api.reptiles.ge` directly.
- The fetch uses `next: { revalidate: 3600, tags: ["species", "species:<id>"] }`, so a page catches up with D1 within an hour at the latest, plus up to an hour in the API edge cache. **Clear site cache** in the admin app revalidates at once (see "Species writes").
- Still local for now: lookalike and related cards, slugs and 301s, hubs, search, sitemap (phases 3–4).
- Tests mock the API with `tests/msw/reptilesApi.ts`, which forwards `https://api.reptiles.ge/*` to the real Hono app on a seeded SQLite database.

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
pnpm dev:api              # wrangler dev on :8787 (local D1, no migrations)
pnpm db:migrations:list   # pending migrations on the local D1
pnpm db:migrate           # apply pending migrations to the local D1
pnpm db:migrate:remote    # apply to production reptiles-db (owner asks only)
pnpm db:seed:local        # load tests/fixtures/speciesSeed.sql into an empty local D1 (never production)
pnpm deploy:api           # wrangler deploy (no migrations)
pnpm exec vitest run src/api
```

Before a PR: `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage`, `pnpm knip`, `pnpm cpd`.

## Adding an endpoint (checklist)

1. Schema in `schemas/{resource}.ts` (or `src/lib` if the site shares it).
2. SQL in `db/{resource}.ts` with `bind()` and named columns. New table or index: a new migration.
3. Route in `routes/{resource}.ts`, mounted under `/v1/` in `app.ts`.
4. Errors through `ApiError`, cache header from `lib/cache.ts`. A write route needs `requireToken`, or `requireSiteOrigin` plus a rate limit if browsers call it.
5. A public route: its operation in `OPERATIONS` in `lib/openapi.ts`. A private or site-only route: a prefix in `UNDOCUMENTED_PATH_PREFIXES`.
6. `routes/{resource}.test.ts` covering success, 400, 401, and 404.
7. Run the checks above. Apply a new migration locally with `pnpm db:migrate`. Production waits for the owner (`pnpm db:migrate:remote`).
