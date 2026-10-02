# reptiles.ge — Project Audit and Execution Plan

Prepared 2 October 2026. Companion to `reptiles.ge Search Roadmap.md`.

**Scope.** Full takeover review of the repository, about 4,900 commits and 771 merged PRs, the cached Search Console and GA4 exports, a fresh vinext production build, and read-only checks against the live site: headers, HTML, sitemap, JS sizes, and a mobile pass. Every number below was measured unless it is labelled as an estimate. The appendix explains how to reproduce the measurements.

**Evidence labels.** _Confirmed_ means it was reproduced against the code or the live site. _Likely_ means a strong inference from code and docs that still needs a one-step check. _Estimate_ means a projection.

**Snapshot.** All numbers come from `staging` at `96f3e90a` and the live site on the morning of 2 October 2026. Two PRs merged into `staging` later the same day:

| PR   | What shipped                                                                                                                                                                                                              | Audit items it closes                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| #770 | Bed bugs at home guide (`/mtserebi/baghlinjo-sakhlshi`), linked to `cimex-lectularius`                                                                                                                                    | P0-5 bed-bug step, queue #1, Next-5 item 5 (first half). Guide articles: 14 → 15. |
| #769 | Search Roadmap fixes 1–7, 10 and 11: tick colloquial forms, snake in the house, "most venomous" H2, lizard hub owns „ხვლიკი საქართველოში“, mammal snippets, raccoon disambiguation, ladybirds, predators H2, scorpion H2s | Queue #4, quick wins 8 and 9, P1-4 (first three profiles)                         |

Shipped items are marked **Shipped** below. Everything else still stands.

---

## Contents

1. [Executive Summary](#1-executive-summary)
2. [What reptiles.ge Is Today](#2-what-reptilesge-is-today)
3. [What Changed Recently](#3-what-changed-recently)
4. [Current Architecture](#4-current-architecture)
5. [Content Inventory](#5-content-inventory)
6. [What Is Working](#6-what-is-working)
7. [What Is Holding Us Back](#7-what-is-holding-us-back)
8. [SEO & Indexing Findings](#8-seo--indexing-findings)
9. [Performance / Cloudflare Findings](#9-performance--cloudflare-findings)
10. [UX & Engagement Findings](#10-ux--engagement-findings)
11. [Engineering Findings](#11-engineering-findings)
12. [Missed Opportunities](#12-missed-opportunities)
13. [Highest-Leverage Opportunities](#13-highest-leverage-opportunities)
14. [Do Not Spend Time On This Yet](#14-do-not-spend-time-on-this-yet)
15. [P0 / P1 / P2 Execution Plan](#15-p0--p1--p2-execution-plan)
16. [30 / 60 / 90 Day Roadmap](#16-30--60--90-day-roadmap)
17. [Top 20 Content Publishing Queue](#17-top-20-content-publishing-queue)
18. [10 Quick Wins](#18-10-quick-wins)
19. [Up to 3 Big Bets](#19-up-to-3-big-bets)
20. [Project Scorecard](#20-project-scorecard)
21. [The Next 5 Things I Would Personally Do](#21-the-next-5-things-i-would-personally-do)

- [Appendix: how the numbers were measured](#appendix-how-the-numbers-were-measured)

---

## 1. Executive Summary

reptiles.ge is two months old: the first commit was 3 August 2026. It has grown quickly into a four-language atlas of Georgian animals with 143 published species, 14 practical guide articles, 25 cluster guides and 972 sitemap URLs. Content quality, sourcing discipline and on-page SEO are good. Search impressions in Georgia roughly doubled in ten days in mid-September (451 to 821 a day).

The main constraint isn't content. It's an infrastructure migration that was never finished.

- **Every HTML page is uncacheable** (_confirmed_). Pages are served `cache-control: no-store` with `x-vinext-cache: BYPASS`, so every view, Googlebot's included, is a full Worker render.
  - Cause (_likely_, verified in the next-intl source): the root layout calls `getLocale()` (`src/app/layout.tsx:129`), which falls back to `headers()` and opts every route into dynamic rendering.
  - The cache works when a response is cacheable: `sitemap.xml` and `llms-full.txt` return `HIT` in about 0.1 s.
- **The pages that lead users and crawlers into the site are the heaviest and slowest** (_confirmed_). Hubs and index pages serialize full species documents (FAQ, sources, iNaturalist records) into the client payload.
  - Birds index: 2.24 MB of HTML, 4.8 s to first byte. Snakes hub: 1.16 MB, 1.0 to 1.4 s.
  - The same class of bug was fixed for region pages on 1 October (PR #757), and only there.
- **The Worker bundle grew from 18 MB to 24 MB in eight days** (_confirmed_), about 6.4 MB gzipped. The growth is mostly iNaturalist field records duplicated across locales, plus admin tooling that includes the TypeScript compiler.
- **Guides are weakly connected to the atlas** (_confirmed_). Species-to-guide links are hard-coded and cut to four. Bird profiles link nowhere useful, and the cockroach and scorpion profiles don't link to their own guides.
- **The data behind decisions is stale** (_confirmed_). The newest Search Console data ends 17–19 September, before all 14 guides launched, and it covers Georgia only.

The 2 October Search Roadmap is good, demand-based work, and most of it should stand. This audit changes the order:

1. Fix caching and payloads first, because every new page depends on them.
2. Build the cross-group hub page type and the species–guide linking system before the cross-group hubs ship.
3. Move **Reptiles of Georgia** near the top. It is the domain's identity, and the school year is in session.

---

## 2. What reptiles.ge Is Today

- **Product.** A sourced, four-locale atlas of Georgian fauna. Georgian is canonical; English, Russian and Turkish are alternates. On top of the atlas sits a practical layer of guides for animal problems at home.
  - Herpetofauna is the scientific core, aligned with the Tarkhnishvili et al. 2026 checklist.
  - Birds (43 profiles) are now the largest group.
- **Traffic.** GA4, 23 Aug–19 Sep, 5,913 sessions:

  | Channel        | Sessions | Share |
  | -------------- | -------- | ----- |
  | Facebook       | 3,712    | 63%   |
  | Google organic | 892      | 15%   |
  | Direct         | 673      | 11%   |
  | ChatGPT        | 144      | 2.4%  |

- **Search.** Search Console, Georgia only, 23 Aug–17 Sep:
  - 12,264 impressions and 250 clicks (2.0% CTR); 88% of impressions on mobile.
  - 84% of impressions land on species or guide URLs.
  - The top queries are animal names, not problems: წავი (otter) 1,194, მაჩვი (badger) 529, დედოფალა (weasel) 439, ენოტი (raccoon) 395.
- **Team.** One human developer (4,913 commits) working with AI agents (Claude, Cursor and Codex branches). A local AI-assisted admin opens content pull requests.

---

## 3. What Changed Recently

Only the strategic changes are listed.

| Date         | Change                                                                                                     | Problem it solved                        | Status now                                                                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3–6 Aug      | Next.js + Vercel scaffold, Georgian first, sitemap                                                         | Launch                                   | Superseded                                                                                                                                                                                           |
| 29 Aug–3 Sep | MDX compiled to a generated catalog; news; multilanguage; knip and react-doctor                            | Scaling content safely                   | Working, but the generated catalog has become the bundle problem                                                                                                                                     |
| 4–13 Sep     | llms.txt, contributor and authority pages, PageSpeed work, `georgia-field` photo flag, Fuse search         | Trust signals, AI citations, performance | `photoConfidence`: only 2 of 1,047 photos are verified                                                                                                                                               |
| 14–20 Sep    | Four-language copy rollout; hand-written sitemap timestamps; meta rewrites; Sentry; Rust seo/atlas doctors | Locale parity, CTR                       | The lastmod table is synthetic (see §8)                                                                                                                                                              |
| 21–22 Sep    | iNaturalist field-record import and range maps                                                             | Real distribution data                   | 5,357 records now ship inside the Worker bundle                                                                                                                                                      |
| **22 Sep**   | **Vercel → Cloudflare Workers via vinext**, with a response-store cache (R2 + Durable Object)              | Cost and control                         | **Half-finished.** HTML has never been cached. `next.config.ts` redirects are dead code in production (`if (isVinext) return []`). CI e2e and Lighthouse are commented out. Deploys don't run in CI. |
| 24 Sep       | CDN cache adapter plus `revalidate` tried, then reverted (`331081ce` → `f27d2476`)                         | Caching                                  | Abandoned; root cause never found                                                                                                                                                                    |
| 23–30 Sep    | 14 guide articles built with `defineGuideArticle` (household, bites, stings)                               | Problem-intent search demand             | Good builder. Guides aren't linked into the atlas and have no Search Console data yet.                                                                                                               |
| 26–30 Sep    | Admin species-workflow and content-editor (AI-assisted PRs)                                                | Editing velocity                         | Works locally. Its code, including `typescript`, is bundled into the production Worker as a 3.6 MB chunk.                                                                                            |
| 1 Oct        | Region card projection (`toRegionSpeciesCard`), vinext 1.0.1 with `--warm-cache`, bird batch               | Payload size                             | **Only region pages were fixed.** Hubs, indexes and guides still ship full documents.                                                                                                                |
| 2 Oct        | Search roadmap                                                                                             | Content plan                             | Good input; needs reordering (§17)                                                                                                                                                                   |

**Doc drift.** `AGENTS.md` reports 126 MDX folders and 125 published species, 39 birds, 15 mammals and 4 spiders. The real figures are 144 and 143, 43, 17 and 8. Agents act on this file, so the drift matters.

---

## 4. Current Architecture

- **Content.** `src/content/species/{id}/{ka,en,ru,tr}.mdx` is compiled by `scripts/compile-species.ts` into `src/data/species.generated.ts`, which is 10.9 MB and gitignored. Guides, news, cluster guides and quizzes are TypeScript registries. Tests enforce locale parity.
- **Routing.**
  - Route files are thin wrappers around factories: `createSpeciesHubRoute`, `createGroupHubRoute`, `createClusterGuideRoute` and `createGuideArticleRoute`.
  - next-intl provides localized pathnames.
  - In production every redirect lives in `src/proxy.ts`.
- **Runtime.** vinext, a Vite reimplementation of Next 16, runs on Cloudflare Workers next to a separate `reptiles-response-store` Worker (R2 plus a Durable Object). The build marks every route `ƒ Dynamic` and prerenders nothing: `__vinext_pregenerated_concrete_paths` is empty.
- **Images.** Pre-optimized AVIF and WebP on Bunny CDN (`cdn.reptiles.ge`), with long max-age and cache hits.
- **Search.** Client-side and lazy-loaded, one index per locale (about 435 KB raw each).
- **Analytics.**
  - GTM and GA4, loaded with `lazyOnload`; a top.ge counter; Sentry on client and server.
  - Local GSC, GA4 and SERP collectors (`pnpm seo:audit:*`).
- **Admin.** Local-only: `NODE_ENV !== "production"`, plus localhost and origin checks on every route. Codex rewrites content and the tool opens GitHub PRs.

### Page families

| Family                                       | Per locale | Rendering / size                 | Schema                                                 | Continuation                                                                                                 |
| -------------------------------------------- | ---------- | -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Home                                         | 1          | Dynamic, 455 KB HTML             | Organization, WebSite                                  | Strong (66 unique links)                                                                                     |
| Group hubs                                   | 9          | Dynamic, up to 1.16 MB           | CollectionPage, BreadcrumbList, FAQPage                | Strong to species, weak to guides                                                                            |
| Cluster guides (index / ID / collections)    | 25         | Dynamic, index pages 1.1–2.2 MB  | CollectionPage / ItemList                              | Good                                                                                                         |
| Special guides (venomous, yard, risk legend) | 3          | Dynamic, 0.6–0.9 MB              | —                                                      | Good                                                                                                         |
| Guide articles                               | 14         | Dynamic, about 230 KB            | Article, BreadcrumbList                                | **Weak.** Sibling guides and the hub only; the wasp-nest guide has 8 unique links and none go into the atlas |
| Species profiles                             | 143        | Dynamic, 300–480 KB, 0.22–0.28 s | Article + Taxon, ImageGallery, BreadcrumbList, FAQPage | Good for reptiles (giurza: 26 links). **Poor for birds, insects, scorpions and mammals.**                    |
| Regions                                      | 12 + index | Dynamic (payload fixed)          | CollectionPage                                         | Good                                                                                                         |
| News                                         | 10 + index | Dynamic                          | NewsArticle                                            | Last article published 23 Sep                                                                                |
| Quizzes                                      | 2 + hub    | Client-side play                 | —                                                      | OK                                                                                                           |
| Contributors                                 | 15 + index | Dynamic                          | Person                                                 | Thin but legitimate                                                                                          |

---

## 5. Content Inventory

The counts come from the generated catalog, the content registries and the live sitemap.

| Item                                                | Count                                                                                                                                                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Species MDX / published                             | 144 / 143 (`dolichophis-caspius` is unpublished)                                                                                                                                                                        |
| Snakes · Lizards · Amphibians · Turtles             | 22 · 29 · 12 · 4                                                                                                                                                                                                        |
| Birds · Mammals · Spiders · Scorpions · Insects     | 43 · 17 · 8 · 4 · 4                                                                                                                                                                                                     |
| Guide articles                                      | 14: household 8 (ants, cockroaches, fleas, clothes moth, mosquitoes, stink bug, wasp nest, mouse); bat 1; scorpion 2 (in the house, sting); bites 3 (snake, giurza, tick)                                               |
| Cluster guides                                      | 25: 9 indexes, identification pages, Darevskia, glass-lizard comparison, lizard in the house, frogs, newts, land and freshwater turtles, snake range and largest snakes, spider bite and venomous spiders, bear, jackal |
| Special guides                                      | 3: venomous snakes, snakes in the yard, risk legend                                                                                                                                                                     |
| Hubs · Regions · News · Live quizzes · Contributors | 9 · 12 · 10 · 2 · 15                                                                                                                                                                                                    |
| Indexable URLs                                      | 243 per locale × 4 = 972 (checked against the live sitemap)                                                                                                                                                             |
| Translations                                        | 143/143 in English, Russian and Turkish; none is under half the Georgian length                                                                                                                                         |
| Photos                                              | 1,047 gallery images: `georgia-field` **2**, `range-typical` 5, unclassified 1,040                                                                                                                                      |
| Audio / field records                               | 45 species with audio; 44 species with 5,357 iNaturalist records                                                                                                                                                        |
| Region coverage                                     | 94 of 143 species appear in at least one region (sourced localities only, by design)                                                                                                                                    |
| Profile depth (Georgian words)                      | Median about 990; thinnest about 480 (`vipera-darevskii`, `vipera-renardi`, `zamenis-hohenackeri`)                                                                                                                      |

**Existing and strong**

- The snake cluster: hub, index, venomous, identification, bite, giurza bite, yard, quiz.
- The lizard and Darevskia cluster.
- The household guide set.
- Sourced profiles in four locales.

**Existing but should be improved**

- Top-impression mammal profiles: 0.3–0.9% CTR at positions 6–9.
- The lizard hub and identification page compete for the same query (roadmap fix #4).
- The stink-bug guide needs an autumn ladybird section.
- 9 of the 14 guides have no `relatedSpeciesIds`, including scorpion-in-house, even though 4 scorpion profiles exist.
- News hasn't been updated since 23 September.

**Missing and valuable**

- The reptiles class hub, "ქვეწარმავლები საქართველოში" (Reptiles of Georgia).
- Bed bugs and rats.
- The dangerous-animals hub.
- A "what bug is this in my house?" identification router.
- Spiders in the house.
- A marten profile and a marten-in-the-attic guide.
- Pre-season tick and sting pages.
- Common mammal and bird profiles with proven demand.

**Missing, low priority**

- Black Sea and jellyfish pages (April).
- Animal sounds.
- Woodworm.
- Pigeons.

**Structural gap.** The household vertical has 8 insect guides but only 4 insect profiles. Most of those guides have no atlas page to send readers to: there are no profiles for wasps, ticks, mosquitoes, ants or house mice.

---

## 6. What Is Working

- **The content-integrity system.**
  - The `AGENTS.md` rules and guard tests (440 passing).
  - Enforced locale parity.
  - No invented ranges, a 112 emergency call-to-action, and no `MedicalWebPage` schema. This is a real moat.
- **On-page SEO is correct on live pages.**
  - Self-referencing canonicals and five hreflang tags with Georgian as x-default.
  - Unique titles, H1s and descriptions (130–155 characters).
  - Correct status codes and redirects:

    | Request             | Result           |
    | ------------------- | ---------------- |
    | Unknown URL         | 404 with noindex |
    | `/ka/*`             | 301              |
    | Trailing slash      | 308              |
    | `www` and `http://` | 301              |
    | Legacy `/species/*` | 301              |

- **The sitemap** lists 972 URLs; all have hreflang alternates and 704 include images.
- **The guide builder** (`defineGuideArticle`) produces answer-first, well-sourced pages. The wasp-nest guide reads like an authority page.
- **The cluster architecture.** The hub → index → profile path works: organic sessions average 4.6 pages per session, and visits that land on the home page generated 1,350 pageviews from 105 sessions.
- **Images** are pre-optimized on Bunny with long-lived caching.
- **The admin authoring loop** gives high editorial velocity and stays safely local-only.

---

## 7. What Is Holding Us Back

1. **No HTML caching** (_confirmed_). Every request is a Worker render, and the pages that lead into the site take 1–5 s to first byte.
2. **Oversized client payloads on hubs, indexes and guides** (_confirmed_). These pages embed full species documents.
3. **The Worker bundle is growing toward the Workers compressed-size limit** (growth _confirmed_, timing an _estimate_). The species catalog, admin code and the TypeScript compiler all ship to production.
4. **Atlas-to-guide linking is hard-coded and truncated** (_confirmed_), so new guides get little internal authority.
5. **The decision data is stale and filtered to Georgia** (_confirmed_), and nothing tracks index coverage.
6. **Release safety** (_confirmed_). Deploys run from a laptop with no post-deploy smoke test, redirects live in two tables (one of them dead), and lastmod dates and meta overrides are maintained by hand.

---

## 8. SEO & Indexing Findings

### Crawlability

- `robots.txt` (built in `src/lib/llmsFiles.ts`) is fine: `/api` and `/admin` are disallowed and AI crawlers are allowed.
- There are no accidental noindex tags and no crawl traps, and URLs with query strings canonicalize correctly.
- Only the atlas page reads `searchParams` (for filtered views).
- Nothing here is urgent.

### Indexability

- Canonicals and hreflang are correct.
- 17 legacy `/species/*` URLs still drew impressions. That is normal consolidation lag.
- **The redirect tables are duplicated.** About 150 entries exist in both `next.config.ts` and `src/proxy.ts`, and the `next.config.ts` copy does nothing under vinext. This is a drift risk, not a live bug.

### Sitemap

- **lastmod is synthetic.**
  - `src/data/pageLastModified.ts` gives more than 50 paths timestamps on 16 September spaced exactly 11 minutes apart (08:07, 08:18, 08:29, and so on).
  - Hubs never update when their children change: `/birds` shows 20 September, yet five birds were added on 1 October.
  - Google ignores lastmod values it can't trust, which removes the one freshness hint that would help the new guides.
- The structure scales: a single file of 972 URLs is far below the 50,000 limit.

### Metadata

Titles and descriptions are unique, but the sources are scattered:

| What                                                  | Where                                   |
| ----------------------------------------------------- | --------------------------------------- |
| 218 Georgian description overrides, keyed by URL path | `src/lib/kaMetaDescriptionOverrides.ts` |
| Title overrides                                       | `src/lib/speciesMeta.ts`                |
| Aliases                                               | `src/lib/seoKeywords.ts` (1,527 lines)  |

If a slug changes, a path-keyed override stops applying without any error.

### Structured data

| Page type        | Schema types                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Species          | Article + Taxon (`sameAs` to GBIF, IUCN and others), ImageGallery, BreadcrumbList, FAQPage |
| Hubs and regions | CollectionPage, BreadcrumbList, FAQPage                                                    |
| Guides           | Article, BreadcrumbList                                                                    |
| Site             | WebSite + SearchAction                                                                     |

- FAQPage and SearchAction no longer produce rich results. They do no harm, so don't spend time adding or removing them.
- Taxon `sameAs` is the type with a real purpose: it tells search engines which species the page is about.
- No high-value schema is missing.

### Internal linking

`getSpeciesGuideLinks` (`src/lib/clusterGuides.ts:898`) has these problems (_confirmed_):

- It works from hard-coded sets per group and ends with `.slice(0, 4)`. On venomous-snake profiles, the cut drops the bite and yard guides.
- Birds link only to the birds index.
- Insects link only to their index, except Halyomorpha.
- Scorpions link only to the scorpions hub.
- `blatta-orientalis` doesn't link to the cockroach guide.
- Mammal profiles, the biggest source of impressions, link only to sibling mammals and regions. They never link to the bat, mouse or jackal guides.

### Indexing diagnosis ("Discovered – currently not indexed")

| Bucket                   | Finding                                                                                                                                                                                | Evidence                                | Severity at this scale                                                                            | Urgent?                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Technical                | No blocking issue: noindex, canonicals, status codes and hreflang are all correct                                                                                                      | Live headers and HTML                   | —                                                                                                 | No                                                    |
| Crawl / discovery        | Pages are never cached. Hubs take 1–1.4 s to first byte and index pages up to 4.8 s. Google slows crawling on slow hosts, and these are the pages that link to everything else         | curl timings, `no-store` headers        | Medium. A real contributor to "Discovered", because Google defers crawling when a host looks slow | **Yes**                                               |
| Crawl / discovery        | lastmod is synthetic. New guides are linked mostly from the footer, hub and sibling guides, not from profiles that already rank                                                        | `pageLastModified.ts`, link extraction  | Medium                                                                                            | Yes (cheap fix)                                       |
| Crawl / discovery        | Heavy URL churn (Georgian-Latin slug changes, legacy `/species/`) means Google keeps recrawling 301s                                                                                   | Proxy redirect tables                   | Low and decaying                                                                                  | No                                                    |
| Quality / prioritization | A two-month-old domain that published 110 profiles in August alone. Pages share a template across 4 locales, and few external sites link in (Facebook links pass no crawl signal)      | `publishedAt` distribution, GA4 sources | **High. This is the main driver**: Google samples a new site before indexing all of it            | Address with links and authority, not technical fixes |
| Duplicate / locale       | Out of 243 URLs per locale, Georgian impressions reached 144 Georgian, 96 English, 50 Russian and **8 Turkish** pages. hreflang is correct, so this is prioritization, not duplication | `gsc-raw.json`                          | Low to medium                                                                                     | No. Don't expand Turkish.                             |
| Normal latency           | The 14 guides went live 23–30 September. One to four weeks in "Discovered" is normal for a new domain                                                                                  | Publish dates                           | —                                                                                                 | Wait and measure                                      |

**Avoid:** repeated "Request indexing" clicks, the Indexing API, sitemap pings, and dropping locales to "save crawl budget" on a 972-URL site.

---

## 9. Performance / Cloudflare Findings

Measured on the live site. Every HTML response carried `x-vinext-cache: BYPASS`.

| URL                              | HTML (raw / gzip) | Inline RSC payload | Time to first byte    | Full species docs embedded |
| -------------------------------- | ----------------- | ------------------ | --------------------- | -------------------------- |
| `/prinvelebi/saxeoebebi`         | 2.24 MB / 343 KB  | 1.96 MB            | **4.7–4.8 s**         | 44                         |
| `/gvelebi`                       | 1.16 MB / 194 KB  | 0.97 MB            | 1.0–1.4 s             | 22                         |
| `/gvelebi/saxeoebebi`            | 1.12 MB / 191 KB  | 0.94 MB            | 1.3 s                 | 22                         |
| `/riskis-doneebi`                | 918 KB            | 773 KB             | 0.9 s                 | 15                         |
| `/gvelebi/shxamiani-gvelebi`     | 614 KB            | 463 KB             | 0.6 s                 | 8                          |
| `/gvelebi/giurza`                | 479 KB            | 284 KB             | 0.25 s                | Lookalike and related docs |
| `/regions/kakheti` (fixed 1 Oct) | 386 KB            | 151 KB             | 0.28 s                | 0                          |
| `sitemap.xml`, `llms-full.txt`   | —                 | —                  | **0.10 s, cache HIT** | —                          |

### Why every page bypasses the cache (_likely_, high confidence)

1. `RootLayout` calls `getLocale()` (`src/app/layout.tsx:129`). That runs above the `[locale]` segment, where `setRequestLocale` is called.
2. With no locale stored yet, next-intl falls back to `headers()` (see `next-intl/dist/esm/*/server/react-server/RequestLocale.js`). That makes every route dynamic.
3. vinext then sends `no-store`, and its response store refuses to keep `no-store` responses.
4. A secondary issue: next-intl middleware sets `Set-Cookie: NEXT_LOCALE` on every page, even though `localeDetection` is `false`.

### Why the payloads are so large (_confirmed_)

These client components accept full `Species` objects or arrays of them:

- `SpeciesIndexTable`, `SpeciesGuideRow`, `RiskLevelList`, `VenomousSnakesSpecies`
- `TurtleIdentifyMatrix`, `TurtleIdentifyChooser`
- `ConflictGuideSections`, `SafetyGuideSections`
- `RelatedGuideCards`, `LookalikePair`

The fix pattern already exists: `toRegionSpeciesCard` in `src/data/regions.ts`.

### Worker bundle (fresh build)

| Chunk                      | Size                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| All server JS              | 24 MB raw / about 6.4 MB gzip (the 24 Sep build was 18 MB)                                                    |
| Species catalog            | 9.7 MB; about 75 ms to parse and run and 27 MB of heap per cold isolate (measured locally, slower on Workers) |
| `contentEditorPullRequest` | **3.6 MB**, including the TypeScript compiler; local-only admin code                                          |
| `guideArticles`            | 950 KB                                                                                                        |
| Search indexes (4)         | Also bundled into server rendering                                                                            |

_Estimate:_ most of the growth is field records duplicated across four locales. At this rate the bundle will approach the Workers compressed-size limit (10 MB on the paid plan) within a quarter. When it does, deploys fail.

### Client JavaScript per page

About 290 KB gzipped on first load:

| Chunk                           | Gzip      | Note                                                            |
| ------------------------------- | --------- | --------------------------------------------------------------- |
| Sentry browser SDK with tracing | **96 KB** | 356 KB raw, loaded eagerly from `src/instrumentation-client.ts` |
| framework                       | 68 KB     |                                                                 |
| vinext runtime                  | 45 KB     |                                                                 |
| Navbar                          | 23 KB     |                                                                 |
| `optimizedImages` map           | 18 KB     | 193 KB raw, parsed on every page                                |

With 88% of traffic on mobile, trimming Sentry is the biggest single JavaScript win.

---

## 10. UX & Engagement Findings

- **Templates are polished on mobile:** hero, section tabs, quick facts, galleries and accordions all work. One small glitch: the transparent sticky header overlaps text while scrolling.
- **Dead ends.**
  - Guide articles end in sibling guides. They never route readers into the atlas ("which animal is this?", "is it dangerous?") because either no profile exists (wasp, tick, mosquito) or it isn't linked (scorpions).
  - Visits that land on a species profile view about 1–2 pages (giurza: 37 pageviews from 20 sessions; red-bellied racer: 15 from 15). Visits that land on a hub or the home page view 4–13.
- **What already makes people click again:** the lookalikes and "is it dangerous?" blocks on snake profiles. Extending lookalikes and practical-guide links to birds, mammals and insects is the most valuable UX change available.
- **Quizzes** are well instrumented (start, answer, complete, abandon). Read that data before building more quizzes.

---

## 11. Engineering Findings

### Code health

Only findings that affect reliability, speed of development, SEO, performance or correctness are listed.

- **Release safety.**
  - No CI deploy: production ships via `pnpm deploy:vinext` from a laptop.
  - e2e and Lighthouse are commented out in `.github/workflows/lint.yml`.
  - Nothing checks cacheability or payload size, which is why the BYPASS problem went unnoticed for ten days.
- **Duplicated sources of truth:** two redirect tables, a hand-maintained lastmod table, and meta overrides keyed by URL path.
- **Brittle mappings.** 56 hard-coded species-ID branches in components and lib (`halyomorpha-halys` 8 times, `pseudopus-apodus` 7 times). Guide linking runs on hard-coded sets.
- **Merge-conflict magnets.** The committed `src/data/optimizedImages.generated.ts` (250 KB) and `src/data/image-manifest.json` (2.7 MB) were each changed more than 500 times in 30 days.
- **Giant components:**

  | File                                               | Lines | Note                                              |
  | -------------------------------------------------- | ----- | ------------------------------------------------- |
  | `src/components/map/SpeciesRangeMap.tsx`           | 2,374 |                                                   |
  | `src/components/map/HalyomorphaRangeMapClient.tsx` | 1,250 | Now the generic field-record map despite its name |
  | `src/components/SpeciesProfileBody.tsx`            | 1,135 |                                                   |

- **Guide wiring takes 11 manual steps per article.** The guide registry can't express cross-group, top-level hubs, which roadmap items #2, #4, #8 and #15 need.
- **Good:**
  - Strict TypeScript, with only 4 unsafe casts.
  - knip and react-doctor in CI.
  - Strong guard tests: 49 files, 440 tests, all passing.

### Security and reliability

- **Confirmed clean.**
  - No secrets are committed (`.env*` is gitignored), and no secret values are inlined into the Worker or client bundles.
  - Every admin page and API route is gated (`isLocalAdminEnabled` plus localhost and origin checks).
  - The public endpoint `/api/species/[id]/occurrences` validates its input and sends cache headers.
  - Security headers are present: CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`.
- **Minor.**
  - The CSP allows `'unsafe-inline'` and `'unsafe-eval'`, which GTM needs.
  - The vite build copies every `.env` secret (Bunny key, Google service account, Sentry token) into `dist/server/.dev.vars`. That file isn't deployed, but `dist/` should never be zipped or shared.
  - The Sentry DSN is public, which is normal.
- **Reliability risks:** the bundle-size trend, and manual deploys without smoke tests.

### Observability

| Question                                                        | Answerable today?                                                                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Which page families drive organic traffic?                      | Partly. `seo:audit` classifies pages, but its data dates from 20 September and covers Georgia only.                  |
| Which guides get impressions but poor CTR?                      | Not yet: there is no post-launch data.                                                                               |
| Which pages get users to a second page?                         | Roughly, from GA4 landing pages. Because GTM loads with `lazyOnload`, quick bounces are undercounted.                |
| Which locale performs?                                          | Only inside Georgia.                                                                                                 |
| Which templates are slow?                                       | No; there is no real-user monitoring or Core Web Vitals data. Worker logs and Cloudflare analytics can fill the gap. |
| Which pages are rarely crawled, and what is their index status? | **No.** Neither GSC Crawl Stats nor URL Inspection data is collected.                                                |
| How long does new content take to get indexed?                  | **No.**                                                                                                              |

**Missing measurement that would change decisions:**

- URL Inspection sampling.
- Search Console data for all countries.
- Cloudflare Web Analytics (cookieless, with Core Web Vitals per page).
- UTM tags on Facebook posts, the largest channel.

---

## 12. Missed Opportunities

1. **Facebook is the largest channel (63% of sessions) and the process around it is ad hoc.** Posts carry no UTMs, and publishing a page doesn't trigger a post.
2. **Profiles that already rank don't send readers to guides.** Mammal and bird profiles earn the impressions; guides earn nothing yet.
3. **The site called reptiles.ge has no "Reptiles of Georgia" page.** In Search Console, the query "რეპტილიები საქართველოში" lands on the home page.
4. **School-year demand goes unserved** from September to May: species lists, endemic, extinct and birds of prey.
5. **Georgia-verified photos are nearly absent: 2 of 1,047.** The 15 contributors, including Tarkhnishvili, are an untapped source of authority.
6. **The household vertical has no species behind it:** no tick, wasp or hornet, German cockroach, mouse or rat profiles.

---

## 13. Highest-Leverage Opportunities

| Lever                                         | One change, broad effect                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Cacheable HTML                                | One layout and config fix → all 972 URLs served in about 0.1 s, roughly 90% less Worker CPU, more crawl capacity               |
| `SpeciesCard` data shape                      | One type and about 10 components → every hub, index and guide page sheds 0.5–1.9 MB                                            |
| Data-driven species–guide links               | One reverse index built from `relatedSpeciesIds` → all 143 profiles send readers to the 14 current guides and every future one |
| Cross-group hub page type                     | One route type → unlocks the Reptiles, Dangerous, Endemic and Extinct hubs now, Raptors and Migratory later                    |
| Field records out of the bundle               | One data move → solves Worker size and cold starts for the next year                                                           |
| Snippet tests on top mammal and bird profiles | About 5 title and description edits → better CTR on the site's largest source of impressions                                   |

---

## 14. Do Not Spend Time On This Yet

| Idea                                                     | Why wait                                                                                                                   |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Accounts, login, saved lists, comments                   | No user need yet. A return loop can be built without login.                                                                |
| Mobile app or push notifications                         | The web already serves 88% mobile traffic, and the app wouldn't add any capability.                                        |
| AI chatbot or AI photo identification                    | High integrity risk around identification claims, and ChatGPT already cites the site. Revisit after the observation pilot. |
| More structured data                                     | FAQ rich results are gone and the existing types are correct. Don't add or remove any.                                     |
| A new quiz (turtle or amphibian)                         | Read the funnel data for the existing quizzes first.                                                                       |
| Rewriting away from vinext/Cloudflare, or back to Vercel | The cache infrastructure works; one bug blocks it.                                                                         |
| Expanding Turkish or adding locales                      | Only 8 of 243 Turkish URLs drew impressions in Georgia.                                                                    |
| More Rust "doctor" tooling                               | The real gaps are deploy smoke tests and fresh data.                                                                       |
| Obscure species profiles with no demand                  | Prefer common mammals and birds that people search for ("X ინფორმაცია").                                                   |
| Redesigning templates that work                          | They already perform.                                                                                                      |
| Red Book or conservation pages                           | Wait for the owner's decision. It is the strongest school query found, though (see P2).                                    |

---

## 15. P0 / P1 / P2 Execution Plan

### P0 — Do Now

#### P0-1 Make HTML cacheable

| Field          | Detail                                                                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | Every HTML page is served `no-store` and bypasses the cache.                                                                                                                                                                                                                                                                    |
| Evidence       | Live response headers; `src/app/layout.tsx:129` calls `getLocale()`, which falls back to `headers()` (next-intl `RequestLocale.js`); every page also sets `Set-Cookie: NEXT_LOCALE`.                                                                                                                                            |
| Action         | 1. Move `<html lang>` into `src/app/[locale]/layout.tsx` and read the locale from `params.locale`.<br>2. Remove `getLocale()` from the root layout.<br>3. Set `localeCookie: false` in `src/i18n/routing.ts`.<br>4. Keep `/species` dynamic (it has filters).<br>5. Deploy with `--warm-cache`, then check for `HIT` with curl. |
| Impact         | Performance, crawl capacity, Worker cost. Time to first byte drops from 1–5 s to about 0.1 s on cache hits.                                                                                                                                                                                                                     |
| Effort         | M                                                                                                                                                                                                                                                                                                                               |
| Risk           | Medium: `lang` correctness, the 404 page, atlas filters.                                                                                                                                                                                                                                                                        |
| Dependencies   | None                                                                                                                                                                                                                                                                                                                            |
| Success metric | At least 95% of HTML requests are cache `HIT`s; p75 time to first byte under 300 ms; average response time in GSC Crawl Stats goes down.                                                                                                                                                                                        |

#### P0-2 Use a lightweight `SpeciesCard` everywhere

| Field          | Detail                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | List pages serialize full species documents into the client payload.                                                                                                                                                                                                                                                                                      |
| Evidence       | The birds index embeds 44 full documents (1.96 MB); the snakes hub embeds 22; the risk legend embeds 15.                                                                                                                                                                                                                                                  |
| Action         | 1. Generalize `toRegionSpeciesCard` into a `SpeciesCard` containing only `id`, slug/href, names, image and credit, danger, and group.<br>2. Switch the 10 client components listed in §9 to it.<br>3. Pass lookalikes and related species to profiles as cards.<br>4. Add a test that fails if `fieldRecords`, `faq` or `sources` reach a list component. |
| Impact         | Performance, Core Web Vitals, Worker CPU                                                                                                                                                                                                                                                                                                                  |
| Effort         | M                                                                                                                                                                                                                                                                                                                                                         |
| Risk           | Low                                                                                                                                                                                                                                                                                                                                                       |
| Dependencies   | None; can run in parallel with P0-1                                                                                                                                                                                                                                                                                                                       |
| Success metric | Birds index under 350 KB of HTML; snakes hub under 300 KB; uncached time to first byte under 600 ms.                                                                                                                                                                                                                                                      |

#### P0-3 Data-driven species–guide linking

| Field          | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | Guides get no internal authority from the profiles that already rank.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Evidence       | `src/lib/clusterGuides.ts:898` uses hard-coded sets plus `.slice(0, 4)`; 9 of 14 guides have no `relatedSpeciesIds`.                                                                                                                                                                                                                                                                                                                                                                            |
| Action         | 1. Build a reverse index from the `relatedSpeciesIds` of guides and cluster guides.<br>2. Show it on profiles as a separate "Practical guides" block (up to 3 links), independent of the 4 group links.<br>3. Backfill every guide: scorpion-in-house → the 4 scorpions; cockroach guide ↔ `blatta-orientalis`; the coming bed-bug guide → `cimex-lectularius`; jackal guide → canids.<br>4. Add a guard test: when a guide's subject has a published profile, the two must link to each other. |
| Impact         | Indexing, SEO, pages per session                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Effort         | S–M                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Risk           | Low                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Dependencies   | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Success metric | Every guide has at least 3 contextual inbound links from profiles; the October guides leave "Discovered" faster than the September ones did.                                                                                                                                                                                                                                                                                                                                                    |

#### P0-4 Build a fresh measurement baseline

| Field          | Detail                                                                                                                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | Decisions rest on Georgia-only data from 17–19 September.                                                                                                                                                                                                |
| Evidence       | The date window and the `country = geo` filter in `.seo/reports/gsc-raw.json`.                                                                                                                                                                           |
| Action         | 1. Run `pnpm seo:audit:gsc` for all countries over 18 Sep–1 Oct.<br>2. Add a URL Inspection pull for 60 URLs, stratified by page family and locale, covering all 14 guides.<br>3. Enable Cloudflare Web Analytics.<br>4. Add UTM tags to Facebook posts. |
| Impact         | Every later decision                                                                                                                                                                                                                                     |
| Effort         | S                                                                                                                                                                                                                                                        |
| Risk           | Low                                                                                                                                                                                                                                                      |
| Dependencies   | GSC credentials (already in `.env`)                                                                                                                                                                                                                      |
| Success metric | A baseline sheet with index status per page family and locale, refreshed weekly.                                                                                                                                                                         |

#### P0-5 October content

| Field          | Detail                                                                                                                                                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | October demand is live now: bed bugs, rodents moving indoors, the school term.                                                                                                                                                                                                            |
| Evidence       | The roadmap's demand evidence; the guide builder is ready.                                                                                                                                                                                                                                |
| Action         | 1. **Shipped (#770).** Bed-bug guide in week 1 (the builder is ready).<br>2. Rats in weeks 2–3.<br>3. The Reptiles of Georgia class hub by about 20 October. It needs a top-level route, built through the cluster-guide factory.<br>4. Roadmap fixes #4 (lizard hub) and #7 (ladybirds). |
| Impact         | Traffic                                                                                                                                                                                                                                                                                   |
| Effort         | M                                                                                                                                                                                                                                                                                         |
| Risk           | Low                                                                                                                                                                                                                                                                                       |
| Dependencies   | P0-3, so the new pages are linked from profiles                                                                                                                                                                                                                                           |
| Success metric | Indexed within 21 days; first impressions on the primary queries by mid-November.                                                                                                                                                                                                         |

### P1 — Next

#### P1-1 Shrink the Worker bundle

| Field          | Detail                                                                                                                                                                                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | The bundle is 24 MB (about 6.4 MB gzip) and grew 33% in eight days.                                                                                                                                                                                                                                              |
| Evidence       | Fresh build: the species chunk is 9.7 MB; the admin chunk is 3.6 MB, including the TypeScript compiler.                                                                                                                                                                                                          |
| Action         | 1. Move `fieldRecords` into static per-species JSON (in `dist/client` or on the CDN) and have the map fetch it on demand.<br>2. Remove `fieldRecords` from `species.generated.ts`.<br>3. Exclude `/admin` and `/api/admin` from vinext production builds.<br>4. Keep the search indexes out of server rendering. |
| Impact         | Reliability, cold starts                                                                                                                                                                                                                                                                                         |
| Effort         | M                                                                                                                                                                                                                                                                                                                |
| Risk           | Medium                                                                                                                                                                                                                                                                                                           |
| Dependencies   | P0-2                                                                                                                                                                                                                                                                                                             |
| Success metric | Worker under 3 MB gzipped; species chunk under 4 MB.                                                                                                                                                                                                                                                             |

#### P1-2 Truthful sitemap dates

| Field          | Detail                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Problem        | Synthetic lastmod values get ignored by Google.                                                                                                  |
| Evidence       | `src/data/pageLastModified.ts`                                                                                                                   |
| Action         | Derive lastmod from each page's `updatedAt` or git history. A hub or index takes the newest date among its children. Delete the synthetic table. |
| Impact         | Crawling and indexing                                                                                                                            |
| Effort         | S                                                                                                                                                |
| Risk           | Low                                                                                                                                              |
| Dependencies   | —                                                                                                                                                |
| Success metric | lastmod changes only when content really changes.                                                                                                |

#### P1-3 Cut client JavaScript

| Field          | Detail                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | About 290 KB of gzipped JavaScript on first load.                                                                                               |
| Evidence       | Sentry is 96 KB gzipped; the `optimizedImages` map is 193 KB raw.                                                                               |
| Action         | Load Sentry after the page is idle, or turn off browser tracing. Resolve image srcsets on the server so the image map never reaches the client. |
| Impact         | INP and LCP on mobile                                                                                                                           |
| Effort         | S                                                                                                                                               |
| Risk           | Low                                                                                                                                             |
| Dependencies   | —                                                                                                                                               |
| Success metric | First-load JavaScript under 180 KB gzipped.                                                                                                     |

#### P1-4 Raise CTR on profiles that already rank

| Field          | Detail                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Problem        | Profiles with the most impressions get very few clicks.                                                                                                                                                                                                                                                                  |
| Evidence       | წავი (otter): 1,194 impressions and 6 clicks at about position 8. მაჩვი (badger): 529 impressions and 0 clicks.                                                                                                                                                                                                          |
| Action         | Rewrite titles and descriptions for the top 10 mammal and bird profiles toward "X საქართველოში — ფოტო, სად ცხოვრობს, რას ჭამს" ("X in Georgia — photos, where it lives, what it eats"). Change one thing per page and measure for four weeks. **Started in #769:** წავი, მაჩვი and შველი now lead with „X საქართველოში“. |
| Impact         | Clicks                                                                                                                                                                                                                                                                                                                   |
| Effort         | S                                                                                                                                                                                                                                                                                                                        |
| Risk           | Low                                                                                                                                                                                                                                                                                                                      |
| Dependencies   | The P0-4 baseline                                                                                                                                                                                                                                                                                                        |
| Success metric | CTR on the treated pages roughly doubles.                                                                                                                                                                                                                                                                                |

#### P1-5 Make releases safe

| Field          | Detail                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | Deploys are manual and regressions go unnoticed (the cache bypass lasted ten days).                                                                                                                                        |
| Evidence       | No deploy job in CI; e2e commented out.                                                                                                                                                                                    |
| Action         | 1. A GitHub Action that deploys `main`.<br>2. A post-deploy smoke test on 20 URLs: status code, `HIT` on the second request, HTML size budget, canonical.<br>3. Re-enable `e2e/routes.spec.ts` against the preview deploy. |
| Impact         | Reliability                                                                                                                                                                                                                |
| Effort         | M                                                                                                                                                                                                                          |
| Risk           | Low                                                                                                                                                                                                                        |
| Dependencies   | P0-1                                                                                                                                                                                                                       |
| Success metric | No more silent regressions.                                                                                                                                                                                                |

#### P1-6 A page type for cross-group hubs

| Field          | Detail                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | The roadmap hubs (#2, #4, #8, #15) need top-level paths, but the guide registry places every guide under a group hub.                  |
| Evidence       | Guide registry structure                                                                                                               |
| Action         | Add a "topic hub" registry with a top-level path, species selectors, sections and all four locales. Reuse the cluster-guide rendering. |
| Impact         | Unlocks 4–6 new pages                                                                                                                  |
| Effort         | M                                                                                                                                      |
| Risk           | Low                                                                                                                                    |
| Dependencies   | P0-2                                                                                                                                   |
| Success metric | The Dangerous, Reptiles and Endemic hubs ship without bespoke route code.                                                              |

#### P1-7 One source for redirects

| Field          | Detail                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Problem        | Redirects live in two tables, and the `next.config.ts` one is dead in production.                    |
| Evidence       | `next.config.ts` and `src/proxy.ts`                                                                  |
| Action         | Generate one table that the proxy reads. Delete the `next.config.ts` redirects. Add a snapshot test. |
| Impact         | Maintainability, SEO safety                                                                          |
| Effort         | S                                                                                                    |
| Risk           | Low                                                                                                  |
| Dependencies   | —                                                                                                    |
| Success metric | One table, covered by a test.                                                                        |

#### P1-8 Species profiles behind the household guides

| Field          | Detail                                                                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problem        | Most household guides have no atlas page to link to.                                                                                                                                                                         |
| Evidence       | The structural gap in §5                                                                                                                                                                                                     |
| Action         | Add profiles for tick species, the German cockroach, _Vespa crabro_ (European hornet), and the house mouse and brown rat, each only with a Georgian source. Publish 1–2 a week alongside the marten and common-mammal batch. |
| Impact         | Internal linking, entity depth                                                                                                                                                                                               |
| Effort         | M                                                                                                                                                                                                                            |
| Risk           | Low                                                                                                                                                                                                                          |
| Dependencies   | P0-3                                                                                                                                                                                                                         |
| Success metric | Every household guide links to at least one profile.                                                                                                                                                                         |

### P2 — Later

- Move meta overrides and aliases into content frontmatter.
- Stop committing generated image files: generate them in CI or store the manifest elsewhere.
- Split `SpeciesRangeMap`.
- Use a nonce-based CSP.
- Start a program to verify Georgia field photos.
- Re-evaluate the Turkish locale after 90 days of all-country data.
- Owner decision: a Red Book index built only from statuses already cited on profiles.
- Update the catalog counts and URL map in `AGENTS.md`. This is trivial and can be done any time.

### Parked

Accounts, an app, AI chat or identification, new quiz types, extra schema, a framework migration, new locales, Black Sea pages before April.

---

## 16. 30 / 60 / 90 Day Roadmap

### Next 7 days (2–9 October)

- Fix caching (P0-1), deploy, and confirm cache `HIT`s.
- Switch the birds, snakes and lizards indexes, the hubs and the risk legend to the lightweight card (P0-2).
- Pull Search Console data for all countries, inspect 60 URLs, and enable Cloudflare Web Analytics (P0-4).
- Post the bed-bug guide (shipped in #770) to Facebook with UTMs.

### Rest of October

- Linking system and backfill (P0-3).
- Publish the rats guide.
- Start the cross-group hub page type (P1-6) and publish the Reptiles of Georgia hub.
- Publish spiders in the house.
- Publish the marten profile, the first of the mammal batch.
- Fix sitemap dates (P1-2), trim Sentry (P1-3), and start the snippet tests (P1-4).
- Fixes to existing pages: lizard-hub cannibalization, ladybird section, mouse-to-rats teaser.

### November

- **1–5 November: Search Console review.** Set the publishing pace from how the September and October guides got indexed.
- Engineering: Worker bundle diet (P1-1), CI deploys and smoke tests (P1-5), single redirect table (P1-7).
- Publish:
  - Dangerous animals hub
  - Endemic animals
  - House-bug identification router
  - Pantry pests
  - Tick on a dog
  - Marten in the attic, at the end of the month

### December

- Publish stings, ticks in Georgia, and birds of prey.
- Build the household species backbone (P1-8).
- Draft the snake-season refresh.

### Q1 2027 (direction only)

- Snake cluster refreshed by mid-February: a "snake in the house" section on the yard guide, a "most venomous" H2, black-snake identification, a dog snake-bite page.
- Tick cluster complete by 1 March; the stings page matured by April.
- Small pilots to validate Big Bets 2 and 3.
- Write the summer plan from real seasonal data.

---

## 17. Top 20 Content Publishing Queue

Rows are listed in publishing order.

| #   | Page / topic                                                                             | Why now                                                                     | Intent        | Season           | Existing / missing                                     | Priority                     |
| --- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ------------------------------------------------------ | ---------------------------- |
| 1   | Bed bugs at home (`ბაღლინჯო სახლში`)                                                     | Year-round demand; profile exists; builder ready                            | Problem       | Year-round       | **Shipped (#770)**                                     | P0                           |
| 2   | Reptiles of Georgia (class hub)                                                          | Exact-match domain; school term; the query currently lands on the home page | List / school | Sep–May          | Missing                                                | P0                           |
| 3   | Rats in the house and yard                                                               | Rodents move indoors October–February                                       | Problem       | Autumn–winter    | Missing                                                | P0                           |
| 4   | Fixes: lizard-hub title/H1, ladybird section on the stink-bug guide, mouse → rats teaser | Cheap; autumn queries                                                       | Mixed         | Now              | **Shipped (#769)**; the mouse → rats link waits for #3 | P0                           |
| 5   | Spiders in the house                                                                     | Spiders move indoors in autumn; the spider cluster already ranks            | Problem / ID  | Aug–Nov          | Missing                                                | P1                           |
| 6   | Marten profile (`კვერნა`)                                                                | Mammal profiles are the proven traffic source; feeds #11                    | Information   | Evergreen        | Missing                                                | P1                           |
| 7   | Dangerous and venomous animals of Georgia                                                | Head term in 3 languages; every child page exists                           | Hub           | Year-round       | Missing                                                | P0 (needs P1-6)              |
| 8   | Endemic animals of Georgia                                                               | School demand; Darevskia and vipers are in the atlas                        | List          | Sep–May          | Missing                                                | P1                           |
| 9   | What bug is this in my house?                                                            | Routes the long tail to 9+ guides                                           | ID router     | Spring / autumn  | Missing                                                | P1                           |
| 10  | Pantry pests (beans, flour)                                                              | Specific to Georgian households; low competition                            | Problem       | Autumn storage   | Missing                                                | P1                           |
| 11  | Marten in the attic or henhouse                                                          | Denning starts in October, so earlier than the roadmap's December           | Problem       | Oct–Mar          | Missing                                                | P1                           |
| 12  | Tick on a dog                                                                            | Needs about 5 months to age before April                                    | Problem       | Peak Apr–Jul     | Missing                                                | P1 (publish ahead of season) |
| 13  | Bee, wasp and hornet stings                                                              | August peak; shorten the wasp-nest sting section afterwards                 | Safety        | Jun–Aug          | Missing                                                | P1 (publish ahead of season) |
| 14  | Ticks in Georgia (hub)                                                                   | Must rank before April and the June CCHF news                               | Hub           | Apr–Aug          | Missing                                                | P1                           |
| 15  | Birds of prey of Georgia                                                                 | 11 raptor profiles exist; school demand                                     | List          | Sep–May          | Missing                                                | P2                           |
| 16  | Insect bite identification                                                               | Router over the bite pages, after #1 and #13                                | ID router     | May–Sep          | Missing                                                | P1                           |
| 17  | Extinct animals of Georgia                                                               | School demand; low competition                                              | List          | Sep–May          | Missing                                                | P2                           |
| 18  | Black snake in Georgia                                                                   | Search Console shows demand; a real safety identification question          | ID            | Apr–Jun          | Missing                                                | P1 (Jan–Feb)                 |
| 19  | Snake cluster spring refresh (yard + house section, "most venomous" H2)                  | Snake searches climb from April                                             | Safety        | Apr–Jun          | Existing                                               | P0 for February              |
| 20  | Migratory birds of Georgia                                                               | Ranks by spring, then serves the autumn school topic                        | List          | Mar–Apr, Sep–Oct | Missing                                                | P2                           |

**Cannibalization guards** follow the roadmap:

- A profile covers what the animal is; a guide covers what to do.
- The Dangerous hub routes readers; it doesn't answer each question itself.
- Identification routers keep each card short and link out.

**Where this queue departs from the roadmap**

1. Reptiles of Georgia moves to #2. It is the domain's identity and the school year is running.
2. The Dangerous hub moves to early November, after the cross-group page type and the linking system exist.
3. The marten guide moves earlier, because denning starts in October.
4. Mammal and bird profiles run in parallel at 1–2 a week, because species names are what earns impressions today.
5. Pace is set at the 1–5 November review, from how the 14 September guides got indexed.

---

## 18. 10 Quick Wins

Each takes less than a day.

1. Set `localeCookie: false` in `src/i18n/routing.ts`, so cacheable HTML stops carrying `Set-Cookie`.
2. Remove the `.slice(0, 4)` truncation in `getSpeciesGuideLinks`, or split "practical guides" from the group links, so venomous-snake profiles link to the bite and yard guides again.
3. Add `relatedSpeciesIds` to the scorpion-in-house guide (4 scorpions). Also link the cockroach guide back from `blatta-orientalis` and the jackal guide to the canid profiles.
4. Derive hub and index lastmod from the newest `updatedAt` among their children.
5. Lazy-load the Sentry client or disable browser tracing: about 96 KB less gzipped JavaScript per page.
6. Write a post-deploy smoke script for 20 URLs that checks the 200 status, `x-vinext-cache: HIT` on the second request, and the HTML size budget.
7. Rewrite titles and descriptions for the top 5 profiles by impressions: წავი (otter), მაჩვი (badger), დედოფალა (weasel), ენოტი (raccoon), შველი (roe deer).
8. **Shipped (#769).** Make the lizard hub own "ხვლიკი საქართველოში" (lizards in Georgia) (roadmap fix #4).
9. **Shipped (#769).** Add an indoor-ladybirds section to the stink-bug guide (roadmap fix #7). The season is now.
10. Update the catalog counts, groups and URL map in `AGENTS.md`. Agents act on the stale numbers.

---

## 19. Up to 3 Big Bets

### 1. Own "an animal problem at home or in the yard in Georgia", all year round

|                         |                                                                                                                                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What it is              | Household, encounter and bite guides, plus the species profiles behind them, organized around a seasonal calendar: rodents and spiders in October, martens in attics through winter, ticks in April, snakes in May, hornets in August. Every new page is shared on Facebook. |
| reptiles.ge's advantage | Competitors are news reposts and pest-control sales pages. reptiles.ge has sourced, answer-first content, species identity and risk ratings.                                                                                                                                 |
| Why users care          | Urgent, practical questions that come back every season.                                                                                                                                                                                                                     |
| Potential               | The largest pool of non-commercial problem searches in Georgian. Seasonality gives people natural reasons to return.                                                                                                                                                         |
| Difficulty              | M (content pace plus linking)                                                                                                                                                                                                                                                |
| Validate first          | How the 14 September guides get indexed and perform by mid-November; click-through on Facebook guide posts.                                                                                                                                                                  |

### 2. A Georgia field-record and photo-verification program (citizen science, without login at first)

|                         |                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| What it is              | A moderated "I saw this here" submission form, plus curation of contributor and iNaturalist records. It feeds the region maps and lifts `georgia-field` photos from 2 into the hundreds, all credited. |
| reptiles.ge's advantage | An existing contributor network (15 people, including Tarkhnishvili), the iNaturalist pipeline, and strict data-integrity rules.                                                                       |
| Why users care          | Recognition, and the question "does this live in my region?"                                                                                                                                           |
| Potential               | Unique content and photos, links from partners, and a reason to return that needs no accounts.                                                                                                         |
| Difficulty              | M–L (moderation and data integrity)                                                                                                                                                                    |
| Validate first          | Will the Facebook audience and contributors submit? Pilot a simple form for one season (spring snakes).                                                                                                |

### 3. A school and education channel

|                         |                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What it is              | Species-list hubs shaped around the school curriculum (reptiles, endemic, extinct, birds of prey, migratory birds, and a Red Book index if the owner allows it), printable lists and a classroom quiz mode, built with teacher and university partners. |
| reptiles.ge's advantage | The exact-match domain, scientific authorship, four locales, and the September–May search window.                                                                                                                                                       |
| Potential               | School queries are the largest informational demand the roadmap research found that nobody serves. Links from partners help indexing across the whole domain.                                                                                           |
| Difficulty              | M                                                                                                                                                                                                                                                       |
| Validate first          | Impressions for queue items #2 and #8 in Search Console by December; one pilot with a teacher.                                                                                                                                                          |

---

## 20. Project Scorecard

| Area                        | Status     | Why                                                                                                                                |
| --------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Content depth               | Healthy    | 143 sourced profiles in 4 locales and strong guides, but few insect profiles and only 2 of 1,047 photos verified in Georgia.       |
| Technical SEO               | Healthy    | Canonicals, hreflang, status codes and the sitemap are correct; lastmod is synthetic and redirects are duplicated.                 |
| Indexability                | Needs work | Only about 59% of Georgian URLs drew Georgian impressions, discovery pages are slow and uncached, and new-domain lag adds to both. |
| Site architecture           | Healthy    | A clear hub → index → profile structure driven by registries; cross-group hubs are missing.                                        |
| Performance                 | Weak       | No HTML caching; 1–5 s to first byte and 1–2 MB of HTML on hubs and indexes; about 290 KB of gzipped JavaScript per page.          |
| UX                          | Healthy    | Polished mobile templates, but guide pages and non-reptile profiles are dead ends.                                                 |
| Internal linking            | Needs work | Species-to-guide links are hard-coded and truncated, and guides are cut off from the atlas.                                        |
| Localization                | Strong     | Full four-locale parity enforced by tests; Turkish demand is low, so don't expand further.                                         |
| Observability               | Needs work | Good collectors and events, but the data is stale and Georgia-only, with no index or Core Web Vitals tracking.                     |
| Engineering maintainability | Needs work | Strong tests and strict TypeScript, but manual deploys, duplicated tables, hard-coded mappings and a growing bundle.               |
| Growth potential            | Strong     | A demand-backed roadmap, thin competition, rising impressions and a strong Facebook channel.                                       |

---

## 21. The Next 5 Things I Would Personally Do

1. **Fix caching today.**
   - Move `<html lang>` from `src/app/layout.tsx` into `src/app/[locale]/layout.tsx`, using `params.locale`.
   - Delete the root `getLocale()` call and set `localeCookie: false`.
   - Deploy, then curl `/`, `/gvelebi`, `/prinvelebi/saxeoebebi` and `/gvelebi/giurza` twice each and confirm `x-vinext-cache: HIT`.
2. **Ship `SpeciesCard`.**
   - Generalize `toRegionSpeciesCard` and switch the 10 client components listed in §9 to it.
   - Pass lookalikes and related species to profiles as cards.
   - Add a test that fails if `fieldRecords`, `faq` or `sources` reach a list component. Target: the birds index under 350 KB.
3. **Replace the hard-coded `getSpeciesGuideLinks`** with a reverse index built from `relatedSpeciesIds`. Backfill all 14 guides and add the two-way guard test.
4. **Pull fresh Search Console data for all countries (18 Sep–1 Oct)** and inspect 60 stratified URLs. Turn on Cloudflare Web Analytics. The 1 November review uses this baseline to set the content pace.
5. **Start the topic-hub route so the Reptiles of Georgia hub ("ქვეწარმავლები საქართველოში") ships by about 20 October.** The bed-bug guide already shipped in #770. Share both on Facebook with UTMs.

---

## Appendix: how the numbers were measured

| Measurement                                 | How                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Cache status, time to first byte, HTML size | `curl -s -D - --compressed -w "%{time_starttransfer}"` against live URLs on 2 Oct 2026, three runs each                                  |
| RSC payload and embedded species fields     | Sum of inline `<script>` bytes; counts of escaped keys such as `\"fieldRecords\"` and `\"faq\"` in the saved HTML                        |
| Client JavaScript per page                  | Every `/_next/static/*.js` and `.css` referenced by the page, fetched raw and gzipped                                                    |
| Worker bundle                               | `VINEXT=1 npx vinext build`, then file sizes under `dist/server` and a gzip of all server JS combined                                    |
| Species chunk cost                          | `import()` of the built species chunk in Node 22: time and heap delta, three runs                                                        |
| Inventory                                   | `getCatalogSpecies()`, `speciesAtlasMeta` groups, the generated EN/RU/TR translations, `regions[].speciesIds`, gallery `photoConfidence` |
| Search Console                              | `.seo/reports/gsc-raw.json`: window 23 Aug–19 Sep, country `geo`, current rows only                                                      |
| GA4                                         | `.seo/cache/ga4-*.json`: 23 Aug–19 Sep, aggregated by `channelGroup`, `sourceMedium` and `landingPage`                                   |
| Tests                                       | `npx vitest run`: 49 files, 440 tests, all passing                                                                                       |
| Internal links                              | Unique `<a href>` values inside `<main>`, with scripts removed, in the live HTML                                                         |
