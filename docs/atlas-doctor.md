# Atlas Doctor

`atlas-doctor` is a publish gate for reptiles.ge content. It is not a generic fact checker and it is not a replacement for sources. It checks whether the atlas data model contradicts itself before a broken or weakly sourced change reaches production.

## Why This Exists

The main failure mode of this project is not slow rendering. The main failure mode is a small content mistake that becomes public:

- a published species is missing a locale;
- a folder id and frontmatter id drift apart;
- a photo is marked as Georgia-field without provenance;
- an overlay locale points at a gallery image that is not in the KA canonical gallery;
- a region references an unpublished species;
- a public slug collides with a hub route;
- generated catalog files are stale after MDX edits;
- a candidate herpetofauna taxon reads like a confirmed occurrence.

Those are not UI bugs. They are atlas trust bugs.

## How It Works

The checker has two steps.

```bash
pnpm run doctor:content
```

`doctor:content` compiles species, exports the graph, and runs the Rust checker. It requires Rust/Cargo locally or in CI.

`scripts/export-atlas-graph.ts` exports the project-specific truth that already lives in TypeScript:

- generated species catalog;
- content folders and MDX frontmatter;
- published and unpublished species ids;
- atlas metadata and groups;
- checklist status;
- regions and their species ids;
- public species slug tables;
- reserved hub slugs.

`tools/atlas-doctor` reads `.atlas/graph.json`, runs cross-file checks, prints a terminal summary, and writes `.atlas/doctor-report.json`.

## What It Catches Today

These are the must-have fatal checks added for atlas integrity:

| Priority | Code                         | What it blocks                                                                |
| -------- | ---------------------------- | ----------------------------------------------------------------------------- |
| #1       | `locale-missing`             | a published species missing any required KA/EN/RU/TR content file             |
| #2       | `taxonomy-conflict`          | species id, scientific name, genus/family, atlas meta, or slug hub disagree   |
| #3       | `internal-link-invalid`      | MDX internal links point to a route that is not a live atlas page             |
| #4       | `checklist-status-conflict`  | candidate/confirmed/introduced status disagrees across atlas data             |
| #5       | `candidate-region-reference` | a candidate species is mapped in `regions.ts` as if confirmed                 |
| #6       | `gallery-reference-invalid`  | hero, mobile, or localized gallery overlay image is absent from KA gallery    |
| #7       | `scientific-name-duplicate`  | two species ids share one accepted scientific name                            |
| #8       | `slug-locale-invalid`        | a locale slug is missing, blank, duplicated, reserved, or targets bad species |

Additional fatal diagnostics still block publish readiness:

| Code                            | Meaning                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `published-content-missing`     | a published id has no content folder                           |
| `ka-id-missing`                 | canonical KA frontmatter is missing `id`                       |
| `date-modified-invalid`         | `dateModified` is missing or malformed                         |
| `sources-invalid`               | a published species has no specific source URL                 |
| `generated-catalog-stale`       | MDX and `species.generated.ts` disagree                        |
| `generated-species-missing`     | content exists but generated catalog missed it                 |
| `atlas-meta-missing`            | published species has no `speciesAtlasMeta`                    |
| `danger-group-invalid`          | `danger` is set for a group that cannot have venom/risk labels |
| `photo-coordinate-pair-invalid` | only one of `lat` / `lng` is set                               |
| `publish-state-conflict`        | one species is marked both published and unpublished           |
| `region-species-unknown`        | region references an unknown species id                        |
| `region-species-unpublished`    | region references an unpublished species                       |

Warnings show risky content that should be reviewed:

| Code                                 | Meaning                                                |
| ------------------------------------ | ------------------------------------------------------ |
| `georgia-field-location-missing`     | Georgia-field photo has no location                    |
| `georgia-field-photographer-missing` | Georgia-field photo has no photographer                |
| `candidate-confirmed-tone`           | candidate taxon copy sounds confirmed without a caveat |

## Real Benefit

Without this gate, a normal content edit can silently create a production problem. For example:

```yaml
gallery:
  - src: "https://cdn.reptiles.ge/new-photo.jpg"
    credit:
      photoConfidence: georgia-field
```

That looks harmless, but it makes a provenance claim without saying where the photo was taken or who took it. `atlas-doctor` turns it into a warning before deploy:

```text
warning [georgia-field-location-missing] src/content/species/.../ka.mdx: gallery[0].credit is georgia-field but has no location
warning [georgia-field-photographer-missing] src/content/species/.../ka.mdx: gallery[0].credit is georgia-field but has no photographer
```

Another common failure:

```yaml
# en.mdx
gallery:
  - src: "https://cdn.reptiles.ge/photo-that-is-not-in-ka.jpg"
```

Locale galleries are credit overlays, not independent galleries. The checker blocks that:

```text
fatal [gallery-reference-invalid] src/content/species/.../en.mdx: en.mdx overlays unknown gallery src `https://cdn.reptiles.ge/photo-that-is-not-in-ka.jpg`
```

That is the practical value: the tool protects the exact places where this atlas can become untrustworthy.

## Recommended CI Gate

Once Rust is available in CI, make content readiness part of the normal gate:

```bash
pnpm run doctor:content
pnpm run test
pnpm run build
```

Do not wire it into `prebuild` until CI and local machines have Rust installed. The tool is valuable only if it is boring and always runnable.
