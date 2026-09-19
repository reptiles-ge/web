# reptiles.ge SEO/GEO Intelligence System

This repository includes a local SEO/GEO intelligence runner for reptiles.ge. It is evidence-first: Georgian Search Console data is primary for Georgian pages, GA4 is used for behavior and referral evidence, and synthetic GEO prompts are labeled as hypotheses.

## Commands

```bash
pnpm seo:audit
pnpm seo:audit:gsc
pnpm seo:audit:ga4
pnpm seo:audit:geo
pnpm seo:audit:technical
pnpm seo:audit:url -- --url=https://reptiles.ge/gvelebi/giurza
pnpm seo:serp -- --query="გიურზა საქართველოში"
pnpm seo:selfcheck
```

Reports and raw collector outputs are written to `.seo/reports/`. API and SERP caches are written to `.seo/cache/`. Both directories are ignored by git.

## Credentials

Use read-only access only.

Google collectors support either:

- `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json`
- `GOOGLE_SERVICE_ACCOUNT_JSON='{...}'`

Search Console also needs:

- `GSC_SITE_URL=https://reptiles.ge/` or `GSC_SITE_URL=sc-domain:reptiles.ge`

GA4 also needs:

- `GA4_PROPERTY_ID=...`

Optional reproducible SERP collection uses DataForSEO:

- `DATAFORSEO_LOGIN=...`
- `DATAFORSEO_PASSWORD=...`

Do not commit real credentials.

## What The Runner Does

- Builds a normalized URL inventory from `.seo/graph.json` and the source registries.
- Classifies page types without mixing locales.
- Audits canonical, hreflang, sitemap, robots, and duplicate metadata signals from repository evidence.
- Collects GSC query/page/country/device/date rows with pagination when credentials are present.
- Collects GA4 landing-page, organic, referral, engagement, and source/medium rows when credentials are present.
- Flags striking-distance queries, weak CTR relative to observed position-band medians, cannibalization candidates, internal-linking candidates, and GEO citation-readiness prompts.
- Labels evidence as `OBSERVED`, `INFERRED`, `SYNTHETIC`, or `UNKNOWN`.

## Guardrails

- Georgian (`ka`) demand is not inferred from English demand.
- Synthetic Georgian expansions are never treated as volume-backed.
- Medical, venom, distribution, taxonomy, and conservation recommendations require human review and existing reliable sources.
- The current runner is audit-only. Repository edits should be made as normal reviewable code changes after an evidence-backed finding.
