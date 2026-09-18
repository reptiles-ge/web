# SEO Doctor

`seo-doctor` is a technical SEO integrity gate for reptiles.ge. It is not a ranking predictor, keyword tool, Lighthouse replacement, or generic SEO scoring system.

Its job is narrower and more useful: crawl the locally rendered production site and catch contradictions between routes, canonical URLs, hreflang clusters, robots/indexability, sitemap entries, internal links, and structured data before deploy.

## How It Works

The tool has two layers.

```bash
pnpm run seo:graph
pnpm run doctor:seo
```

`scripts/export-seo-graph.ts` exports expected route truth from the existing application sources:

- production origin and locale settings;
- public localized pathnames;
- species profile URLs from the generated catalog and slug tables;
- group hubs and cluster guides;
- region, author, quiz, news, legal, and static pages;
- expected canonical URLs and hreflang alternates;
- sitemap inclusion expectations.

`tools/seo-doctor` is the Rust crawler/checker. It requests the local production server, parses rendered HTML, reads `/sitemap.xml` and `/robots.txt`, and writes `.seo/doctor-report.json`.

`scripts/run-seo-doctor.ts` starts `next start` on a temporary local port, waits for readiness, runs the Rust checker with `--base-url`, and then terminates the server.

## Commands

Requires a local Rust toolchain with `cargo`. The npm scripts add
`$HOME/.cargo/bin` to `PATH`, matching the local `atlas-doctor` setup.

```bash
pnpm run build
pnpm run doctor:seo
```

For CI, use:

```bash
pnpm run doctor:content
pnpm run build
pnpm run doctor:seo
pnpm run test
```

If a server is already running:

```bash
pnpm run seo:graph
SEO_DOCTOR_BASE_URL=http://127.0.0.1:3000 pnpm run doctor:seo
```

## What It Checks

Fatal diagnostics fail the command:

| Area                  | Examples                                                                                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP routes           | `route-not-found`, `route-http-error`, `unexpected-redirect`                                                                                                                                                                                                                       |
| title and description | `title-missing`, `title-empty`, `title-multiple`, `meta-description-missing`                                                                                                                                                                                                       |
| canonical             | `canonical-missing`, `canonical-multiple`, `canonical-invalid-url`, `canonical-wrong-origin`, `canonical-mismatch`, `canonical-locale-mismatch`, `canonical-target-duplicate`                                                                                                      |
| indexability          | `unexpected-noindex`, `robots-header-conflict`                                                                                                                                                                                                                                     |
| hreflang              | `hreflang-missing`, `hreflang-duplicate`, `hreflang-target-404`, `hreflang-target-redirect`, `hreflang-reciprocal-missing`, `x-default-missing`, `x-default-invalid`                                                                                                               |
| HTML locale           | `html-lang-missing`, `html-lang-mismatch`                                                                                                                                                                                                                                          |
| sitemap               | `sitemap-invalid`, `sitemap-url-duplicate`, `sitemap-url-404`, `sitemap-url-5xx`, `sitemap-url-redirect`, `sitemap-url-noindex`, `sitemap-url-canonicalized-away`, `sitemap-url-wrong-origin`, `sitemap-lastmod-invalid`, `sitemap-lastmod-future`, `indexable-url-not-in-sitemap` |
| robots.txt            | `robots-invalid`, `robots-blocks-all`, `robots-blocks-indexable-route`, `robots-sitemap-missing`, `robots-sitemap-invalid`                                                                                                                                                         |
| internal links        | `internal-link-broken`, `internal-link-5xx`                                                                                                                                                                                                                                        |
| JSON-LD               | `jsonld-invalid-json`, `jsonld-empty`, `jsonld-page-url-mismatch`, `jsonld-internal-url-broken`                                                                                                                                                                                    |
| breadcrumbs           | `breadcrumb-position-invalid`, `breadcrumb-target-invalid`, `breadcrumb-target-404`, `breadcrumb-target-redirect`                                                                                                                                                                  |

Warnings do not fail the command:

| Area               | Examples                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- |
| duplicate metadata | `title-duplicate`, `meta-description-duplicate`                                               |
| crawl graph        | `orphan-indexable-page`, `internal-link-redirect`                                             |
| social metadata    | `og-title-missing`, `og-description-missing`, `og-image-missing`, `og-url-canonical-mismatch` |
| page structure     | `h1-missing`, `h1-multiple`                                                                   |
| images             | `important-image-alt-missing`                                                                 |

## Production Origin vs Crawl Origin

The crawler may request:

```text
http://127.0.0.1:PORT/en/snakes/macrovipera-lebetina
```

but rendered SEO metadata is expected to use:

```text
https://reptiles.ge/en/snakes/macrovipera-lebetina
```

The checker maps production URLs back to local paths for validation. It does not crawl the deployed production site during normal execution.

## Output

Human output is concise:

```text
SEO Doctor
pages: 812  expected: 744
fatal: 0  warning: 6
report: .seo/doctor-report.json
```

The JSON report has a summary and structured diagnostics for future CI annotations:

```json
{
  "summary": {
    "crawled": 812,
    "expectedRoutes": 744,
    "fatal": 0,
    "warning": 6
  },
  "diagnostics": [
    {
      "code": "unexpected-redirect",
      "locale": "ka",
      "message": "expected canonical route redirects to /amphibians",
      "path": "/amfibiebi",
      "route_type": "hub",
      "severity": "fatal"
    }
  ]
}
```

## Relationship With Atlas Doctor

`atlas-doctor` answers:

```text
Is the atlas data internally trustworthy?
```

`seo-doctor` answers:

```text
Is the rendered/indexable website technically SEO-consistent?
```

The tools intentionally stay separate. `seo-doctor` does not mutate content, rewrite metadata, or fix pages; it reports contradictions in the rendered output.

## Current Limits

This first Rust version avoids speculative SEO scoring. It does not check keyword density, external links, Core Web Vitals, backlink health, rankings, or live production behavior.

Sitemap index support is intentionally shallow because the current app emits a single sitemap. If the app later emits multiple child sitemaps, extend the sitemap fetch stage rather than weakening sitemap checks.
