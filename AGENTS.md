<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# reptiles.ge — agent map

Bilingual (KA canonical, EN secondary) atlas of animals of Georgia: [reptiles.ge](https://reptiles.ge). Herpetofauna is the deepest layer (Tarkhnishvili et al. 2026 checklist). Birds and mammals exist as hubs + profiles, without the same guide clusters.

This file is the project map for agents. Humans: see `README.md`.

## Stack

| Piece | Detail |
| --- | --- |
| App | Next.js 16 App Router, React 19, TypeScript strict |
| i18n | `next-intl` v4 — `src/i18n/`, `messages/ka.json`, `messages/en.json` |
| Style | Tailwind 4, no CSS-in-JS |
| Alias | `@/*` → `src/*` |
| Request edge | `src/proxy.ts` (Next 16 proxy, **not** `middleware.ts`) |
| Images | `https://cdn.reptiles.ge` (`images.unoptimized: true`) |
| Site | `src/lib/site.ts` — `https://reptiles.ge`, default locale `ka` |

Do not add code comments. Do not invent UI copy in one locale only.

## Read first

| Task | Start here |
| --- | --- |
| Species profile / MDX | `src/content/species/{id}/{ka,en}.mdx`, then `scripts/compile-species.ts` |
| Catalog, publish, danger | `src/data/species.ts` |
| Group (snake/lizard/…) | `src/data/speciesAtlas.ts` |
| Public URL / slug / lookalikes | `src/lib/speciesRoutes.ts` |
| Localized pathnames | `src/i18n/pathnames.ts` |
| Group hubs | `src/lib/groupHubs.ts`, `src/lib/createGroupHubRoute.tsx` |
| Cluster guides | `src/lib/clusterGuides.ts`, `src/lib/createClusterGuideRoute.tsx` |
| Species page factory | `src/lib/createSpeciesRoute.tsx` |
| Regions + map IDs | `src/data/regions.ts` — **never infer** `speciesIds` |
| Checklist authority | `src/data/herpetofauna-checklist.ts` |
| Quiz registry | `src/lib/quizzes.ts`, `src/lib/snakeQuiz.ts` |
| 301 map | `next.config.ts` **and** `src/proxy.ts` |
| UI strings | `messages/ka.json` + `messages/en.json` (same keys) |

## Architecture

```text
src/app/[locale]/          routes (folder names = internal English pathnames)
src/components/            pages + UI
src/content/species/{id}/  ka.mdx + en.mdx (+ ru/tr) → compile →
src/data/species.generated.ts   gitignored
src/lib/                   routing, SEO, quiz, clusters
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

- **111** MDX taxa. **110** published. `dolichophis-caspius` is unpublished (`unpublishedSpeciesIds`) and 302s to the snake hub.
- Groups (approx.): 22 published snakes, 29 lizards, 4 turtles, 12 amphibians, 27 birds, 15 mammals.
- SSOT for live pages, quiz, atlas, search: `getCatalogSpecies()` — never a parallel species list.
- Atlas group + habitat tags: `speciesAtlasMeta` in `src/data/speciesAtlas.ts`. Adding a species without this entry will break grouping.
- `vipera-ammodytes` is not a taxon here; 301 → `vipera-transcaucasiana`.
- `Macrovipera lebetinus` vs folder id `macrovipera-lebetina`: explained on the გიურზა profile. Do not contradict it elsewhere.

## Species content pipeline

1. Edit `src/content/species/{id}/{ka,en,ru,tr}.mdx`. KA frontmatter owns `id`, taxonomy, `danger`, `image` / `mobileImage` / `gallery` srcs, `sources`. Other locales translate text. Do not copy the photo list: sparse `gallery` in `en`/`ru`/`tr` is credit overlay only (match by `src`). Missing overlay keeps the KA credit.
2. `npm run species:compile` (also `predev` / `prebuild`) writes gitignored `src/data/species.generated.ts`.
3. Register the id in `featuredSpeciesIds` / `catalogSpeciesIds` in `src/data/species.ts`.
4. Add `speciesAtlasMeta`.
5. KA public slug: `kaToSlug(commonName)` unless `KA_SLUG_OVERRIDES` / `KA_SLUG_ALIASES` in `speciesRoutes.ts`.
6. Lookalikes: `LOOKALIKES` in `speciesRoutes.ts` (bidirectional). **Do not** add a lookalike YAML key to MDX — compile does not read it.
7. Range map on a profile: only if the id is in some `regions[].speciesIds`. That is a data task, not MDX.

Empty/placeholder fields are hidden by `src/lib/speciesContent.ts`. Prefer a missing field over invented size, region, IUCN category, or Red List status.

Reference profiles: `macrovipera-lebetina`, `paralaudakia-caucasia`, `pseudopus-apodus`.

## Content integrity (non-negotiable)

This is a public scientific atlas, not a blog.

- **Do not invent.** No locality, region, measurement, IUCN/national status, venom effect, or endemic claim without a source already used on the site (see below).
- **Regions:** add a species id to `regions.ts` only when Tarkhnishvili et al. 2026 (DOI `10.3897/caucasiana.5.e189214`) — or a profile that already cites a locality — names that administrative unit. “Georgia”, “Caucasus”, “Colchis”, habitat type, IUCN global range, or a neighbouring region is **not** enough.
- **Candidate taxa:** keep the checklist note. Do not “confirm” a species Tarkhnishvili marks as candidate.
- **Darevskia:** 16 species; colour is not ID. Do not collapse them.
- **Medical:** bite / venom / yard pages are educational. Call **112**. Not first-aid protocol, not `MedicalWebPage` schema. `malpolon-insignitus` is Moderate / rear-fanged — not გიურზა.
- **Photos:** CDN URLs are often generic. Do not mark Georgia-field-verified without evidence. Keep credit; placeholder is OK.
- FAQ schema only for FAQs that are actually on the page.

Sources we trust: Tarkhnishvili et al. 2026; Iankoshvili & Tarkhnishvili 2021 (when the checklist cites it); IUCN **species-specific** URL; Georgia Red List only when the profile already cites it.

## Public URL map

KA is canonical. EN uses the English pathname. Old `/species/{id}` 301s in `proxy.ts`. Folder under `src/app/[locale]/` matches the **internal** pathname.

| KA | EN | Kind |
| --- | --- | --- |
| `/` | `/en` | Home |
| `/species` | `/en/species` | Atlas |
| `/gvelebi` | `/en/snakes` | Hub |
| `/gvelebi/saxeoebebi` | `/en/snakes/species` | Index |
| `/gvelebi/shxamiani-gvelebi` | `/en/venomous-snakes` | Guide |
| `/gvelebi/shxamiani-gvelis-amocnoba` | `/en/snakes/identify-venomous` | Guide |
| `/gvelebi/gvelis-nakbeni` | `/en/snakes/bite` | Guide (educational) |
| `/gvelebi/gavrtseleba` | `/en/snakes/range` | Guide |
| `/gvelebi/didi-gvelebi` | `/en/snakes/largest` | Guide |
| `/gvelebi/gveli-ezoshi` | `/en/snakes-in-the-yard` | Guide |
| `/gvelebi/giurza` (etc.) | `/en/snakes/macrovipera-lebetina` | Species |
| `/xvlikebi` … | `/en/lizards` … | Hub + index + ID + glass-lizard compare |
| `/kuebi` … | `/en/turtles` … | Hub + index + land + freshwater + ID |
| `/amfibiebi` … | `/en/amphibians` … | Hub + index + frogs guide + frogs index + newts |
| `/prinvelebi` | `/en/birds` | Hub + species only |
| `/dzuzumtsovrebi` | `/en/mammals` | Hub + species only |
| `/regions`, `/regions/{id}` | same | 12 regions |
| `/quiz`, `/quiz/romeli-gvelia` | `/en/quiz`, `/en/quiz/which-snake` | Hub + one live quiz |
| `/riskis-doneebi` | `/en/risk-to-humans` | Risk legend |
| `/about`, `/contact` | `/en/about`, `/en/contact` | Site |

There is **no** `/konservacia` cluster. Conservation copy lives on profiles, not standalone Red List guides.

`src/app/[locale]/[...rest]/page.tsx` is 404 `noindex`. Do not create thin duplicate URLs.

New cluster page checklist: `pathnames.ts` → `RESERVED_HUB_SLUGS` → `CLUSTER_GUIDES` + factory page → `messages` KA+EN → 301s in `next.config.ts` for any old/cross-locale slug.

## Quiz

- Registry: `QUIZ_INDEX` in `src/lib/quizzes.ts`. Only `snake` is `live` (`romeli-gvelia` / `which-snake`). Lizard and turtle are `soon` (no href, no URL).
- Engine: `src/lib/snakeQuiz.ts`. Pool = published snakes from the catalog. Glass lizard must never be an option (`isSnakeSpecies`).
- Landing is indexable. Question / score / session are **client state** — never add `/quiz/.../result` or query-param indexable modes.
- Intent: this quiz owns `რომელი გველია` / Georgia snake quiz. Canonical how-to remains `/gvelebi/shxamiani-gvelis-amocnoba`. Do not add `/quiz/gvelis-amocnoba`.
- Second live quiz needs a new registry entry + unique intent — do not clone `SnakeQuiz` page folders.

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
npm run species:compile
```

`npx tsc --noEmit` after routing or catalog changes (run `species:compile` first if the generated catalog is missing).

## Open work (do not assume done)

- Georgia-field photo verification (`photoConfidence` vs generic CDN).
- Conservation cluster pages — not implemented; do not link them.
- Further quizzes (lizard / amphibian / venomous-practice) — only after a unique intent slot and the existing registry.
- Birds/mammals: no species-index cluster pages yet.
- Region fauna is incomplete by design where the paper names no admin unit.

## Do not

- Commit or hand-edit `src/data/species.generated.ts` (gitignored; `predev` / `prebuild` writes it).
- Fill empty scientific fields with plausible prose.
- Add `middleware.ts` (use `src/proxy.ts`).
- Ship one-locale copy or one-locale MDX.
- Index quiz results or duplicate identify-guide intent on a new quiz slug.
- Treat `CONTENT-ROADMAP.md` / `QUIZ-MODULE-AUDIT.md` as current — they were removed as stale.
