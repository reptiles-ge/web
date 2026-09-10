# scripts/

Build and maintenance scripts for reptiles.ge. Prefer the npm scripts in `package.json`; call `tsx scripts/…` directly only when you need extra flags.

BunnyCDN scripts need `.env` / `.env.local`:

```bash
BUNNY_STORAGE_ZONE=…
BUNNY_STORAGE_ACCESS_KEY=…
BUNNY_STORAGE_REGION=…   # optional
BUNNY_CDN_BASE_URL=https://cdn.reptiles.ge   # optional
```

---

## When to use what

| Goal | Run |
| --- | --- |
| MDX → catalog (new/changed species) | `npm run species:compile` |
| Refresh search indexes | `npm run search:compile` (species first) |
| Refresh Georgia map paths | `npm run map:compile` |
| Spot broken CDN image URLs | `npm run images:check` |
| Are species OG images live? | `npm run images:check-og` |
| Upload missing OG images | `npm run images:og-missing` |
| AVIF/WebP + OG optimize on Bunny | `npm run images:optimize …` |
| Regenerate only `optimizedImages.generated.ts` | `npm run images:emit` |
| Unused files under `public/images` | `npm run images:unused` |
| Unused photos on BunnyCDN | `npm run images:cdn-unused` |

`npm run dev` / `build` / `test` already run the three compile scripts (`predev` / `prebuild` / `pretest`).

---

## Compile (generated catalogs)

These outputs are **gitignored** — do not hand-edit or commit them.

### `compile-species.ts` → `npm run species:compile`

Reads `src/content/species/{id}/{ka,en,ru,tr}.mdx` and writes:

- `src/data/species.generated.ts`
- `src/data/speciesSlugs.generated.ts`

Validates frontmatter via `speciesFrontmatter.ts` (Zod). Run this first after MDX or slug changes.

### `compile-search.ts` → `npm run search:compile`

Requires an existing `species.generated.ts`. Writes `src/data/search-index.{ka,en,ru,tr}.generated.ts`.

### `compile-georgia-map.ts` → `npm run map:compile`

`src/assets/maps/georgia.svg` → `src/data/georgia-paths.generated.ts` (region paths + viewBox). Run after editing the SVG.

### `speciesFrontmatter.ts`

Library only, not a CLI. KA / translation frontmatter schemas for `compile-species.ts`.

---

## Images — checks

### `check-image-urls.ts` → `npm run images:check`

Finds CDN / local image URLs in the repo and HEAD-checks them on `cdn.reptiles.ge`. Prints 404s and network failures.

Flags: `--json`, `--limit N`, `--concurrency N`, `--timeout Ms`.

### `check-og-images.ts` → `npm run images:check-og`

Checks each catalog species OG URL. The npm script compiles species first.

Flags: `--json`, `--concurrency N`, `--timeout Ms`.

---

## Images — optimize & OG (BunnyCDN)

### `optimize-images.ts` → `npm run images:optimize`

Builds `optimized/` derivatives (AVIF/WebP), OG JPEGs when needed, and updates:

- `src/data/image-manifest.json`
- `src/data/optimizedImages.generated.ts`

**Pick one scope:**

| npm | Meaning |
| --- | --- |
| `images:optimize -- --all` | Every catalog image |
| `images:optimize -- --species id1,id2` | Specific species |
| `images:optimize:news` | News article photos |
| `images:optimize:site` | Site / home images |
| `images:optimize:dry` | Dry-run (no storage writes) |
| `images:emit` | Regenerate TS from the manifest only (`--emit-only`) |

Other flags: `--force`, `--limit N`, `--concurrency N`.

### `generate-missing-og.ts` → `npm run images:og-missing`

Generates and uploads OG images for species that are missing them. Dry-run: `--dry-run`. Specific ids: `--species id1,id2`.

---

## Images — unused cleanup

Two different stores — do not mix them up:

| Script | Compares | Delete |
| --- | --- | --- |
| `remove-unused-images.js` | `public/images` vs repo references | `--delete` or `images:unused:delete` |
| `cdn-unused-images.ts` | BunnyCDN storage vs repo CDN URLs | Interactive **Y/N** at the end |

### `remove-unused-images.js` → `npm run images:unused`

Local `public/images`. Dry-run by default. Delete with `npm run images:unused:delete` or `--delete`. `--json` prints the list as JSON.

### `cdn-unused-images.ts` → `npm run images:cdn-unused`

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
npm run species:compile
npm run search:compile
```

**New gallery photos after CDN upload**

```bash
npm run images:optimize -- --species macrovipera-lebetina
# or full catalog:
npm run images:optimize -- --all
```

**Broken-image diagnosis**

```bash
npm run images:check
npm run images:check-og
```

**CDN cleanup**

```bash
npm run images:cdn-unused   # list → Y/N
```
