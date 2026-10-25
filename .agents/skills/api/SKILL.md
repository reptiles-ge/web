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
  - **Public from the browser** (beacons such as views): `requireSiteOrigin` (Origin must be in `ALLOWED_ORIGINS`, else 403 `forbidden`) **and** a Cloudflare rate limit middleware (429 `rate_limited`, fails open when the binding errors), then Zod validation. The Origin check alone is not protection; the rate limit is. Ratings add `requireSiteKey` in front (only `SITE_API_KEY`, 401 `unauthorized` otherwise), because they reach the API through the site's `/api/rating` proxy, not from the browser.
- NEVER put `API_WRITE_TOKEN` or any secret in browser code or a `NEXT_PUBLIC_*` variable.
- Secrets: `.dev.vars` locally (gitignored) and `wrangler secret put … --config wrangler.api.jsonc` in production. NEVER put a secret in code, config, tests, commits, PR text, or chat. Never read `process.env`; use `c.env`.
- `app.ts` keeps `secureHeaders()`, `noindex` (`X-Robots-Tag: noindex`), CORS (`GET`/`POST`/`OPTIONS`, echoes an `ALLOWED_ORIGINS` origin with `Access-Control-Allow-Credentials: true`, `*` otherwise, preflight cached 24 h), `bodyLimit` (16 KB), `etag()`, and `onError(handleError)`. Do not remove them. The guard test checks each one.
- The D1 `database_id` in `wrangler.api.jsonc` is an identifier, not a secret. It stays in the repo.

### API keys (public data for registered clients)

- Migration `0015_api_keys.sql`: `api_keys` (UUID id, `name`, `note`, `key_prefix`, unique `key_hash`, `created_by`, `created_at`, `expires_at`, `revoked_at`, `last_used_at`). One row is one key; rotate by creating a new key and revoking the old one. No contact emails or other personal data.
- A key is `rpt_` plus 32 random bytes in base64url (`lib/apiKeys.ts`). D1 keeps only its SHA-256. The full key is returned once, by the create call; lists show `keyPrefix` only.
- Clients send it in `X-Api-Key`, never `Authorization`: `edgeCache` skips the cache for any request with `Authorization`, so a bearer key would send every request to D1. CORS does not allow `X-Api-Key`, so keys cannot be used from browser code.
- `requireApiKey` (`middleware/requireApiKey.ts`) runs from `app.ts` on every `/v1/` path except `/v1/admin`, `/v1/auth`, `/v1/docs` and `/v1/views` (a browser beacon with its own origin and rate limit checks) (`needsApiKey`). A new public route needs a key by default.
- `API_KEY_MODE` (var in `wrangler.api.jsonc`): `off` (default, nothing checked), `log` (requests without a valid key are answered and logged with `console.warn`), `enforce` (401 `unauthorized`: `Missing API key` / `Invalid API key`). A revoked or expired key is invalid.
- The site and the build scripts send `SITE_API_KEY` (a secret on both `reptiles-api` and the site Worker, and in CI for `pnpm compile`). `createApiClient` adds it on the server only (`typeof window === "undefined"`); browser calls never carry it. The site key has no rate limit.
- Client keys are rate limited per key id with `API_KEY_LIMITER` (120/min). Lookups are cached per isolate for 60 s, so a revoke takes effect within a minute. `last_used_at` is updated at most once a day per key, in the background.
- Admin (`routes/adminApiKeys.ts`, undocumented): `GET /v1/admin/api-keys` (`requireAdmin`, `NO_STORE`) lists keys newest first, one page at a time, with `q` (client, note or key prefix); `POST /v1/admin/api-keys` (`{ name, note?, expiresAt? }`) and `POST /v1/admin/api-keys/:id/revoke` are guarded like the cache endpoints (`requireSiteOrigin`, `rateLimitAdmin`, `requireAdminSession`), so the admin app's API keys page can call them. The token alone cannot create keys.
- Rollout: set `SITE_API_KEY` on both Workers and in CI, deploy, switch to `log`, issue client keys, read the logs, then `enforce`. Before `enforce`, add the `X-Api-Key` scheme and a quick-start note to `DESCRIPTION` and the OpenAPI document so Scalar's "Test Request" can send it. Production runs `enforce` since 2026-10-24; CI (`lint.yml`, `e2e.yml`) and the site build read `SITE_API_KEY` from their secrets.

### Admin users and sessions

- Migration `0009_users.sql`: `users` (UUID id, lowercased unique `email`, `name`, `role_id`, `password_hash`, `disabled`), the `user_roles` lookup (`admin` for now; a new role is an `INSERT` in a new migration) and `user_sessions`. No IP addresses or user agents.
- Passwords: PBKDF2-SHA256, 100,000 iterations (the Workers maximum), a random 16-byte salt per hash, stored as `pbkdf2-sha256$100000$salt$hash` (`lib/passwords.ts`). Never store, log or return a plain password.
- `POST /v1/admin/users` (`requireToken`) creates a user: `{ email, name, password (12–256), role }`, 409 `conflict` for an existing email. There is no sign-up route. The owner creates admins with the write token.
- `POST /v1/auth/login` (`requireSiteOrigin`, `rateLimitLogin`: `LOGIN_LIMITER`, 5/min per IP) answers one 401 `Invalid email or password` for a wrong password, an unknown email or a disabled user, and verifies against a dummy hash when the email is unknown so timing does not reveal it.
- A session is a random 32-byte token in the `__Host-reptiles_admin_session` cookie (`HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, 7 days). D1 keeps only its SHA-256 (`token_hash`). The browser never sees `API_WRITE_TOKEN`.
- `requireAdminSession` reads the cookie, rejects a missing, unknown, expired or disabled session (401) and a non-admin role (403), and sets `c.var.user`. `GET /v1/auth/me` returns that user; `POST /v1/auth/logout` (`requireSiteOrigin`, `rateLimitLogin`) deletes the session and clears the cookie.
- The admin app (`admin.reptiles.ge`) sends these requests with `credentials: "include"`. Its origin is in `ALLOWED_ORIGINS`; for local work add `http://localhost:3002` in `.dev.vars`.
- `/v1/auth/` is in `UNDOCUMENTED_PATH_PREFIXES`, like `/v1/admin/`. Every `/v1/admin/…` route stays out of the OpenAPI document and Scalar; `routes/docs.test.ts` fails if one leaks.
- `requireAdmin` (`middleware/requireAdmin.ts`) accepts the write token when an `Authorization` header is present, and otherwise an admin session (`requireAdminSession`). Use it only on admin **reads** the admin app needs. Admin writes stay `requireToken`, except the cache endpoints, draft merge and reject, the photo upload, photo credit edit and delete, the iNaturalist photo import and the admin app's text edits, which have their own session, origin and rate-limit checks (below).
- `POST /v1/admin/site/revalidate` (`routes/adminSite.ts`) is the **Clear species cache** button on the admin Species page. It is guarded like logout: `requireSiteOrigin`, `rateLimitAdmin` (`ADMIN_LIMITER`, 5/min per IP), then `requireAdminSession` (no token). It reads every species with a revision in the last 24 hours (`readSpeciesIdsRevisedSince`, index `species_revisions_created` from migration `0012`) and calls the site's `/api/revalidate` with `species` plus `species:<id>` for each, in requests of at most 20 tags. It answers `{ data: { species } }`, or 502 `site_unavailable` when the site cannot be revalidated.
- `GET /v1/admin/site/pages` (`requireAdmin`) returns the site's page groups from `src/lib/sitePageGroups.ts` (`SITE_PAGE_GROUPS`: Home, About, Contact, legal, Species atlas, each animal section, safety guides, News, Contributors, Regions, Quizzes, Whole site), each with its routes (`{ path, type: "page" | "layout" }`). `POST /v1/admin/site/pages/:id/revalidate` (same guards as the other cache endpoints) answers 404 for an unknown group and otherwise calls the site's `/api/revalidate` with `{ groups: [id] }`. The site accepts only registry ids there (never free paths) and runs `revalidatePath(path, type)` for each route. vinext tags every cached page with its route path (`_N_T_/[locale]/about/page`, `_N_T_/[locale]/snakes/layout`, `_N_T_/layout`), so a page route clears that page in every locale and a layout route clears everything under it. `src/lib/sitePageGroups.test.ts` fails when a route no longer matches a folder under `src/app`.
- `GET /v1/admin/species` (`requireAdmin`, `NO_STORE`) lists every species, whatever its status, in catalog order, one page at a time, with `group`, `status` and `q` (id, scientific name, KA or EN common name): `id`, KA and EN common names, scientific name, group, status, danger, KA slug, version, hero image, gallery photo count, pending drafts and the last revision time. It is registered before `.use(requireToken)` in `routes/adminSpecies.ts`, so the token-only routes after it never accept a session (tested).
- `GET /v1/admin/species/:id/field-records` (`requireAdmin`, `NO_STORE`) returns every field record of a species, any status, in position order: `{ data, id, total }`, 404 for an unknown species. It feeds the Locations tab of the admin species page; the admin app never reads the public API.
- `POST /v1/admin/species/:id/revalidate` has the same guards as the other admin cache endpoints, answers 404 for an unknown species, purges that species' API cache (`species:<id>`, `catalog`, `images`, see "Caching") and revalidates `species` and `species:<id>`: its profile pages in every locale and every page built from the catalog (hubs, indexes, cards, lookalikes, photo counts), so a new photo, order or cover shows everywhere.
- `GET /v1/admin/news` (`requireAdmin`, `NO_STORE`) lists every news article, drafts included, newest `publishedAt` first (ties by `position`), one page at a time, with `status`, `series` and `q` (slug, KA or EN title): `id`, `status`, `publishedAt`, `updatedAt`, `series`, `version`, KA and EN `title`, `locales` with text, cover `image`, gallery `photoCount` and `lastEditedAt` (newest revision). It is registered before `.use(requireToken)` in `routes/adminNews.ts`, so the token-only writes after it never accept a session (tested).
- `POST /v1/admin/news/revalidate` is the **Clear news cache** button on the admin News page. It has the same guards and revalidates the site with `news` alone: the news index, the archive pages and every article (each article fetch carries `news` too). The site refetches the news list at the edge first. It answers `{ data: { tags: ["news"] } }`, or 502 `site_unavailable`. Pages that read news from the compiled MDX (home, hubs, species, regions, authors, sitemap, feeds) change only on deploy.
- `POST /v1/admin/news/:slug/revalidate` (`routes/adminNews.ts`, also before `.use(requireToken)`) is the **Clear cache** action on a News row in the admin app. It is guarded like `POST /v1/admin/site/revalidate`: `requireSiteOrigin`, `rateLimitAdmin`, `requireAdminSession`. It answers 404 for an unknown slug. Otherwise it calls the site's `/api/revalidate` with `news:<slug>` only, so the site refetches that article in every locale and purges its pages; news lists (tag `news`) are not cleared. It answers `{ data: { id } }`, or 502 `site_unavailable`.
- `GET /v1/admin/authors` (`requireAdmin`, `NO_STORE`, `routes/adminAuthors.ts`, before `.use(requireToken)`) lists authors one page at a time (see "Pagination"), contributors first, then by photo count and id: `id`, KA and EN `name`, `kind`, `role`, `jobTitle`, `isContributor`, portrait `image`, `aliasCount` and `photoCount` (distinct species photos, audio excluded). Filters `contributor` (`true`/`false`), `kind`, `role` and `q` (id, KA or EN name, substring) run in SQL and combine; `total` counts the matches.
- `POST /v1/admin/authors/:id/revalidate` and `POST /v1/admin/authors/revalidate` are the admin Authors page's cache buttons. They have the same guards as the news cache endpoints. `/:id` answers 404 for an unknown author and revalidates `author:<id>` (that contributor page). `/revalidate` revalidates `authors`, which is on every contributor-list fetch: contributor pages, every species profile, news articles, home, about, contact, photo-use, search and the sitemap, so most of the site.
- Every admin cache endpoint turns a failed site call into 502 `site_unavailable` through `ensureSiteRevalidated` (`lib/revalidateSite.ts`).
- **Text edits from the admin app**, like draft merges, are content writes a session may make. Each is registered before `.use(requireToken)` and guarded like the cache endpoints: `requireSiteOrigin`, `rateLimitAdmin`, `requireAdminSession`. The session user's `name` becomes the revision `actor` and the `source` is `admin`. They change text only and never revalidate the site; the admin presses **Clear cache** afterwards.
  - `POST /v1/admin/species/:id/texts` with `{ expectedVersion, locale, summary, texts }` replaces one locale's text fields (`commonName`, the long texts, `facts`, `faq`, `stats`, `identification` without `colors`). `lib/speciesTexts.ts` refuses a different number of facts, questions, stats or traits, or adding or removing `identification`; the whole record is then checked with `speciesRecordSchema` and saved through the versioned path (409 `version_conflict` when stale).
  - `POST /v1/admin/authors/:id/texts` with `{ texts }` replaces `author_texts` only (`writeAuthorTexts`, one batch), after the merged author passes `authorRecordSchema`. Aliases, links and photo credits are untouched, so nothing is relinked.
  - `GET /v1/admin/news/:slug` (`requireAdmin`, `NO_STORE`) returns `{ article, version }`, drafts included. `POST /v1/admin/news/:slug/copy` with `{ copy, expectedVersion, summary }` replaces `news_texts` and `news_sections` (`writeNewsCopy`, one batch with a `news_revisions` row). `lib/newsCopy.ts` refuses adding or removing a locale, a different section count, or any change to the order of figures; the merged article must pass `newsArticleSchema` and `newsReferenceIssues`. Photos, sources, related ids, dates and status never change here.
- `GET /v1/admin/ratings` (`requireAdmin`, `NO_STORE`, `routes/adminRatings.ts`) lists site ratings newest first, one page at a time: `id`, `rating`, `path`, `locale`, `feedback`, `country`, `createdAt`. Filters `rating` (1–5) and `q` (feedback or path). The page's `total` counts the matches; `summary` (`average`, `byRating`, `count`) is all-time. Migration `0011` indexes `site_ratings (rating, id)`.

## Pagination

- Page-numbered lists (admin tables) use the shared helper. Do not write offset, page count or limit code per route.
  - Constants, types and the response builder live in `src/lib/pagination.ts`, shared with the admin app: `DEFAULT_PAGE_SIZE` (50), `MAX_PAGE_SIZE` (100), `PAGE_SIZE_OPTIONS`, `PageParams`, `Page<T>`, `pageOffset()` and `toPage()`.
  - Query: extend `pageQuery` from `schemas/common.ts` (`page` from 1, default 1; `limit` 1–100, default 50) with the route's filters.
  - SQL: `LIMIT ? OFFSET ?` bound with `limit` and `pageOffset(page)`, plus a `COUNT(*)` with the same `WHERE`, in `db/`. Return `toPage(data, total, page)`. A `q` substring search binds `containsPattern(q)` from `db/search.ts` with `LIKE ? ESCAPE '\\'`.
  - Response: `{ data, limit, page, pageCount, total }`. A page past the end is an empty `data`, not an error.
  - Every admin list is paged this way: species, news, drafts, authors, ratings, views and API keys. `readPage(db, { select, from, order }, params, page)` (`db/paging.ts`) runs the page and its `COUNT(*)` with the same `WHERE`; bind the filters as `?1`, `?2`, … in `from`.
- Admin app: fetch functions take a `PagedQuery<Filters>` and send it with `toQueryParams()` (`src/admin/pagination.ts`). Pages use `usePagedList(fetch, onSessionExpired)` (`src/admin/usePagedList.ts`: page, size, server filters, search debounced by 300 ms; `lastPage` keeps any extra response field, such as the views total or the ratings summary) and pass `serverPaging(list, readFilters)` to `AdminListView`; a filter column spreads `serverFilter(selected, values)` (`listColumns.tsx`). A screen that needs a whole list (the species link targets in the news editor) reads every page with `fetchAllPages()`.
- `/v1/news` is page-numbered with the same helper (`pageQuery`, `pageOffset()`, `toPage()`), plus `q` and `facets.hub`. The site's `/news` reads it 24 at a time (`NEWS_PAGE_SIZE`); the browser goes through the site's `/api/news/[locale]` (no key in the browser), with the search debounced by 300 ms (`lodash/debounce`).
- Public lists that are read in full or followed page by page (`/v1/catalog`) keep their `cursor` pagination.

## Caching

- Public D1-backed `GET` routes use `edgeCache(name)` from `lib/cache.ts`, which stores responses in the Workers Cache API keyed by URL, `Origin` and `X-Locale` (Hono `cache` puts each `vary` header value into the key). A cache hit never touches D1. Never cache an authenticated or `no-store` response.
- `etag()` runs on every response. A repeated `GET` with a matching `If-None-Match` gets `304` with no body. Keep responses deterministic (no timestamps or random values in a cacheable body) so the ETag stays stable.
- Public `GET`: `Cache-Control: PUBLIC_CACHE` from `lib/cache.ts`.
- Authenticated or personal responses: `NO_STORE`.
- The Workers Cache API is per data centre: `cache.delete` and an `X-Cache-Bypass` refetch only reach the colo the Worker runs in. Do not shorten cache times as a workaround. Every stored entry carries a `Cache-Tag` header instead: `edgeCache(name, baseTags)` adds its base tags (`species`, `catalog`, `news`, `authors`, `images`) and the handler adds the item it served with `cacheTags(c, …)` (`species:<id>` on the profile, field records and range map, `catalog` on the species list, `news:<slug>`, `author:<id>`), each prefixed `api:` (`apiCacheTag`) so they never collide with other cache tags in the `reptiles.ge` zone. Every admin cache clear goes through `lib/revalidateSite.ts`, which first purges the tags it depends on with `purgeApiCache` (`lib/cachePurge.ts`: Cloudflare's zone purge API by tag, at most 100 tags per request; purge by tag reaches Cache API entries in every data centre) and then revalidates the site. A species clear purges `species:<id>`, `catalog` and `images`; **Clear species cache** purges `species`, `catalog` and `images`; news and author clears purge their own tags; a page group purges what its pages read (`PAGE_GROUP_API_TAGS`, **Whole site** purges everything). A failed purge still revalidates the site, then answers 502 so the admin sees it. Secrets: `CACHE_PURGE_TOKEN` (an API token with Zone → Cache Purge on `reptiles.ge`) and `CACHE_PURGE_ZONE_ID` (`wrangler secret put … --config wrangler.api.jsonc`). Without them the purge is skipped with a logged error, and only the colo of the site's `X-Cache-Bypass` refetch is fresh. The site's `/api/revalidate` still refetches the affected responses with `X-Cache-Bypass: <REVALIDATE_TOKEN>` (`refreshSpeciesApiCache` in `src/lib/speciesApiRefresh.ts`), which `edgeCache` checks with a constant-time compare, to warm that colo. Normal server renders do not send it; they read the edge cache. A plain `Cache-Control: no-cache` from the public never skips the cache.

## Calling the API from the site

- The site calls the API only through `src/lib/apiClient.ts`: `createApiClient({ fetch?, origin?, token? })` returns a typed `hc<AppType>` client. The origin comes from `NEXT_PUBLIC_API_ORIGIN` (via `publicEnv()`), default `https://api.reptiles.ge`.
- NEVER call the API with raw `fetch("https://api.reptiles.ge/…")`, and NEVER import `@/api/…` runtime code into the site. `apiClient.ts` imports only `type { AppType }`. The guard test fails otherwise.
- Because the client is typed from `AppType`, a changed route, query, or body breaks `pnpm typecheck` on the site side. Fix the caller; do not cast around it.
- Routes MUST keep chained methods and an explicit status in `c.json(body, status)`, or the client loses its types.

### Ratings flow

- `SiteRating.tsx` posts to the site's `/api/rating` (`src/app/api/rating/route.ts`). That route refuses another origin (403), an invalid body (400) or one over 16 KB (413), then calls `createApiClient().v1.ratings.$post` on the server, which adds `SITE_API_KEY`. It forwards `Origin`, `User-Agent`, `Accept-Language` and the visitor's `cf-connecting-ip` / `cf-ipcountry` as `X-Visitor-Ip` / `X-Visitor-Country` (`src/lib/visitorHeaders.ts`), and passes on 201, 400, 403 and 429; anything else answers 502. It has no D1, limiter or Telegram code (`structure.test.ts`).
- The API owns the rest: `requireSiteKey` (only `SITE_API_KEY`, whatever `API_KEY_MODE` says), origin check, `RATING_VISITOR_LIMITER` (3/min per visitor IP: `X-Visitor-Ip`, trusted only after the site key, else `cf-connecting-ip`) and `RATING_GLOBAL_LIMITER` (30/min), validation with `src/lib/ratingInput.ts`, the D1 insert (country from `X-Visitor-Country`, else `cf-ipcountry`, never from the body), and the Telegram notice in `c.executionCtx.waitUntil` (`inBackground`).
- Telegram secrets live on `reptiles-api`: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (`wrangler secret put … --config wrangler.api.jsonc`). Without them the rating is still stored and the miss is logged.
- `ALLOWED_ORIGINS` is a var in `wrangler.api.jsonc` (`https://reptiles.ge,https://admin.reptiles.ge`). For local work, add your dev origin in `.dev.vars`, and point the site at the local API with `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787`.
- The site CSP `connect-src` allows `https://api.reptiles.ge` (and `http://localhost:8787` in development). Keep it in sync if the API origin changes.

### View counts

- Species and news pages are cached (site and API edge), so the server never sees a page view. `ContentViewBeacon` (`src/components/ContentViewBeacon.tsx`, on species profiles from `createSpeciesRoute.tsx` and on `NewsArticlePage`) posts `{ kind: "species" | "news", id }` (`src/lib/contentViewInput.ts`) to `POST /v1/views` after hydration. A news `id` is its slug.
- The browser sends at most one beacon per page per UTC day (`localStorage` key `reptiles:viewed:<kind>:<id>`) and none when `navigator.webdriver` is set. That only saves requests; the API does the real dedupe.
- `POST /v1/views` (`routes/views.ts`): `requireSiteOrigin`, `rateLimitViews` (`VIEW_LIMITER`, 30/min per IP), validation, then `202` with no body. Counting runs in `inBackground`, and requests with no user agent or a bot user agent are not counted.
- Migration `0014_content_views.sql`: `content_views (kind, target_id, day, views)` holds the counts per UTC day; the total is the sum. One visitor counts once per target per UTC day.
- The visitor is `SHA-256(daily salt, IP, User-Agent, Accept-Language)`, kept in `content_view_visitors` for that day only. The salt is 32 random bytes per day in `content_view_salts`. Each count deletes visitors and salts from earlier days, so a stored hash cannot be linked to an IP or to another day. No IP address or user agent is stored.
- Only published targets count (`EXISTS` on `species.status` / `news_articles.status`). An unknown id is still answered `202`.
- `/v1/views` is in `UNDOCUMENTED_PATH_PREFIXES`.
- `GET /v1/admin/views` (`requireAdmin`, `NO_STORE`, `routes/adminViews.ts`, `listAdminViews` in `db/views.ts`) lists counted pages one page at a time (see "Pagination"): `kind`, `id`, KA and EN `name` (species common name or news title, `null` once the target is gone), `views` and `lastDay`, most viewed first, then by last day, kind and id. Filters `days` (`1`, `7` or `30`: today and the days before it, UTC), `kind` and `q` (id or KA/EN name, substring) run in SQL and combine. Next to the page fields it returns `views`, the sum over every match. The admin **Views** page reads it.
- `GET /v1/species/:slug` returns the profile's total as top-level `views` (`readViewTotal`, every day and locale), next to `data` and `locale`. It is cached with the profile (API edge and the site's fetch, up to an hour each), which is fine for a counter. The site loader passes it on as `getSpeciesProfile(...).views`.

### Species writes (phase 2)

- **D1 is the source of truth for species.** Change content only through `PUT /v1/admin/species/:id` or an approved draft. Never with raw SQL.
- `GET /v1/admin/species/:id` returns `{ record, version }` and takes `requireAdmin` (session or token), so the admin app's species page can read it. `PUT` takes `{ record, expectedVersion, actor, source: admin|ai|api, summary }` and needs `requireToken`. Admin bodies may be up to 1 MB; every other route stays at 16 KB.
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
- Draft creation, `PUT` and text saves also refuse text that **adds** page talk ("on this page", "this atlas", "the records table" and the KA/RU/TR forms; `src/lib/pageTalkProse.ts`, `lib/speciesPageTalk.ts`) compared with the stored record: 400 `invalid_request` with the locale and field paths. Page talk that is already stored may stay or be removed. `pnpm species:draft push` runs the same check locally.
- `db/speciesWrite.ts` writes the whole record in **one D1 batch** (one transaction):
  1. a `species_revisions` row, whose `version` comes from `(SELECT version + 1 … WHERE version = expected)`, so a stale version fails `NOT NULL` and aborts the batch;
  2. the `species` update;
  3. child deletes and parameterized inserts (≤ 99 bound values each).

  A stale version answers 409 `version_conflict` with `currentVersion`, both when the pre-check sees it and when a concurrent write wins the race between check and batch. Any database error rolls everything back.

- `db/speciesRows.ts` is the single row builder used by both the import and the writes. Overlays point at media with a subquery, so media ids are never assigned by hand.
- Species writes **do not** revalidate the site. The `species` tag is on every catalog fetch, so revalidating after each write purged most of the site (owner decision, #1574). The admin presses **Clear species cache** on the admin Species page when a batch of edits is done, or **Clear cache** on one species (`POST /v1/admin/species/:id/revalidate`, `species` and `species:<id>`; pressed by hand, so the wider catalog revalidation does not go against #1574). That calls `POST /v1/admin/site/revalidate` (see "Admin users and sessions"), which calls the site through the `SITE` Service Binding: `POST /api/revalidate` with `REVALIDATE_TOKEN`, run with `revalidateTag(tag, "max")`. Before that, the API purges the matching API cache tags in every data centre (see "Caching"), and the site refetches the catalog and the edited profiles with `X-Cache-Bypass: <REVALIDATE_TOKEN>`, so the next render reads fresh D1 data. Without a clear, an edited page catches up within the fetch TTL (3600 s) plus up to 3600 s in the API edge cache.
- Photo actions: `POST /v1/admin/species/:id/photos/{cover,order,remove,coordinates}` (body includes `actor`). Each one reads the record, applies a pure operation from `lib/speciesPhotos.ts`, validates the whole record, and saves through the same versioned path as `PUT`, so it gets a revision and a 409 on a race. Like `PUT`, it does not revalidate the site.
- The admin app's photo **Edit** and **Delete** buttons use `POST /v1/admin/species/:id/photos/credit` (`{ src, expectedVersion, credit }`, the upload's credit fields with `georgiaField` as a boolean) and `POST /v1/admin/species/:id/photos/delete` (`{ src, expectedVersion }`). Both are registered before `.use(requireToken)` and guarded like the text edits (`requireSiteOrigin`, `rateLimitAdmin`, `requireAdminSession`); the session user's `name` is the revision actor, and a stale `expectedVersion` is a 409. `credit` replaces the gallery photo's Georgian credit through `creditFromInput` (`setPhotoCredits`), copies it to a cover that shows the photo, and writes the English credit as an `en` overlay only when it differs (otherwise the overlay is dropped); a `range-typical` or `placeholder` confidence is kept. `delete` runs `removePhoto`: the last gallery photo cannot go, a cover moves to the next photo, and the file stays on the CDN. Neither revalidates the site.
- The Photos tab's ordering (drag a gallery row, or ↑ ↓) and its **Cover** dialog use `POST /v1/admin/species/:id/photos/reorder` (`{ srcs, expectedVersion }`, every gallery photo once, `reorderPhotos`, revision `Reorder gallery`) and `POST /v1/admin/species/:id/photos/set-cover` (`{ src, target: desktop | mobile | both, expectedVersion }`, a gallery photo only, `setCover`, which copies its credit to the cover; revision `Set <target> cover`; answers the new `image` and `mobileImage`). They have the same guards, actor and 409 as `credit` and `delete`, and neither revalidates the site. The token-only `/photos/order` and `/photos/cover` (with `actor`, and `coverSrc` for crops) stay for scripts.
- The local admin (`/admin`, dev only) reads species through `src/lib/adminSpeciesApi.ts`. It calls these endpoints with `API_WRITE_TOKEN` from the developer's local env. Cover, crop, reorder, remove and coordinates no longer open PRs. A crop still opens a catalog-only PR for the AVIF/WebP manifest when it creates new derivatives.

### Photo uploads

- `POST /v1/admin/species/:id/photos` (`routes/adminSpecies.ts`, before `.use(requireToken)`) is **Add photos** in the admin app. It is guarded with `requireSiteOrigin`, `rateLimitUpload` (`UPLOAD_LIMITER`, 30/min per IP) and `requireAdminSession`; the write token is not accepted. Its body limit is 64 MB (`app.ts`); every other admin route keeps 1 MB.
- The body is `multipart/form-data` (`schemas/photoUpload.ts`): `original` (one file), `derivatives` (files), and the credit text fields `photographer`, `photographerEn`, `location`, `locationEn`, `date`, `lat`, `lng`, `url`, `georgiaField` (`"1"`/`"0"`). The credit is built with the shared `creditFromInput` (`src/lib/photoCreditInput.ts`); an English credit that differs from the Georgian one becomes an `en` gallery overlay.
- The Worker cannot run sharp, so the admin app encodes (see AGENTS.md "Admin app"). The API trusts nothing it is sent: `lib/imageProbe.ts` reads the real format and size from each file's header. The original must be a JPEG or PNG (≤ 25 MB, ≤ 80 MP); there must be exactly one AVIF and one WebP for every width of `photoDerivativeWidths(original width)` (`src/lib/photoDerivatives.ts`), each with the original's aspect ratio (±1 px). Anything else is 400 `invalid_request` before anything is stored.
- Storage (`lib/bunnyStorage.ts`, plain `fetch` to Bunny Storage with a SHA-256 `Checksum`): the original goes to the CDN root as `{id}-{photographer slug}-{n}.{ext}` (the first free `n`, checked against the gallery and the root listing), then the derivatives to `optimized/{name}-{width}.{format}`, the naming of `@reptiles-ge/img-compression`. Secrets: `BUNNY_STORAGE_ZONE`, `BUNNY_STORAGE_ACCESS_KEY` (`wrangler secret put … --config wrangler.api.jsonc`); optional `BUNNY_STORAGE_REGION` and `BUNNY_CDN_BASE_URL`. Without them the route answers 503 `storage_unavailable`; a failed storage call is 502 `storage_failed`.
- Then the photo is appended to the gallery through the same versioned path as the photo actions (revision `Add gallery photo`, actor = the admin's email), and in the same batch the derivative entry is upserted into `optimized_images` (migration `0016`) unless no format beat the original (`optimizedPhotoFormats`). It answers 201 `{ data: { optimized, photo, version } }`. It does **not** revalidate the site.
- `POST /v1/admin/species/:id/photos/inaturalist` (same file and guards as the upload: `requireSiteOrigin`, `rateLimitUpload`, `requireAdminSession`) downloads one iNaturalist photo for the **iNaturalist observation** field in **Add photos**. The body is `{ photoUrl }` (`inaturalistPhotoBody`): an `https` original photo (`/photos/<id>/original.<jpg|jpeg|png|webp>`, no query) on `static.inaturalist.org` or `inaturalist-open-data.s3.amazonaws.com` (`isINaturalistPhotoUrl`). It answers 200 with the image bytes (≤ 12 MB JPEG, PNG or WebP, `NO_STORE`) and stores nothing. The Worker never calls `api.inaturalist.org`: from Cloudflare's shared egress IPs it answers 429. The admin app reads the observation there itself, from the admin's browser (`lookUpINaturalistObservation` in `src/lib/inaturalistPhoto.ts`, which builds the credit: login as photographer, first part of the place guess, date, coordinates unless hidden, photo page link, licence, Georgia flag), then posts the photo URL here, and the photo goes on through `POST /v1/admin/species/:id/photos` as usual. The Worker is needed for the photo because `static.inaturalist.org` sends no CORS headers. Every fetch uses `redirect: "manual"`; Workers refuses `"error"`. Errors: 400 for any other URL, 404 for an unknown species, 422 for a photo it cannot use, 502 `upstream_failed` when the photo cannot be downloaded.
- `GET /v1/images` (`routes/images.ts`, public, edge-cached, documented) lists `optimized_images` ordered by `src`. The site's `pnpm images:compile` (`scripts/compile-optimized-images.ts`, part of `compile`) writes it to the gitignored `src/data/optimizedImages.api.generated.ts`, which `src/data/optimizedImages.ts` merges under the committed catalog. A 404 (an API without the route yet) writes an empty catalog with a warning; any other failure fails the build.

### Catalog (list consumers)

- `GET /v1/catalog?view=card|photos|quiz|full` (locale in `X-Locale`) returns every **published** species in catalog order, localized with `applySpeciesTranslation`, plus `group`, `habitats`, `slug` (KA slug or id) and `lookalikes` (bidirectional ids: the species' own list first, then reverse links ordered by id, unpublished peers left out). The site reads lookalikes only from this field; there is no list in code. It is edge-cached and supports `X-Cache-Bypass`.
  - `card` (default, about 190–280 KB per locale) is for hubs, lists, home, cards and stats. Its fields are `SPECIES_CARD_KEYS` (`commonName, danger, description, family, genus, id, image, imageCredit, location, mobileImage, mobileImageCredit, publishedAt, scientificName, stats, updatedAt`) plus `photoCount`.
  - `photos` (about 0.47–0.59 MB per locale) is the card fields plus `gallery` (`SPECIES_PHOTO_KEYS`), for photo credits: contributor pages, photo-use, news image rights. Credit matching uses the KA view (`getCreditPhotoCatalog()`), because translations localize photographer names.
  - `quiz` (about 0.8–1.4 MB per locale) is the card fields plus `facts`, `gallery` and `identification` (`SPECIES_QUIZ_KEYS`), for the identification quizzes.
  - `full` (up to about 3.7 MB for KA) is only for consumers that need every text, such as search and `llms-full`. **Never** fetch `full` for a normal page render; add the field you need to `card` instead, or add a narrow view the way `quiz` was added. Next does not cache fetch responses over 2 MB.
- Pagination is opt-in: `limit` (1–100) and `cursor` (the `id` of the last entry on the previous page). The response always has `total` (all published species) and `nextCursor` (`null` on the last page or without `limit`). An unknown or unpublished cursor id answers 400 `invalid_request`. Without `limit` the whole catalog comes back in one response, which is what the site uses: every site consumer needs the full list, and the reader loads every row from D1 either way.
- Site loader: `getSpeciesCatalog(locale, view?)` in `src/lib/speciesCatalogApi.ts`. It uses React `cache`, the `species` tag and `revalidate: 3600` (shared `speciesFetchOptions`), and has no fallback.
- `routes/catalog.test.ts` checks every view against the test fixture in all locales (`toStrictEqual`).

### Field records

- `species_field_records` (migration `0005`) holds observation, literature and specimen locations: about 13.8k rows for 96 species. They are part of `SpeciesRecord` (`fieldRecords`, in position order), so `PUT`, the photo actions, text saves and merged drafts all write them back. `fieldRecordStatements` (`db/fieldRecords.ts`) rewrites them with one `DELETE` and one `INSERT … SELECT … FROM json_each(?)`, so a species with 1,000 records stays two statements; never switch it to per-row inserts.
- Public read: `GET /v1/species/:slug/field-records` (same slug and `X-Locale` rule) returns `{ data, id, total }`, edge-cached.
- They were copied once from MDX. The site reads them through `getSpeciesFieldRecords(id)` (`src/lib/speciesFieldRecordsApi.ts`) for the profile map, and through `/api/occurrences/{id}/{locale}` for the map's records.

### Range maps

- Migration `0018_species_range_maps.sql` adds `species_range_maps` (one row per species with an interactive map: `inaturalist_taxon_id`, `range_source`, `confirmed_threshold`) and `species_range_map_texts` (per locale, only the texts that differ from the site defaults: `range_title`, `intro`, `map_aria`, `official_region_label`, `regions_metric_label`, `confirmed_status_label`). `0019_species_range_maps_backfill.sql` copied the 96 maps that lived in `src/data/speciesRangeMaps/{id}.ts`, with their per-species thresholds.
- They are `rangeMap` in `SpeciesRecord` (`null` without a map), read by `readRangeMap` (`db/rangeMaps.ts`) and written by the row builder like the other species tables.
- Public read: `GET /v1/species/:slug/range-map` (same slug and `X-Locale` rule) returns `{ data, id, locale }`, `data` being the settings plus that locale's `copy`, or `null`. The site reads it through `getSpeciesRangeMap(id, locale)` (`src/lib/speciesRangeMapApi.ts`) and merges `copy` over `HALYOMORPHA_RANGE_COPY`.
- A merged draft that was saved before `fieldRecords` and `rangeMap` were part of the record keeps the live values for both (`approveSpeciesDraft`), so an old draft never empties a map.

### Authors

- Migration `0006_authors.sql` adds `authors` (id = contributor page slug, `kind`, `role`, `job_title`, **`is_contributor`**, portrait, links), `author_texts` (name, bio and meta description per locale; `ka` required), `author_aliases` (every spelling used in photo credits) and `author_affiliations`, with lookup tables for kinds, roles, job titles and affiliations. `species_media` and `species_media_overlays` gain a nullable `author_id`.
- `is_contributor = 1` means the author has a contributor page on reptiles.ge. Everyone else credited on a photo is an author too, with `is_contributor = 0`.
- Migration `0020_author_dates.sql` adds `published_at` and `updated_at` (ISO UTC). `PUT /v1/admin/authors/:id` sets `updated_at` and, the first time the author is a contributor, `published_at`; a text save sets `updated_at`. `/v1/authors/:id` and `/v1/contributors` return them as `publishedAt` / `updatedAt`, and the site dates contributor pages (structured data, sitemap) only from them. There is no author date list in code. Contributor pages render on demand (`dynamicParams = true`), so a new contributor needs no deploy: save the author, then **Clear authors cache**.
- `author_id` is derived, never sent by clients: it is the `author_aliases` owner of the row's `credit_person`. Every species write relinks that species in the same batch (`relinkSpeciesAuthors`), and every author write relinks all photos (`RELINK_MEDIA_AUTHORS`). The credit text itself is unchanged.
- `0007_authors_backfill.sql` was a one-off backfill from the contributor registry, the old credit-name translations and the photo credits. Its generator was deleted once it was applied; new authors and aliases go through `PUT /v1/admin/authors/:id`.
- Every photo credit in API responses carries `authorId`. Outside Georgian, `photographer` is the author's name in that locale (`author_texts`) when there is one, looked up by the credit text through `author_aliases` (`readCreditPersonNames`, passed to `applySpeciesTranslation`); otherwise the credit text is kept. Place names are still localized in code (`creditNames.ts`).
- Public: `GET /v1/authors` (`?contributor=true`) and `GET /v1/authors/:id`, edge-cached, localized by `X-Locale` with the Georgian name as fallback. Admin: `GET /v1/admin/authors/:id` (`requireAdmin`, session or token) and `PUT /v1/admin/authors/:id` (token; whole record; an alias owned by another author is a 400). `GET /v1/admin/authors/:id/photos` (`requireAdmin`) lists every species photo credited to the author (`species_media.author_id`, audio excluded, any species status) in catalog order with the species' KA and EN name, status, role, src, location and date; 404 for an unknown author. A write revalidates the site with `authors`, `author:<id>`, `species` and `news`, because relinking photo credits changes species and news responses too. The site's `/api/revalidate` refreshes `/v1/contributors` and `/v1/contributors/:id` in every locale at the edge.
- `GET /v1/contributors` (`routes/contributors.ts`, `listContributors` in `db/authors.ts`) returns every contributor as a full profile (the `/v1/authors/:id` fields plus `speciesCount`) in one response, most credited photos first (ties by id), edge-cached. Optional `limit` (1–100) keeps the first ones; `total` always counts all contributors. `GET /v1/contributors/:id` returns one contributor in the same shape, and 404 for an author without a contributor page. The counts match the site's contributor cards (tested). Never load contributors one profile at a time.
- The site reads contributors only from these endpoints (`src/lib/authorsApi.ts`: `getContributors(locale)` and `getContributorDirectory(locale)` from one `/v1/contributors` request, `getContributor(id, locale)` (contributor pages) from `/v1/contributors/:id`). Contributor pages, credit links, photo alt text, image rights JSON-LD, search, the sitemap and photo-use all take that data; client components read the directory from `ContributorsProvider`. A credit links to a contributor by `authorId`, or by its spelling when it has none (news MDX credits).

### News

- Migration `0008_news.sql` adds `news_articles`, `news_texts`, `news_sections` (blocks as a JSON array), `news_media` + `news_media_alts`, `news_sources`, `news_hubs`, `news_regions`, `news_species` and the `news_series` lookup. `docs/NEWS-D1-MIGRATION.md` is the plan.
- `db/newsRows.ts` is the single row builder (`NewsRecord = { article: NewsArticle, position }`); `db/news.ts` reads (`readNewsRecords`). `news.test.ts` requires the import of `news.generated.ts` to read back `toStrictEqual`.
- `news_media.author_id` is derived like `species_media.author_id`: `RELINK_MEDIA_AUTHORS` includes `RELINK_NEWS_MEDIA_AUTHORS`.
- `db:import:news` is a one-off with a guard (`news_import_runs`): it fails when `news_articles` has rows. News MDX is still the live source until the site reads from the API (phase 3).
- Writes are validated with `schemas/newsRecord.ts` (`newsArticleSchema`), which runs the shared rules in `src/lib/newsRules.ts`.
- Public read (`routes/news.ts`, `db/newsView.ts`), edge-cached:
  - `GET /v1/news` lists published articles that have text in the `X-Locale` locale, newest first (ties by `position`), without `sections`, with `metaTitle` and `readMinutes` (title, lead and body at 150 words a minute, `src/lib/newsReadTime.ts`, the same count the site uses). Filters `hub`, `region`, `species` (related, or linked in that locale's text), `series` and `author` (id or credit spelling, the same text match as the site, `src/lib/newsAuthorMentions.ts`) combine. `q` matches title, dek and source names, ignoring case. `page` (from 1) and `limit` (1–100, default 50) page the list through `src/lib/pagination.ts`; the response is `{ data, facets, limit, locale, page, pageCount, total }`, where `total` counts every match and `facets.hub` counts each hub with the other filters and `q` applied.
  - `GET /v1/news/:slug` returns one published article with `sections` and `gallery`. Without text in the requested locale it falls back to Georgian, and `locale` and `Content-Language` say `ka`. Drafts and unknown slugs answer 404.
  - Texts, photo `alt`, source names and the series name are localized. Photo credits are returned as published (not translated), with `authorId`. Paragraphs are `NewsMark` arrays, not the Markdown text format of species.
- `routes/news.test.ts` compares the list, every filter and every article in all four locales with the site's own news functions (`src/data/news.ts`). Tests get a seeded database from `createNewsTestDatabase()`.
- Writes (`routes/adminNews.ts`, `db/newsWrite.ts`, `requireToken`). Migration `0010_news_revisions.sql` adds `news_articles.version` and `news_revisions`:
  - `POST /v1/admin/news` with `{ actor, article, source, summary }` validates the article (`newsArticleSchema`, then `newsReferenceIssues` against published species and contributors in D1, hubs and `REGION_IDS`), refuses an existing slug with 409 `conflict`, and creates it as a **draft** at the end of the order, version 1, with its first revision and author links, in one batch. `?dryRun=true` runs every check and answers 200 without writing.
  - `POST /v1/admin/news/:slug/status` with `{ actor, expectedVersion, source, status, summary }` publishes or unpublishes. A stale version is 409 `version_conflict` with `currentVersion`. It revalidates the site with the `news` and `news:<slug>` tags; the site's `/api/revalidate` accepts them and refreshes the news list and that article in every locale at the edge.
  - `pnpm news:import <slug> [--dry-run] [--publish] [--actor <name>]` (`scripts/news-import.ts`, through `src/lib/adminNewsApi.ts`) parses `src/content/news/<slug>/*.mdx` with `newsArticleFromMdx` and calls these endpoints with `API_WRITE_TOKEN`. It uses `NEXT_PUBLIC_API_ORIGIN` when set, production otherwise. It does not delete the MDX while the site still lists news from it.

### Drafts (AI changes need approval)

- Migration `0004_species_drafts.sql` adds `species_drafts`: a full proposed record, plus its `base_version`, `source`, `actor`, `summary` and a `status` of pending, approved or rejected.
- Migration `0013_species_drafts_status_index.sql` adds `species_drafts_status (status, id)` for the cross-species list.
- Migration `0017_species_drafts_base_record.sql` adds `species_drafts.base_record`: the live record the draft was made from, saved when the draft is created. A draft made before `0017` gets the live record on merge (`COALESCE`), so a merged draft can always show what it changed. Older decided drafts keep `NULL`.
- Endpoints under `/v1/admin/species`, all token-only:
  - `POST /v1/admin/species/:id/drafts` validates the record and needs `baseVersion` to equal the current version (409 otherwise).
  - `GET /v1/admin/species/:id/drafts` lists the pending drafts.
  - `POST …/drafts/:draftId/approve` saves through the normal versioned path. The revision keeps the draft's `source`/`summary`, the approver becomes the `actor`, and the draft is marked approved **in the same batch**. A draft whose base version is no longer current answers 409 and stays pending.
  - `POST …/drafts/:draftId/reject`.
- Endpoints under `/v1/admin/drafts` (`routes/adminDrafts.ts`), for the **Drafts** page of the admin app:
  - `GET /v1/admin/drafts?status=pending|approved|rejected` (`requireAdmin`, `NO_STORE`, default `pending`) lists drafts of every species, newest first, one page at a time, with `q` (species id or names, summary, actor), without the record: species id, KA common name, scientific name, `baseVersion`, the live `speciesVersion` (a draft is stale when they differ), `source`, `actor`, `summary`, `status`, `createdAt`, `decidedAt`, `decidedBy`.
  - `GET /v1/admin/drafts/:draftId` (`requireAdmin`) returns `{ draft, current }`: the draft with its record and `baseRecord`, and the live `{ record, version }`. The admin app diffs `baseRecord` against the draft with `diffSpeciesRecords` ("Before (vN)" against "Proposed"), and falls back to the live record when `baseRecord` is `NULL`.
  - `POST /v1/admin/drafts/:draftId/merge` and `…/reject` are guarded like the cache endpoints: `requireSiteOrigin`, `rateLimitAdmin`, then `requireAdminSession` (no token). The signed-in admin's `name` becomes the revision `actor` and `decided_by`. Merge runs the same approve as the token route (`approveSpeciesDraft` in `lib/speciesDrafts.ts`), and only after the batch commits calls `revalidateSpeciesPage` (`species:<id>`). It answers `{ status, version, speciesId, revalidated }`; a failed revalidation is `revalidated: false`, never an error, because the write is already live. Reject never touches the species and never revalidates.
- Approve and reject are safe against races: `decideDraftStatement` sets `decided_by` to `NULL` when the row is no longer pending, which breaks the table's `CHECK`, so a draft decided between the read and the write aborts the whole batch (answered as 400 `Draft is already …`). A second merge of the same draft answers 400; a stale one 409 `version_conflict` and stays pending.
- **Every AI change MUST land as a draft.** NEVER let AI output call `PUT` or a photo action directly. A local AI submits drafts with `pnpm species:draft` (`scripts/species-draft.ts`, playbook in `.agents/skills/species-drafts/SKILL.md`): it reads `GET /v1/admin/species/:id`, checks the edited record against `speciesRecordSchema`, refuses changes to status, group, slugs, ids, cover images or gallery `src`, and posts `POST /v1/admin/species/:id/drafts` only. The selection editor (`src/lib/contentEditorSpecies.ts`) and AI page texts (`processSpeciesTexts`) build the draft record from the API record (`src/lib/speciesRecordFields.ts`) and return `reviewUrl` (`/admin/:id#draft-N`).
- The local admin page lists pending drafts with a field-level diff (`src/lib/speciesDraftDiff.ts`, `AdminSpeciesDrafts`) and approves or rejects them through `/api/admin/species-drafts`.
- Not yet on the API: AI analysis and workflow, and new species creation. Their local admin routes answer 503 until the admin phase. Adding a photo is on the API (see "Photo uploads").

### Species pages (SSR from the API)

- Species profile pages render on the server from the API. `createSpeciesRoute.tsx` calls `getSpeciesProfile(id, locale)` (`src/lib/speciesProfileApi.ts`, wrapped in React `cache`) for the page and for `generateMetadata`. It fetches `ka` (for the Taxon, citations and hero) and the page locale before rendering.
- There is **no fallback**. A 404 from the API is `notFound()`, and any other error fails the render, which vinext does not cache.
- NEVER add `loading.tsx`, `Suspense` fallbacks or client-side fetching for page content. The HTML must arrive complete, as before. Browser beacons (views) go to `api.reptiles.ge` directly; ratings go through the site's `/api/rating`.
- The fetch uses `next: { revalidate: 3600, tags: ["species", "species:<id>"] }`, so a page catches up with D1 within an hour at the latest, plus up to an hour in the API edge cache. **Clear species cache** or a species' **Clear cache** on the admin Species page revalidates at once (see "Species writes").
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
