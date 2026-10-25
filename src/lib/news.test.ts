import { describe, expect, it } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import { routing } from "@/i18n/routing";
import {
  newsArticleAlternates,
  newsArticleHref,
  newsArticleModifiedDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexAlternates,
  newsIndexDateFields,
  newsIndexHref,
  newsIndexUrl,
  newsOgImageDimensions,
  newsOgImageUrl,
  newsReadMinutes,
  newsSchemaDate,
  newsSourceBadges,
} from "@/lib/news";
import { SITE_OG_IMAGE_URL } from "@/lib/site";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

const article = getPublishedNewsArticles()[0];

describe("news urls", () => {
  it("builds the article and index hrefs", () => {
    expect(newsArticleHref("x")).toEqual({
      params: { slug: "x" },
      pathname: "/news/[slug]",
    });
    expect(newsIndexHref()).toBe("/news");
  });

  it("builds absolute site URLs", () => {
    expect(newsIndexUrl("en")).toMatch(/^https:\/\/reptiles\.ge/);
    expect(newsArticleUrl("tr", "x")).toMatch(/^https:\/\/reptiles\.ge/);
  });
});

describe("newsDateTime", () => {
  it("turns a bare date into midnight in Tbilisi", () => {
    expect(newsDateTime("2026-03-01")).toBe("2026-03-01T00:00:00+04:00");
  });

  it("converts a timestamp to the site time zone", () => {
    expect(newsDateTime("2026-03-01T00:00:00Z")).toBe(
      "2026-03-01T04:00:00+04:00",
    );
  });

  it("falls back to midnight for an unparseable value", () => {
    expect(newsDateTime("not-a-date")).toBe("not-a-dateT00:00:00+04:00");
  });
});

describe("newsSchemaDate", () => {
  it("keeps a bare date without inventing a time", () => {
    expect(newsSchemaDate("2026-10-24")).toBe("2026-10-24");
  });

  it("converts a timestamp to the site time zone", () => {
    expect(newsSchemaDate("2026-10-23T07:30:00Z")).toBe(
      "2026-10-23T11:30:00+04:00",
    );
  });
});

describe("newsArticleAlternates", () => {
  it("lists every language the article has, with KA as x-default", () => {
    const alternates = newsArticleAlternates("en", article);
    expect(alternates.canonical).toBe(newsArticleUrl("en", article.slug));
    expect(alternates.languages["x-default"]).toBe(
      newsArticleUrl("ka", article.slug),
    );
    for (const locale of Object.keys(article.copy)) {
      expect(alternates.languages).toHaveProperty(locale);
    }
  });

  it("leaves out languages the article is not written in", () => {
    const alternates = newsArticleAlternates("ka", {
      copy: { ka: article.copy.ka } as typeof article.copy,
      slug: article.slug,
    });
    expect(Object.keys(alternates.languages)).toEqual(["x-default", "ka"]);
  });
});

describe("newsIndexAlternates", () => {
  it("has an entry for every locale", () => {
    const { languages } = newsIndexAlternates("ka");
    for (const locale of routing.locales) {
      expect(languages).toHaveProperty(locale);
    }
  });
});

describe("newsOgImageUrl", () => {
  it("falls back to the site image without an article", () => {
    expect(newsOgImageUrl()).toBe(SITE_OG_IMAGE_URL);
  });

  it("returns an absolute URL for a real article", () => {
    expect(newsOgImageUrl(article, speciesCatalogFixture("ka"))).toMatch(
      /^https:\/\//,
    );
  });
});

describe("newsOgImageDimensions", () => {
  it("sizes the schema image of every published article", () => {
    for (const item of getPublishedNewsArticles()) {
      const { height, width } = newsOgImageDimensions(
        item,
        speciesCatalogFixture("ka"),
      );
      expect(width, item.slug).toBeGreaterThan(0);
      expect(height, item.slug).toBeGreaterThan(0);
    }
  });
});

describe("newsReadMinutes", () => {
  it("estimates a positive whole number of minutes per locale", () => {
    for (const item of getPublishedNewsArticles()) {
      for (const locale of routing.locales) {
        const minutes = newsReadMinutes(item, locale);
        expect(Number.isInteger(minutes)).toBe(true);
        expect(minutes).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

describe("newsIndexDateFields", () => {
  function withDates(publishedAt: string, updatedAt?: string) {
    return { ...article, publishedAt, slug: publishedAt, updatedAt };
  }

  it("dates the index by the newest article update, then publish date", () => {
    const fields = newsIndexDateFields([
      withDates("2026-09-01", "2026-09-20"),
      withDates("2026-09-10T12:30:00+04:00"),
    ]);
    expect(fields.dateModified).toBe("2026-09-20T00:00:00+04:00");
  });

  it("compares instants across time zones, not strings", () => {
    const fields = newsIndexDateFields([
      withDates("2026-09-10T23:30:00Z"),
      withDates("2026-09-11T02:00:00+04:00"),
    ]);
    expect(fields.dateModified).toBe("2026-09-11T03:30:00+04:00");
  });

  it("falls back to the index publish date with no dated articles", () => {
    const fields = newsIndexDateFields([]);
    expect(fields.dateModified).toBe(fields.datePublished);
    expect(newsIndexDateFields([withDates("bad")]).dateModified).toBe(
      fields.datePublished,
    );
  });

  it("matches the newest published article in the registry", () => {
    const newest = Math.max(
      ...getPublishedNewsArticles("ka").map((item) =>
        Date.parse(newsArticleModifiedDateTime(item)),
      ),
    );
    expect(
      Date.parse(
        newsIndexDateFields(getPublishedNewsArticles("ka")).dateModified,
      ),
    ).toBe(newest);
  });
});

describe("newsSourceBadges", () => {
  function withSources(slug: string, names: string[]) {
    return {
      ...article,
      slug,
      sources: names.map((name) => ({ name, url: `https://x/${name}` })),
    };
  }

  it("is empty when no article cites a source", () => {
    expect(newsSourceBadges([], "en")).toEqual([]);
    expect(newsSourceBadges([withSources("a", [])], "en")).toEqual([]);
  });

  it("counts an organisation once per article, case-insensitively", () => {
    expect(
      newsSourceBadges(
        [
          withSources("a", ["Zootaxa — paper", "zootaxa — PDF", "NOAA"]),
          withSources("b", ["NOAA — biology"]),
        ],
        "en",
      ),
    ).toEqual(["NOAA", "Zootaxa"]);
  });

  it("orders by citing articles, then by first appearance, and caps the list", () => {
    const articles = [
      withSources("a", ["A", "B"]),
      withSources("b", ["C", "B"]),
      withSources("c", ["D", "E"]),
    ];
    expect(newsSourceBadges(articles, "en")).toEqual(["B", "A", "C", "D"]);
    expect(newsSourceBadges(articles, "en", 2)).toEqual(["B", "A"]);
    expect(newsSourceBadges(articles, "en")).toEqual(
      newsSourceBadges(articles, "en"),
    );
  });

  it("uses localized source names", () => {
    const localized = {
      ...article,
      sources: [
        {
          name: {
            en: "Ministry — x",
            ka: "სამინისტრო — x",
            ru: "Министерство",
            tr: "Bakanlık",
          },
          url: "u",
        },
      ],
    };
    expect(newsSourceBadges([localized], "en")).toEqual(["Ministry"]);
    expect(newsSourceBadges([localized], "ka")).toEqual(["სამინისტრო"]);
  });
});
