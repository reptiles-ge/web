<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# reptiles.ge — agent map

Bilingual (KA canonical, EN secondary; RU/TR also live) atlas of animals of Georgia: [reptiles.ge](https://reptiles.ge). Herpetofauna is the deepest layer (Tarkhnishvili et al. 2026 checklist). Birds and mammals have hubs, species-index clusters, and profiles — indexes list published atlas pages, not a complete national fauna.

This file is the project map for agents. Humans: see `README.md`.

## Stack

| Piece        | Detail                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| App          | Next.js 16 App Router, React 19, TypeScript strict                                |
| i18n         | `next-intl` v4 — `src/i18n/`, `messages/ka.json`, `en.json`, `ru.json`, `tr.json` |
| Style        | Tailwind 4, no CSS-in-JS                                                          |
| Alias        | `@/*` → `src/*`                                                                   |
| Request edge | `src/proxy.ts` (Next 16 proxy, **not** `middleware.ts`)                           |
| Images       | `https://cdn.reptiles.ge` (`images.unoptimized: true`)                            |
| Site         | `src/lib/site.ts` — `https://reptiles.ge`, default locale `ka`                    |

Do not add code comments. Do not invent UI copy in one locale only.

## Read first

| Task                           | Start here                                                                |
| ------------------------------ | ------------------------------------------------------------------------- |
| Species profile / MDX          | `src/content/species/{id}/{ka,en}.mdx`, then `scripts/compile-species.ts` |
| Catalog, publish, danger       | `src/data/species.ts`                                                     |
| Group (snake/lizard/…)         | `src/data/speciesAtlas.ts`                                                |
| Public URL / slug / lookalikes | `src/lib/speciesSlugRules.ts`, `src/lib/speciesSlugTable.ts`, `src/lib/speciesRoutes.ts` |
| Localized pathnames            | `src/i18n/pathnames.ts`                                                   |
| Group hubs                     | `src/lib/groupHubs.ts`, `src/lib/createGroupHubRoute.tsx`                 |
| Cluster guides                 | `src/lib/clusterGuides.ts`, `src/lib/createClusterGuideRoute.tsx`         |
| Species page factory           | `src/lib/createSpeciesRoute.tsx`                                          |
| Regions + map IDs              | `src/data/regions.ts` — **never infer** `speciesIds`                      |
| Checklist authority            | `src/data/herpetofauna-checklist.ts`                                      |
| Quiz registry                  | `src/lib/quizzes.ts`, `src/lib/snakeQuiz.ts`                              |
| Contributors                   | `src/data/creditAuthors.ts`, `src/lib/creditAuthors.ts`                   |
| News                           | `src/data/news.ts`, `src/content/news/`, `src/lib/news.ts`                |
| 301 map                        | `next.config.ts` **and** `src/proxy.ts` (slug table: `speciesSlugTable.ts`) |
| UI strings                     | `messages/ka.json` + `messages/en.json` (same keys)                       |

## Architecture

```text
src/app/[locale]/          routes (folder names = internal English pathnames)
src/components/            pages + UI
src/content/species/{id}/  ka.mdx + en.mdx (+ ru/tr) → compile →
src/data/species.generated.ts   gitignored
src/data/speciesSlugs.generated.ts gitignored (Edge slug table)
src/data/search-index.{ka,en,ru,tr}.generated.ts gitignored
src/content/news/{slug}.ts first-class news articles (all locales)
src/data/news.ts           published news registry
src/lib/                   routing, SEO, quiz, clusters, news
src/i18n/                  next-intl routing + pathnames
messages/                  KA + EN copy
scripts/compile-species.ts predev / prebuild
```

Route pages are thin factories:

- Hub: `createGroupHubRoute("snakes")` in `src/app/[locale]/snakes/page.tsx`
- Guide: `createClusterGuideRoute("snake-bite")` in `…/snakes/gvelis-nakbeni/page.tsx`
- Species: `createSpeciesHubRoute("snakes")` in `…/snakes/[slug]/page.tsx`

Internal hrefs use English pathnames (`/snakes`, `/snakes/[slug]`). Public KA URLs are Georgian (`/gvelebi`, `/gvelebi/giurza`). EN keeps English/scientific slugs (`/en/snakes/macrovipera-lebetina`). `Link` / `getPathname` from `@/i18n/navigation` — never hardcode locale prefixes.

Default locale has **no** `/ka` prefix (`localePrefix: as-needed`). `/ka` and `/ka/…` 301 via `src/proxy.ts`.

## Catalog

- **126** MDX folders, **126** featured IDs, **125** published (`featuredSpeciesIds` minus `unpublishedSpeciesIds`). `dolichophis-caspius` is unpublished and 302s to the snake hub.
- Groups: 22 published snakes, 29 lizards, 4 turtles, 12 amphibians, 39 birds, 15 mammals, 4 spiders.
- SSOT for live pages, quiz, atlas, search: `getCatalogSpecies()` — never a parallel species list.
- Atlas group + habitat tags: `speciesAtlasMeta` in `src/data/speciesAtlas.ts`. Adding a species without this entry will break grouping.
- `vipera-ammodytes` is not a taxon here; 301 → `vipera-transcaucasiana`.
- `Macrovipera lebetinus` vs folder id `macrovipera-lebetina`: explained on the გიურზა profile. Do not contradict it elsewhere.

## Species content pipeline

1. Edit `src/content/species/{id}/{ka,en,ru,tr}.mdx`. KA frontmatter owns `id`, taxonomy, `danger`, `image` / `mobileImage` / `gallery` srcs, `sources`. Other locales translate text. Do not copy the photo list: sparse `gallery` in `en`/`ru`/`tr` is credit overlay only (match by `src`). Missing overlay keeps the KA credit.
2. `npm run species:compile` (also `predev` / `prebuild`) writes gitignored `src/data/species.generated.ts` and `src/data/speciesSlugs.generated.ts`.
3. Register the id in `featuredSpeciesIds` / `catalogSpeciesIds` in `src/data/species.ts`.
4. Add `speciesAtlasMeta`.
5. KA public slug: `kaToSlug(commonName)` unless `KA_SLUG_OVERRIDES` / `KA_SLUG_ALIASES` in `speciesSlugRules.ts`. `src/proxy.ts` must import lookup from `speciesSlugTable.ts`, not `speciesRoutes.ts`.
6. Lookalikes: `LOOKALIKES` in `speciesRoutes.ts` (bidirectional). **Do not** add a lookalike YAML key to MDX — compile does not read it.
7. Range map on a profile: only if the id is in some `regions[].speciesIds`. That is a data task, not MDX.

Empty/placeholder fields are hidden by `src/lib/speciesContent.ts`. Prefer a missing field over invented size, region, IUCN category, or Red List status.

Reference profiles: `macrovipera-lebetina`, `paralaudakia-caucasia`, `pseudopus-apodus`.

## Content integrity (non-negotiable)

This is a public scientific atlas, not a blog.

- **Do not invent.** No locality, region, measurement, IUCN/national status, venom effect, or endemic claim without a source already used on the site (see below).
- **Regions:** add a species id to `regions.ts` only when Tarkhnishvili et al. 2026 (DOI `10.3897/caucasiana.5.e189214`) — or a profile that already cites a locality — names that administrative unit. “Georgia”, “Caucasus”, “Colchis”, habitat type, IUCN global range, or a neighbouring region is **not** enough.
- **Candidate taxa:** keep the checklist note. Status lives in `src/data/herpetofauna-checklist.ts` (`confirmed` \| `candidate` \| `introduced`) for amphibians and reptiles only. Do not “confirm” a species Tarkhnishvili marks as candidate. Birds, mammals, and spiders are out of scope for that map.
- **Darevskia:** 16 species; colour is not ID. Do not collapse them.
- **Medical:** bite / venom / yard pages are educational. Call **112**. Not first-aid protocol, not `MedicalWebPage` schema. `malpolon-insignitus` is Moderate / rear-fanged — not გიურზა.
- **Photos:** CDN URLs are often generic. Do not mark Georgia-field-verified without evidence. Keep credit; placeholder is OK.
- FAQ schema only for FAQs that are actually on the page.

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
| `/regions`, `/regions/{id}`                            | same                                                        | 12 regions                                          |
| `/quiz`, `/quiz/romeli-gvelia`, `/quiz/romeli-xvlikia` | `/en/quiz`, `/en/quiz/which-snake`, `/en/quiz/which-lizard` | Hub + two live quizzes                              |
| `/riskis-doneebi`                                      | `/en/risk-to-humans`                                        | Risk legend                                         |
| `/about`, `/contact`                                   | `/en/about`, `/en/contact`                                  | Site                                                |
| `/news`, `/news/{slug}`                                | `/en/news`, `/en/news/{slug}`                               | News                                                |
| `/kontributorebi`                                      | `/en/contributors`                                          | Contributor index                                   |
| `/kontributorebi/sandro-khakhva` (etc.)                | `/en/contributors/sandro-khakhva`                           | Contributor page                                    |

There is **no** `/konservacia` cluster. Conservation copy lives on profiles, not standalone Red List guides.

`src/app/[locale]/[...rest]/page.tsx` is 404 `noindex`. Do not create thin duplicate URLs.

New cluster page checklist: `pathnames.ts` → `RESERVED_HUB_SLUGS` → `CLUSTER_GUIDES` + factory page → messages in KA/EN/RU/TR → 301s in `next.config.ts` for any old/cross-locale slug.

## Quiz

- Registry: `QUIZ_INDEX` in `src/lib/quizzes.ts`. Live: `snake` (`romeli-gvelia` / `which-snake`) and `lizard` (`romeli-xvlikia` / `which-lizard`). Turtle stays `soon` (no href, no URL).
- Engine: `src/lib/snakeQuiz.ts`. Snake pool = published snakes; glass lizard must never be a snake option (`isSnakeSpecies`). Lizard pool = published lizards, including the glass lizard. Darevskia stay separate species; colour is not ID.
- Landing is indexable. Question / score / session are **client state** — never add `/quiz/.../result` or query-param indexable modes.
- Intent: snake quiz owns `რომელი გველია`. Lizard quiz owns `რომელი ხვლიკია` — not `/xvlikebi/identifikacia` (`ეს რა ხვლიკია?`). Do not add `/quiz/gvelis-amocnoba` or a lizard-identify quiz slug. Do not clone quiz page folders.
- A further live quiz still needs a new registry entry + unique intent.

## News

- Registry: `src/data/news.ts`. Copy: `src/content/news/{slug}.ts` with `ka`/`en`/`ru`/`tr`.
- Public URLs: `/news`, `/news/{slug}` (KA unprefixed; `/en/news/…`). Do not add `/ka/news` as a live URL — `/ka/…` 301s via `src/proxy.ts`.
- No category or tag archive URLs. Drafts stay out of `getPublishedNewsArticles()`, sitemap, and `generateStaticParams`.
- Reuse `localeAlternates` / `JsonLd` / sitemap `pageEntry`. Do not invent a parallel blog.
- Do not invent counts, quotes, or species totals beyond the cited source.

## SEO

- Unique title / H1 / description. Species: H1 = common name; title often `absolute` (no ` — Reptiles` double suffix).
- `hreflang` via `localeAlternates` / `speciesAlternates` (`x-default` = KA).
- BreadcrumbList on cluster and species pages. FAQPage only if FAQ is visible.
- Bite page: `WebPage`, not medical schema.
- `www.reptiles.ge` → apex 301. API routes send `X-Robots-Tag: noindex`.

## Commands

```bash
npm run dev              # compile species, then next dev
npm run build
npm run lint
npm run doctor           # React Doctor health scan
npm run doctor:changed   # only issues introduced vs the base branch
npm run species:compile
```

`npx tsc --noEmit` after routing or catalog changes (run `species:compile` first if the generated catalog is missing).

## Open work (do not assume done)

- Georgia-field photo verification (`photoConfidence: georgia-field` needs photographer + Georgia locality; do not tag generic CDN images).
- Conservation cluster pages — not implemented; do not link them.
- Further quizzes (turtle / amphibian / venomous-practice) — only after a unique intent slot and the existing registry.
- Region fauna is incomplete by design where the paper names no admin unit.

## Do not

- Commit or hand-edit `src/data/species.generated.ts`, `src/data/speciesSlugs.generated.ts`, or `src/data/search-index.*.generated.ts` (gitignored; `predev` / `prebuild` writes them).
- Fill empty scientific fields with plausible prose.
- Add `middleware.ts` (use `src/proxy.ts`).
- Ship one-locale copy or one-locale MDX.
- Index quiz results or duplicate identify-guide intent on a new quiz slug.
- Treat `CONTENT-ROADMAP.md` / `QUIZ-MODULE-AUDIT.md` as current — they were removed as stale.
