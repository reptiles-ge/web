---
name: species-drafts
description: Use whenever you are asked to change anything on a reptiles.ge species page (texts in any locale, facts, FAQ, stats, identification, sources, lookalikes, habitats, photo credits or photo coordinates). AI never writes live content; it pulls the species record, edits it locally, and submits it as a draft with `pnpm species:draft`. The owner reviews and merges it on the Drafts page of admin.reptiles.ge.
metadata:
  version: 1.0.0
---

# species-drafts

**AI proposes, the owner merges.** You never change a live species page. You prepare a draft; the owner reads the diff on `admin.reptiles.ge/drafts` and presses **Merge** or **Reject**. Merge saves it as a new version and refreshes that species page on reptiles.ge.

Species content lives in D1 behind `api.reptiles.ge`. There is no species MDX any more, so editing files under `src/` does not change a species page.

## Setup (once, by the owner)

- Put the production `API_WRITE_TOKEN` in `.env.local` (gitignored). `pnpm species:draft` reads `.env.local`, then `.env`.
- Never print, echo, log or paste the token, and never ask for it in chat. If it is missing, the script says `API_WRITE_TOKEN is not set`; tell the owner and stop.
- The script talks to `https://api.reptiles.ge` by default. To try against a local API: `NEXT_PUBLIC_API_ORIGIN=http://localhost:8787 pnpm species:draft …` with `pnpm dev:api` running.

## The workflow

For every species you are asked to change:

1. **Pull** the live record:
   ```bash
   pnpm species:draft pull <species-id> [<species-id> …]
   ```
   This writes `.drafts/<id>.json` (gitignored): `{ "baseVersion": N, "record": { … } }`. Use the species id (`macrovipera-lebetina`), not the Georgian slug (`giurza`). If you only know the page, find the id in the URL of the English page (`/en/snakes/macrovipera-lebetina`).
2. **Edit `record`** in that file and nothing else. Keep `baseVersion` as it is. Change only what you were asked to change.
3. **Check** without sending:
   ```bash
   pnpm species:draft push <species-id> --summary "<one line: what and why>" --dry-run
   ```
   It lists every changed field with the old and new text, and refuses the file if a content rule is broken or a locked field changed. Read the list: every line must be a change you meant.
4. **Send**:
   ```bash
   pnpm species:draft push <species-id> --summary "<same summary>"
   ```
   It prints `draft #N created. Review: https://admin.reptiles.ge/drafts/N` and deletes the local file.
5. **Report** to the owner: one line per species with the summary and the review link. Say what you did not change and why, if anything was left out.

`--summary` is what the owner sees in the Drafts list (max 500 characters). Write it in plain words: `Rewrite diet and behaviour in all four locales`, `Add 2023 IUCN source and update conservation`, `Fix photo coordinates of gallery photo 3`.

## What the record holds

`record.base` is Georgian (KA) and owns the shared data. `record.translations.en|ru|tr` hold the same text fields in the other locales.

| You can change through a draft                                                                                                                    | Where                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page texts: `commonName`, `description`, `overview`, `habitat`, `location` (distribution text), `diet`, `behavior`, `conservation`, `interaction` | `base.*` and `translations.<locale>.*`                                                                                                                                     |
| `identification` (`summary`, `traits`, `coloration`, `colors`)                                                                                    | same                                                                                                                                                                       |
| `facts`, `faq`, `stats`                                                                                                                           | same                                                                                                                                                                       |
| Sources                                                                                                                                           | `base.sources` (`{ name, url }`)                                                                                                                                           |
| Danger level (snakes, spiders, scorpions, …)                                                                                                      | `base.danger` (`Harmless` / `Moderate` / `High`)                                                                                                                           |
| Scientific name, genus, family                                                                                                                    | `base.scientificName`, `base.genus`, `base.family`                                                                                                                         |
| Lookalikes, habitats                                                                                                                              | `lookalikes` (species ids), `habitats` (`forest`, `grassland`, `mountain`, `wetland`)                                                                                      |
| Photo credits and photo places                                                                                                                    | `credit` of `base.imageCredit`, `base.mobileImageCredit`, `base.gallery[i]`: `photographer`, `date`, `location`, `lat` + `lng` (always together), `url`, `photoConfidence` |
| Translated photo credits                                                                                                                          | `translations.<locale>.gallery` (`{ src, credit }`, `src` must be in the KA gallery)                                                                                       |

**Locked.** The script refuses a draft that changes `status`, `group`, `catalogPosition`, `slugKa`, `slugs`, `base.id`, `base.image`, `base.mobileImage`, `base.publishedAt` or any gallery `src` (adding, removing or reordering photos). `base.updatedAt` is set by the script; do not touch it.

**Not possible through a draft.** Say so to the owner instead of trying another way:

- New photos, cover, crop, gallery order or removing a photo: the admin app (species page, **Photos** tab).
- Range-map field records (the points on the map): no API write yet.
- Which regions list a species: `src/data/regions.ts`, a code change in a pull request, under the region rules in `AGENTS.md`.
- A new species, publishing or unpublishing one, changing its slug or group.
- News articles and contributor pages: they are not species drafts.

## Content rules (the push checks some; you own all of them)

- Follow `AGENTS.md` → "Content integrity" and the house style in `src/prompts/writing-style.md`. Read both before writing species text.
- Do not invent facts, places, sizes, dates, coordinates, IUCN or Red List categories. Every new claim needs a source the site already trusts, and a new source goes in `base.sources`. If you have no source, leave the field as it is and tell the owner.
- No source names in the prose (no authors, organisations or "according to …"). Sources live only in `sources`.
- Georgian is written first. When you change a text field, change it in all four locales (`base`, `en`, `ru`, `tr`) unless you were asked for one locale only.
- `facts`, `faq`, `stats` and `identification.traits` must have the same number of items in every locale, and `identification.colors` must be identical. The push refuses the file otherwise.
- Coordinates: only from a source or the owner. `lat` and `lng` go together. Do not mark a photo `georgia-field` without a photographer and a Georgian locality.
- Keep JSON valid and keep fields you did not touch exactly as they were (same order of list items, same text). Do not reformat or "tidy" other fields.

## Several species or several changes

- One draft per species per request. Put all changes to one species in one draft.
- Watch for open drafts: the push prints `N pending draft(s) already exist`. Merging one draft makes every other draft of that species stale, and a stale draft can only be rejected. If one is already pending for the same species, tell the owner instead of stacking another.
- For a batch, pull all ids at once, edit each file, dry-run each, then push each.

## When the push refuses

| Message                                                 | Do this                                                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `the species is at version X, the file was pulled at Y` | Someone changed the species. Pull again and redo the edit on the fresh record.                      |
| `these fields are not changed through AI drafts`        | Undo those fields. If the owner asked for them, explain where they are changed instead (see above). |
| `the record breaks a content rule` with paths           | Fix the listed paths (usually item counts across locales, or missing `lat`/`lng` pair).             |
| `nothing changed`                                       | The file matches the live record. Check you edited `record`, not a copy.                            |
| `API_WRITE_TOKEN is not set`                            | Stop and tell the owner to add it to `.env.local`.                                                  |

## Never

- Never call `PUT /v1/admin/species/:id`, the photo routes, `…/drafts/:id/approve`, `…/merge` or `…/reject`. Only the owner decides.
- Never write to D1 with SQL, `wrangler d1 execute` or a migration to change content.
- Never edit `src/` files to change what a species page says. That is not where species content lives.
- Never put the token in a file other than `.env.local`, in a command line, or in chat.
