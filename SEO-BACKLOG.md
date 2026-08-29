# SEO backlog — reptiles.ge

**Source:** Google Search Console exports  
`reptiles.ge-Performance-on-Search-2026-08-29.xlsx`  
`reptiles.ge-Coverage-2026-08-29.xlsx`  

**Window:** last 28 days (approx. 2026-08-02 → 2026-08-26)  
**Property:** `sc-domain:reptiles.ge`  
**Status:** site is young; indexed URLs grew ~12 → ~189; impressions rising late August.

---

## Snapshot (why this backlog exists)

| Metric | Value |
| --- | --- |
| Page clicks (export) | ~145 |
| Page impressions | ~4.2k |
| Query impressions (query sheet) | ~2.0k |
| Indexed (latest chart point) | ~189 |
| Discovered – not indexed | **68** |
| Demand geography | Georgia ≈ 93% of clicks |
| Device | Mobile ~3141 imp / **2.5% CTR**; Desktop ~591 imp / **10% CTR** |

**Read this correctly:** most search demand is mobile + Georgian + snakes. Improving SERP titles/descriptions on high-impression low-CTR pages beats adding long encyclopedia copy.

---

## Intent ownership (do not break)

| Intent | Canonical URL |
| --- | --- |
| Snakes hub | `/gvelebi` |
| Venomous snakes | `/gvelebi/shxamiani-gvelebi` |
| Snake identify | `/gvelebi/shxamiani-gvelis-amocnoba` |
| Species deep dive | KA public slug e.g. `/gvelebi/giurza` |
| Turtle identify | `/kuebi/identifikacia` |
| Turtle hub / land / water / index | `/kuebi`, `/kuebi/xmelis-kuebi`, `/kuebi/tsqlis-kuebi`, `/kuebi/saxeoebebi` |

Legacy `/species/{id}` must 301 to the public species URL. Do not rebuild content on `/species/…`.

---

## Priority queue

### P0 — do next

---

### Task 1 — ანკარა / grass snake CTR + intent

**Primary URL:** https://reptiles.ge/gvelebi/chveulebrivi-ankara  
**Related:** https://reptiles.ge/gvelebi/tsqlis-ankara  
**Species ids:** `natrix-natrix` (ჩვეულებრივი ანკარა), `natrix-tessellata` (წყლის ანკარა) as linked lookalike  

**GSC evidence**

| Signal | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| Query `ანკარა გველი` | 3 | **187** | **1.6%** | ~7.6 |
| Query `წყლის ანკარა` | 1 | 41 | 2.4% | ~5.7 |
| Query `გველი ანკარა` | 0 | 31 | 0% | ~8.5 |
| Query `ჩვეულებრივი ანკარა` | 0 | 25 | 0% | ~6.3 |
| Page `/gvelebi/chveulebrivi-ankara` | 2 | **245** | **0.8%** | ~6.9 |
| Page `/gvelebi/tsqlis-ankara` | 4 | 165 | 2.4% | ~6.0 |

**Problem**  
Google already shows the page. Users rarely click. Likely causes: weak SERP snippet, unclear whether it is venomous, confusion with წყლის ანკარა / გველგესლა.

**Do**

1. Audit live KA title, meta description, H1, first screen (profile MDX + any route metadata).
2. Rewrite **title + meta** for CTR (natural Georgian, not stuffing):
   - name of snake
   - Georgia
   - harmless / not a viper (only if profile danger supports it)
3. Put the answer to “შხამიანია?” in the first viewport / FAQ if not already obvious.
4. Add a short **lookalike / confusion** block: ჩვეულებრივი ანკარა vs წყლის ანკარა (link both ways).
5. Keep EN equivalent if KA copy changes (`en.mdx` + any messages).
6. Do **not** invent localities, venom claims, or size.

**Files likely touched**

- `src/content/species/natrix-natrix/{ka,en}.mdx`
- related water-ankara profile if comparison copy is needed
- `LOOKALIKES` in `src/lib/speciesRoutes.ts` only if pair missing
- title template / species meta helpers only if needed

**Done when**

- [x] Title/meta clearly answer “რა არის ანკარა / საშიშია?”
- [x] First screen states danger level from existing catalog data
- [x] Link to წყლის ანკარა (and back) is visible
- [x] KA + EN updated
- [x] No invented facts

**Expected improvement**  
Higher CTR on ~200+ impressions; better chance to move from ~pos 7 toward top 5 for `ანკარა გველი`.

---

### Task 2 — კავკასიური გველგესლა CTR + URL consolidation

**Primary URL:** https://reptiles.ge/gvelebi/kavkasiuri-gvelgesla  
**Legacy still in GSC:** https://reptiles.ge/species/vipera-kaznakovi  
**Species id:** `vipera-kaznakovi`

**GSC evidence**

| Signal | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| Query `კავკასიური გველგესლა` | 3 | 69 | 4.3% | ~8.3 |
| Page `/gvelebi/kavkasiuri-gvelgesla` | 1 | **166** | **0.6%** | ~7.1 |
| Page `/species/vipera-kaznakovi` | 6 | 162 | 3.7% | ~4.5 |

**Problem**  
High impressions, tiny CTR on the KA public URL. Legacy `/species/` still attracts comparable impressions — ranking signals may be split.

**Do**

1. CTR pass on KA title/meta/H1 (name + Georgia + risk level from catalog).
2. Verify `proxy.ts` / `next.config.ts` 301: `/species/vipera-kaznakovi` → KA/EN public species URL.
3. Grep repo for internal links still pointing at `/species/vipera-kaznakovi`; fix to `speciesHref`.
4. Confirm only one indexable URL is intended (canonical + hreflang intact).
5. Optional: strengthen venomous-hub link into this profile with descriptive anchor.

**Done when**

- [x] Title/meta improved for CTR
- [x] 301 verified in browser/network
- [x] No internal `/species/vipera-kaznakovi` left (except redirect map)
- [x] KA + EN consistent

**Expected improvement**  
More clicks on the public URL; cleaner consolidation away from `/species/`.

---

### Task 3 — ტრიტონი cluster (amphibians)

**Primary URL:** https://reptiles.ge/amfibiebi/kavkasiuri-tritoni  
**Related queries:** `ტრიტონი`, `ტრიტონი წყლის`, `ტრიტონი საქართველოში`, `კავკასიური ტრიტონი`  
**Species id:** `ommatotriton-ophryticus` (confirm against profile; also check other newt pages)

**GSC evidence**

| Signal | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| Query `ტრიტონი` | 3 | **114** | 2.6% | ~8.8 |
| Query `ტრიტონი წყლის` | 0 | 29 | 0% | ~6.9 |
| Query `ტრიტონი საქართველოში` | 0 | 26 | 0% | ~7.6 |
| Page `/amfibiebi/kavkasiuri-tritoni` | 1 | **117** | **0.9%** | ~7.9 |
| Page `/species/ommatotriton-ophryticus` | 2 | 76 | 2.6% | ~8.0 |

**Problem**  
Second-largest non-snake demand cluster after ანკარა/გველგესლები. Profile under-clicks relative to impressions.

**Do**

1. Title/meta: make “ტრიტონი საქართველოში” / კავკასიური ტრიტონი obvious without stuffing.
2. Intro: what it is, habitat cue, link to Caudata / amphibian guides if they exist.
3. Distinguish from frogs/toads in one short line if users confuse them (only with existing facts).
4. Check legacy `/species/ommatotriton-ophryticus` redirect + internal links.
5. KA + EN.

**Done when**

- [x] SERP snippet matches Georgia newt intent
- [x] Related amphibian navigation is clear
- [x] Redirects/internal links cleaned

**Expected improvement**  
CTR on ტრიტონი queries; amphibians become a real second pillar beside snakes.

---

### P1 — same sprint if capacity

---

### Task 4 — გიურზა polish (typo + photo intent)

**Primary URL:** https://reptiles.ge/gvelebi/giurza  
**Species id:** `macrovipera-lebetina`

**GSC evidence**

| Signal | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| Query `გიურზა` | 7 | 72 | 9.7% | ~9.2 |
| Query `გიუზა` (misspelling) | 0 | **37** | 0% | ~8.4 |
| Query `giurza` | 1 | 29 | 3.5% | ~9.9 |
| Query `გიურზა ფოტო` | 0 | 21 | 0% | ~4.2 |
| Page `/gvelebi/giurza` | 5 | 125 | 4.0% | ~6.0 |
| Page `/species/macrovipera-lebetina` | 12 | 214 | 5.6% | ~7.2 |

**Problem**  
Already a winning entity, but misspelling + photo queries leak impressions; legacy `/species/` still out-impresses the KA slug.

**Do**

1. Light title/OG check for photo attractiveness (do not churn a working title without reason).
2. Ensure hero/gallery load well on mobile.
3. Verify 301 `/species/macrovipera-lebetina` → `/gvelebi/giurza`.
4. Optional FAQ line for alternate spellings **only if natural** — no stuffing “გიუზა” into H1.
5. Prefer KA slug in all internal links / venomous hub cards.

**Done when**

- [x] Redirect + internal links prefer `/gvelebi/giurza`
- [x] Mobile hero is solid
- [x] No awkward keyword injection

**Expected improvement**  
Consolidate authority on KA URL; pick up some typo/photo SERP CTR.

---

### Task 5 — Coverage: 68 “Discovered – currently not indexed”

**GSC evidence (Coverage export)**

- Critical: Discovered – currently not indexed → **68 pages** (validation Started 8/11/26; list as of 8/21/26)
- Also listed: Page with redirect (3), Alternate with proper canonical (1), Duplicate Google chose different canonical (1), Crawled – not indexed (1)
- Indexed count recovered strongly mid-August (good sign — do not panic)
- **All 68 examples show Last crawled = N/A** → discovered (sitemap/links) but not fetched yet. Crawl-queue issue on a young site, not “thin content” for most of these.

**Do**

1. In GSC UI, export/list the 68 URLs (this spreadsheet only has counts).
2. Bucket:
   - **Must index:** published species, hubs, cluster guides
   - **OK delayed:** low-value EN duplicates if KA is canonical
   - **Should not force:** thin, redirecting, or unpublished
3. For must-index URLs: add contextual internal links from hubs/guides (descriptive anchors).
4. Confirm sitemap includes them; no accidental `noindex`.
5. Do **not** spam Request Indexing for every URL.

**Triage (2026-08-29 — full GSC example list)**

| Bucket | Count | Action |
| --- | ---: | --- |
| **Must index (KA)** | ~27 | Wait for crawl; already in sitemap + footer/hub links. Optional: Request Indexing only for 3–5 priority hubs if still N/A after 2+ weeks |
| **OK delayed (EN)** | ~41 | Do not force; `x-default` = KA. Indexing will lag |
| **Should not force** | 0 in this list | No quiz-results / unpublished / broken paths in the 68 |

**Must-index KA (want these crawled)**

- Site: `/about`, `/contact`, `/species`
- Hubs/indexes: `/amfibiebi`, `/amfibiebi/saxeoebebi`, `/amfibiebi/bayayi`, `/amfibiebi/bayayi/saxeoebebi`, `/amfibiebi/tritoni-salamandra`, `/kuebi` (+ land/water/index/identify), `/xvlikebi` (+ index/identify/glass-compare), `/gvelebi/saxeoebebi`, `/gvelebi/shxamiani-gvelis-amocnoba`, `/gvelebi/didi-gvelebi`
- Species: `/gvelebi/tsxvirrkosani-gvelgesla`, `/gvelebi/dinikis-gvelgesla`, `/gvelebi/darevskis-gvelgesla`, `/gvelebi/velis-gvelgesla`, `/gvelebi/aghmosavluri-xvlikichamia-gveli`, `/xvlikebi/sashualo-xvliki`
- Region: `/regions/samegrelo` (OK if slow — fauna incomplete by design)

**OK delayed (EN mirrors)** — entire `/en/…` set in the list (hubs, guides, vipers, Darevskia, regions, turtles, etc.). Correct public URLs; secondary locale.

**Not a bug**

- `/en/amphibians/newts` = intentional EN slug for `/amphibians/tritoni-salamandra`
- No legacy `/species/{id}` in this Discovery bucket (good — those are redirects elsewhere)

**Done when**

- [x] URL list reviewed and bucketed
- [x] Important orphans linked from parent hubs *(footer + hubs already link these; venomous featured cards added earlier)*
- [x] No thin pages pushed for indexing
- [x] No mass Request Indexing

**Note (2026-08-29)**  
Do not rebuild pages for this bucket. Re-check Coverage in 2–4 weeks; expect N/A → crawled as Google works the queue. If a **KA must-index** hub is still Discovered-not-indexed after that, Request Indexing for that URL only (not the whole EN set).

---
### Task 6 — Legacy `/species/…` consolidation (sitewide)

**GSC evidence**

- **42** pages under `/species/` still receiving impressions
- Combined ≈ **969 impressions**, **34 clicks**
- Top legacy: `macrovipera-lebetina`, `vipera-kaznakovi`, `vipera-transcaucasiana`, `dolichophis-schmidti`, `ommatotriton-ophryticus`, `pseudopus-apodus`, …

**Do**

1. Confirm redirect map in `src/proxy.ts` + `next.config.ts` for all published species.
2. Repo-wide grep: replace remaining internal `/species/` hrefs with `speciesHref` / navigation helpers.
3. After Tasks 1–4, re-check GSC in 2–4 weeks: impressions should shift to `/gvelebi/…`, `/xvlikebi/…`, `/amfibiebi/…`, `/kuebi/…`.

**Done when**

- [x] Redirects verified for top 15 legacy URLs by impressions *(`proxy.ts` 301 + `speciesHref` public slugs; no in-app `/species/{id}` hrefs)*
- [x] Internal links cleaned *(no in-app `/species/{id}` hrefs; components use `speciesHref`)*
- [x] Follow-up GSC note dated *(2026-08-29: re-check impressions on `/species/…` vs public KA slugs in 2–4 weeks)*

**Expected improvement**  
Single canonical per species; less diluted CTR and rankings.

---

## Already in good shape (do not open as large projects)

| Area | Why leave it |
| --- | --- |
| `/gvelebi` hub | Top impressions + solid clicks |
| `/gvelebi/shxamiani-gvelebi` | Already converting |
| Turtle cluster IA | Hub / index / land / water / identify correctly split |
| Turtle identify rebuild (`/kuebi/identifikacia`) | Shipped; GSC demand ≈ 0 for now — wait for indexing + time |
| EN-first SEO campaign | Only ~15 clicks vs ~130 on non-`/en/` pages in this window |
| Generic word-count expansion | Problem is CTR/intent, not article length |

---

## Explicitly out of scope (for now)

- Rebuilding turtle identify again for “more SEO”
- Creating new thin URLs for every query variant (`ანკარა შხამიანია` as its own page, etc.)
- Inventing region lists or venom claims for rankings
- Forcing index of quiz result-like or duplicate paths
- Desktop-only visual polish while mobile CTR is the real gap

---

## Suggested execution order

| Week | Tasks |
| --- | --- |
| Week 1 | Task 1 (ანკარა) → Task 2 (კავკასიური გველგესლა) |
| Week 1–2 | Task 3 (ტრიტონი) |
| Week 2 | Task 4 (გიურზა) + Task 6 redirects/links |
| Ongoing | Task 5 coverage list triage |
| +14–28 days | Re-export GSC; compare CTR/position on Tasks 1–3 URLs |

---

## How we will measure success

Re-export Performance (same 28-day or compare last 7 vs previous 7 once stable):

| URL / query | Watch |
| --- | --- |
| `ანკარა გველი` + `/gvelebi/chveulebrivi-ankara` | CTR up; position stable or better |
| `/gvelebi/kavkasiuri-gvelgesla` vs `/species/vipera-kaznakovi` | Public URL gains share of impressions |
| `ტრიტონი` + newt profile | CTR up |
| `/gvelebi/giurza` vs `/species/macrovipera-lebetina` | KA slug gains share |
| Coverage | Discovered-not-indexed count trends down for important URLs |

---

## Content integrity rules (every task)

Follow `AGENTS.md` / content-integrity:

- Do not invent locality, size, IUCN, Red List, or venom effects.
- Both KA and EN when editing copy.
- Do not edit `src/data/species.generated.ts`.
- Lookalikes only via `LOOKALIKES` in `speciesRoutes.ts`.
- Bite/medical pages stay educational + 112; no `MedicalWebPage`.

---

## Appendix — high-impression low-CTR pages (watchlist)

From Performance export (imp ≥ 50 and CTR &lt; 4%):

| Page | Clicks | Imp | CTR | Pos |
| --- | ---: | ---: | ---: | ---: |
| `/gvelebi/chveulebrivi-ankara` | 2 | 245 | 0.8% | 6.9 |
| `/gvelebi/kavkasiuri-gvelgesla` | 1 | 166 | 0.6% | 7.1 |
| `/gvelebi/tsqlis-ankara` | 4 | 165 | 2.4% | 6.0 |
| `/species/vipera-kaznakovi` | 6 | 162 | 3.7% | 4.5 |
| `/en/snakes/platyceps-najadum` | 2 | 135 | 1.5% | 6.8 |
| `/snakes` | 5 | 126 | 4.0% | 6.1 |
| `/amfibiebi/kavkasiuri-tritoni` | 1 | 117 | 0.9% | 7.9 |
| `/species/vipera-transcaucasiana` | 3 | 101 | 3.0% | 6.6 |
| `/en/snakes/natrix-tessellata` | 0 | 100 | 0% | 8.4 |

Tasks 1–3 address the worst of these. Others become candidates after the first re-measure.

**Watchlist CTR pass (2026-08-29):** `natrix-tessellata`, `vipera-transcaucasiana`, `platyceps-najadum` — title/meta/FAQ lead updated like Tasks 1–2.

---

## Appendix — turtle note (why not prioritized)

Turtle-related demand in this export is near-zero (e.g. `წითელყურა კუ` = 1 impression; no turtle hub/identify URL in top pages). Profiles show only a handful of impressions and 0 clicks. The identify-page rebuild remains valuable as **architecture + future demand**, not as the next GSC-driven sprint.

---

*Document created for implementation planning from GSC exports dated 2026-08-29. Update this file when tasks ship or when a new export changes priorities.*
