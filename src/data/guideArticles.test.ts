import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { GUIDE_ARTICLE_PATHS } from "@/data/guideArticlePaths";
import {
  getGuideArticles,
  getGuideArticlesForHub,
  guideArticleSectionAnchor,
} from "@/data/guideArticles";
import { optimizedEntry } from "@/data/optimizedImages";
import { sitemapPathDatePublished } from "@/data/pageLastModified";
import { getSpeciesById } from "@/data/species";
import { images as siteMedia } from "@/data/speciesMedia";
import { guideArticleRedirects } from "@/i18n/guideArticleRedirects";
import { pathnames } from "@/i18n/pathnames";
import { routing } from "@/i18n/routing";
import { HUB_CLUSTER_CARDS } from "@/lib/clusterGuides";
import { RESERVED_HUB_SLUGS } from "@/lib/groupHubs";
import { pageDateFields } from "@/lib/structuredDataDates";

const articles = getGuideArticles();
const messages = Object.fromEntries(
  routing.locales.map((locale) => [
    locale,
    JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "messages", `${locale}.json`),
        "utf8",
      ),
    ),
  ]),
);

function jpegSize(bytes: Buffer) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isFrame) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

function messageAt(locale: string, keyPath: string) {
  return keyPath
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      messages[locale],
    );
}

describe("guide article registry", () => {
  it("registers every guide article path exactly once", () => {
    expect(articles.map((article) => article.pathname).sort()).toEqual(
      [...GUIDE_ARTICLE_PATHS].sort(),
    );
    expect(new Set(articles.map((article) => article.id)).size).toBe(
      articles.length,
    );
    expect(new Set(articles.map((article) => article.messageKey)).size).toBe(
      articles.length,
    );
  });

  it("has shared guide labels in every locale", () => {
    for (const locale of routing.locales) {
      for (const key of [
        "contents",
        "faq",
        "related",
        "relatedSpecies",
        "sources",
        "summary",
      ]) {
        expect(
          messageAt(locale, `guideArticle.${key}`),
          `${locale} ${key}`,
        ).toBeTypeOf("string");
      }
    }
  });
});

describe("guide structured data", () => {
  it("keeps FAQ visible but never emits FAQPage schema on guides", () => {
    for (const file of [
      "src/lib/createGuideArticleRoute.tsx",
      "src/lib/createClusterGuideRoute.tsx",
      "src/app/[locale]/snakes-in-the-yard/page.tsx",
      "src/app/[locale]/venomous-snakes/page.tsx",
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).not.toContain("FAQPage");
    }
    expect(
      fs.readFileSync(
        path.join(process.cwd(), "src/components/GuideArticlePage.tsx"),
        "utf8",
      ),
    ).toContain("<GuideFaqItems");
  });

  it("renders the summary after the sections, never under the H1", () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), "src/components/GuideArticlePage.tsx"),
      "utf8",
    );
    const summaryAt = page.indexOf("{copy.summary}");
    expect(summaryAt).toBeGreaterThan(-1);
    expect(summaryAt).toBeGreaterThan(page.indexOf("<GuideArticleSectionView"));
    expect(summaryAt).toBeLessThan(page.indexOf("<GuideFaqItems"));
  });
});

describe.each(articles.map((article) => [article.id, article] as const))(
  "guide article %s",
  (_id, article) => {
    it("uses a kebab-case id and a path under its parent hub", () => {
      expect(article.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(article.pathname.startsWith(`/${article.parentHub}/`)).toBe(true);
    });

    it("ships complete copy in every locale", () => {
      const ka = article.copy.ka;
      for (const locale of routing.locales) {
        const copy = article.copy[locale];
        expect(copy, locale).toBeDefined();
        expect(copy.title.length, `${locale} title`).toBeLessThanOrEqual(90);
        expect(copy.metaTitle.length, `${locale} metaTitle`).toBeGreaterThan(
          20,
        );
        expect(
          copy.metaTitle.length,
          `${locale} metaTitle`,
        ).toBeLessThanOrEqual(65);
        expect(
          copy.description.length,
          `${locale} description`,
        ).toBeGreaterThanOrEqual(110);
        expect(
          copy.description.length,
          `${locale} description`,
        ).toBeLessThanOrEqual(165);
        expect(copy.summary.length, `${locale} summary`).toBeGreaterThan(80);
        expect(copy.summary.length, `${locale} summary`).toBeLessThanOrEqual(
          600,
        );
        expect(copy.sections.length, `${locale} sections`).toBe(
          ka.sections.length,
        );
        expect(copy.faq.length, `${locale} faq`).toBe(ka.faq.length);
        expect(
          copy.sections.map((section) => section.image ?? null),
          `${locale} images`,
        ).toEqual(ka.sections.map((section) => section.image ?? null));
      }
      expect(ka.sections.length).toBeGreaterThanOrEqual(3);
      expect(ka.faq.length).toBeGreaterThanOrEqual(3);
    });

    it("keeps section headings, anchors, and FAQ questions unique", () => {
      for (const locale of routing.locales) {
        const copy = article.copy[locale];
        const anchors = copy.sections.map((section) =>
          guideArticleSectionAnchor(section.heading, locale),
        );
        expect(anchors.every(Boolean), locale).toBe(true);
        expect(new Set(anchors).size, locale).toBe(anchors.length);
        expect(
          new Set(copy.faq.map((item) => item.question)).size,
          locale,
        ).toBe(copy.faq.length);
        for (const section of copy.sections) {
          expect(section.paragraphs.length, section.heading).toBeGreaterThan(0);
          if (section.list) {
            expect(section.list.items.length, section.heading).toBeGreaterThan(
              1,
            );
          }
        }
      }
    });

    it("uses optimized, localized images", () => {
      const images = [article.hero, ...Object.values(article.images ?? {})];
      for (const image of images) {
        const entry = optimizedEntry(image.src);
        expect(entry, image.src).not.toBeNull();
        expect(entry?.width, image.src).toBe(image.width);
        expect(entry?.height, image.src).toBe(image.height);
        if (image.src.startsWith("/")) {
          expect(
            fs.existsSync(path.join(process.cwd(), "public", image.src)),
            image.src,
          ).toBe(true);
        }
        for (const locale of routing.locales) {
          expect(
            image.alt[locale]?.trim(),
            `${image.src} ${locale}`,
          ).toBeTruthy();
        }
      }
      for (const locale of routing.locales) {
        for (const section of article.copy[locale].sections) {
          if (!section.image) continue;
          expect(article.images?.[section.image], section.image).toBeDefined();
        }
      }
      const optimizerSources = new Set<string>(Object.values(siteMedia));
      for (const image of images) {
        expect(optimizerSources.has(image.src), image.src).toBe(true);
      }
    });

    it("has a 1200x630 JPEG share image", () => {
      expect(
        article.ogImage.endsWith(`/og/images/guides/${article.id}.jpg`),
        article.ogImage,
      ).toBe(true);
      if (article.ogImage.startsWith("/")) {
        const file = path.join(process.cwd(), "public", article.ogImage);
        expect(fs.existsSync(file), `${file}: run pnpm images:og-guides`).toBe(
          true,
        );
        const bytes = fs.readFileSync(file);
        expect(bytes.byteLength).toBeLessThanOrEqual(300_000);
        expect(jpegSize(bytes)).toEqual({ height: 630, width: 1200 });
      }
    });

    it("cites https sources with localized support notes", () => {
      expect(article.sources.length).toBeGreaterThan(0);
      expect(new Set(article.sources.map((source) => source.url)).size).toBe(
        article.sources.length,
      );
      for (const source of article.sources) {
        expect(source.url, source.name).toMatch(/^https:\/\//);
        for (const locale of routing.locales) {
          expect(
            source.supports[locale]?.trim(),
            `${source.name} ${locale}`,
          ).toBeTruthy();
        }
      }
    });

    it("has localized search copy", () => {
      expect(article.search.keywords.length).toBeGreaterThan(0);
      for (const locale of routing.locales) {
        expect(article.search.title[locale]?.trim(), locale).toBeTruthy();
        expect(article.search.subtitle[locale]?.trim(), locale).toBeTruthy();
      }
    });

    it("links only to published species", () => {
      for (const id of article.relatedSpeciesIds ?? []) {
        expect(getSpeciesById(id), id).toBeDefined();
      }
    });

    it("is routed with localized pathnames, reserved slugs, and redirects", () => {
      const localized: Record<"en" | "ka" | "ru" | "tr", string> =
        pathnames[article.pathname];
      expect(localized.en).toBe(localized.ru);
      expect(localized.en).toBe(localized.tr);
      const reserved = RESERVED_HUB_SLUGS[article.parentHub];
      for (const value of [article.pathname, localized.ka, localized.en]) {
        const slug = value.split("/").at(-1) ?? "";
        expect(reserved, value).toContain(slug);
      }

      const redirects = guideArticleRedirects();
      if (localized.en !== localized.ka) {
        expect(redirects.ka[localized.en]).toBe(localized.ka);
        expect(redirects.prefixed[localized.ka]).toBe(localized.en);
      }

      const page = path.join(
        process.cwd(),
        "src/app/[locale]",
        article.pathname,
        "page.tsx",
      );
      expect(fs.existsSync(page), page).toBe(true);
      expect(fs.readFileSync(page, "utf8")).toContain(
        `createGuideArticleRoute("${article.pathname}")`,
      );
    });

    it("has sitemap and structured-data dates", () => {
      const dates = pageDateFields(article.pathname);
      expect(sitemapPathDatePublished(article.pathname)).toBe(
        dates.datePublished,
      );
      expect(Date.parse(dates.dateModified)).toBeGreaterThanOrEqual(
        Date.parse(dates.datePublished),
      );
    });

    it("is shown as an article card on its hub", () => {
      expect(getGuideArticlesForHub(article.parentHub)).toContain(article);
    });

    it("is linked from its hub, the footer, and the home SEO block", () => {
      expect(HUB_CLUSTER_CARDS[article.parentHub]).toContainEqual({
        href: article.pathname,
        key: article.messageKey,
        kind: "page",
      });
      for (const locale of routing.locales) {
        for (const field of ["eyebrow", "title", "body", "cta"]) {
          expect(
            messageAt(
              locale,
              `groupHubShared.cluster.${article.messageKey}.${field}`,
            ),
            `${locale} cluster ${field}`,
          ).toBeTypeOf("string");
        }
        expect(
          messageAt(locale, `footer.${article.messageKey}`),
          `${locale} footer`,
        ).toBeTypeOf("string");
        expect(
          messageAt(locale, `home.seo.links.${article.messageKey}`),
          `${locale} home`,
        ).toBeTypeOf("string");
      }
    });
  },
);
