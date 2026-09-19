---
name: reptiles-seo
description: Use for reptiles.ge SEO, GEO, AI-citation, Search Console, GA4, SERP, technical SEO, content-gap, cannibalization, CTR, internal-link, and one-URL audit work. This skill is specific to the reptiles.ge repository and its Georgian-first multilingual atlas architecture.
metadata:
  version: 1.0.0
---

# reptiles-seo

Work from repository evidence first. Georgian (`ka`) is the primary market and must not be mixed with `/en`, `/ru`, or `/tr` metrics.

## Commands

- Full local audit: `pnpm seo:audit`
- GSC collector: `pnpm seo:audit:gsc`
- GA4 collector: `pnpm seo:audit:ga4`
- GEO audit: `pnpm seo:audit:geo`
- Technical audit: `pnpm seo:audit:technical`
- One URL: `pnpm seo:audit:url -- --url=https://reptiles.ge/gvelebi/giurza`
- SERP query: `pnpm seo:serp -- --query="გიურზა საქართველოში"`
- CLI self-check: `pnpm seo:selfcheck`

## Workflow

1. Run `pnpm seo:graph` or a command that runs it for you.
2. Use `.seo/graph.json` and source registries as the canonical inventory.
3. Use GSC for observed Georgian queries and GA4 for behavior/referral evidence when credentials exist.
4. Treat generated query ideas as `SYNTHETIC` until GSC, GA4, SERP, or another observed source confirms them.
5. Write reports to `.seo/reports/`; never commit credentials or `.seo/` artifacts.

## Credentials

Read-only Google access uses `GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_SERVICE_ACCOUNT_JSON`.

GSC also needs `GSC_SITE_URL`.

GA4 also needs `GA4_PROPERTY_ID`.

Optional DataForSEO SERP collection needs `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`.

When missing, ask for exactly one needed value or authorization and explain where it goes.

## Editorial Rules

Do not invent search volume, traffic gains, biological facts, regions, venom effects, medical advice, conservation status, or taxonomy. Recommendations touching safety, venom, medical, distribution, taxonomy, and conservation require human review and existing reliable sources.
