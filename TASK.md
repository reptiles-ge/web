# reptiles.ge — development tasks

Work items from the full-project audit. Each task is written so it can become a branch, PR, or issue without extra briefing.

**How to use this file**

- Pick from **P0** then **P1**. Do not start P3 while P0 is open.
- Keep the architecture: static App Router, KA canonical, `getCatalogSpecies()` as SSOT, no database, no CMS, no Cache Components.
- Do not invent locality, IUCN, Red List, or Georgia-field photo claims. Empty is better than invented.
- UI copy: update `messages/ka.json`, `en.json`, `ru.json`, and `tr.json` together.
- Do not commit `src/data/species.generated.ts`.

**Do not build (out of scope for this list)**

Database, CMS, ISR, Cache Components, AI identification, accounts, observation journal, Lenis, Algolia, shadcn/Radix rewrite, Storybook, `/konservacia`, indexable quiz results, a second quiz without a unique intent, more animal classes, mass machine-translated profiles.

---

## P0 — Fix now

Critical correctness, trust, or safety. Small enough to land in one PR each.

---

### TASK-01 — Fail species compile on invalid or incomplete taxa

**Title:** Harden `species:compile` with Zod and completeness checks

**Problem**

`scripts/compile-species.ts` casts YAML as `SpeciesFrontmatter`. Missing `en.mdx` is skipped. Missing sources fall back to `"Scientific publications"` with no URL. A published id can lack `speciesAtlasMeta`. Corrupt catalog can ship.

**Solution**

Validate every taxon at compile time with Zod. Fail the process (non-zero exit) when:

- Folder name ≠ frontmatter `id`
- A **published** id (`featuredSpeciesIds` minus `unpublishedSpeciesIds`) lacks `en.mdx`
- A published id lacks a `speciesAtlasMeta` entry
- `sources` is missing, empty, or only the generic default with no URL
- `danger` is set on a group that does not use the venom scale (birds, mammals, and non-venom spiders unless the risk model already allows it)
- Required KA fields (`id`, `commonName`, `scientificName`, `genus`, `family`) are empty

RU/TR may remain optional for drafts; published herp taxa should not silently drop EN.

**Files**

- `scripts/compile-species.ts`
- `src/data/speciesTypes.ts`
- `src/data/species.ts`
- `src/data/speciesAtlas.ts`
- `package.json` (compile already runs in `prebuild` / CI)

**Dependencies**

Zod (devDependency, compile-time only — not the browser bundle).

**Acceptance**

- `pnpm species:compile` fails with a clear path + field message on a fixture that omits `en.mdx` or sources.
- Valid catalog still compiles.
- CI lint job already runs compile; no extra workflow unless the script is no longer on the lint path.

**Complexity:** M

---

### TASK-02 — Remove unused public species API

**Title:** Delete `/api/species` catalog dump routes

**Problem**

`GET /api/species` and `GET /api/species/[id]` are not used by the app. They expose catalog JSON, add scrape surface, and can be quoted as “Reptiles.ge says…” after data has changed.

**Solution**

Delete the route handlers. Confirm nothing in `src/` fetches them. Keep `X-Robots-Tag` headers on any remaining `/api` routes (`admin`, `dev/axe`).

**Files**

- `src/app/api/species/route.ts` (delete)
- `src/app/api/species/[id]/route.ts` (delete)
- `knip.config.ts` if it referenced these files

**Dependencies:** none

**Acceptance**

- No `/api/species` tree.
- `pnpm knip` and `pnpm typecheck` pass.
- Admin photo POST and axe-dev POST still 404 in production.

**Complexity:** S

---

### TASK-03 — Add skip link and a single page landmark

**Title:** Keyboard skip-to-content and one `<main id="main">` per page

**Problem**

The nav is `fixed` and there is no skip link. Keyboard users tab through chrome before content. Some pages wrap their own `<main>` while the locale layout does not, so landmarks are inconsistent.

**Solution**

- Add a visually hidden skip link as the first focusable element in the locale layout, targeting `#main`.
- Render one `<main id="main">` around `{children}` in `src/app/[locale]/layout.tsx` **or** keep per-page `<main>` but then the skip target must exist on every page — prefer layout-level `<main>` and remove inner `<main>` wrappers to avoid nested mains.
- Ensure focus styles on the skip link match existing `focus-visible:ring` patterns.

**Files**

- `src/app/[locale]/layout.tsx`
- Page shells that currently render `<main>`: `SpeciesProfile`, `GroupHubPage`, `Hero`/home, `AboutPage`, `ContactPage`, atlas, quiz, news, 404, cluster frames
- `messages/*.json` (`nav.skipToContent` or equivalent, all four locales)

**Dependencies:** none

**Acceptance**

- Tab from load: skip link first, Enter moves focus into article content, not the menu.
- No nested `<main>`.
- axe “skip-link” / landmark region checks pass on home, one species, one guide.

**Complexity:** S

---

### TASK-04 — Rewrite About to match the real atlas

**Title:** Align About/methodology copy with checklist, four locales, and source policy

**Problem**

About still reads as a bilingual company page. It links the IUCN and GBIF **homepages**, implies conservation status is always present, and does not explain Tarkhnishvili et al. 2026, candidate taxa, “do not invent regions,” or the photo policy. JSON-LD says Organization; the page does not.

**Solution**

Rewrite About (all four message files) so it states:

- Scope: animals of Georgia; herpetofauna is the deep layer
- SSOT for herps: Tarkhnishvili et al. 2026 (DOI already used on profiles)
- What is never inferred (admin regions, IUCN, Red List, measurements)
- Candidate vs confirmed
- Bite/venom pages are educational; call 112
- Photos: credit always; Georgia-field only with evidence
- Four locales, KA canonical
- How to send a correction (existing contact)

Replace generic IUCN/GBIF/Reptile Database cards with the sources the site actually trusts, plus a link to `/about#methodology`. Keep the contribute → contact path.

**Files**

- `messages/ka.json`, `en.json`, `ru.json`, `tr.json` (`about` namespace)
- `src/components/AboutPage.tsx`
- `src/app/[locale]/about/page.tsx` (JSON-LD if AboutPage type/description change)

**Dependencies:** none. Do not invent an editor name if none is agreed — use “Reptiles.ge editorial compilation” until TASK-10 names a person.

**Acceptance**

- About no longer says the product is only bilingual.
- No `https://www.iucnredlist.org/` homepage as a primary source (species-specific IUCN URLs on profiles stay).
- Methodology heading has `id="methodology"` (footer attribution already links there).

**Complexity:** S–M

---

## P1 — High value

Material product, performance, SEO, or maintainability. One PR per task unless noted.

---

### TASK-05 — Convert static page shells to Server Components

**Title:** Remove `"use client"` from hubs, guides, About, and species chrome

**Problem**

`GroupHubPage`, `ClusterGuidePage`, `AboutPage`, `ContactPage`, `SpeciesProfile`, `AtlasSeo`, and most index/hero files are Client Components because they call `useTranslations` / `useLocale`. The homepage `Hero` is already a Server Component. Extra JS hydrates pages that are HTML.

**Solution**

- Use `getTranslations` / `getLocale` from `next-intl/server` on static shells.
- Keep client islands only where there is interaction: search, theme, language switcher, gallery lightbox, map, quiz player, atlas filters, voice player, navbar scroll/menu.
- `SpeciesProfile`: localization already happens in `createSpeciesRoute.tsx`. Do not localize again on the client. Move `species_view` into a tiny client `SpeciesViewTracker` (or existing `AnalyticsPageContext` if it can take props).
- `ContactPage`: drop Framer Motion; CSS is enough.

Do not enable React Compiler in this PR. Do not enable Cache Components.

**Files**

- `src/components/GroupHubPage.tsx` and related heroes/lists
- `src/components/ClusterGuidePage.tsx`, `ClusterPageFrame.tsx` (split if needed)
- `src/components/AboutPage.tsx`, `ContactPage.tsx`
- `src/components/SpeciesProfile.tsx`, `SpeciesProfileHero.tsx`, `SpeciesProfileBody.tsx`
- `src/components/species-atlas/AtlasSeo.tsx`
- Index pages (`SnakeSpeciesIndexPage`, etc.) if they have no client state
- `src/lib/createSpeciesRoute.tsx`, `createGroupHubRoute.tsx`, `createClusterGuideRoute.tsx`

**Dependencies:** none

**Acceptance**

- `"use client"` remains only on interactive islands.
- Hub / species / about HTML is meaningful with JS disabled (nav search overlay excepted).
- `pnpm build` and visual check of one hub, one guide, one species, About, Contact.

**Complexity:** M–L (file-by-file; can split into TASK-05a hubs/guides, TASK-05b species, TASK-05c about/contact)

---

### TASK-06 — Compile a slim search index instead of shipping the catalog

**Title:** Build `search-index.generated.ts` and lazy-load the search overlay

**Problem**

`Navbar` → `SpeciesSearch` → `siteSearch.ts` → `getCatalogSpecies()`. Every page hydrates the full generated catalog for Cmd+K.

**Solution**

At compile time, emit a locale-aware **search document** list: id, kind, titles, aliases, subtitle, href, optional tiny image URL — not overview/habitat/sources.

- `SpeciesSearch` dynamic-imports the overlay/panel.
- Scoring stays in `siteSearch.ts` but operates on the slim index.
- Navbar trigger can stay in the header without loading the index until open or idle.

**Files**

- `scripts/compile-species.ts` (or `scripts/compile-search.ts` called from `predev` / `prebuild`)
- `src/lib/siteSearch.ts`
- `src/components/SpeciesSearch.tsx`, `NavbarChrome.tsx`
- `.gitignore` if the index is generated (same rule as `species.generated.ts`)

**Dependencies:** none (reuse compile pipeline)

**Acceptance**

- Client bundle for a no-search page (e.g. Contact) no longer includes species overview text.
- Cmd+K still finds გიურზა, `Macrovipera`, `giurza`, and news/hub titles.
- Search analytics events still fire.

**Complexity:** M

---

### TASK-07 — Named editor, Person JSON-LD, and profile credibility footer

**Title:** Add authorship and a visible compilation/review block

**Problem**

Species JSON-LD `author` is only Organization. Photographers already get `Person` in `photoMeta.ts`. The public site has no named editor, no “how this page was compiled,” and git `updatedAt` is the only date.

**Solution**

- Agree a public byline (person or “Reptiles.ge editorial compilation of cited sources”). Do not claim peer review.
- Add `Person` (or honest Organization authorship) on species `Article` JSON-LD; keep `publisher` as Organization.
- Profile footer: sources (existing) + checklist status when you have it (see TASK-18) + last updated + link to `/about#methodology`.
- Optional `reviewedBy` only if a named herpetologist actually reviewed that page.

**Files**

- `src/lib/createSpeciesRoute.tsx`
- `src/lib/site.ts` (`organizationJsonLd`, optional `editorJsonLd`)
- `src/components/ContentAttribution.tsx` / `SpeciesSources.tsx`
- `messages/*.json` (`attribution`, `profile`)
- About (TASK-04) if not already done

**Dependencies:** none

**Acceptance**

- View-source JSON-LD on `/gvelebi/giurza` includes a named author or an explicit editorial Organization role, plus citations.
- Footer does not invent IUCN or Red List.

**Complexity:** S–M

---

### TASK-08 — Vitest for catalog invariants + Playwright route smokes

**Title:** Add unit tests for slugs/quiz/search and E2E for 301s and hreflang

**Problem**

There are no tests. A broken slug, unpublished 302, or quiz result URL would ship as an SEO incident.

**Solution**

**Vitest (no DOM):**

- `kaToSlug`, `KA_SLUG_OVERRIDES` / aliases, hub resolve
- Unpublished `dolichophis-caspius` stays out of `getCatalogSpecies()`
- `isPlaceholderBody`, `hasRealIdentification`
- Quiz: `isSnakeSpecies`; glass lizard never in pool
- Search scoring: scientific name + Georgian alias
- `regions.ts`: every `speciesIds` entry is a published catalog id

**Playwright (preview or `pnpm start` after build):**

- `/gvelebi/giurza` 200, H1, canonical, Taxon JSON-LD
- `/en/snakes/macrovipera-lebetina` hreflang includes KA `x-default`
- `/ka` and `/ka/gvelebi` 301
- `/species/macrovipera-lebetina` 301 to hub slug
- Caspius URL 302 to snake hub
- `/species?type=snake` is `noindex`
- Quiz landing is indexable; playing does not create `/quiz/.../result`
- Cmd+K finds გიურზა
- 404 is `noindex`

Wire `pnpm test` and `pnpm test:e2e` into CI after lint/typecheck. Do not require 100% coverage.

**Files**

- `vitest.config.ts`, `playwright.config.ts`
- `src/**/*.test.ts` next to libs or under `tests/`
- `.github/workflows/lint.yml` (extend or add `test.yml`)
- `package.json`

**Dependencies**

`vitest`, `@playwright/test`, `@axe-core/playwright` (axe in TASK-09 can share the Playwright job).

**Acceptance**

- CI fails if giurza slug or caspius 302 regresses.
- Tests do not hit production `reptiles.ge` (local build only).

**Complexity:** M

---

### TASK-09 — Gallery `showModal()` and overlay focus trap

**Title:** Fix dialog keyboard behavior for gallery and search/language panels

**Problem**

`SpeciesGallery` sets `<dialog open>` instead of `showModal()`, so there is no top layer or inert background. `OverlayPanel` handles Escape and backdrop click but does not trap focus or restore focus to the opener.

**Solution**

- Gallery: `useRef` + `showModal()` / `close()`; initial focus on close button; keep arrow keys; return focus to the thumbnail.
- OverlayPanel / language list: focus trap while open, restore focus on close, `aria-modal` already present on mobile sheet.
- Respect `prefers-reduced-motion` if overlay still uses Framer Motion.

**Files**

- `src/components/SpeciesGallery.tsx`
- `src/components/OverlayPanel.tsx`
- `src/components/LanguageSwitcher.tsx` if it does not use OverlayPanel’s trap
- Optional: `src/components/map/RegionDetailsPanel.tsx` (already `role="dialog"`)

**Dependencies:** none (do not add focus-trap-react unless native is painful)

**Acceptance**

- Tab cycles inside open gallery; Escape closes; focus returns to the image button.
- Same for search sheet and language panel.
- Playwright + axe on species + header search (with TASK-08).

**Complexity:** S–M

---

### TASK-10 — Cut analytics vendors to one pageview tool + Speed Insights

**Title:** Remove overlapping GTM / Vercel Analytics / Clarity unless a vendor is required

**Problem**

Production loads Google Tag Manager, Vercel Analytics, Speed Insights, and Microsoft Clarity. Event taxonomy in `src/lib/analytics.ts` is already good (`dataLayer`). Extra scripts hurt TBT/INP and session replay on a science site has a trust cost.

**Solution**

Keep **Speed Insights** (CWV). Keep **one** pageview + custom-event pipeline:

- Either GTM (if GA4/GSC events are configured there) **or** Vercel Analytics — not both for the same pageviews.
- Remove Clarity unless recordings are reviewed weekly; if kept, disclose on About.

Do not drop `trackEvent` / `page_context` / `species_click`; retarget the remaining vendor.

**Files**

- `src/app/layout.tsx` (`GoogleTagManager`)
- `src/app/[locale]/layout.tsx` (`Analytics`, `SpeedInsights`, `ClarityInit`)
- `src/components/ClarityInit.tsx`
- `src/lib/analytics.ts`
- About privacy sentence if Clarity stays

**Dependencies:** remove unused packages from `package.json`

**Acceptance**

- Production page has at most one analytics bootstrap besides Speed Insights.
- Existing events still appear in the chosen tool (document the mapping in the PR).

**Complexity:** S

---

### TASK-11 — Knip in CI; tune React Doctor toward blocking new errors

**Title:** Fail PRs on unused exports and new React Doctor errors

**Problem**

`pnpm knip` exists but CI only runs lint + typecheck. React Doctor is advisory, so regressions are comments only.

**Solution**

- Add `pnpm knip` to `.github/workflows/lint.yml` after compile.
- Keep React Doctor on PRs; set `blocking: error` only after ignoring known noise in `doctor.config.json` (already ignores generated files and `nextjs-no-img-element`).
- Pin `millionco/react-doctor` to a commit SHA if you tighten blocking (workflow comment already warns about floating `@v2`).

**Files**

- `.github/workflows/lint.yml`
- `.github/workflows/react-doctor.yml`
- `knip.config.ts`, `doctor.config.json`

**Dependencies:** none

**Acceptance**

- A dead export fails CI.
- Doctor does not fail the whole historical backlog on day one unless you choose `scope: changed` + blocking on new errors only.

**Complexity:** S

---

### TASK-12 — Deepen remaining herp profiles to the reference bar

**Title:** Bring published snakes, lizards, turtles, and amphibians to `macrovipera-lebetina` depth

**Problem**

SEO and trust come from complete identification, cited range, sources, and FAQs. Many herp MDX files are thinner than გიურზა / ჯოჯო / გველხოკერა. Thin pages dilute the cluster.

**Solution**

Content-only, KA first then EN/RU/TR overlays. For each taxon: identification traits that are not checklist-meta, overview that is not a placeholder, sources with URLs, lookalikes in `LOOKALIKES` (not YAML), regions only from Tarkhnishvili admin units or an already-cited locality. Hide empty stats via existing `speciesContent.ts`.

Do not invent size, IUCN, or Red List. Do not mark CDN photos Georgia-field-verified.

**Files**

- `src/content/species/{id}/{ka,en,ru,tr}.mdx`
- `src/lib/speciesRoutes.ts` (`LOOKALIKES`) only when adding real pairs
- `src/data/regions.ts` only with a cited admin unit

**Dependencies:** none

**Acceptance**

- Placeholder markers do not appear in rendered biology blocks.
- Each published herp has at least one real identification trait set and cited sources.
- Darevskia species remain distinct (colour is not ID).

**Complexity:** L (many PRs by taxon or family; this is the highest user/SEO value task)

---

## P2 — Strong follow-ups

Do after P1. Still production-quality, not polish-only.

---

### TASK-13 — Add `datePublished` distinct from git `updatedAt`

**Title:** Persist first-publish time on species and news JSON-LD

**Problem**

Species `Article` JSON-LD has `dateModified` from git/mtime. Every content tweak looks like a new article. There is no `datePublished`.

**Solution**

At compile, set `datePublished` from the **oldest** git commit of that taxon’s MDX (or an optional frontmatter override). Keep `updatedAt` as the latest commit. Emit both in `Species` and in `generateMetadata` / JSON-LD (`datePublished`, `dateModified`).

News already has `publishedAt` / `updatedAt` — mirror the same JSON-LD discipline if any article is missing it.

**Files**

- `scripts/compile-species.ts`
- `src/data/speciesTypes.ts`
- `src/lib/createSpeciesRoute.tsx`
- `src/lib/speciesMeta.ts` if Open Graph `publishedTime` is added

**Dependencies:** none

**Acceptance**

- JSON-LD on a stable species keeps a fixed `datePublished` across unrelated typo commits.
- Invalid dates fall back safely (do not ship `Invalid Date`).

**Complexity:** S–M

---

### TASK-14 — Complete RU/TR aliases and stop indexing English-fallback region FAQs

**Title:** Locale-complete search aliases; region FAQs only when translated

**Problem**

`SPECIES_ALIASES` in `seoKeywords.ts` is mostly `ka`/`en`. `regionContent.ts` FAQs often have no `ru`/`tr`; `pickLocalized` falls back to English on indexed region pages.

**Solution**

- Extend alias type to `en`/`ka`/`ru`/`tr` for species you rank (vipers, yard snakes, turtles, common lizards).
- For region FAQs: omit the FAQ block (and FAQ JSON-LD) when the locale has no translation — do not show English Q&A on `/ru/regions/adjara`.
- Same rule for biome/overview if those strings are English-only.

**Files**

- `src/lib/seoKeywords.ts`
- `src/data/regionContent.ts`
- `src/components/RegionProfile.tsx`
- `src/app/[locale]/regions/[id]/page.tsx`

**Dependencies:** none. Do not machine-translate scientific body copy.

**Acceptance**

- RU search finds Russian vernaculars for Macrovipera / გიურზა.
- `/ru/regions/{id}` does not render English FAQ as if it were Russian.
- FAQ schema only when FAQ is visible.

**Complexity:** M

---

### TASK-15 — Localized `error.tsx` and `global-error.tsx`

**Title:** Design a four-locale 500 that still shows 112 on bite-adjacent failures

**Problem**

There is no `error.tsx` or `global-error.tsx`. A client island throw blanks the species page.

**Solution**

App Router error boundaries with messages in all locales. Keep 404 as `not-found.tsx` (`noindex`). Error page: short apology, link home, link contact. On venomous profiles, do not hide the 112 educational line if you can pass a flag; otherwise a global “emergency: 112” in the error chrome is enough. `global-error.tsx` must define its own `<html>`/`<body>`.

No `loading.tsx` required for static routes.

**Files**

- `src/app/[locale]/error.tsx`
- `src/app/global-error.tsx`
- `messages/*.json`

**Dependencies:** none

**Acceptance**

- Forced throw in a client island shows the error UI, not a blank screen.
- Error responses stay `noindex` if they are 500.

**Complexity:** S

---

### TASK-16 — Close IA holes after spiders and quiet hubs

**Title:** Footer, About explore links, and home CTAs include every live hub

**Problem**

Spiders are a live hub (`GROUP_HUBS`, home quiet tiles) but `Footer` `exploreLinks` omits them. About explore links may lag. Identify guides are weaker on the homepage than mammal tiles.

**Solution**

- Footer explore: add spiders; keep birds/mammals.
- Home: one clear path to snake identify + venomous cluster above the fold or in `HomeField`.
- README/AGENTS: four locales, current taxon counts, remove stale `herpetofauna-checklist.ts` pointer unless TASK-18 restores the file.

**Files**

- `src/components/Footer.tsx`
- `src/components/home/HomeGroups.tsx`, `HomeField.tsx`
- `messages/*.json` (`about.exploreLinks`, `footer`)
- `AGENTS.md`, `README.md`

**Dependencies:** none

**Acceptance**

- Every `GROUP_HUB_LIST` id appears in footer explore.
- AGENTS catalog numbers match `featuredSpeciesIds` minus unpublished.

**Complexity:** S

---

### TASK-17 — Darevskia field identification guide

**Title:** Add a Darevskia cluster page that does not collapse 16 species by colour

**Problem**

Georgia has many `Darevskia` taxa; colour is not ID. There is no dedicated guide. This is unique intent (not a second quiz, not `/konservacia`).

**Solution**

Follow the cluster checklist: `pathnames.ts` → `RESERVED_HUB_SLUGS` → `CLUSTER_GUIDES` + `createClusterGuideRoute` → messages in four locales → cross-locale 301s if needed. Content: range, scalation/habitat/elevation **only from cited sources**; explicit “do not ID by colour”; links to each profile. No invented localities.

**Files**

- `src/i18n/pathnames.ts`
- `src/lib/clusterGuides.ts`
- `src/lib/groupHubs.ts` (`RESERVED_HUB_SLUGS`)
- `src/app/[locale]/lizards/.../page.tsx`
- `messages/*.json`
- `next.config.ts` / `src/proxy.ts` if old slugs exist

**Dependencies:** none. Do this after TASK-12 has honest Darevskia profiles.

**Acceptance**

- Unique title/H1/description vs `/xvlikebi` and `/xvlikebi/identifikacia`.
- Does not treat the 16 species as one lizard.

**Complexity:** M

---

### TASK-18 — Restore checklist status in data, not only in prose

**Title:** Add `herpetofauna-checklist.ts` (or equivalent) with confirmed | candidate | introduced

**Problem**

`AGENTS.md` points at `src/data/herpetofauna-checklist.ts` but the file is missing. Candidate status lives in MDX sentences and can drift from Tarkhnishvili et al. 2026.

**Solution**

A typed module: species id → `{ status: "confirmed" | "candidate" | "introduced"; note?: string }` for herps only, sourced from the paper (and Iankoshvili & Tarkhnishvili 2021 only where the checklist cites it). Compile or profile UI shows a non-invented badge. Do not “confirm” candidates. Birds/mammals/spiders stay out of this file.

**Files**

- `src/data/herpetofauna-checklist.ts` (new)
- `scripts/compile-species.ts` or profile components
- `src/lib/createSpeciesRoute.tsx` (optional JSON-LD / visible note)
- `AGENTS.md`

**Dependencies:** none

**Acceptance**

- Every published amphibian/reptile id is in the checklist map or explicitly listed as out of scope with a comment in AGENTS (not in code comments).
- UI never labels a candidate as confirmed.

**Complexity:** M

---

### TASK-19 — Implement `photoConfidence` for species images

**Title:** Tag photos as georgia-field | range-typical | placeholder

**Problem**

AGENTS lists Georgia-field verification as open work. CDN/iNaturalist images can be outside Georgia. There is no field in types or UI.

**Solution**

Add optional `photoConfidence` on `GalleryImage` / hero credit (KA-owned). Values: `georgia-field` (needs photographer + Georgia locality evidence), `range-typical`, `placeholder`. Default `range-typical` or unset (treat as unverified). UI: do not show a “Georgia” verification chip unless `georgia-field`. Compile may warn on `georgia-field` without location.

**Files**

- `src/data/speciesTypes.ts`
- `scripts/compile-species.ts`
- Species MDX frontmatter (KA)
- `src/components/PhotoCreditCaption.tsx`, `SpeciesGallery.tsx`
- `messages/*.json`

**Dependencies:** none

**Acceptance**

- No profile claims Georgia-field-verified without the tag and a locality/credit.
- Placeholders still hidden by `isPlaceholderMedia`.

**Complexity:** M

---

### TASK-20 — Security headers after analytics is simplified

**Title:** Add CSP, Referrer-Policy, and frame protections in `next.config.ts`

**Problem**

`headers()` only sets `X-Robots-Tag` for `/api` and `/admin`. No CSP, `Referrer-Policy`, or `X-Frame-Options`/`frame-ancestors`.

**Solution**

Do this **after TASK-10**. GTM makes CSP painful. If GTM is gone, add a strict CSP: `'self'`, `cdn.reptiles.ge`, fonts, Speed Insights domain. `frame-ancestors 'none'`. `referrer-policy: strict-origin-when-cross-origin`. Keep API `noindex`.

Do not invent XSS in MDX (compile-time gray-matter is enough).

**Files**

- `next.config.ts`
- Verify GTM/Clarity/Analytics domains if any remain

**Dependencies:** none

**Acceptance**

- `curl -I https://reptiles.ge` (or preview) shows CSP and referrer policy.
- Home, species, and CDN images still load.

**Complexity:** S–M

---

### TASK-21 — Remove dead UI: `Reveal`, leftover motion, unused lucide

**Title:** Delete no-op `Reveal` and prune icon/motion usage

**Problem**

`Reveal` is an identity wrapper. Contact used Framer Motion for a static page (should be gone in TASK-05). lucide-react is imported from ~80 files.

**Solution**

- Delete `Reveal.tsx` and unwrap call sites.
- After Contact is a Server Component, Framer stays only behind `MotionLazy` for OverlayPanel + map.
- Remove unused lucide icons; do not add a new icon library.

**Files**

- `src/components/Reveal.tsx`
- Grep `from "@/components/Reveal"`
- `src/components/MotionLazy.tsx` import graph
- lucide imports under `src/components/`

**Dependencies:** none

**Acceptance**

- Knip reports `Reveal` gone.
- Overlay and map animation still work; `prefers-reduced-motion` respected on CSS hero-drift.

**Complexity:** S

---

## P3 — Optional polish

Only when P0–P2 for the same area are done.

---

### TASK-22 — Contrast, radius, and type ramp cleanup

**Title:** One radius scale and a WCAG contrast pass on light/dark tokens

**Problem**

Cards mix `rounded-[20px]`, `[22px]`, `[24px]`. Clamp type sizes are copied by hand. Primary green on muted text may fail contrast in one theme.

**Solution**

Pick one radius (e.g. 20px cards, 999px pills). Optional CSS variables `--radius-card`. Measure `--primary` / `--muted-foreground` / ink hero text. No shadcn. No CVA unless a third variant appears.

**Files**

- `src/app/globals.css`
- High-traffic components (cards, chips, nav)

**Complexity:** S

---

### TASK-23 — Replace date-fns with `Intl.DateTimeFormat`

**Title:** Format site dates with Intl and a fixed Georgia time zone

**Problem**

`date-fns` and `@date-fns/tz` are only used in `formatDate.ts` and `siteTime.ts`.

**Solution**

Use `Intl` + existing `src/lib/siteTime.ts` timezone rules. Drop the two packages if nothing else imports them.

**Files**

- `src/lib/formatDate.ts`, `src/lib/siteTime.ts`
- `package.json`

**Complexity:** S

---

### TASK-24 — React Compiler for remaining client islands

**Title:** Enable React Compiler after RSC split

**Problem**

React Doctor reports the compiler off. Quiz, map, atlas filters, and search still re-render.

**Solution**

Enable only after TASK-05/06. Follow current Next 16 docs (not cached training data). Measure quiz + atlas before/after. Turn off if compile time or edge cases hurt.

**Files**

- `next.config.ts`
- `package.json` / babel or Next compiler flags per **current** Next 16.2 docs

**Complexity:** S–M

---

### TASK-25 — Sentry (or equivalent) after error UI exists

**Title:** Report 500s from `error.tsx` without adding a second analytics product

**Problem**

No error monitoring. Speed Insights is not an exception tracker.

**Solution**

Optional. Add Sentry (or Vercel’s error tracking if that is enough) **after TASK-15**. Sample client errors. No session replay if Clarity was removed for trust reasons.

**Complexity:** S

---

### TASK-26 — Lighthouse CI on a small URL set

**Title:** Lab CWV on home, giurza, atlas, one guide

**Problem**

RUM exists (Speed Insights); no lab budget in CI.

**Solution**

Optional. Lighthouse CI on four URLs per locale is too slow — KA home + KA species + EN species is enough. Do not fail CI on flaky TTI; fail on broken LCP images or missing meta.

**Complexity:** S

---

### TASK-27 — Lizard quiz only with a unique intent slot

**Title:** Do not clone SnakeQuiz under a new slug

**Problem**

`QUIZ_INDEX` has lizard/turtle `soon`. A cloned “identify” quiz would collide with `/xvlikebi/identifikacia`.

**Solution**

If built: new registry entry, unique Georgian intent (not გველის ამოცნობა), no result URLs, pool from catalog lizards only, never glass-lizard-as-snake. Otherwise leave `soon` with no href.

**Files**

- `src/lib/quizzes.ts`
- Do not clone `src/app/[locale]/quiz/[slug]` patterns into a second folder tree

**Complexity:** M

---

### TASK-28 — Bird/mammal species-index cluster pages

**Title:** Add `/prinvelebi/saxeoebebi` (and mammals) only when profiles are not thin

**Problem**

AGENTS: birds/mammals have hubs + profiles, no index cluster. Thin indexes hurt SEO.

**Solution**

Same factory as snake index, after a critical mass of profiles have real identification + sources. Until then, do not add URLs.

**Complexity:** M

---

## Suggested PR order

| Order | Task | Why this order |
| --- | --- | --- |
| 1 | TASK-01 | Stop shipping a corrupt catalog |
| 2 | TASK-02 | Remove dead API |
| 3 | TASK-03 | A11y baseline |
| 4 | TASK-04 | Trust copy |
| 5 | TASK-08 | Tests before large RSC moves |
| 6 | TASK-06 | Biggest JS cut |
| 7 | TASK-05 | RSC split |
| 8 | TASK-09 | Dialogs |
| 9 | TASK-11 | CI |
| 10 | TASK-10 | Scripts |
| 11 | TASK-07 | E-E-A-T |
| 12 | TASK-12 | Content (parallel anytime after 01) |
| 13 | TASK-13–21 | P2 as listed |
| 14 | TASK-22–28 | Polish / later product |

TASK-12 can run in parallel with engineering tasks from day one (content PRs).
