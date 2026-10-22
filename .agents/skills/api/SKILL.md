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

## OpenAPI and Swagger UI

- `GET /v1/docs` serves Swagger UI (`@hono/swagger-ui`, pinned; assets load from jsDelivr). `GET /v1/docs/openapi.json` serves the OpenAPI 3.1 document. Both are public and send `PUBLIC_CACHE`.
- The document is built in `lib/openapi.ts` from the same Zod schemas the routes validate with (`z.toJSONSchema`, input side). NEVER write a request schema by hand there; import it from `schemas/`.
- The spec is public-only. Admin (`/v1/admin/…`) and ratings (`/v1/ratings…`) routes are listed in `UNDOCUMENTED_PATH_PREFIXES` and MUST NOT appear in it, along with any token scheme.
- Every other route MUST have an entry in `OPERATIONS` (`lib/openapi.ts`) with its method, path, tag, inputs, success status and error statuses. `routes/docs.test.ts` fails when a public route is missing, a documented one no longer exists, path params do not match, or an admin or ratings path leaks into the spec.
- Responses are typed: `schemas/responses.ts` holds strict Zod schemas for every public response, registered as named components (`responseSchemas`), with a `description` (and `examples` where useful) on every field. `schemas/responses.test.ts` parses every real response (all species, all four locales, every catalog view, all field records) against them, so a new or renamed field fails until the schema and its description are updated. Descriptions follow the content rules: state only what the data shows, never invent meaning.
- Examples live in `lib/openapiExamples.ts`. They use real atlas values, shortened to whole sentences and the first array items. The test checks them against the schemas, and the `400`/`404` examples against the real responses.
- The developer guide is `DESCRIPTION` in `lib/openapi.ts` (quick start, versioning, locales, ids and slugs, text format, credits, caching, errors). The docs are public and open source: keep it accurate when behaviour changes.
- Servers are `/` (whatever origin serves the page, so "Try it out" in `pnpm dev:api` hits the local Worker) and `https://api.reptiles.ge`.

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
- **D1 is the source of truth for species.** `pnpm db:import:species` / `db:import:species:remote` was the one-off initial copy from MDX. It deletes and rewrites only the species tables, and its first statement fails once any `species_revisions` row exists, so it can never overwrite API edits. Change content only through `PUT /v1/admin/species/:id`. NEVER edit MDX for species content and NEVER edit species rows by hand.
- `src/api/db/speciesImport.ts` builds the SQL. `src/api/db/speciesCatalog.ts` reads it back. `speciesCatalog.test.ts` imports every species into SQLite and requires `toStrictEqual` with the compiled MDX catalog (`src/lib/speciesImportSource.ts`). A schema or import change that loses a field fails it.
- Add a new species field in this order: migration (new column or table), `speciesSchema.ts` columns, import builder, reader. The round-trip test tells you what is missing.
- `GET /v1/species` and `GET /v1/species/:slug` read only from D1 (`db/species.ts`). The API runtime MUST NOT import the compiled MDX catalog (`species.generated`, `localizeSpecies`, `speciesRoutes`, `speciesImportSource`); the guard test fails if it does, and the Worker stays small (about 170 KB gzip instead of 2.5 MB). Localization reuses the pure `applySpeciesTranslation` (`src/i18n/speciesTranslation.ts`), the same code the site uses.
- `:slug` accepts only the public slug of the requested locale (`X-Locale`, the `slug` field): `slug_ka` (or the id when it is null) for `ka`, the id for `en`/`ru`/`tr`. Case-insensitive. No ids in `ka`, no aliases from `species_slugs` (the site's 301s handle old slugs). Unpublished species answer 404. The site's loader (`src/lib/speciesProfileApi.ts`) maps the id to that slug with `getSpeciesPublicSlug`.
- Public species responses are cached at the edge with `edgeCache()` (`lib/cache.ts`, Hono `cache` with `vary: Origin, X-Locale`) for `s-maxage=3600`, so a public API client sees a write within an hour. The site does not wait: see "Species writes" below.
- `routes/species.test.ts` compares the D1 list and every published profile in all four locales with what the site renders (`toStrictEqual`), including lookalike order. Reverse lookalikes are ordered by id, which matches the alphabetical `LOOKALIKES` keys.
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

- Public D1-backed `GET` routes use `edgeCache(name)` from `lib/cache.ts`, which stores responses in the Workers Cache API keyed by URL, `Origin` and `X-Locale` (Hono `cache` puts each `vary` header value into the key). A cache hit never touches D1. Never cache an authenticated or `no-store` response.
- `etag()` runs on every response. A repeated `GET` with a matching `If-None-Match` gets `304` with no body. Keep responses deterministic (no timestamps or random values in a cacheable body) so the ETag stays stable.
- Public `GET`: `Cache-Control: PUBLIC_CACHE` from `lib/cache.ts`.
- Authenticated or personal responses: `NO_STORE`.
- The Workers Cache API is per data centre: a Worker can only purge entries in the colo it runs in, so a write cannot clear every edge copy. Do not shorten cache times as a workaround. Instead, readers that need fresh data right after a write (the site's server render) send `X-Cache-Bypass: <REVALIDATE_TOKEN>`, which `edgeCache` checks with a constant-time compare. A plain `Cache-Control: no-cache` from the public never skips the cache.

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

### Species writes (phase 2)

- **D1 is the source of truth for species.** Change content only through `PUT /v1/admin/species/:id`. Never through MDX, never with raw SQL.
- `GET /v1/admin/species/:id` returns `{ record, version }`. `PUT` takes `{ record, expectedVersion, actor, source: admin|ai|api, summary }`. Both need `requireToken`. Admin bodies may be up to 1 MB; every other route stays at 16 KB.
- `schemas/speciesRecord.ts` enforces every compile-species rule:
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
- After a write, the API calls the site through the `SITE` Service Binding: `POST /api/revalidate` with `REVALIDATE_TOKEN` and the tags `species`, `species:<id>`, run with `revalidateTag(tag, "max")`. The site's server fetch sends `X-Cache-Bypass: <REVALIDATE_TOKEN>`, so `edgeCache` skips the API edge cache and the re-render reads fresh D1 data. Without the secret the header is ignored.
- `pnpm db:import:species*` is now a one-off. The first statement fails once any `species_revisions` row exists, so an import can never overwrite API edits.
- Photo actions: `POST /v1/admin/species/:id/photos/{cover,order,remove,coordinates}` (body includes `actor`). Each one reads the record, applies a pure operation from `lib/speciesPhotos.ts`, validates the whole record, and saves through the same versioned path as `PUT`, so it gets a revision, a 409 on a race, and page revalidation.
- The local admin (`/admin`, dev only) reads species through `src/lib/adminSpeciesApi.ts`. It calls these endpoints with `API_WRITE_TOKEN` from the developer's local env. Cover, crop, reorder, remove and coordinates no longer open PRs. A crop still opens a catalog-only PR for the AVIF/WebP manifest when it creates new derivatives.

### Catalog (list consumers)

- `GET /v1/catalog?view=card|photos|quiz|full` (locale in `X-Locale`) returns every **published** species in catalog order, localized with `applySpeciesTranslation`, plus `group`, `habitats`, `slug` (KA slug or id) and `lookalikes` (bidirectional ids in the same order as `getSpeciesLookalikes`). It is edge-cached and supports `X-Cache-Bypass`.
  - `card` (default, about 130–210 KB per locale) is for hubs, lists, home, cards and stats. Its fields are `SPECIES_CARD_KEYS` (`commonName, danger, description, family, genus, id, image, imageCredit, location, mobileImage, mobileImageCredit, publishedAt, scientificName, stats, updatedAt`) plus `photoCount`.
  - `photos` (about 0.47–0.59 MB per locale) is the card fields plus `gallery` (`SPECIES_PHOTO_KEYS`), for photo credits: contributor pages, photo-use, news image rights. Credit matching uses the KA view (`getCreditPhotoCatalog()`), because translations localize photographer names.
  - `quiz` (about 0.8–1.4 MB per locale) is the card fields plus `facts`, `gallery` and `identification` (`SPECIES_QUIZ_KEYS`), for the identification quizzes.
  - `full` (up to about 3.6 MB for KA) is only for consumers that need every text, such as search and `llms-full`. **Never** fetch `full` for a normal page render; add the field you need to `card` instead, or add a narrow view the way `quiz` was added. Next does not cache fetch responses over 2 MB.
- Pagination is opt-in: `limit` (1–100) and `cursor` (the `id` of the last entry on the previous page). The response always has `total` (all published species) and `nextCursor` (`null` on the last page or without `limit`). An unknown or unpublished cursor id answers 400 `invalid_request`. Without `limit` the whole catalog comes back in one response, which is what the site uses: every site consumer needs the full list, and the reader loads every row from D1 either way.
- Site loader: `getSpeciesCatalog(locale, view?)` in `src/lib/speciesCatalogApi.ts`. It uses React `cache`, the `species` tag and `revalidate: 3600` (shared `speciesFetchOptions`), and has no MDX fallback.
- `routes/catalog.test.ts` proves every view matches the MDX-era catalog for all locales (`toStrictEqual`).

### Field records

- `species_field_records` (migration `0005`) holds observation, literature and specimen locations: about 13.8k rows for 96 species. It is **a separate resource**, not part of `SpeciesRecord`, so record writes never rewrite them.
- Public read: `GET /v1/species/:slug/field-records` (same slug and `X-Locale` rule) returns `{ data, id, total }`, edge-cached.
- `pnpm db:import:field-records` / `:remote` is a one-off copy from the compiled MDX JSON. Its first statement fails once any field record exists, so it can never duplicate or overwrite rows. `db/fieldRecords.test.ts` round-trips every record 1:1.

### Drafts (AI changes need approval)

- Migration `0004_species_drafts.sql` adds `species_drafts`: a full proposed record, plus its `base_version`, `source`, `actor`, `summary` and a `status` of pending, approved or rejected.
- Endpoints, all token-only:
  - `POST /v1/admin/species/:id/drafts` validates the record and needs `baseVersion` to equal the current version (409 otherwise).
  - `GET /v1/admin/species/:id/drafts` lists the pending drafts.
  - `POST …/drafts/:draftId/approve` saves through the normal versioned path. The revision keeps the draft's `source`/`summary`, the approver becomes the `actor`, and the draft is marked approved **in the same batch**. A draft whose base version is no longer current answers 409 and stays pending.
  - `POST …/drafts/:draftId/reject`.
- **Every AI change MUST land as a draft.** NEVER let AI output call `PUT` or a photo action directly. The selection editor (`src/lib/contentEditorSpecies.ts`) and AI page texts (`processSpeciesTexts`) build the draft record from the API record (`src/lib/speciesRecordFields.ts`) and return `reviewUrl` (`/admin/:id#draft-N`).
- The local admin page lists pending drafts with a field-level diff (`src/lib/speciesDraftDiff.ts`, `AdminSpeciesDrafts`) and approves or rejects them through `/api/admin/species-drafts`.
- Not yet on the API: adding a photo, AI analysis/workflow (it still edits MDX in a worktree), field records (not in D1 yet), and new species creation.

### Species pages (SSR from the API)

- Species profile pages render on the server from the API. `createSpeciesRoute.tsx` calls `getSpeciesProfile(id, locale)` (`src/lib/speciesProfileApi.ts`, wrapped in React `cache`) for the page and for `generateMetadata`. It fetches `ka` (for the Taxon, citations and hero) and the page locale before rendering.
- There is **no MDX fallback**. A 404 from the API is `notFound()`, and any other error fails the render, which vinext does not cache.
- NEVER add `loading.tsx`, `Suspense` fallbacks or client-side fetching for page content. The HTML must arrive complete, as before. Browser requests (forms such as ratings) go to `api.reptiles.ge` directly.
- The fetch uses `next: { revalidate: 3600, tags: ["species", "species:<id>"] }`, so a page catches up with D1 within an hour at the latest. Every API write also calls `revalidateTag` through `/api/revalidate` (see "Species writes").
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
pnpm dev:api              # species:compile, then wrangler dev on :8787 (local D1, no migrations)
pnpm db:migrations:list   # pending migrations on the local D1
pnpm db:migrate           # apply pending migrations to the local D1
pnpm db:migrate:remote    # apply to production reptiles-db (owner asks only)
pnpm db:import:species    # one-off: copy MDX into an empty local D1 (refuses once API edits exist)
pnpm db:import:species:remote  # one-off on production (done; refuses once API edits exist)
pnpm deploy:api           # species:compile, then wrangler deploy (no migrations)
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
