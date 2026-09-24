---
name: guide-article
description: Use when adding, editing, or reviewing a long-form practical guide article on reptiles.ge (for example "bat in the house" or "wasp nest near your home"). Covers the one-file content model, the shared builder, routing, redirects, SEO fields, source rules, and the guard test.
metadata:
  version: 1.0.0
---

# guide-article

Guide articles are evergreen, answer-first, sourced pages that sit under a group hub. They are rendered by one shared builder. Live examples:

| Article            | Content file                       | KA URL                            | EN URL                         |
| ------------------ | ---------------------------------- | --------------------------------- | ------------------------------ |
| Bat in the house   | `src/content/guides/batInHouse.ts` | `/dzuzumtsovrebi/ghamura-saxlshi` | `/en/mammals/bat-in-the-house` |
| Wasp nest near you | `src/content/guides/waspNest.ts`   | `/mtserebi/krazanis-bude`         | `/en/insects/wasp-nest`        |

This is **not** the model for news (`src/data/news.ts`), species profiles (MDX), or species-list cluster pages (`src/lib/clusterGuides.ts`).

## How it fits together

| Piece                              | File                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| Types + `defineGuideArticle`       | `src/data/guideArticleTypes.ts`                                                   |
| Registry                           | `src/data/guideArticles.ts`                                                       |
| Edge-safe path list                | `src/data/guideArticlePaths.ts`                                                   |
| Route factory (metadata + JSON-LD) | `src/lib/createGuideArticleRoute.tsx`                                             |
| Page view                          | `src/components/GuideArticlePage.tsx`                                             |
| Generated 301s                     | `src/i18n/guideArticleRedirects.ts` (used by `src/proxy.ts` and `next.config.ts`) |
| Guard test                         | `src/data/guideArticles.test.ts`                                                  |

The builder emits, per locale: title/description, a 1200×630 JPEG share image, canonical + hreflang (`x-default` = KA), Open Graph + Twitter card, `Article` + `BreadcrumbList` JSON-LD, an answer-first lead, a table of contents with section anchors, FAQ accordion, related guides + parent hub links, the sources accordion, and the attribution block.

The registry feeds these automatically. **Do not hand-edit them for a guide article:** sitemap (including the hero in the image sitemap), search index, `llms.txt` / `llms-full.txt`, footer and home SEO links, navbar hero style, and the proxy / `next.config.ts` redirects.

## Add a new article

1. **Intent check.** One search intent per URL. Grep `src/i18n/pathnames.ts`, `src/lib/clusterGuides.ts`, and `src/lib/quizzes.ts`. If an existing page already answers the query, improve that page instead.
2. **Images.** Add JPEGs under `public/images/guides/`. Register each `src` in `images` in `src/data/speciesMedia.ts`, then run `pnpm images:optimize:site` so `src/data/optimizedImages.generated.ts` gets the entry and width/height. This uses the public [`reptiles-ge/img-compression`](https://github.com/reptiles-ge/img-compression) package and needs CDN (Bunny) credentials to upload. If the install fails with a 403 from `codeload.github.com`, clone the repo at the lockfile commit, run `npm ci && npm run build` in it, and symlink it to `node_modules/@reptiles-ge/img-compression`. If there are no CDN credentials, stop and ask the owner.
3. **Content file.** Create `src/content/guides/<camelCaseId>.ts` from the template below. KA is written natively first. EN, RU, and TR keep the same structure.
4. **Register.**
   - `src/data/guideArticlePaths.ts`: add the internal path.
   - `src/data/guideArticles.ts`: import the article and add it to `GUIDE_ARTICLES`.
   - `src/data/guideArticleTypes.ts`: add the camelCase key to `GuideArticleMessageKey`.
5. **Share image (required).** Run `pnpm images:og-guides --guide <id>`. It renders a 1200×630 JPEG (under 300 KB, attention crop) from the hero into `public/og/images/guides/<id>.jpg`. Set `ogImage: "/og/images/guides/<id>.jpg"`. With Bunny credentials, `pnpm images:og-guides --guide <id> --upload` puts it on the CDN instead; then set `ogImage` to the printed `https://cdn.reptiles.ge/og/images/guides/<id>.jpg`. Open the JPEG and check that the subject is in frame.
6. **Pathname.** In `src/i18n/pathnames.ts`, add `"/<hub>/<ka-slug>": kaLatin("/<ka-hub>/<ka-slug>", "/<hub>/<english-slug>")`. The folder under `src/app/[locale]/` is the internal path.
7. **Reserved slugs.** In `RESERVED_HUB_SLUGS[<hub>]` in `src/lib/groupHubs.ts`, add both the KA slug and the English slug.
8. **Route file.** Create `src/app/[locale]/<hub>/<ka-slug>/page.tsx`:

   ```tsx
   import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

   const guide = createGuideArticleRoute("/<hub>/<ka-slug>");

   export const generateStaticParams = guide.generateStaticParams;
   export const generateMetadata = guide.generateMetadata;
   export default guide.Page;
   ```

9. **Dates.** Add the internal path to both `SITEMAP_PATH_LAST_MODIFIED` and `SITEMAP_PATH_DATE_PUBLISHED` in `src/data/pageLastModified.ts` (ISO with `+04:00`). On every meaningful content edit later, bump only the last-modified value.
10. **Hub card and nav labels, in all 4 locales** (`messages/{ka,en,ru,tr}.json`):

- `groupHubShared.cluster.<key>`: `eyebrow`, `title`, `body`, `cta`
- `footer.<key>`
- `home.seo.links.<key>`

Then add `{ href: "<internal path>", key: "<key>", kind: "page" }` to `HUB_CLUSTER_CARDS[<hub>]` in `src/lib/clusterGuides.ts`.

11. **Verify.**

    ```bash
    pnpm species:compile && pnpm search:compile
    npx vitest run src/data/guideArticles.test.ts
    pnpm typecheck
    pnpm lint
    ```

    The guard test names any missing step. Do not weaken it to get green.

## Writing for search and AI answers

- **H1 (`title`)**: the question people actually type. For example: `<problem>: what to do?` or `<problem> — what should you do?`. Put the main Georgian term first in KA.
- **`metaTitle`**: unique, about 60 characters (the test allows 21–65). It is used as the absolute `<title>`, so do not add a site suffix.
- **`description`**: 120–160 characters (the test allows 110–165). State the problem, the action, and the safety hook. It must differ from the lead.
- **`lead`**: answer-first, 2–4 sentences (40–80 words). This is the featured-snippet and AI-overview candidate: what to do right now. If there is any medical risk, say to call 112 in Georgia.
- **`sections`**: 6–12 H2s phrased as real questions or tasks (for example "What should you never do?"). Use one idea per section and short paragraphs. Use `list` for steps (`ordered: true`) or do/don't lists. Headings must be unique; they become `#anchors` in the table of contents.
- **`faq`**: 4–10 real follow-up questions that the headings do not already answer word for word. Each answer is 1–3 self-contained sentences. They stay visible on the page and in `llms-full.txt`. Do not add `FAQPage` schema: Google retired FAQ rich results on 2026-05-07, and the guard test fails if a guide emits it.
- **Internal links**: inside any paragraph, list item, lead, or FAQ answer, `[label](/internal/path)` renders a localized link. Use internal static pathnames from `pathnames.ts` (for example `/mammals`, `/snakes/gvelis-nakbeni`). Use `relatedSpeciesIds` for published profiles only.
- **`search.keywords`**: Georgian script, Latin transliteration, EN, RU, and TR. Include colloquial synonyms (for example `კრაზანა` / `ბზიკი`).
- **Alt text**: describe what is visible, in each locale. Do not claim a species, a locality, or "photographed in Georgia" unless it is verified.
- **Parity**: every locale has the same number of sections and FAQs, with images at the same positions. The test enforces this.

## Content integrity (non-negotiable)

AGENTS.md rules apply in full:

- No invented facts, measurements, localities, species counts, or legal or medical claims.
- Every factual or medical claim maps to a `sources[]` entry. Its `supports` line says what that source backs, in all 4 locales.
- Use primary or authoritative sources: government, public-health, extension services, peer-reviewed papers, the Tarkhnishvili et al. 2026 checklist, and species-specific IUCN pages.
- Medical content is educational. Call **112**. No dosing, no treatment protocol, and no `MedicalWebPage` schema.
- Do not identify species from generic photos. Colour is not identification.
- If the evidence is thin, leave the claim out and tell the owner.

## Template

```ts
import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "detail";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description: "",
    faq: [{ answer: "", question: "" }],
    lead: "",
    metaTitle: "",
    sections: [
      { heading: "", paragraphs: [""] },
      { heading: "", image: "detail", paragraphs: [""] },
      {
        heading: "",
        list: { items: ["", ""], ordered: true },
        paragraphs: [""],
      },
    ],
    title: "",
  },
  ka: {/* same shape, written natively in Georgian */},
  ru: {/* same shape */},
  tr: {/* same shape */},
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "Publisher — Page title",
    supports: { en: "", ka: "", ru: "", tr: "" },
    url: "https://…",
  },
];

export const EXAMPLE_GUIDE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: { en: "", ka: "", ru: "", tr: "" },
    height: 0,
    src: "/images/guides/example-hero.jpg",
    width: 0,
  },
  id: "example-guide",
  images: {
    detail: {
      alt: { en: "", ka: "", ru: "", tr: "" },
      height: 0,
      src: "/images/guides/example-detail.jpg",
      width: 0,
    },
  },
  messageKey: "exampleGuide",
  ogImage: "/og/images/guides/example-guide.jpg",
  parentHub: "mammals",
  pathname: "/mammals/example-ka-slug",
  search: {
    icon: "safety",
    keywords: [],
    rank: 5,
    subtitle: { en: "", ka: "", ru: "", tr: "" },
    title: { en: "", ka: "", ru: "", tr: "" },
  },
  sources: SOURCES,
});
```

Object keys are sorted alphabetically (ESLint `perfectionist`). Run `pnpm lint:fix` if needed.
