# Species content: MDX → D1 migration plan

Status as of 2026-10-22. This file picks up where the work stopped. Binding API rules are in `.agents/skills/api/SKILL.md`; read that first.

## Where things stand

| Phase    | What                                                                                                          | State           |
| -------- | ------------------------------------------------------------------------------------------------------------- | --------------- |
| 1        | Species profile pages render from `api.reptiles.ge` on the server (SSR, no loaders, no MDX fallback)          | ✅ done (#1486) |
| 2a       | Validated, versioned write API: `GET`/`PUT /v1/admin/species/:id`, revisions, import guard, page revalidation | ✅ done (#1487) |
| 2b-a     | Admin photo edits through the API: cover, crop, reorder, remove, coordinates                                  | ✅ done (#1488) |
| 2b-c     | AI text edits become drafts: selection editor + AI page texts, review/approve UI                              | ✅ done (#1489) |
| **2b-b** | Adding a photo (upload + iNaturalist)                                                                         | ⏳ next         |
| **2b-e** | Field records into D1                                                                                         | ⏳              |
| **2b-d** | AI analysis / workflow / super-analysis → drafts                                                              | ⏳              |
| **2b-f** | New species creation                                                                                          | ⏳              |
| 3        | Rest of the site reads species from the API                                                                   | ⏳              |
| 4        | Slugs and 301s in `proxy.ts` from D1/KV                                                                       | ⏳              |
| 5        | Delete species MDX, `compile-species`, generated files, MDX admin helpers                                     | ⏳              |

Recommended order: **2b-b → 2b-e → 2b-d → 2b-f**, then phase 3.

### Production today

- D1 `reptiles-db` has migrations `0001`–`0004` applied: ratings, species catalog, versions/revisions/import guard, drafts.
- `reptiles-api` (`api.reptiles.ge`) is deployed with: species list/detail, ratings, admin record `GET`/`PUT`, photo actions, drafts.
- Secrets: `reptiles-api` has `API_WRITE_TOKEN`, `REVALIDATE_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. The site worker `reptiles` has `REVALIDATE_TOKEN`. Its `API_WRITE_TOKEN` and Telegram secrets are no longer needed there and can be deleted.
- The local admin needs `API_WRITE_TOKEN` in `.env.local`.
- **Species MDX is no longer the source of truth.** Profile pages and API edits use D1. Hubs, search, sitemap, quiz and regions still read the compiled MDX (phase 3).

### Working pattern for every 2b step

1. Pure operation on `SpeciesRecord` in `src/api/lib/` (photos: `speciesPhotos.ts`).
2. API endpoint in `src/api/routes/adminSpecies.ts`. It goes through the `change()` helper (read, apply, validate the whole record, versioned save, revision, revalidate). **AI output goes through `POST …/drafts`, never a direct write.**
3. Typed call in `src/lib/adminSpeciesApi.ts`. The local admin route (`src/app/api/admin/**/route.local.ts`) calls it instead of the MDX/PR helper.
4. Delete the MDX helper and its tests once nothing uses them (`pnpm knip` tells you).
5. Tests: API route tests on the seeded SQLite DB (`createSpeciesTestDatabase`), and admin route tests through MSW (`tests/msw/reptilesApi.ts` + `API_WRITE_TOKEN` stub).
6. A new migration is applied with `pnpm db:migrate` locally. Production gets `pnpm db:migrate:remote` and then `pnpm deploy:api`, run by hand, only when the owner says so.

---

## 2b-b — Adding a photo

**Today**

- `POST /api/admin/photos` (upload form in `AdminSpeciesEditor`) calls `uploadSpeciesPhoto` in `src/lib/adminPhotos.ts`.
  - Validation: 12 MB max, sharp format checks (`prepareOriginal`), `creditFromInput`. `georgia-field` needs a location, and coordinates go through `parsePhotoCoordinatesInput`. Duplicate src is checked.
  - Upload: original plus AVIF/WebP derivatives to Bunny via `optimizeUploadedOriginal`.
  - Then `openPhotoPullRequest`, which runs `appendGalleryItemToSpecies` (KA gallery item; an EN overlay item only when the EN credit differs) and writes `image-manifest.json` + `optimizedImages.generated.ts`.
  - It reads `readAdminSpeciesGallery` (MDX) to pick unique CDN keys.
- `POST /api/admin/inaturalist-photo` only prefills the form. It writes nothing and needs no change.

**Target**

- API: `POST /v1/admin/species/:id/photos` with `{ actor, src, credit?, photoConfidence?, overlays?: { en?: credit } }`. A pure `addPhoto(record, item, overlays)` refuses a duplicate src and appends to the KA gallery, plus the EN overlay when given. It is validated and saved through `change()`.
- Admin: `uploadSpeciesPhoto` reads the existing gallery from `readAdminSpecies` instead of MDX, uploads to the CDN as today, then calls `addAdminSpeciesPhoto`.
- **Derivatives catalog** (`image-manifest.json`, `optimizedImages.generated.ts`) stays in the repo for now. Open a catalog-only PR with `openStandalonePhotoPullRequest([optimized])`, the same as crop does. Moving the catalog to D1 belongs to phase 3.
- Remove `openPhotoPullRequest`, `appendGalleryItemToSpecies`, `appendGalleryItemToMdx` and their tests when they are unused. Check `adminPhotoPullRequest.test.ts`, which still exercises `openPhotoPullRequest`.

**Tests:** API (append, duplicate → 400, EN overlay, validation, 401), admin route through MSW, and the upload helper with the CDN mocked.

---

## 2b-e — Field records into D1

**Today**

- KA frontmatter `fieldRecords[]`: `{ locality*, lat*, lng*, evidence: literature|specimen|observation, date?, note?, observer?, observerName?, source?, url? }`.
- They are compiled into `src/data/fieldRecords.generated.json` and used by the site (occurrence maps, `compile-occurrences.ts`). They are **not** in `species.generated`, so they are **not in D1 yet**.
- `POST /api/admin/field-records` calls `openFieldRecordPullRequest`, which runs `appendFieldRecordToSpecies`. It checks the required locality, parses coordinates, normalizes the evidence and checks for duplicates (locality+lat+lng+date).
- `scripts/import-inaturalist-field-records.ts` also writes them (AI records mode).

**Target**

- Migration `0005_species_field_records.sql`: `species_field_records (id, species_id FK CASCADE, position, locality NOT NULL, lat/lng CHECK ranges, evidence CHECK, date, note, observer, observer_name, source, url)`, with an index on `species_id`.
- Add `fieldRecords` to `SpeciesRecord`, `speciesRows.ts`, `speciesSchema.ts`, the reader (`speciesCatalog.ts`) and `schemas/speciesRecord.ts`. Extend the import, then re-run the round-trip test.
- **One-off import into production:** the species import guard refuses once revisions exist. Write a dedicated, idempotent `db:import:field-records` (insert only where a species has no records yet), or a guarded SQL file. Do not bypass the species guard.
- API: `POST /v1/admin/species/:id/field-records` (append with the duplicate check), plus remove if needed.
- Admin route switches to the API. **Site:** occurrence maps keep reading the compiled JSON until phase 3, so record when the JSON stops being regenerated. Decide whether `compile-occurrences` reads D1 through the API at build time or the maps move to SSR from the API.

---

## 2b-d — AI analysis, workflow, super-analysis

**Today** (all in `src/lib/speciesPageAnalysis.ts`, `speciesSuperAnalysis*.ts`)

- `/api/admin/species-analysis` (modes `analysis|links|lookalikes|records`) and `/api/admin/species-workflow` run an AI CLI with **workspace-write in a git worktree**. They commit and open a PR.
  - lookalikes mode edits `LOOKALIKES` in `src/lib/speciesLookalikes.ts`.
  - records mode also edits range maps (`src/data/speciesRangeMaps/{id}.ts`), `mapRegions.ts` and components.
- `/api/admin/species-super-analysis` runs background jobs with stages analysis → lookalikes → links → texts. The AI returns structured JSON (`superAnalysisResultSchema`). The app applies edits with `applyAnalysisEdits`, validates them heavily (`validateSuperAnalysisResult`: coverage, evidence, numbers, scientific names, links, colors, conservation codes), re-serializes the frontmatter, commits per stage and opens a draft PR.
- The texts step of the workflow already uses `mdxSpeciesTextSource` on the worktree.

**Target**

- **Super-analysis first.** It already produces structured edits. Apply them to a `structuredClone` of the API record instead of MDX: the edit list is `field` + `before` + `after` per locale, `sources` appends, and lookalike pairs into `record.lookalikes`. Keep `validateSuperAnalysisResult`. Create one draft per stage, or one per run. Replace the "Snapshot changed during AI execution" check with the draft `baseVersion` (approval answers 409 if stale).
- **analysis / links / lookalikes modes:** stop giving the AI a writable worktree. Hand it the record as JSON, ask for structured edits (reuse the super-analysis schema), and create a draft.
- **records mode** touches non-species files (range maps, `mapRegions.ts`). Keep it on the PR flow until range maps move (decide in phase 3), or split it: field records go to a draft once 2b-e exists, map files go to a PR.
- Workflow `texts` mode → `processSpeciesTexts` (draft), the same as the standalone button.
- Remove worktree/PR plumbing that becomes unused: `repairSpeciesFrontmatter`, `assertSpeciesContentMatchesBase`, `selectSpeciesAnalysisFiles`, `processWorkflowTexts`, parts of `contentEditorPullRequest.ts`.

---

## 2b-f — New species creation

**Today:** `/api/admin/species-create` validates the input (`validateSpeciesCreationInput`: Latin binomial, derived id) and only returns a Codex prompt. A human then creates 4 MDX files and registers the species in `speciesPublish.ts`, `speciesAtlasMeta.ts`, `herpetofauna-checklist.ts`, `mapRegions.ts`, `speciesLookalikes.ts` and `speciesSlugRules.ts`.

**Target**

- API: `POST /v1/admin/species` creates a **draft** species: `status: 'draft'`, version 1, `catalog_position` at the end, slug from `kaToSlug` and checked for uniqueness against `species_slugs`. It needs a create path in `speciesWrite.ts` (insert, not update) and the same validation. A draft species is not served publicly, because `listPublishedSpecies` and `findPublishedSpeciesId` filter on `published`.
- Publishing = a status change to `published` through `PUT` (needs `slugKa`).
- Still in code until phase 3/4: the herpetofauna checklist status, region membership (`regions.ts` / `mapRegions.ts`) and the 301 slug table. Document what the admin still has to register by hand.
- Optional: AI-assisted first draft. The AI fills the texts and the result lands as a draft (2b-c pattern).

---

## Phase 3 — everything on the API, then delete MDX (decided 2026-10-22)

**Owner decision:** the whole site reads species from the API **at runtime, server-side (SSR)**, the same way profile pages already do. There are no client loaders. Browser-side requests (forms, client search) go to `api.reptiles.ge`. Species MDX is then deleted. The remaining admin flows (2b-b, 2b-d, 2b-f) come later and may be broken in the meantime.

Slices, one PR each, in this order:

| Slice     | What                                                                                                                                                                                                                                                                   | Why first                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S0** ✅ | Field records into D1 (13,817 records for 96 species): migration `0005`, a dedicated one-off import, a read endpoint                                                                                                                                                   | They exist only in MDX. Deleting MDX first would lose data. They stay a separate resource and are not part of `SpeciesRecord`, so a text edit never rewrites 13k rows |
| S1 ✅     | Catalog endpoint + server loader: `GET /v1/catalog?locale` (published species as full localized `Species` + group, habitats, slug, lookalikes), and `getSpeciesCatalog(locale)` (React `cache`, `next.revalidate` + `species` tag, `X-Cache-Bypass`)                   | One fetch feeds every list consumer                                                                                                                                   |
| S2        | Make the data layer async: `getCatalogSpecies`, `speciesAtlas`, `regions`, `speciesRelated`, … become server loaders on the catalog. Pages and server components `await` them. Client components (`HomeGroupCarousel`, `TrackedSpeciesLink`, …) get data through props | About 44 files read the compiled catalog today                                                                                                                        |
| S3        | Build-time and edge consumers: sitemap, `llms.txt`, OG images, the search index (served at runtime from the API or a route instead of `search-index.*.generated`), occurrences maps (`compile-occurrences` → API), `contentDates`                                      | They depend on generated files                                                                                                                                        |
| S4        | Slugs and 301s in `proxy.ts` (phase 4 below), because the edge cannot `await` the whole catalog per request                                                                                                                                                            | Needed before the generated slug table can go                                                                                                                         |
| S5        | Delete species MDX, `compile-species` (species part), `species*.generated`, `fieldRecords.generated.json`, the MDX admin helpers and the `db:import:species*` scripts. Move tests that use the compiled catalog to MSW + `createSpeciesTestDatabase`                   | Phase 5                                                                                                                                                               |

### S2 sub-slices (from the dependency map, 2026-10-22)

`lib/speciesRoutes.ts` (pure slug helpers mixed with catalog code) and `lib/llmsFiles.ts` (robots/headers mixed with catalog builders) make about 250 modules transitively load the compiled catalog, layouts and `not-found` included. Splitting them first shrinks the real consumer list.

1. **S2.1 Decouple, no behaviour change:** split `speciesRoutes.ts` into slug helpers, lookalikes (`LOOKALIKES` + `getSpeciesLookalikes`) and `speciesStaticParams`. Delete the dead `resolveSpecies`/`resolveSpeciesInHub`. Split `llmsFiles.ts` (robots/headers vs builders).
2. **S2.2 Async core libs** on `getSpeciesCatalog(locale, "card")`, which now also returns `photoCount` per species: `speciesAtlas`, `regions`, `atlasList`, `structuredDataDates`, `regionSummary`, `navbarData`, `footerData`. Their direct callers (home, hubs, cluster guides, atlas, venomous and risk pages, regions, layout, `not-found`, sitemap, the SEO script) `await` them. Card data comes localized from the API, so these callers no longer call `localizeSpecies`. `clusterGuides` helpers take any `SpeciesSummary`. `getAtlasStats(locale).lastUpdated` now uses that locale's `updatedAt`. The sitemap fetches one catalog per locale and passes it to the date helpers, because React `cache` does not dedupe in a route. Not yet moved: `speciesRelated` and `getSpeciesGuideLinks` (profile, step 6). Node tests reach the catalog through the default MSW handler; DOM tests mock `@/lib/speciesCatalogApi` with `tests/fixtures/speciesCatalog.ts`.
3. Home page (`Hero`, `HomeFeatured`, `HomeFresh`, `HomeGroups`).
4. Group hubs, species indexes, cluster guides, `species` atlas, and the venomous, risk and yard pages.
5. Regions (`regions`, `regions/[id]`, `regionSummary`, `SnakeRangePage`).
6. **S2.6 Rest of the species profile:** lookalike and related cards come from the card catalog. `speciesRelated` is pure over a catalog you pass in, and a test proves the API cards rank exactly like the compiled catalog. `getSpeciesGuideLinks` and `getSpeciesProfileGuideLinks` take the species instead of looking it up. `speciesStaticParams` reads slugs and groups from the four card catalogs. All 9 species `[slug]` routes have `dynamicParams = true`; an unknown slug still gets `notFound()`. Still on generated data until S4: slug to id (`resolveSpeciesIdInHub`) and the canonical slug check, so a species added only through the API 404s until the slug table moves. The quiz passes the compiled catalog to `getRelatedSpecies` until step 7.
7. **S2.7 Quiz** on a new `quiz` catalog view (card fields plus `identification`, `facts`, `gallery`; about 1.4 MB in ka against 3.7 MB for `full`, which is over the 2 MB Next fetch-cache limit). The quiz page and `getSpeciesQuizTeaser` read it; `snakeQuiz` builders and `getRelatedSpecies` take that catalog, and the teaser pool is memoized per catalog. Pools and teasers match the old output in all four locales. Needs `deploy:api` before the site.
8. **S2.8 News, authors, photo-use** on a new `photos` catalog view (card fields plus `gallery`; about 0.59 MB in ka). `creditAuthors`, `photoUse`, `newsVisual`, `newsSchemaImages`, `news` OG helpers and `newsRelatedSpecies` take catalogs as arguments; async pages and components fetch them (`getSpeciesCatalog(locale)` for names and images, `getCreditPhotoCatalog()` for KA credits). Contributor counts use `getPublishedCreditAuthors().length`. Author, photo-use and news outputs match the old ones in all four locales. Needs `deploy:api` before the site.
9. **S2.9 Layout level.** Measured with a miss log inside `getSpeciesCatalog` (React `cache` miss = one real call), on Next dev and on vinext dev, 2026-10-22:
   - React `cache` dedupes layout and page: one `card` call per locale for the whole render.
   - vinext probes each layout before rendering (`probeReactServerSubtree`, not gated on production). The probe runs outside React's request scope, so `cache` does not dedupe there. `footerData` and `navbarData` each called the catalog, so the probe made 3 calls per request. Fix: the `[locale]` layout fetches the catalog once and passes it to the now pure `getFooterData(locale, catalog)` and `getNavbarData(catalog)` (`summarizeAtlas`, `pickVenomousSnakes`). The probe now makes 1 call.
   - Per page on vinext: probe 1, render 1, `generateMetadata` 1 (its own scope), root `not-found.tsx` 1 (vinext renders it on every request; it needs the KA navbar stats). All are data-cache hits after the first. Going lower needs a request-scoped memo outside React; a module-level in-flight memo is not safe on Workers (promises shared across requests), so it is left as is.
10. **S2.10 SEO outputs.** `llmsFiles` builders take an `LlmsSpecies` bundle (`createLlmsSpecies`: KA base, the id set for links, and a per-locale lookup); `loadLlmsSpecies(locale)` fetches the `full` catalog for ka, en and that locale, and the four `force-static` llms routes call it (static at build, like before). Species OG images and `speciesOgPageMetadata` read `image` from the card catalog. Sitemap species entries use the localized card (`publishedAt`, `updatedAt`) and the KA `photos` catalog for image URLs. All eight llms files, the whole sitemap and every OG URL match the old output.
11. Search index and locale-switch index (client-loaded build artifacts; serve from a route or the API, pass the index as a prop).
12. Scripts and admin, split in two (owner decision, 2026-10-23):
    - **S2.12a** — the pages earlier slices left on the compiled catalog (`Hero`, `HomeFeatured`, `GuideArticlePage`, risk, yard, dangerous-animals and atlas metadata) now read `getSpeciesCatalog(locale)`. The manual scripts load the catalog from the API (`getSpeciesCatalog` works from `tsx`; it hits `api.reptiles.ge` unless `NEXT_PUBLIC_API_ORIGIN` is set): `check-og-images`, `generate-missing-og`, `generate-news-schema-images`, `fetch-photo-licenses` (KA `photos`), `fetch-taxon-identifiers`, `export-seo-graph` (same 1,064 routes) and `reptiles-seo` (`full` per locale, KA dates). `optimize-images` never read the catalog.
    - **S2.12b** — occurrences: `SpeciesProfile` and `SpeciesRangeMap` read `fieldRecords.generated.json` from `compile-occurrences` (MDX); move them to the D1 field-records endpoint at runtime and drop the script.
    - Left for the admin phase: `speciesAnalysisInventory` (AI analysis reads each `ka.mdx`), `adminGalleryMdx`, `adminPhotos`, `speciesImportSource`.

Hard spots: `src/proxy.ts` stays on the generated slug table until S4. Build-time static params need the API to be reachable during `next build`. `tsx` scripts can't use React `cache` or `next` fetch options.

Image derivatives catalog to D1 and the Service Binding from the site to the API also fit in S1–S3.

## Phase 4 — slugs and 301s

`src/proxy.ts` uses `speciesSlugs.generated`. Serve slug resolution from D1 (`species_slugs`) through a KV snapshot updated on writes, so the edge does not query D1 per request.

## Phase 5 — delete MDX

Remove `src/content/species/*`, `scripts/compile-species.ts` (species part), the generated species files, the MDX admin helpers (`adminGalleryMdx.ts` remnants, `contentEditor` species MDX paths), and the `db:import:species*` scripts. Update AGENTS.md (species pipeline section) and the guard tests.
