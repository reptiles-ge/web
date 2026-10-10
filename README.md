# reptiles.ge — საქართველოს ცხოველთა ატლასი

A multilingual scientific atlas of the animals of Georgia: species profiles, identification guides, range maps, and practical field guides. Live at **[reptiles.ge](https://reptiles.ge)**.

- **Georgian is canonical.** English, Russian, and Turkish are full, hand-written alternates (`/en/…`, `/ru/…`, `/tr/…`), not machine overlays.
- **Herpetofauna is the core.** Snakes, lizards, turtles, and amphibians follow the national checklist by Tarkhnishvili et al. 2026 ([DOI 10.3897/caucasiana.5.e189214](https://doi.org/10.3897/caucasiana.5.e189214)).
- **Other groups** (birds, mammals, spiders, insects, scorpions) have hubs, species indexes, and profiles. Those indexes list the pages published so far. They are not complete national lists.

> [!IMPORTANT]
> This is a public scientific reference, not a blog. Never invent a locality, measurement, conservation status, venom effect, or endemic claim. The rules are in [Content integrity](#content-integrity).

## Contents

- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [How the site is built](#how-the-site-is-built)
- [Working with content](#working-with-content)
- [Content integrity](#content-integrity)
- [Quality checks](#quality-checks)
- [Branches, deploys, and releases](#branches-deploys-and-releases)
- [Environment variables](#environment-variables)
- [Command reference](#command-reference)
- [Further documentation](#further-documentation)
- [License](#license)

## Quick start

### Requirements

| Tool    | Version                                               |
| ------- | ----------------------------------------------------- |
| Node.js | 22 (the version CI uses)                              |
| pnpm    | 10.34.5 (pinned through `packageManager`)             |
| Git     | Any recent version. Husky installs a pre-commit hook. |

Enable pnpm through Corepack if you don't have it:

```bash
corepack enable
```

### Install and run

```bash
pnpm install
```

```bash
pnpm dev
```

Open [http://localhost:3333](http://localhost:3333). `pnpm dev` first runs `pnpm compile` (the `predev` hook), which generates the species catalog, search indexes, and map paths. A fresh clone runs without a `.env` file. You only need one for the CDN and notification tooling (see [Environment variables](#environment-variables)).

### Run it like production

Production runs on Cloudflare Workers through [vinext](https://www.npmjs.com/package/vinext), not `next start`. To check a change in the real runtime:

```bash
pnpm build:vinext
```

```bash
pnpm start:vinext
```

## Tech stack

| Area          | Choice                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19, TypeScript strict                                               |
| Runtime       | Cloudflare Workers via vinext (`src/worker.ts`), with a separate response-store Worker for caching |
| i18n          | `next-intl` v4. Locales are `ka` (default, no prefix), `en`, `ru`, and `tr`                        |
| Styling       | Tailwind CSS 4, no CSS-in-JS                                                                       |
| Content       | MDX species profiles compiled to TypeScript at build time; TypeScript modules for guides and news  |
| Images        | BunnyCDN at `https://cdn.reptiles.ge` (Next.js image optimization is off)                          |
| Maps          | Leaflet, plus an SVG map of Georgia compiled to paths                                              |
| Search        | Fuse.js over per-locale indexes generated at build time                                            |
| Monitoring    | Sentry, Cloudflare Workers observability logs                                                      |
| Testing       | Vitest (Node and happy-dom), Testing Library, MSW, Playwright with axe-core                        |
| Quality gates | ESLint, Prettier, knip, jscpd, React Doctor, i18n-check                                            |

> [!NOTE]
> Next.js 16 differs from older versions. The request edge is `src/proxy.ts`. **Do not add `middleware.ts`.** When in doubt, read the guides in `node_modules/next/dist/docs/`.

## Project structure

```text
.
├── src/
│   ├── app/
│   │   ├── [locale]/          Routes. Folder names are internal English pathnames.
│   │   ├── admin/             Local-only editor (*.local.tsx, never in a production build)
│   │   ├── api/               Rating API and local-only admin APIs
│   │   └── sitemap.ts, robots.txt, llms.txt, manifest.ts
│   ├── components/            Page components and UI
│   ├── content/
│   │   ├── species/{id}/      ka.mdx, en.mdx, ru.mdx, tr.mdx per species
│   │   ├── guides/{id}.ts     Long-form guide articles, all locales in one file
│   │   └── news/{slug}.ts     News articles, all locales in one file
│   ├── data/                  Catalog, regions, checklist, registries, *.generated.ts outputs
│   ├── i18n/                  next-intl routing and localized pathnames
│   ├── lib/                   Routing, SEO, route factories, quiz engine, helpers
│   ├── proxy.ts               Request edge: redirects, slug rewrites, locale handling
│   └── worker.ts              Cloudflare Worker entry (maintenance mode, RSC canonicalisation)
├── messages/                  UI strings: ka.json, en.json, ru.json, tr.json
├── scripts/                   Compile, image, SEO, and maintenance scripts (see scripts/README.md)
├── tests/                     Shared test setup, MSW server, proxy cacheability test
├── e2e/                       Playwright specs: routes, search, accessibility
├── docs/                      Release playbook and project notes
├── .agents/skills/            Playbooks for AI agents (guide articles, SEO, copy editing)
├── wrangler.jsonc             Main Worker config
└── wrangler.response-store.jsonc  Response-store Worker config
```

## How the site is built

### URLs and locales

Route folders under `src/app/[locale]/` use **internal English pathnames** such as `/snakes` and `/snakes/[slug]`. `src/i18n/pathnames.ts` maps them to public URLs:

| Locale           | Example                           | Notes                                           |
| ---------------- | --------------------------------- | ----------------------------------------------- |
| `ka` (canonical) | `/gvelebi/giurza`                 | No prefix. Latin-transliterated Georgian slugs. |
| `en`             | `/en/snakes/macrovipera-lebetina` | English pathnames, scientific slugs             |
| `ru`, `tr`       | `/ru/…`, `/tr/…`                  | Follow the English pathnames                    |

- Always link with `Link` / `getPathname` from `@/i18n/navigation`. Never hardcode a locale prefix.
- `/ka` and `/ka/…` redirect (301) to the unprefixed URL in `src/proxy.ts`.
- Any URL that changes needs a 301 in both `next.config.ts` and `src/proxy.ts`.
- Unknown paths fall through to `src/app/[locale]/[...rest]/page.tsx`, a `noindex` 404.

### Thin route factories

Route files are thin. They call a factory in `src/lib/`:

| Page kind     | Factory                                 | Example                                   |
| ------------- | --------------------------------------- | ----------------------------------------- |
| Group hub     | `createGroupHubRoute("snakes")`         | `src/app/[locale]/snakes/page.tsx`        |
| Species page  | `createSpeciesHubRoute("snakes")`       | `src/app/[locale]/snakes/[slug]/page.tsx` |
| Cluster guide | `createClusterGuideRoute("snake-bite")` | `src/app/[locale]/snakes/…/page.tsx`      |
| Guide article | `createGuideArticleRoute("/mammals/…")` | `src/app/[locale]/mammals/…/page.tsx`     |

### Generated files

`pnpm compile` (run automatically by `predev`, `prebuild`, and `pretest`) writes gitignored files. **Never edit or commit them.**

| Output                                             | Source                                | Script                 |
| -------------------------------------------------- | ------------------------------------- | ---------------------- |
| `src/data/species.generated.ts`                    | `src/content/species/*/*.mdx`         | `pnpm species:compile` |
| `src/data/speciesSlugs.generated.ts`               | MDX and slug rules (used by the edge) | `pnpm species:compile` |
| `src/data/releaseVersion.generated.ts`             | Latest Git tag (shown in the footer)  | `pnpm species:compile` |
| `src/data/search-index.{ka,en,ru,tr}.generated.ts` | Species catalog, guides, and news     | `pnpm search:compile`  |
| `src/data/georgia-paths.generated.ts`              | `src/assets/maps/georgia.svg`         | `pnpm map:compile`     |

If TypeScript reports a missing `*.generated.ts` module, run `pnpm compile`.

### Caching and the edge

- `src/proxy.ts` handles redirects and slug lookups. It imports only lightweight tables (`speciesSlugTable.ts`, `guideArticlePaths.ts`), never the full catalog.
- Server components pass the locale explicitly to next-intl, for example `getTranslations({ locale, namespace: "site" })`. An implicit locale falls back to `headers()` and makes the page uncacheable on vinext. ESLint enforces this, and `tests/proxy-cacheability.test.ts` guards it.
- On every push to `main`, the [Warm cache workflow](.github/workflows/warm-cache.yml) waits for the deploy and then requests every sitemap URL.

### Maintenance mode

This is a kill switch for emergencies, not for routine deploys, which are atomic. To turn it on, set the Worker variable `MAINTENANCE_MODE` to `on`. Every URL then answers `503` with `Retry-After`. Turn it off again as soon as possible, because a long 503 costs search rankings. The copy for all four locales is in `src/lib/maintenance.ts`. The team bypass uses the `MAINTENANCE_BYPASS_TOKEN` secret.

## Working with content

All user-facing copy must ship in **all four locales** in the same change. Never add text in one locale only.

### Add or edit a species profile

1. Edit `src/content/species/{id}/ka.mdx` and its `en`, `ru`, and `tr` siblings. The KA frontmatter owns the `id`, taxonomy, `danger`, image sources, gallery, and `sources`. The other locales translate the text and may override photo credits by matching `src`.
2. Run `pnpm species:compile`. It validates the frontmatter with Zod (`scripts/speciesFrontmatter.ts`).
3. For a new species, register the id in `src/data/speciesPublish.ts` and add its group and habitat tags to `speciesAtlasMeta` in `src/data/speciesAtlasMeta.ts`. Without that entry, grouping breaks.
4. The KA slug is derived from the common name. Override it in `src/lib/speciesSlugRules.ts` only when needed.
5. Lookalikes go in `LOOKALIKES` in `src/lib/speciesRoutes.ts` (in both directions), not in MDX.
6. A range map appears only if the id is in some `regions[].speciesIds` in `src/data/regions.ts`, and that requires a source (see [Content integrity](#content-integrity)).

Reference profiles: `macrovipera-lebetina`, `paralaudakia-caucasia`, `pseudopus-apodus`.

### Guide articles

Practical long-form guides (bat in the house, wasp nest, tick bite, …) live in `src/content/guides/{id}.ts` and are registered in `src/data/guideArticles.ts` and `src/data/guideArticlePaths.ts`. The sitemap, search, navigation, `llms.txt`, and redirects derive from that registry. Read [`.agents/skills/guide-article/SKILL.md`](.agents/skills/guide-article/SKILL.md) first. `src/data/guideArticles.test.ts` fails on any missing wiring.

### News

Articles live in `src/content/news/{slug}.ts` (all locales) and are registered in `src/data/news.ts`. Drafts stay out of the sitemap and static params. There are no tag or category archives.

### UI strings

Keys go in `messages/ka.json` and must also exist in `en.json`, `ru.json`, and `tr.json`. `pnpm i18n:check` verifies parity and ICU arguments. `pnpm i18n:usage` fails on unused or undefined keys.

### Images

Photos are served from BunnyCDN. Keep the photographer credit on every image. Only mark a photo as Georgia-field-verified with a named photographer and a Georgian locality. See [`scripts/README.md`](scripts/README.md) for the image pipeline (`images:optimize`, `images:check`, `images:og-missing`, `images:og-guides`).

### Local admin

`pnpm dev` also serves a local-only editor at [http://localhost:3333/admin](http://localhost:3333/admin) for photos, CDN uploads, species texts, and field records. Its files use the `.local.ts(x)` extension, which `next.config.ts` only picks up in development, so the editor is never part of a production build.

## Content integrity

These rules are non-negotiable. The full set is in [AGENTS.md](AGENTS.md).

- **Do not invent.** Every locality, region, measurement, IUCN or national status, venom effect, or endemic claim needs a source the site already uses.
- **Regions.** Add a species to a region in `src/data/regions.ts` only when Tarkhnishvili et al. 2026, or a profile that already cites a locality, names that administrative unit. "Georgia", "Caucasus", a habitat type, or a neighbouring region is not enough.
- **Checklist status.** Amphibian and reptile status (`confirmed`, `candidate`, `introduced`) lives in `src/data/herpetofauna-checklist.ts`. Never upgrade a candidate taxon.
- **Darevskia.** All 16 rock lizard species stay separate. Colour is not identification.
- **Medical pages are educational.** Bite and sting pages direct readers to call **112**. They are not first-aid protocols and do not use medical schema.
- **Prefer an empty field to a guess.** `src/lib/speciesContent.ts` hides empty and placeholder fields automatically.

Trusted sources: Tarkhnishvili et al. 2026; Iankoshvili & Tarkhnishvili 2021 (where the checklist cites it); species-specific IUCN Red List pages; the Georgian Red List where a profile already cites it.

## Quality checks

CI ([`.github/workflows/lint.yml`](.github/workflows/lint.yml)) runs on every pull request. Run the same checks locally before you push:

```bash
pnpm compile && pnpm knip && pnpm i18n:check && pnpm i18n:usage && pnpm cpd && pnpm doctor:check && pnpm lint && pnpm typecheck && pnpm test:coverage
```

| Check                | What it enforces                                                               |
| -------------------- | ------------------------------------------------------------------------------ |
| `pnpm lint`          | ESLint, including next-intl locale rules, the edge boundary, a11y, and imports |
| `pnpm typecheck`     | `tsc --noEmit`                                                                 |
| `pnpm test:coverage` | Vitest with v8 coverage. Thresholds are in `vitest.config.ts`.                 |
| `pnpm knip`          | No unused files, exports, or dependencies                                      |
| `pnpm cpd`           | jscpd copy-paste detection with a threshold of 0                               |
| `pnpm doctor:check`  | React Doctor score must be exactly 100                                         |
| `pnpm i18n:check`    | Locale key parity and ICU arguments (KA is the source)                         |
| `pnpm i18n:usage`    | No unused or undefined message keys                                            |
| `pnpm build:vinext`  | The production Worker build succeeds                                           |

### Tests

- `src/**/*.test.ts` runs in Node. Network calls are mocked with MSW (`tests/msw/server.ts`), and an unhandled request fails the test.
- `src/**/*.test.tsx` runs in happy-dom with Testing Library.
- When you add a test for a component, remove that component from `coverage.exclude` in `vitest.config.ts`.
- End-to-end tests (`pnpm test:e2e`) build the app and run Playwright against routes, search, and axe-core accessibility checks.

A pre-commit hook runs `lint-staged`, which applies ESLint and Prettier to staged files.

## Branches, deploys, and releases

```text
feature branch ──PR──▶ staging ──"Staging to main" PR──▶ main ──▶ production deploy
                                                          │
                                                          └── tag vX.Y.Z + GitHub Release (owner only)
```

- **Branch from `staging`** and open pull requests into `staging`.
- **Every push to `main` deploys** to production on Cloudflare Workers.
- **Label every pull request** into `staging` with one of `enhancement`, `content`, `bug`, `documentation`, or `dependencies`. Changes to a page's text, links, or photos are always `content`, including corrections. Label `Staging to main` pull requests `skip-changelog`.
- **Write the pull request title** as one plain sentence about the outcome, because it becomes the release note line.
- **Releases** are `vMAJOR.MINOR.PATCH` tags on commits already live on `main`. Only the owner cuts them. Do not bump `package.json` or add a changelog. The playbook is [`docs/RELEASING.md`](docs/RELEASING.md).

### Working on staging in a separate worktree

A dedicated worktree keeps `staging` checked out next to your feature branch:

```bash
git worktree add ../reptiles-staging staging
```

```bash
cd ../reptiles-staging && pnpm install && pnpm dev
```

Remove it when you're done:

```bash
git worktree remove ../reptiles-staging
```

## Environment variables

Put local values in `.env.local`. All `.env*` files are gitignored. `src/lib/env.ts` validates the variables with Zod, and `instrumentation.ts` checks them at startup. Read them through `publicEnv()` and `serverEnv()`, never through `process.env` directly.

| Variable                   | Scope  | Needed for                | Purpose                                                   |
| -------------------------- | ------ | ------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Public | Optional                  | Overrides the site origin (default `https://reptiles.ge`) |
| `BUNNY_STORAGE_ZONE`       | Server | CDN scripts, admin upload | BunnyCDN storage zone                                     |
| `BUNNY_STORAGE_ACCESS_KEY` | Server | CDN scripts, admin upload | BunnyCDN storage key                                      |
| `BUNNY_STORAGE_REGION`     | Server | Optional                  | BunnyCDN storage region                                   |
| `BUNNY_CDN_BASE_URL`       | Server | Optional                  | CDN base URL (default `https://cdn.reptiles.ge`)          |
| `TELEGRAM_BOT_TOKEN`       | Server | Optional                  | Telegram notifications for ratings and admin workflows    |
| `TELEGRAM_CHAT_ID`         | Server | Optional                  | Chat that receives those notifications                    |

Worker settings (`MAINTENANCE_MODE`, `MAINTENANCE_BYPASS_TOKEN`) live in Cloudflare and `wrangler.jsonc`, not in `.env`.

## Command reference

| Command                  | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `pnpm dev`               | Compile generated data, then start Next.js on port 3333                 |
| `pnpm build`             | Next.js production build                                                |
| `pnpm build:vinext`      | Production Worker build (what CI and Cloudflare build)                  |
| `pnpm start:vinext`      | Run the built Worker locally with Wrangler                              |
| `pnpm compile`           | `species:compile`, `search:compile`, and `map:compile`                  |
| `pnpm species:compile`   | MDX to catalog, slug table, occurrences, and release version            |
| `pnpm search:compile`    | Per-locale search indexes                                               |
| `pnpm map:compile`       | Georgia SVG to map paths                                                |
| `pnpm lint` / `lint:fix` | ESLint                                                                  |
| `pnpm typecheck`         | TypeScript                                                              |
| `pnpm test`              | Vitest and the proxy cacheability test                                  |
| `pnpm test:watch`        | Vitest in watch mode                                                    |
| `pnpm test:coverage`     | Vitest with coverage thresholds                                         |
| `pnpm test:e2e`          | Playwright end-to-end and accessibility tests                           |
| `pnpm doctor`            | React Doctor health scan (`doctor:changed` scans only your diff)        |
| `pnpm knip`              | Unused code and dependencies                                            |
| `pnpm cpd`               | Copy-paste detection                                                    |
| `pnpm i18n:check`        | Locale parity                                                           |
| `pnpm i18n:usage`        | Unused or undefined message keys                                        |
| `pnpm images:*`          | Image checks, optimization, and OG generation (see `scripts/README.md`) |
| `pnpm seo:*`             | SEO audits and the SEO graph export                                     |
| `pnpm analyze`           | Bundle analyzer                                                         |
| `pnpm format`            | Prettier on the whole repository                                        |

## Further documentation

| Document                                                                       | Covers                                                    |
| ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                                                         | Full project map and rules for AI agents and contributors |
| [docs/RELEASING.md](docs/RELEASING.md)                                         | Versions, tags, labels, and release notes                 |
| [scripts/README.md](scripts/README.md)                                         | Every compile, image, and maintenance script              |
| [.agents/skills/guide-article/SKILL.md](.agents/skills/guide-article/SKILL.md) | How to add a guide article                                |
| [docs/SPECIES-SUPER-ANALYSIS.md](docs/SPECIES-SUPER-ANALYSIS.md)               | The local species text analysis workflow                  |

## License

Photographs and species texts belong to their credited authors and cited sources. The source code is all rights reserved unless a license file is added.
