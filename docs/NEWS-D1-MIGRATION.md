# News content: MDX → D1 migration plan

Status as of 2026-10-23. Phases 1 and 2, slice 3.1 and the `news:import` create path are built; none of it is in production yet. Binding API rules are in `.agents/skills/api/SKILL.md`; read that first. The species track (`docs/SPECIES-D1-MIGRATION.md`) is the model: same API layout, row builder, round-trip test, versioned writes, revalidation and loaders.

## Where things stand

| Phase | What                                                                                                  | State                                     |
| ----- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 0     | Owner decisions: writing workflow (decided: MDX input + import script), body storage, series          | ⏳ 1 of 3                                 |
| 1a    | Schema `0008_news` + one-off import + 1:1 round-trip test                                             | ✅ code done; not applied to production   |
| 1b    | MDX parser to `src/lib` + `schemas/newsRecord.ts` validation                                          | ✅ code done                              |
| 2     | Public read API: `GET /v1/news`, `GET /v1/news/:slug`                                                 | ✅ code done; not deployed                |
| 3     | Site reads news from the API (SSR): article, index, archive, home, hubs, regions, species, authors    | ⏳ 3.1 code done (article page)           |
| 4     | Build-time and SEO consumers: sitemap, feeds, `llms.txt`, search index, scripts                       | ⏳                                        |
| 5     | Versioned write API, admin text editor on the API, `news:import` / `news:export`                      | ⏳ create, publish and `news:import` done |
| 6     | Delete news MDX folders, `compile-news`, `news.generated.ts`, `newsPublish.ts` (the MDX parser stays) | ⏳                                        |

Recommended order: **0 → 1 → 2 → 3 → 4 → 5 → 6**. Phases 3 and 4 can each be split into several PRs. Exception: the create path of `news:import` (`POST /v1/admin/news` + the script) must ship **before** phase 3 switches the site to the API. From then on the site no longer reads MDX, so an article written in MDX reaches the site only through the import. Until phase 3, new articles are added both ways: MDX on `main` as today, and `news:import` into D1.

### Today

- 31 articles in `src/content/news/{slug}/{ka,en,ru,tr}.mdx` (about 1.2 MB). The order lives in `newsSlugs` (`src/data/newsPublish.ts`); it breaks ties between articles with the same `publishedAt`.
- `scripts/compile-news.ts` (`news:compile`, part of `compile` / `predev` / `prebuild`) validates the frontmatter (`src/lib/newsFrontmatter.ts`), parses the body (`src/lib/newsMdx.ts`: sections, paragraphs, figures and inline marks), checks the slug (`newsSlugIssue`) and heroes (`checkNewsHeroes` against `optimizedImages.generated`), then writes the gitignored `src/data/news.generated.ts` (about 1.4 MB, bundled into the site Worker).
- `src/data/news.ts` is the only reader of the generated file. Every lookup is synchronous: `getPublishedNewsArticles`, `…BySlug`, `…InSeries`, `…ForHub`, `…ForRegion`, `…ForSpecies`, `…ForCreditAuthor`, plus pure helpers (`newsArticlePhotos`, `newsLinkedSpeciesIds`, `newsSearchKeywords`, `newsSourceOrg`, …).
- No client component imports news data. Everything is server-side or build-time.
- Series names live in code (`src/data/newsSeries.ts`). Schema-image crops live in `src/data/newsSchemaImages.json` (`images:news-schema`).
- The local admin text editor (`src/lib/contentEditorTarget.ts`, kind `news`) edits `title`, `dek`, `lead` and body fields in the MDX files and opens a PR.
- Guard tests: `src/data/newsContent.test.ts` (one folder per slug, section and figure parity across locales, figures only from the article's own photos, links only to existing species, regions, hubs and contributors, linked ids present in the related ids), `newsData.test.ts`, `newsSeries.test.ts`.

---

## Phase 0 — owner decisions

1. **How a new article gets written. Decided (owner, 2026-10-23): MDX stays the input format, and a script imports it into D1.** Structured JSON drafts and an admin form were considered and not chosen.
   - Writers and agents keep writing `{ka,en,ru,tr}.mdx` with the same frontmatter and body syntax as today (`AGENTS.md` News section, `newsMdx.ts` marks). Writing prompts and skills do not change, apart from the last step.
   - A script, `pnpm news:import <slug>`, reads the folder, parses it with the existing `newsFrontmatter.ts` + `newsMdx.ts` (moved to `src/lib` so the script and tests share them), builds a `NewsRecord` and sends it to the API with `API_WRITE_TOKEN` from `.env.local`. The API validates the whole record (phase 1 rules) and answers 400 with the exact problems, so the writer fixes the MDX and runs the import again.
   - A **new** slug is created with `status: 'draft'`. The owner previews it and publishes it with a status change. An existing slug is updated through the versioned `PUT` (`expectedVersion` from a `GET` first), so an import never silently overwrites an edit made in the admin in between.
   - **D1 is the source of truth after the import.** The MDX folder is input only. It does not stay in `src/content/news/` on `main`: after a successful import the script deletes the folder (or it lives in a gitignored inbox; decide in phase 5). Committed MDX next to D1 would drift after the first admin edit.
   - To rework an existing article in MDX, `pnpm news:export <slug>` writes the D1 record back to MDX (a serializer, the inverse of the parser). Edit, then import again. A round-trip test (export → parse → `toStrictEqual`) keeps the parser and serializer in step.
2. **Body storage.** Recommended: store the parsed body (`NewsSection[]`, the same shape `news.generated.ts` has today), validated by Zod. Do **not** store raw MDX in D1: the API would then need the MDX parser, and validation would happen on read.
3. **Series.** Keep `NEWS_SERIES` in code (3 entries, rarely change) or move to a `news_series` table. Recommended: a lookup table, like `animal_groups`, so a new series does not need a site deploy.

---

## Phase 1 — schema, import, round-trip

### 1a — done (code only)

- `migrations/api/0008_news.sql`: `news_series` (ids only; names stay in `NEWS_SERIES` for now), `news_articles`, `news_texts`, `news_sections` (blocks as a JSON array, checked with `json_valid`), `news_media` + `news_media_alts`, `news_sources`, `news_hubs`, `news_regions`, `news_species` (FK to `species`), and `news_import_runs` for the guard.
- `src/api/db/newsSchema.ts` (columns), `newsRows.ts` (`newsRecordRows`, `buildNewsImport`, guard) and `news.ts` (`readNewsRecords(db, id?)`). A `NewsRecord` is `{ article: NewsArticle, position }`, the same `NewsArticle` shape the site uses today.
- `news.test.ts`: the import of `news.generated.ts` reads back `toStrictEqual` for all 31 articles in all four locales (with `authorId` removed, since the compiled data has none), a read → rows → read round trip, a single-article read, author linking (`RELINK_NEWS_MEDIA_AUTHORS` in `db/authors.ts`, also part of `RELINK_MEDIA_AUTHORS`, so every author write relinks news photos too), row counts, the import guard, and the SQL checks.
- `pnpm db:import:news` / `db:import:news:remote` (`scripts/export-news-sql.ts`): 43 statements. The guard makes a second run fail. Checked on local D1: 31 articles, 610 sections, 21 photos linked to authors.
- Phase 0 items 2 and 3 were built the recommended way (parsed JSON body, series lookup table). Both can still change before the production import.
- **Production:** `pnpm db:migrate:remote`, then `pnpm db:import:news:remote`, by hand, only when the owner says so. Until phase 3 nothing reads these tables, so MDX stays the live source and an article added in MDX after the import needs the per-article import (phase 5) or a re-import into an emptied table.

### 1b — done (code only)

- `scripts/newsFrontmatter.ts` moved to `src/lib/newsFrontmatter.ts`. `src/lib/newsMdxArticle.ts` adds `newsArticleFromMdx(slug, files)`: the part of `compile-news.ts` that turns the locale files into one `NewsArticle` (plus `errors` and `heroImageException`). `compile-news.ts` now calls it, and its output is byte-identical to before.
- `src/lib/newsRules.ts` holds the shared rules, so the compile-time test and the API check the same things:
  - `newsArticleIssues`: id equals slug, slug rule, Georgian copy, no duplicate photo, section count and figure order per locale, figures only from the article's own photos, every linked species, region and hub listed in the related ids, no duplicate related ids. The two exception lists (`NEWS_SHORTER_TRANSLATIONS`, `NEWS_UNLISTED_REGION_LINKS`) moved here from the test.
  - `newsReferenceIssues(article, known)`: every linked and related species, region, hub and author exists. It takes the known ids as sets, so the write route (phase 5) can pass species and authors from D1.
- `src/data/newsContent.test.ts` now runs those two functions over every compiled article. It also keeps the folder test and checks that each exception is still needed.
- `src/api/schemas/newsRecord.ts`: `newsArticleSchema`, a strict Zod schema of `NewsArticle` (marks, blocks, photos with `photoCredit` shared with species, sources, hub and series enums), with `newsArticleIssues` in `superRefine`. Photo and figure `src` is an https URL or a site path (`/images/news/…`), because some articles use local images. `newsRecord.test.ts` accepts all 31 compiled articles and covers the failure cases.
- Not done here: the reference check against D1 runs only in the write route (phase 5); the hero check stays a warning in `compile-news.ts`.

### Original plan

**Migration `0008_news.sql`** (number may shift):

- `news_articles (id = slug PK CHECK slug pattern, status CHECK draft|published, published_at, updated_at, series_id FK, position UNIQUE)`. `position` replaces the `newsSlugs` order.
- `news_texts (article_id FK CASCADE, locale FK, title, dek, lead, meta_title, meta_description, PRIMARY KEY (article_id, locale))`. `ka` required (checked in Zod; SQL cannot require a row).
- `news_sections (article_id, locale, position, heading, blocks TEXT CHECK json_valid(blocks))`. One row per section keeps each statement well under the 90 KB limit (Georgian text is 3 bytes per letter).
- `news_media (id, article_id FK CASCADE, role CHECK cover|gallery, position, src, width, height, plate, from_atlas, credit_* columns, author_id FK NULL)` and `news_media_alt (media_id, locale, alt)`. `author_id` is derived from `author_aliases`, the same way `species_media` does it.
- `news_sources (article_id, position, url, name_ka, name_en, name_ru, name_tr)`; a plain-string name fills all four.
- `news_related_hubs`, `news_related_regions`, `news_related_species` (article_id, position, ref id). Hubs and regions are code ids today, so no FK; species ids FK to `species (id)`.
- Indexes on every `article_id`, on `(status, published_at)` and on the related tables' ref columns (lookups by hub, region and species).

**Import:** a one-off, guarded `db:import:news` (refuses when `news_articles` is not empty), built from `news.generated.ts`. A single row builder `db/newsRows.ts` serves both the import and later writes. This bulk import is separate from the per-article `news:import <slug>` (phase 5), which goes through the API, never raw SQL.

**Parser to `src/lib`:** move `scripts/newsFrontmatter.ts` to `src/lib/newsFrontmatter.ts` next to `src/lib/newsMdx.ts`, and add `newsArticleFromMdx(files)`: the part of `compile-news.ts` that turns four MDX files into one record. `compile-news.ts` uses it until phase 6, and `news:import` uses it afterwards, so both read MDX the same way.

**Round-trip test:** `newsCatalog.test.ts` reads every article from the test seed, writes it back through the row builder into an empty database and requires `toStrictEqual`. Then compare against `news.generated.ts` for all 31 articles in all four locales. Add the news rows to `tests/fixtures/speciesSeed.sql` (or a separate `newsSeed.sql`).

**Validation** (`schemas/newsRecord.ts`, shared rules in `src/lib`): everything `newsFrontmatter.ts`, `compile-news.ts` and `newsContent.test.ts` enforce today moves here, so it runs on every write:

- strict keys, required copy fields, `ka` copy present, slug rule (`newsSlugIssue`, reserved `page`);
- section count and figure order equal across locales;
- figures only from the article's own photos; overlay alts only for KA photos;
- inline marks only to species, regions, hubs and authors that exist (species and authors from D1, regions and hubs from code);
- every linked species, region and hub listed in the related ids (keep the region exceptions the test allows today);
- at least one source;
- hero check (`checkNewsHeroes`) stays a warning, as today.

---

## Phase 2 — public read API

### Done (code only)

- `GET /v1/news` and `GET /v1/news/:slug` in `src/api/routes/news.ts`, reading through `src/api/db/newsView.ts`. Both are edge-cached, documented in the OpenAPI spec (tag `News`, `NewsListResponse` / `NewsResponse` and their parts, real examples) and listed in `.agents/skills/api/SKILL.md`.
- Shape: localized texts, photo `alt`, source names and series name; `locales` lists the article's languages; photo credits as published with `authorId`; body as `sections` of `NewsMark` paragraphs and figures. The list leaves out `sections` and `gallery`.
- List semantics follow the site exactly: only articles with text in the requested locale, newest first with ties by position, and the same hub, region, species and author matching as `src/data/news.ts`. The author text match moved to `src/lib/newsAuthorMentions.ts` so both use one function. `series` is an extra filter.
- Detail falls back to Georgian when the requested locale has no text (`locale: "ka"`).
- `routes/news.test.ts` compares every list, filter and article in all four locales with the site's functions, plus paging, bad input, the fallback and drafts. `responses.test.ts` checks every real news response against the documented schemas.
- The Worker grows from about 195 to 201 KiB gzip.
- **Deploy:** needs `pnpm db:migrate:remote`, `pnpm db:import:news:remote` and `pnpm deploy:api`, by hand, only when the owner says so. Until then production answers 404 for `/v1/news`.

### Original plan

- `GET /v1/news` (`X-Locale`): published articles, newest first (then `position`), **without sections**: slug, title, dek, lead, dates, series, cover photo, related ids, source names. About 31 × a few KB per locale. Optional filters `hub`, `region`, `species`, `author` (credit author id from `news_media.author_id` and `CreditAuthor` marks), `series`. Optional `limit` / `cursor`, same rules as `/v1/catalog`.
- `GET /v1/news/:slug` (`X-Locale`): the full article in that locale with a KA fallback for missing locales (today's `getNewsCopy` behaviour), plus `locales` (which locales really exist) for hreflang.
- Both public, `edgeCache`, `PUBLIC_CACHE`, `X-Cache-Bypass`, entries in `OPERATIONS` and `schemas/responses.ts` with descriptions, tests against the fixture in all four locales.
- Drafts never appear in either response.

---

## Phase 3 — site reads news from the API

### 3.1 — article page, done (code only)

- `src/lib/newsApi.ts`: `getNewsArticle(slug)` loads `GET /v1/news/:slug` in each of the article's `locales` (React `cache`, tags `news` and `news:<slug>`, `revalidate: 3600`) and rebuilds the same `NewsArticle` the compiled data has, so the page components and helpers stay as they are. `getNewsList(locale)` loads `GET /v1/news`. `newsApi.test.ts` shows the rebuild equals every compiled article (photo credits also carry `authorId`).
- `news/[slug]/page.tsx` reads the article from the API. `dynamicParams` is `true`, and `generateStaticParams` comes from `getNewsList` per locale, so an article added in D1 gets a page without a deploy. An unknown slug is a `noindex` 404 as before.
- `newsArticleAlternates(locale, article)` takes the article instead of looking the slug up in the compiled data.
- The MSW test API (`tests/msw/reptilesApi.ts`) now seeds news (`createNewsTestDatabase`).
- Still on the compiled data inside the article page: the series block and "continue reading" (both lists), until 3.2 brings the list consumers over.
- Checked in the browser against a local API (`pnpm dev:api`, local D1 with `db:import:news`) and `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787`: the Georgian and English pages render, with hreflang, JSON-LD and every section, and an unknown slug gives the `noindex` 404.
- **Order before merging to `main`:** production must have the news tables, the data and the API (`db:migrate:remote`, `db:import:news:remote`, `deploy:api`). Otherwise every article page 404s. And per the order note above, `news:import` (create path) should exist first: from 3.1 on, an article added only as MDX is listed by the compiled index but has no article page.

### Original plan

Site loaders in `src/lib/newsApi.ts`: `getNewsList(locale, filters?)` and `getNewsArticle(slug, locale)`, React `cache`, tags `news` and `news:<slug>`, `revalidate: 3600`, like `speciesFetchOptions`. `/api/revalidate` accepts the new tags.

Consumers to make async (each `await`s a loader instead of importing `@/data/news`):

| Slice | Files                                                                                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1   | Article page: `news/[slug]/page.tsx`, `NewsArticlePage.tsx`, `NewsRelatedBlock.tsx`, `NewsSeriesBlock.tsx`. `dynamicParams` becomes `true` with `notFound()` for unknown slugs, so a new article does not need a deploy |
| 3.2   | Index and archive: `news/page.tsx`, `news/page/[page]/page.tsx`, `NewsIndexPage.tsx`, `NewsArchivePage.tsx`, `newsPages.ts`, `newsIndexEntry.ts`                                                                        |
| 3.3   | Cross-links: `HomeFresh.tsx`, `createGroupHubRoute.tsx`, `regions/[id]/page.tsx`, `createSpeciesRoute.tsx`, `authors/[slug]/page.tsx`, `AuthorPage.tsx`                                                                 |

Pure helpers in `src/data/news.ts` and `src/lib/news*.ts` stay and take the article as an argument. Only the lookups move. Node tests reach the API through MSW (`tests/msw/reptilesApi.ts`); DOM tests mock `@/lib/newsApi` with a fixture.

---

## Phase 4 — build-time and SEO consumers

- `sitemap.ts`, `feed.xml` routes (`newsFeed.ts`), `llmsFiles.ts`, `searchIndexBuild.ts`: read `getNewsList` (the list has everything except sections; `llms-full` needs `GET /v1/news/:slug` per article or a `?view=full` list).
- Scripts: `export-seo-graph.ts`, `reptiles-seo.ts`, `fetch-photo-licenses.ts`, `generate-news-schema-images.ts`, `optimize-images.ts --news`. Load from the API the way S2.12a does for species (`tsx` cannot use React `cache` or `next` fetch options).
- Outputs must match the old ones exactly (sitemap, all feeds, all llms files, search index) before the PR merges.

---

## Phase 5 — writes

### Done: create path and `news:import` (code only)

- Migration `0010_news_revisions.sql`: `news_articles.version` (default 1) and `news_revisions` (`source` also allows `import`).
- `POST /v1/admin/news` (token): full validation, including that linked species are published and linked authors are contributors in D1. An existing slug is 409. Creates a **draft** at the end of the order with revision 1 and author links. `?dryRun=true` checks without writing.
- `POST /v1/admin/news/:slug/status` (token): publish or unpublish with `expectedVersion`. Revalidates the site with `news` / `news:<slug>`; `/api/revalidate` now accepts news tags and refreshes the API edge cache for the list and that article in every locale.
- `pnpm news:import <slug> [--dry-run] [--publish] [--actor <name>]` reads the MDX folder with `newsArticleFromMdx` (`readNewsMdxFiles` is shared with `compile-news.ts`) and calls the endpoints through `src/lib/adminNewsApi.ts`. **It does not delete the MDX folder yet**, because the index and other lists still read the compiled MDX until 3.2–3.3.
- A draft cannot be previewed on the site yet; `--publish` creates and publishes in one run. Updating an existing article (`PUT`, `news:export`) is still to do.
- Checked against a local API: dry run, create, the draft hidden from the public endpoint, publish, the public article served, both revisions recorded, and the errors (existing slug, wrong token, no slug).

### Original plan

- `GET` / `PUT /v1/admin/news/:slug` with `{ record, expectedVersion, actor, source, summary }`, `requireToken`, `news_revisions` + version check in one batch, 409 `version_conflict` on a stale version. Same pattern as `speciesWrite.ts`.
- `POST /v1/admin/news` creates a draft article (`status: 'draft'`). Publishing is a status change through `PUT`.
- AI edits to a published article go through `POST …/drafts` + approve (species 2b-c), never a direct write. A new article from `news:import` is already safe: it lands with `status: 'draft'` and stays off the site until the owner publishes it.
- After a write, the API calls `/api/revalidate` through the `SITE` binding with `news`, `news:<slug>`, and the hub, region and species tags the article touches.
- `contentEditorTarget.ts` kind `news` calls the API instead of editing MDX and opening a PR.
- **MDX import workflow (phase 0 decision):**
  - `scripts/news-import.ts` (`pnpm news:import <slug> [--dry-run]`): parse with `newsArticleFromMdx`, then `POST /v1/admin/news` for a new slug or `GET` + `PUT` for an existing one. `--dry-run` validates through the API without saving (a `validate` flag or `POST /v1/admin/news/validate`), so a writer can check the MDX before the real import. Prints the API's 400 details as file and field. On success it deletes the input folder.
  - `scripts/news-export.ts` (`pnpm news:export <slug>`): `GET /v1/admin/news/:slug`, serialize to the four MDX files. Test: export → parse → `toStrictEqual` for every article in the seed.
  - Typed calls in `src/lib/adminNewsApi.ts` (like `adminSpeciesApi.ts`); the scripts use them.
  - Update `AGENTS.md` (News section) and the writing skills: the last step is `news:import`, not a PR with MDX and a `newsSlugs` entry. The order inside a day comes from `position`, which the API sets at the end on create.
  - Images: a new news photo still needs the CDN upload and the derivatives catalog PR (`images:optimize:news`, `images:news-schema`) before the import, because the hero check reads that catalog.

---

## Phase 6 — delete MDX

Remove `src/content/news/`, `scripts/compile-news.ts`, `src/data/news.generated.ts`, `src/data/newsPublish.ts`, `news:compile` from `compile` / `predev` / `prebuild` / `seo:graph` / `images:news-schema`, and `newsContent.test.ts` (its checks now live in `schemas/newsRecord.ts`). **Keep** `src/lib/newsMdx.ts`, `src/lib/newsFrontmatter.ts` and `newsArticleFromMdx`: `news:import` and `news:export` need them. Update `AGENTS.md` (News section) and `.agents/skills/api/SKILL.md` (a "News data in D1" section).

---

## Hard spots

- **MDX and D1 can drift.** MDX is input only. An import over an article edited in the admin must fail on the version check, not overwrite it. Always `news:export` before reworking an existing article in MDX.
- **Review moves from the PR to the draft.** A news MDX PR was the review step. After the move the owner reviews the draft article on the site (preview of `status: 'draft'`) before publishing. Decide how a draft is previewed (local admin, or a token-gated preview route).
- **Build needs the API.** Sitemap, feeds and `llms.txt` are static at build, so `next build` needs `api.reptiles.ge` reachable, as it already does for species.
- **Link validation moves from CI to the API.** Today a broken species link fails `newsContent.test.ts` in CI. After the move it must fail the write. Deleting or unpublishing a species that a news article links needs a check too (or the link renders as plain text).
- **Credit authors.** News credits link to contributors by spelling today. Derive `news_media.author_id` from `author_aliases` on write, the same as species photos.
- **Images catalog** (`optimizedImages.generated.ts`, `newsSchemaImages.json`) stays in the repo, as it does for species. A new news photo still needs a catalog PR until that catalog moves.
- **Fetch cache limit.** One full article is about 46 KB for four locales, so it is far under the 2 MB limit. Never ship a full list with sections to a normal page render.
