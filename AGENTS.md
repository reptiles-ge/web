<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# reptiles.ge — agent map

Bilingual (KA canonical, EN secondary; RU/TR also live) atlas of animals of Georgia: [reptiles.ge](https://reptiles.ge). Herpetofauna is the deepest layer (Tarkhnishvili et al. 2026 checklist). Birds and mammals have hubs, species-index clusters, and profiles — indexes list published atlas pages, not a complete national fauna.

This file is the project map for agents. Humans: see `README.md`.

## Stack

| Piece        | Detail                                                                              |
| ------------ | ----------------------------------------------------------------------------------- |
| App          | Next.js 16 App Router, React 19, TypeScript strict                                  |
| i18n         | `next-intl` v4 — `src/i18n/`, `messages/ka.json`, `en.json`, `ru.json`, `tr.json`   |
| Style        | Tailwind 4, no CSS-in-JS. Only exception: antd in the admin app (`src/admin/`)      |
| Alias        | `@/*` → `src/*`                                                                     |
| Request edge | `src/proxy.ts` (Next 16 proxy, **not** `middleware.ts`)                             |
| Worker entry | `src/worker.ts` (vinext fetch handler; canonical RSC requests so navigation caches) |
| Images       | `https://cdn.reptiles.ge` (`images.unoptimized: true`)                              |
| Site         | `src/lib/site.ts` — `https://reptiles.ge`, default locale `ka`                      |

Do not add code comments. Do not invent UI copy in one locale only.

## Read first

| Task                          | Start here                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| Species content (D1)          | `.agents/skills/api/SKILL.md`, then `src/lib/speciesProfileApi.ts` / `speciesCatalogApi.ts` |
| Writing style (all prose)     | `src/prompts/writing-style.md` — binding house style; AI prompts load it                    |
| Publish list                  | `src/data/speciesPublish.ts`                                                                |
| Group (snake/lizard/…)        | `src/data/speciesAtlas.ts`                                                                  |
| Public URL / slug             | `src/lib/speciesSlugRules.ts`, `src/lib/speciesSlugTable.ts`                                |
| Localized pathnames           | `src/i18n/pathnames.ts`                                                                     |
| Group hubs                    | `src/lib/groupHubs.ts`, `src/lib/createGroupHubRoute.tsx`                                   |
| Cluster guides                | `src/lib/clusterGuides.ts`, `src/lib/createClusterGuideRoute.tsx`                           |
| Guide articles (bat, wasp, …) | `.agents/skills/guide-article/SKILL.md` (playbook), `src/data/guideArticles.ts`             |
| Species page factory          | `src/lib/createSpeciesRoute.tsx`                                                            |
| Regions + map IDs             | `src/data/regions.ts` — **never infer** `speciesIds`                                        |
| Checklist authority           | `src/data/herpetofauna-checklist.ts`                                                        |
| Quiz registry                 | `src/lib/quizzes.ts`, `src/lib/snakeQuiz.ts`                                                |
| Contributors                  | `src/lib/authorsApi.ts` (`/v1/authors`), `src/lib/creditAuthors.ts`                         |
| News                          | `src/content/news/{slug}/{ka,en}.mdx`, `src/data/news.ts`, `scripts/compile-news.ts`        |
| 301 map                       | `src/proxy.ts` only (slug table: `speciesSlugTable.ts`)                                     |
| UI strings                    | `messages/ka.json` + `messages/en.json` (same keys)                                         |
| Maintenance mode              | `src/lib/maintenance.ts`, wired in `src/worker.ts`                                          |
| Releases, versions, tags      | `docs/RELEASING.md` (playbook), `.github/release.yml`                                       |
| Pinned / patched deps         | `docs/DEPENDENCIES.md` (vinext patch, img-compression SHA)                                  |
| API Worker (Hono, D1)         | `.agents/skills/api/SKILL.md` (binding rules), `src/api/`, `wrangler.api.jsonc`             |
| Admin app (admin.reptiles.ge) | `src/admin/`, `vite.admin.config.ts`, `wrangler.admin.jsonc`                                |

## Architecture

```text
src/app/[locale]/          routes (folder names = internal English pathnames)
src/components/            pages + UI
species content            D1 (reptiles-db) → reptiles-api (api.reptiles.ge) → server loaders in src/lib/
src/data/speciesSlugs.generated.ts gitignored (Edge slug table, from the API)
src/app/api/search/[locale] search index JSON, built from the API catalog (static per deploy)
src/content/news/{slug}/  ka.mdx + en.mdx (+ ru/tr) → compile → src/data/news.generated.ts (gitignored)
src/content/guides/{id}.ts long-form guide articles (all locales) → src/data/guideArticles.ts
src/data/news.ts           published news registry
src/lib/                   routing, SEO, quiz, clusters, news
src/i18n/                  next-intl routing + pathnames
messages/                  KA + EN copy
scripts/compile-*.ts       predev / prebuild
```

Route pages are thin factories:

- Hub: `createGroupHubRoute("snakes")` in `src/app/[locale]/snakes/page.tsx`
- Guide: `createClusterGuideRoute("snake-bite")` in `…/snakes/gvelis-nakbeni/page.tsx`
- Species: `createSpeciesHubRoute("snakes")` in `…/snakes/[slug]/page.tsx`
- Guide article: `createGuideArticleRoute("/mammals/ghamura-sakhlshi")` in `…/mammals/ghamura-sakhlshi/page.tsx`

Internal hrefs use English pathnames (`/snakes`, `/snakes/[slug]`). Public KA URLs are Georgian (`/gvelebi`, `/gvelebi/giurza`). EN keeps English/scientific slugs (`/en/snakes/macrovipera-lebetina`). `Link` / `getPathname` from `@/i18n/navigation` — never hardcode locale prefixes.

Default locale has **no** `/ka` prefix (`localePrefix: as-needed`). `/ka` and `/ka/…` 301 via `src/proxy.ts`.

## Catalog

- **146** species in D1, **145** published. `dolichophis-caspius` is unpublished and 302s to the snake hub.
- Groups: 22 published snakes, 29 lizards, 4 turtles, 12 amphibians, 45 birds, 17 mammals, 8 spiders, 4 scorpions, 4 insects.
- SSOT for live pages, quiz, atlas, search: the API, through `getSpeciesCatalog(locale, view)` and `getSpeciesProfile(id, locale)` — never a parallel species list.
- Atlas group + habitat tags: `speciesAtlasMeta` in `src/data/speciesAtlas.ts`. Adding a species without this entry will break grouping.
- Nose-horned viper: the taxon is _Vipera ammodytes_, subspecies _transcaucasiana_ (Tarkhnishvili et al. 2026), and the species id is `vipera-transcaucasiana`. `vipera-ammodytes` URLs 301 to that single profile. Name it _Vipera transcaucasiana_ only as an older or alternative name (2009 IUCN account).
- `Macrovipera lebetinus` vs species id `macrovipera-lebetina`: explained on the გიურზა profile. Do not contradict it elsewhere.

## Species content (D1)

There is no species MDX. Species content lives in D1 and is served by `reptiles-api`; the site renders it on the server. Read `.agents/skills/api/SKILL.md` before changing anything about it.

1. Edit through the local admin (`/admin` with `pnpm dev`). Text edits and AI page texts become drafts for approval; cover, crop, reorder, remove and coordinates write through the API. Adding photos or field records, AI analysis and workflow, and new species creation answer 503 until the admin phase moves them to the API.
2. The record rules are enforced by `src/api/schemas/speciesRecord.ts`: KA owns taxonomy, `danger`, images and `sources`; `en` / `ru` / `tr` translate the text and may re-credit KA photos by `src`; `faq`, `facts`, `stats` and `identification.traits` counts and `identification.colors` match KA.
3. Lookalikes live in D1 (`species_lookalikes`, part of the species record). Every catalog view returns them both ways (`lookalikes`), and the site reads them from there for the lookalike and related cards, the quiz and `llms`. Still in code and read by the site: `speciesAtlasMeta` (group, habitats), `featuredSpeciesIds` / `unpublishedSpeciesIds` in `src/data/speciesPublish.ts`, and the KA slug rules (`KA_SLUG_OVERRIDES` / `KA_SLUG_ALIASES` in `speciesSlugRules.ts`). A species needs these entries too until the admin phase moves them.
4. `pnpm slugs:compile` (part of `compile`) builds the gitignored slug table from the API card catalog, so a slug change or a new species reaches `src/proxy.ts` on the next deploy. `src/proxy.ts` must import lookup from `speciesSlugTable.ts`, not `speciesRoutes.ts`.
5. Range map on a profile: only if the id is in some `regions[].speciesIds` or the species has field records in D1. Region membership is a data task in `regions.ts`.
6. Tests read species from `tests/fixtures/speciesSeed.sql`, a frozen snapshot taken when MDX was deleted, through the MSW API (`tests/msw/reptilesApi.ts`) and `tests/fixtures/speciesCatalog.ts`. They never read production data.

Empty/placeholder fields are hidden by `src/lib/speciesContent.ts`. Prefer a missing field over invented size, region, IUCN category, or Red List status.

Reference profiles: `macrovipera-lebetina`, `paralaudakia-caucasia`, `pseudopus-apodus`.

## Content integrity (non-negotiable)

This is a public scientific atlas, not a blog.

- **Do not invent.** No locality, region, measurement, IUCN/national status, venom effect, or endemic claim without a source already used on the site (see below).
- **Regions:** add a species id to `regions.ts` only when Tarkhnishvili et al. 2026 (DOI `10.3897/caucasiana.5.e189214`) — or a profile that already cites a locality — names that administrative unit. “Georgia”, “Caucasus”, “Colchis”, habitat type, IUCN global range, or a neighbouring region is **not** enough.
- **Candidate taxa:** keep the checklist note. Status lives in `src/data/herpetofauna-checklist.ts` (`confirmed` \| `candidate` \| `introduced`) for amphibians and reptiles only. Do not “confirm” a species Tarkhnishvili marks as candidate. Birds, mammals, and spiders are out of scope for that map.
- **Darevskia:** 16 species; colour is not ID. Do not collapse them.
- **Medical:** bite / venom / yard pages are educational. Call **112**. Not first-aid protocol, not `MedicalWebPage` schema. `malpolon-insignitus` is Moderate / rear-fanged — not გიურზა.
- **No source names in profile prose:** every species text field, in all four locales, states the fact, not who reported it. No authors (`Gorgadze-ის კვლევაში`, `Kopaliani et al. 2014`), organisations or surveys named as a source, and no `X აღნიშნავს` / `X-ის მიხედვით` / `according to X` framing. Keep the year, place, kind of evidence (survey, report, estimate) and scope: `2006–2007 წლებში ალაზანზე…`. Sources belong only in `sources`. IUCN / Georgian Red List categories with their year, checklist status, and a taxonomic authority after a scientific name (`Ognev, 1931`) stay. This is an owner rule; do not reverse it for E-E-A-T or GEO.
- **Photos:** CDN URLs are often generic. Do not mark Georgia-field-verified without evidence. Keep credit; placeholder is OK.
- No `FAQPage` schema on guide pages (guide articles, cluster guides, `/snakes-in-the-yard`, `/venomous-snakes`). Google retired FAQ rich results on 2026-05-07. Keep the visible FAQ sections.

Sources we trust: Tarkhnishvili et al. 2026; Iankoshvili & Tarkhnishvili 2021 (when the checklist cites it); IUCN **species-specific** URL; Georgia Red List only when the profile already cites it.

## Public URL map

KA is canonical. EN uses the English pathname. Old `/species/{id}` 301s in `proxy.ts`. Folder under `src/app/[locale]/` matches the **internal** pathname.

| KA                                                     | EN                                                          | Kind                                                |
| ------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------- |
| `/`                                                    | `/en`                                                       | Home                                                |
| `/species`                                             | `/en/species`                                               | Atlas                                               |
| `/gvelebi`                                             | `/en/snakes`                                                | Hub                                                 |
| `/gvelebi/saxeoebebi`                                  | `/en/snakes/species`                                        | Index                                               |
| `/gvelebi/shxamiani-gvelebi`                           | `/en/venomous-snakes`                                       | Guide                                               |
| `/gvelebi/shxamiani-gvelis-amocnoba`                   | `/en/snakes/identify-venomous`                              | Guide                                               |
| `/gvelebi/gvelis-nakbeni`                              | `/en/snakes/bite`                                           | Guide (educational)                                 |
| `/gvelebi/gavrtseleba`                                 | `/en/snakes/range`                                          | Guide                                               |
| `/gvelebi/didi-gvelebi`                                | `/en/snakes/largest`                                        | Guide                                               |
| `/gvelebi/gveli-ezoshi`                                | `/en/snakes-in-the-yard`                                    | Guide                                               |
| `/gvelebi/giurza` (etc.)                               | `/en/snakes/macrovipera-lebetina`                           | Species                                             |
| `/xvlikebi` …                                          | `/en/lizards` …                                             | Hub + index + ID + Darevskia + glass-lizard compare |
| `/xvlikebi/darevskia`                                  | `/en/lizards/darevskia`                                     | Guide (colour is not ID)                            |
| `/kuebi` …                                             | `/en/turtles` …                                             | Hub + index + land + freshwater + ID                |
| `/amfibiebi` …                                         | `/en/amphibians` …                                          | Hub + index + frogs guide + frogs index + newts     |
| `/prinvelebi`, `/prinvelebi/saxeoebebi`                | `/en/birds`, `/en/birds/species`                            | Hub + published-profile index                       |
| `/dzuzumtsovrebi`, `/dzuzumtsovrebi/saxeoebebi`        | `/en/mammals`, `/en/mammals/species`                        | Hub + published-profile index                       |
| `/dzuzumtsovrebi/ghamura-sakhlshi`                     | `/en/mammals/bat-in-the-house`                              | Guide article                                       |
| `/mtserebi/krazanis-bude`                              | `/en/insects/wasp-nest`                                     | Guide article                                       |
| `/regions`, `/regions/{id}`                            | same                                                        | 12 regions                                          |
| `/quiz`, `/quiz/romeli-gvelia`, `/quiz/romeli-xvlikia` | `/en/quiz`, `/en/quiz/which-snake`, `/en/quiz/which-lizard` | Hub + two live quizzes                              |
| `/riskis-doneebi`                                      | `/en/risk-to-humans`                                        | Risk legend                                         |
| `/about`, `/contact`                                   | `/en/about`, `/en/contact`                                  | Site                                                |
| `/news`, `/news/{slug}`                                | `/en/news`, `/en/news/{slug}`                               | News                                                |
| `/kontributorebi`                                      | `/en/contributors`                                          | Contributor index                                   |
| `/kontributorebi/sandro-khakhva` (etc.)                | `/en/contributors/sandro-khakhva`                           | Contributor page                                    |

There is **no** `/konservacia` cluster. Conservation copy lives on profiles, not standalone Red List guides.

`src/app/[locale]/[...rest]/page.tsx` is 404 `noindex`. Do not create thin duplicate URLs.

New cluster page checklist: `pathnames.ts` → `RESERVED_HUB_SLUGS` → `CLUSTER_GUIDES` + factory page → messages in KA/EN/RU/TR → 301s in `src/proxy.ts` for any old/cross-locale slug.

## Guide articles

Long-form, answer-first practical guides (bat in the house, wasp nest, …) use one shared builder. **Before adding or editing one, read `.agents/skills/guide-article/SKILL.md`.**

- One content file per article: `src/content/guides/{id}.ts` with `defineGuideArticle({...})`. It holds copy (4 locales), images, sources, and search keywords.
- Register it in `src/data/guideArticles.ts` and `src/data/guideArticlePaths.ts`. The route is a 3-line `createGuideArticleRoute(path)` page.
- Sitemap, site search, `llms.txt`, footer and home SEO links, navbar, and the KA↔Latin 301s (`src/proxy.ts`) derive from the registry. Do not hand-add them.
- `src/data/guideArticles.test.ts` fails on any missing wiring: pathnames, reserved slugs, dates, hub card, messages, images, and locale parity. Do not weaken it.
- The `summary` renders as an "In short" (მოკლედ) box after the last section. Never render it under the H1 (owner decision, enforced by the guard test).
- Every guide needs a 1200×630 JPEG share image: `pnpm images:og-guides --guide <id>` renders it from the hero with `@reptiles-ge/img-compression` (`--upload` sends it to the CDN).
- `src/proxy.ts` and client components import `guideArticlePaths.ts` only, never the registry with copy.

## API

The API is a second Worker, `reptiles-api` (Hono on D1 `reptiles-db`), in `src/api/` with its own `wrangler.api.jsonc`. **Before adding or editing anything in `src/api/`, `migrations/api/`, or `wrangler.api.jsonc`, read `.agents/skills/api/SKILL.md`.** Its rules are binding.

- Layout: `app.ts` mounts one sub-app per resource from `routes/` under `/v1/`; SQL only in `db/`; input only through `validate()` and Zod schemas; errors only through `ApiError` / `lib/errors.ts`.
- `src/api/structure.test.ts` fails on any break of that layout. Do not weaken it.
- Species content is written only through `PUT /v1/admin/species/:id` and approved drafts (validated, versioned, revisioned, revalidates the site).
- Every species page and list loads its content from `api.reptiles.ge` on the server (`src/lib/speciesProfileApi.ts`, `speciesCatalogApi.ts`, `speciesFieldRecordsApi.ts`), with no client loaders.
- D1 is the source of truth for species (`0002_species.sql`, `0005_species_field_records.sql`). Species MDX was deleted in S5.
- Photo authors live in D1 too (`0006_authors.sql`): every photographer is an `authors` row, `is_contributor` marks the ones with a contributor page, and photos link to them through `author_aliases`. The site reads contributors from `/v1/authors` (`getContributors(locale)` in `src/lib/authorsApi.ts`) and links a photo credit to a contributor page by its `authorId` (`creditContributor` in `src/lib/contributorCredits.ts`). There is no contributor list in code; add or edit one through the admin API.
- Migrations are add-only (`migrations/api/NNNN_name.sql`) and never run on their own: not from `dev`, build, deploy, or CI. Apply them by hand with `pnpm db:migrate` (local) or `pnpm db:migrate:remote` (production, owner asks only).
- Secrets live in `.dev.vars` (gitignored) and `wrangler secret`. Never in code, config, or chat.
- The browser posts site ratings straight to `https://api.reptiles.ge/v1/ratings` through `src/lib/apiClient.ts`. The API checks the origin, rate-limits, stores in D1, and sends the Telegram notice. The site has no `/api/rating` route and no rating bindings.

## Admin app

`admin.reptiles.ge` is a third Worker, `reptiles-admin`, in `src/admin/`: a Vite + React single-page app with antd, built by `vite.admin.config.ts` into the gitignored `dist-admin/` and served as static assets (`wrangler.admin.jsonc`, SPA fallback). Its build and deploy are separate from the site's.

- **CSS-in-JS exception:** antd (CSS-in-JS) is allowed only in `src/admin/`. ESLint (`@typescript-eslint/no-restricted-imports`) fails on `antd` or `@ant-design/*` anywhere else in `src/`, so it never reaches the reptiles.ge bundle. The site stays Tailwind only.
- **Sign-in:** admins sign in against the API (`/v1/auth/login`, users in D1, an `HttpOnly` session cookie; see "Admin users and sessions" in `.agents/skills/api/SKILL.md`). `src/admin/session.ts` is the only place the app talks to the API, through `createApiClient` with `credentials: "include"`. `vite.admin.config.ts` passes only `NEXT_PUBLIC_API_ORIGIN`, `NEXT_PUBLIC_SITE_URL` and `VERCEL_ENV` to the browser.
- There is no sign-up. The owner creates an admin with `POST /v1/admin/users` and the write token.
- **URL:** `admin.reptiles.ge` is a Custom Domain in `wrangler.admin.jsonc`, so `pnpm deploy:admin` attaches it (Cloudflare creates the DNS record and certificate). `workers_dev` and `preview_urls` stay off, so it has no other URL. Deploy the admin only after the API with migration `0009` is live, and from a checkout of `staging` or `main`, never a feature branch.
- `src/admin/public/_headers` sends `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `nosniff` and `no-referrer` on every response.
- Never put `API_WRITE_TOKEN` or any other secret in admin browser code.
- `pnpm deploy:admin` runs only when the owner says so. The order is `pnpm db:migrate:remote`, `pnpm deploy:api`, create the first admin (`POST /v1/admin/users`), then `pnpm deploy:admin`.
- Until features move over, the working admin is still the local `/admin` in the site (`pnpm dev`).
- Local: `pnpm db:migrate`, `pnpm dev:api` (with `ALLOWED_ORIGINS` including `http://localhost:3002` and an `API_WRITE_TOKEN` in `.dev.vars`), then `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787 pnpm dev:admin`.

## Quiz

- Registry: `QUIZ_INDEX` in `src/lib/quizzes.ts`. Live: `snake` (`romeli-gvelia` / `which-snake`) and `lizard` (`romeli-xvlikia` / `which-lizard`). Turtle stays `soon` (no href, no URL).
- Engine: `src/lib/snakeQuiz.ts`. Snake pool = published snakes; glass lizard must never be a snake option (`isSnakeSpecies`). Lizard pool = published lizards, including the glass lizard. Darevskia stay separate species; colour is not ID.
- Landing is indexable. Question / score / session are **client state** — never add `/quiz/.../result` or query-param indexable modes.
- Intent: snake quiz owns `რომელი გველია`. Lizard quiz owns `რომელი ხვლიკია` — not `/xvlikebi/identifikacia` (`ეს რა ხვლიკია?`). Do not add `/quiz/gvelis-amocnoba` or a lizard-identify quiz slug. Do not clone quiz page folders.
- A further live quiz still needs a new registry entry + unique intent.

## News

- Copy: `src/content/news/{slug}/{ka,en,ru,tr}.mdx`. `pnpm news:compile` (also `compile` / `predev` / `prebuild`) writes the gitignored `src/data/news.generated.ts`. Consumers read it through `src/data/news.ts`, never directly. The article page (`/news/{slug}`) already reads D1 through `src/lib/newsApi.ts` (`getNewsArticle`), so a new article needs its D1 rows to get a page; see `docs/NEWS-D1-MIGRATION.md`.
- New article: add the folder and put its slug in `newsSlugs` (`src/data/newsPublish.ts`). The list order breaks ties between articles with the same `publishedAt`; newest additions go first. Then `pnpm news:import <slug> --publish` (first with `--dry-run`) puts it in D1, which the article page reads. Only the owner runs the import against production.
- KA frontmatter owns the shared data: `slug`, `status`, `publishedAt`, `updatedAt`, `related{Hub,Region,Species}Ids`, `sources`, `image`, `gallery` (src, `alt`, credit, size, `plate`, `fromAtlas`). Every locale has `title`, `dek`, `lead`, `metaTitle`, `metaDescription`. `en`/`ru`/`tr` translate the text and give only `{ src, alt }` for `image` / `gallery` (matched by `src`). Do not copy the photo list.
- Body: each `## heading` is a section, each paragraph a block, `<Figure src="…" />` on its own line a figure. Inline marks: `<Species id="…">label</Species>`, `<Region id="…">`, `<Hub id="…">`, `<CreditAuthor slug="…">`, `<NewsIndex>label</NewsIndex>`, `<Sci>Latin name</Sci>`, and `[label](https://…)` for external links. Escape a literal `\`, `<`, `{`, `}`, `[` or `]` with `\`. Anything else fails the compile.
- `src/data/newsContent.test.ts` checks that every locale has the same figures in the same order and the same section count, and that every linked species, region, hub and contributor exists.
- Public URLs: `/news`, `/news/{slug}` (KA unprefixed; `/en/news/…`). Do not add `/ka/news` as a live URL — `/ka/…` 301s via `src/proxy.ts`.
- No category or tag archive URLs. Drafts stay out of `getPublishedNewsArticles()`, sitemap, and `generateStaticParams`.
- Reuse `localeAlternates` / `JsonLd` / sitemap `pageEntry`. Do not invent a parallel blog.
- Do not invent counts, quotes, or species totals beyond the cited source.
- Hero (`image` in KA frontmatter) must be landscape and at least 1200 px wide at the served size (`src/lib/newsHeroImage.ts`); `pnpm news:compile` fails for articles from 2026-10-21 on and warns for older ones. Urgent news without a fitting photo: `heroImageException: <reason>` (KA only, at most 3 open, remove it once the hero is replaced).

## SEO

- Unique title / H1 / description. Species: H1 = common name; title often `absolute` (no ` — Reptiles` double suffix).
- `hreflang` via `localeAlternates` / `speciesAlternates` (`x-default` = KA).
- BreadcrumbList on cluster and species pages. No FAQPage on guides; elsewhere FAQPage only if the FAQ is visible.
- Bite pages use the guide-article `Article`, never `MedicalWebPage` or other medical schema.
- The Organization node lives only in the layout graph (`siteGraphJsonLd`); everywhere else use `organizationRef()`. Authorship stays with the organization. No `HowTo`, no home `Dataset`.
- `www.reptiles.ge` → apex 301. API routes send `X-Robots-Tag: noindex`.

## Maintenance mode

Kill-switch only; normal deploys are atomic and need none. `src/worker.ts` answers before the app runs, so it works when the app is broken.

- On: set the Worker variable `MAINTENANCE_MODE` to `on`. Off: `off`. Nothing switches it off automatically — a 503 that lasts more than a day or two costs rankings, so turn it off as soon as the work is done.
- Every URL answers `503` + `Retry-After` + `Cache-Control: no-store` at its own address. Never a redirect, a `200`, a `noindex`, or a `robots.txt` disallow. `/robots.txt` stays live.
- Team bypass: secret `MAINTENANCE_BYPASS_TOKEN`, sent as the `maintenance_bypass` cookie or `x-maintenance-bypass` header.
- Copy for all four locales lives in `src/lib/maintenance.ts` (inline, no app imports). A git deploy resets the variable to the value in `wrangler.jsonc`.

## Releases

**Before cutting a release or writing release notes, read `docs/RELEASING.md`.**

- A release is a `vMAJOR.MINOR.PATCH` tag plus a GitHub Release on a `main` commit that is already live. It is not a deploy; `main` deploys on every push.
- Only the owner decides when to release. Never cut one unprompted, never move or delete a tag.
- The tag is the version. Do not bump `package.json` or add a `CHANGELOG.md`.
- The footer version comes from the latest tag at build time (`scripts/compile-release-version.ts` → gitignored `src/data/releaseVersion.generated.ts`). Do not hardcode it.
- Label every pull request into `staging` (`enhancement`, `content`, `bug`, `documentation`, `dependencies`); label `Staging to main` pull requests `skip-changelog`.
- Any work on a specific page's text, internal links, or photos (upload, replace, reorder) gets the `content` label, even when it is a correction.

## Commands

```bash
pnpm dev                  # compile (news, content dates, slug table, map), then next dev
pnpm build
pnpm lint
pnpm doctor               # React Doctor health scan
pnpm doctor:changed       # only issues introduced vs the base branch
pnpm doctor:check         # fails unless the React Doctor score is exactly 100
pnpm content:compile      # content dates and release version
pnpm slugs:compile        # slug table from the API card catalog
pnpm news:compile         # news MDX → src/data/news.generated.ts
pnpm i18n:check           # locale key parity + ICU argument check (KA is the source)
pnpm i18n:usage           # fails on any unused or undefined key; filters i18n-check's dynamic-key false positives
pnpm test:coverage        # vitest with v8 coverage; fails below the thresholds in vitest.config.ts
pnpm cpd                  # jscpd copy-paste scan, fails on any clone (threshold 0)
pnpm dev:api              # API Worker on :8787 (local D1; never applies migrations)
pnpm db:migrate           # apply API migrations to the local D1 (by hand only)
pnpm db:seed:local        # load the test seed into an empty local D1
pnpm dev:admin            # admin app (Vite) on :3002
pnpm build:admin          # admin app → dist-admin/
pnpm preview:admin        # build, then serve dist-admin/ with wrangler dev on :3003
```

`pnpm typecheck` (`tsc --noEmit`) after routing or catalog changes (run `pnpm compile` first if a generated file is missing).

Tests: `src/**/*.test.ts` run in Node (network mocked with MSW, `tests/msw/server.ts`; an unhandled request fails the test). `src/**/*.test.tsx` run in happy-dom with Testing Library. Every component counts toward coverage. `vitest.config.ts` sets per-glob thresholds (`src/lib/**`, `src/data/**`, a lower floor for `src/components/**`) on top of the global one; raise a floor when coverage grows, never lower it. `coverage.exclude` lists only untested dev/admin files and thin route files. `src/lib/coverageConfig.test.ts` fails on an entry that matches no file or a listed file that has a test.

## Open work (do not assume done)

- Georgia-field photo verification (`photoConfidence: georgia-field` needs photographer + Georgia locality; do not tag generic CDN images).
- Conservation cluster pages — not implemented; do not link them.
- Further quizzes (turtle / amphibian / venomous-practice) — only after a unique intent slot and the existing registry.
- Region fauna is incomplete by design where the paper names no admin unit.

## Do not

- Commit or hand-edit `src/data/speciesSlugs.generated.ts` or the other `*.generated.*` files (gitignored; `predev` / `prebuild` writes them).
- Add species MDX or another file-based species source. Species content changes go through the API.
- Fill empty scientific fields with plausible prose.
- Add `middleware.ts` (use `src/proxy.ts`).
- Add `redirects()` to `next.config.ts`. Production runs on vinext, which never applies it; every 301 lives in `src/proxy.ts`.
- Call next-intl server APIs with an implicit locale (`getTranslations("ns")`, `getLocale()`, `getMessages()`), call `setRequestLocale` outside a `[locale]` layout or page, or render the RSC `Link` from `@/i18n/navigation` in a layout-level server component (use `LocalizedLink`). On vinext an implicit locale falls back to `headers()` and makes every page uncacheable. ESLint enforces the first rule.
- Ship one-locale copy or one-locale MDX.
- Read `process.env` directly for the variables in `src/lib/env.ts`; use `publicEnv()` / `serverEnv()` (Zod-validated, checked at startup in `instrumentation.ts`). Exempt: a literal `process.env.NODE_ENV === "production"` check (and `NEXT_RUNTIME` in `instrumentation.ts`). The bundler inlines it, so dev-only code (axe, admin, Sentry sampling) drops out of production and client bundles; `publicEnv()` would keep it. Use `publicEnv()` when the code needs any other variable.
- Index quiz results or duplicate identify-guide intent on a new quiz slug.
- Treat `CONTENT-ROADMAP.md` / `QUIZ-MODULE-AUDIT.md` as current — they were removed as stale.
