# scripts/

Build and maintenance scripts for reptiles.ge. Prefer the pnpm scripts in `package.json`; call `tsx scripts/…` directly only when you need extra flags.

BunnyCDN scripts need `.env` / `.env.local`:

```bash
BUNNY_STORAGE_ZONE=…
BUNNY_STORAGE_ACCESS_KEY=…
BUNNY_STORAGE_REGION=…   # optional
BUNNY_CDN_BASE_URL=https://cdn.reptiles.ge   # optional
```

---

## When to use what

| Goal                                           | Run                                   |
| ---------------------------------------------- | ------------------------------------- |
| MDX → catalog (new/changed species)            | `pnpm species:compile`                |
| Refresh search indexes                         | `pnpm search:compile` (species first) |
| Refresh Georgia map paths                      | `pnpm map:compile`                    |
| Refresh Wikidata / GBIF / iNaturalist IDs      | `pnpm taxon:ids`                      |
| Spot broken CDN image URLs                     | `pnpm images:check`                   |
| Are species OG images live?                    | `pnpm images:check-og`                |
| Upload missing OG images (species + guides)    | `pnpm images:og-missing`              |
| AVIF/WebP + OG optimize on Bunny               | `pnpm images:optimize …`              |
| Regenerate only `optimizedImages.generated.ts` | `pnpm images:emit`                    |
| Unused files under `public/images`             | `pnpm images:unused`                  |
| Unused photos on BunnyCDN                      | `pnpm images:cdn-unused`              |

`pnpm dev` / `build` / `test` already run the three compile scripts (`predev` / `prebuild` / `pretest`).

---

## Compile (generated catalogs)

These outputs are **gitignored** — do not hand-edit or commit them.

### `compile-species.ts` → `pnpm species:compile`

Reads `src/content/species/{id}/{ka,en,ru,tr}.mdx` and writes:

- `src/data/species.generated.ts`
- `src/data/speciesSlugs.generated.ts`

Validates frontmatter via `speciesFrontmatter.ts` (Zod). Run this first after MDX or slug changes.

### `compile-search.ts` → `pnpm search:compile`

Requires an existing `species.generated.ts`. Writes `src/data/search-index.{ka,en,ru,tr}.generated.ts`.

### `compile-georgia-map.ts` → `pnpm map:compile`

`src/assets/maps/georgia.svg` → `src/data/georgia-paths.generated.ts` (region paths + viewBox). Run after editing the SVG.

### `speciesFrontmatter.ts`

Library only, not a CLI. KA / translation frontmatter schemas for `compile-species.ts`.

---

## Taxon identifiers

### `fetch-taxon-identifiers.ts` → `pnpm taxon:ids`

Looks up each published species' scientific name in GBIF (strict match), Wikidata (`P225`) and iNaturalist, and rewrites the committed `src/data/taxonIdentifiers.ts`. Species pages put these IDs in the Taxon `sameAs`; the build never calls the APIs. One request per second per API; responses are cached in memory for the run. `--check` exits 1 when the committed file is stale.

An ID is kept only on an exact, unambiguous match. A Wikidata item must agree with the GBIF key (`P846`) and the iNaturalist taxon (`P3151`). A synonym or alternative name is used only when the profile itself presents it as the same taxon (`EQUIVALENT_NAMES`); deliberate omissions live in `MANUAL_EXCLUSIONS`. The run prints every left-out ID with its reason.

---

## Images — checks

### `check-image-urls.ts` → `pnpm images:check`

Finds CDN / local image URLs in the repo and HEAD-checks them on `cdn.reptiles.ge`. Prints 404s and network failures.

Flags: `--json`, `--limit N`, `--concurrency N`, `--timeout Ms`.

### `check-og-images.ts` → `pnpm images:check-og`

Checks each catalog species OG URL. The pnpm script compiles species first.

Flags: `--json`, `--concurrency N`, `--timeout Ms`.

---

## Images — optimize & OG (BunnyCDN)

### `optimize-images.ts` → `pnpm images:optimize`

Builds `optimized/` derivatives (AVIF/WebP), OG JPEGs when needed, and updates:

- `src/data/image-manifest.json`
- `src/data/optimizedImages.generated.ts`

**Pick one scope:**

| pnpm                                      | Meaning                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `images:optimize -- --all`                | Every catalog image                                  |
| `images:optimize -- --species id1,id2`    | Specific species                                     |
| `images:optimize -- --images path1,path2` | Specific registered site images                      |
| `images:optimize -- --region tbilisi`     | One region hero                                      |
| `images:optimize:news`                    | News article photos                                  |
| `images:optimize:site`                    | Site / home / region images                          |
| `images:optimize:dry`                     | Dry-run (no storage writes)                          |
| `images:emit`                             | Regenerate TS from the manifest only (`--emit-only`) |

Other flags: `--force`, `--limit N`, `--concurrency N`.

### `generate-missing-og.ts` → `pnpm images:og-missing`

Generates and uploads OG images to Bunny for species and guide articles that are missing them. Dry-run: `--dry-run`. Specific ids: `--species id1,id2`, `--guide id1,id2`.

---

## Images — unused cleanup

Two different stores — do not mix them up:

| Script                    | Compares                           | Delete                               |
| ------------------------- | ---------------------------------- | ------------------------------------ |
| `remove-unused-images.js` | `public/images` vs repo references | `--delete` or `images:unused:delete` |
| `cdn-unused-images.ts`    | BunnyCDN storage vs repo CDN URLs  | Interactive **Y/N** at the end       |

### `remove-unused-images.js` → `pnpm images:unused`

Local `public/images`. Dry-run by default. Delete with `pnpm images:unused:delete` or `--delete`. `--json` prints the list as JSON.

### `cdn-unused-images.ts` → `pnpm images:cdn-unused`

1. Scans the repo for used `cdn.reptiles.ge` URLs (originals + `optimized/` + `og/` derivatives)
2. Diffs against Bunny storage
3. Always includes **root-folder JPEG originals** (`foo.jpg` at storage `/`, no path prefix) — those are temporary uploads and are always offered for delete, even if still referenced
4. Writes `cdn-unused-images.txt` (gitignored)
5. Asks: `N unused photos. Delete from BunnyCDN? [Y/N]`

**Y** deletes the listed image files from storage. **N** deletes nothing.

Notes:

- Old `optimized/*.webp` may show up as unused when the manifest now serves AVIF only — that is expected.
- Nested paths (`authors/`, `regions/`, `images/`, `og/`, `optimized/`, …) are only deleted when unreferenced. Root JPEGs are always candidates.

---

## Typical flows

**New species MDX**

```bash
pnpm species:compile
pnpm search:compile
```

**New gallery photos after CDN upload**

```bash
pnpm images:optimize --species macrovipera-lebetina
# or full catalog:
pnpm images:optimize --all
```

**Broken-image diagnosis**

```bash
pnpm images:check
pnpm images:check-og
```

**CDN cleanup**

```bash
pnpm images:cdn-unused   # list → Y/N
```
