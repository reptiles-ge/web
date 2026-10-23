# Species API migration: handoff for the next agent

Status as of 2026-10-23. Read this first, then `docs/SPECIES-D1-MIGRATION.md` (the plan and a record of each finished slice) and `.agents/skills/api/SKILL.md` (binding API rules). `AGENTS.md` still applies to everything.

## Goal

Species content lives in D1 (`reptiles-db`) and is served by the `reptiles-api` Worker at `api.reptiles.ge`. The site renders server-side (SSR) from that API, with no client loaders and no MDX fallback. Species MDX is deleted at the end. The admin flows that still write MDX are moved to the API last.

## Where things stand

### Done and merged into `staging`

| Slice  | What                                                                                  | PR    |
| ------ | ------------------------------------------------------------------------------------- | ----- |
| S0     | Field records in D1, read endpoint `/v1/species/:slug/field-records`                  | #1491 |
| S1     | `GET /v1/catalog` and `getSpeciesCatalog(locale, view)`                               | #1492 |
| S2.1   | Split `speciesRoutes` and `llmsFiles` so layouts stop loading the compiled catalog    | #1493 |
| S2.2   | Core libraries async on the card catalog, `photoCount` in the card view               | #1499 |
| S2.6   | Profile lookalikes, related cards, guide links, static params; `dynamicParams = true` | #1500 |
| S2.7   | Quizzes on the new `quiz` view                                                        | #1501 |
| S2.8   | Contributors, photo-use, news image credits on the new `photos` view                  | #1502 |
| S2.9   | Layout fetches the catalog once (vinext layout probe)                                 | #1505 |
| S2.10  | `llms.txt`, `llms-full.txt`, species OG images, sitemap species entries               | #1506 |
| S2.11  | Search index route `/api/search/{locale}`, locale-switch index as a prop              | #1507 |
| S2.12a | Leftover pages and the manual scripts on the API                                      | #1508 |
| S2.12b | Occurrence summaries and map records from the D1 field-records endpoint               | #1514 |
| S4     | Slug table built from the API card catalog at build time (owner chose option B)       | #1517 |
| S5a    | Committed SQL test seed; tests off the compiled catalog                               | #1521 |
| S5b    | Species MDX deleted; MDX-only admin flows answer 503                                  | #1522 |
| L1     | Lookalikes read from the API catalog; `LOOKALIKES` in code deleted                    | #1525 |
| A1     | `authors` in D1 (`is_contributor`), photo `author_id`, `/v1/authors` API              | #1526 |
| A2a    | `authorId` on credits, credit names localized from D1, `CREDIT_PEOPLE` deleted        | #1527 |
| A2b    | Site reads contributors from `/v1/authors`; `src/data/creditAuthors.ts` deleted       | —     |

S2.3–S2.5 (home, hubs, regions) were absorbed by S2.2.

### Production

- The live site is still on `main` (#1484). Everything above is only in `staging`. The live site calls the API only for `/v1/ratings`.
- `reptiles-api` was last deployed as version `62f14818`, built from the #1502 commit. It serves `card`, `photos`, `quiz` and `full` catalog views, the `X-Locale` header, catalog pagination, and the OpenAPI docs at `/v1/docs`.
- D1 migrations `0001`–`0005` are applied on production. The catalog has 145 published species and 13,817 field records.

## Remaining steps, in order

### 1. Release `staging` → `main`

- **Order:** next, after S5. Only the owner decides when.
- **API:** the API is already ahead of `main` and backward compatible, so no API deploy is needed for this.
- **Process:** follow `docs/RELEASING.md`. The PR from `staging` to `main` gets the `skip-changelog` label.
- **After merge:** open the live site and check a profile, a hub, search, the language switcher and `/sitemap.xml`.

### 2. S4 — slugs and 301s (done, build-time)

The owner chose a build-time table over a KV snapshot (2026-10-23). `scripts/compile-species-slugs.ts` (`pnpm slugs:compile`, part of `compile`) builds `src/data/speciesSlugs.generated.ts` from `getSpeciesCatalog("ka")` (`slug`, `group`) plus `KA_SLUG_ALIASES`. `src/proxy.ts`, `createSpeciesRoute`, `speciesRoutes`, `llmsFiles`, the OG route and the profile loader keep reading it through `speciesSlugTable.ts`.

- A new species or a slug change in D1 needs a deploy before its URL resolves.
- Aliases still live in `KA_SLUG_ALIASES` (code); `species_slugs` in D1 holds them too but no public endpoint exposes them.
- The MDX import (`speciesImportSource`) computes its own slugs from MDX, so the test database no longer reads the generated table.
- A KV snapshot refreshed on writes remains the option if deploy-time slugs become a problem.

### 3. S5 — delete species MDX (done)

- **S5a (#1521):** `tests/fixtures/speciesSeed.sql` is the committed test seed (a frozen snapshot of the MDX catalog, all locales, slugs and 13,817 field records). A vitest `globalSetup` loads it into the real API app and caches the localized catalogs for `tests/fixtures/speciesCatalog.ts`. Tests no longer read compiled MDX.
- **S5b:**
  - Deleted: `src/content/species/*`, `scripts/compile-species.ts`, `scripts/speciesFrontmatter.ts`, the SQL export scripts and `db:import:*`, `species.generated.ts`, `fieldRecords.generated.json`, `speciesImportSource`, the API import builders, `adminGalleryMdx`, and the AI analysis code that edited MDX in a worktree (`speciesPageAnalysis`, `speciesSuperAnalysis*`, `speciesAnalysisInventory`, `speciesAnalysisValidation`, the iNaturalist-to-MDX import and its prompts).
  - Kept and moved: content dates now come from `scripts/compile-content-dates.ts` (`pnpm content:compile`, same output). The Halyomorpha profile copy moved to `src/content/halyomorphaProfileCopy.ts`.
  - Local admin: the species list and page, cover, crop, reorder, remove, coordinates, drafts, the text editor and AI page texts work through the API. Adding photos, adding field records, AI analysis, workflow, super-analysis and species creation answer 503 with a message until step 4.
  - `pnpm db:seed:local` loads the test seed into an empty local D1 for `dev:api`. `dev:api` and `deploy:api` no longer run a compile step: the API bundle uses no generated file.

### 4. Admin on the API (last)

Detailed plans are in `docs/SPECIES-D1-MIGRATION.md` (sections 2b-b, 2b-d, 2b-f). Every step uses the working pattern described there:

- a pure operation on `SpeciesRecord`;
- an endpoint in `src/api/routes/adminSpecies.ts` that goes through `change()`;
- AI output goes through `POST …/drafts`, never a direct write;
- a typed call in `src/lib/adminSpeciesApi.ts`;

1. **2b-b Adding a photo:** upload and iNaturalist import.
2. **2b-d AI analysis, workflow, super-analysis:** rebuild on the API record; results become drafts. The old MDX-based design is in `docs/SPECIES-SUPER-ANALYSIS.md`, and the code is in Git history before S5b.
3. **2b-f New species creation:** create the D1 record and every registration (atlas meta, checklist status, regions, lookalikes, slugs) through the API.
4. **Field records:** an API write endpoint and the admin form (the route answers 503 today).

### Open item, any time

`llms.txt`, `llms-full.txt` and `/api/search/{locale}` are `force-static`. They are built once per deploy, so an API edit shows there only after the next deploy. This was already true when they were generated from MDX. A later improvement is tag-based revalidation on species writes.

## How we work

### Branches and PRs

- One slice per branch. Branch from fresh `origin/staging`. Open the PR into `staging` with the `enhancement` label.
- Never push to `main` or `staging` directly. Never cut a release or tag.
- The owner merges.

### Commits

- Stage files by explicit path.
- Another session may be working in the same folder at the same time. It has happened. Check `git status` before committing, and never commit or revert files you did not change.
- Commit messages are one plain sentence.
- End with `Co-Authored-By` if the session asks for it.

### Checks before a PR

All must pass:

- `pnpm exec tsc --noEmit -p .`
- `pnpm test:coverage` (thresholds included)
- `pnpm lint` (0 errors; the two `<img>` warnings in `AdminCoverCrop` are known)
- `pnpm knip`
- `pnpm cpd` (0 clones)
- `pnpm doctor:check` (score must be exactly 100)

### How we verify

**Prove the output did not change.** Before touching a library, snapshot its output for every species and every locale:

- write a throwaway `tsx` script or vitest test that writes JSON to the scratchpad;
- refactor;
- run it again and diff;
- delete the throwaway file.

Every slice so far was identical before and after. Mask only values that are truly volatile, such as the `Generated:` timestamp in llms. In vitest, internal site URLs collapse to the domain because `@/i18n/navigation` is stubbed.

**Browser:** check the changed pages with the dev server (`.claude/launch.json` → `dev`).

- Dev uses the production API by default.
- For an API change that is not deployed yet, run `dev:api` (local D1, port 8787). Put `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787` in a temporary `.env.local`, and delete it afterwards.
- If port 3333 is already taken by someone else's dev server, use it and do not kill it.

### API changes

- **Rules:** follow `.agents/skills/api/SKILL.md`. `src/api/structure.test.ts` enforces the layout.
- **New catalog views:**
  - add the keys to `src/data/speciesTypes.ts` (`SPECIES_*_KEYS`) and the type to `src/data/speciesCatalogTypes.ts`;
  - add the view in `src/api/db/speciesCatalogView.ts` and `src/api/schemas/catalog.ts`;
  - add a strict response schema and an example (`schemas/responses.ts`, `lib/openapiExamples.ts`, `lib/openapi.ts`);
  - extend `routes/catalog.test.ts` and `schemas/responses.test.ts`.
- **Site → API boundary:** the site never imports from `src/api/`. Shared types live in `src/data/`.
- **Deploy:**
  - `pnpm deploy:api` runs only when the owner says so.
  - Always deploy from a clean worktree of the exact commit (`git worktree add --detach … <sha>`, symlink `node_modules`). Never deploy from the shared working tree, which may hold another session's unfinished API changes.
  - After a deploy, check the new endpoint with `curl`, and that the ratings CORS preflight still answers 204.
- **Order:** a site change that needs a new API view must wait for that deploy. CI e2e builds against the production API, so its e2e fails until the deploy. Re-run e2e after the deploy, and cancel a run that started before it.
- **Migrations:** add-only. `pnpm db:migrate` locally; `pnpm db:migrate:remote` only when the owner says so.

## Things that bit us

**React `cache` doesn't dedupe everywhere.** It only works inside a React server render. It does not dedupe in these places:

- route handlers (sitemap, `/api/search`);
- `generateMetadata`;
- vinext's layout probe (`probeReactServerSubtree`, which runs in production too);
- tests.

The fix is to fetch once and pass the catalog down as an argument:

- library functions are pure and take a catalog (`speciesRelated`, `clusterGuides`, `creditAuthors`, `newsVisual`, `regions`, and others);
- async pages and components fetch it.

Never add a module-level in-flight memo. On Workers a promise must not be shared across requests.

**Next does not cache fetch responses over 2 MB.** `full` is 3.7 MB in ka. Use or add a narrow view (`card` ≈ 0.28 MB, `photos` ≈ 0.59 MB, `quiz` ≈ 1.4 MB). `full` is only for build-time outputs (llms, the SEO script).

**Credits must use the ka catalog.** Translations localize photographer names, so matching a photo to an author only works on ka data. Use `getCreditPhotoCatalog()`.

**Tests:**

- Node tests reach the API through the default MSW handler (`tests/msw/server.ts`), which loads the API app lazily.
- DOM tests cannot load `node:sqlite`. They mock `@/lib/speciesCatalogApi` with `tests/fixtures/speciesCatalog.ts`.
- The fixture returns a stable array per locale, so the per-catalog `WeakMap` memos hit. Without this, `quizTeaser.test` took 16 s and timed out on CI.
- The SQLite test adapter runs `batch` calls one at a time, because concurrent catalog requests used to collide.

**Locale and slugs:**

- The locale goes in the `X-Locale` header, not a query parameter.
- On ka, the card `slug` is the Georgian slug; on other locales it is the id.
- The hub of a species is `ANIMAL_GROUP_TO_HUB[group]`. This was checked to match the old slug table for every species.

**Known 404:** the Georgian-path OG route (`/gvelebi/giurza/opengraph-image`) returns 404 on production too. Pages use the CDN `og:image`. It is not a regression from this work.

## Language with the owner

The owner writes in Georgian and English. Answer in the language of the question. Keep PR descriptions and code in English.
