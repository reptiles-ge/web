import { describe, expect, it } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import { routing } from "@/i18n/routing";
import {
  newsArticleAlternates,
  newsArticleHref,
  newsArticleUrl,
  newsDateTime,
  newsIndexAlternates,
  newsIndexHref,
  newsIndexUrl,
  newsOgImageUrl,
  publishedNewsStaticParams,
} from "@/lib/news";
import { SITE_OG_IMAGE_URL } from "@/lib/site";

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

describe("newsArticleAlternates", () => {
  it("lists every language the article has, with KA as x-default", () => {
    const alternates = newsArticleAlternates("en", article.slug);
    expect(alternates.canonical).toBe(newsArticleUrl("en", article.slug));
    expect(alternates.languages["x-default"]).toBe(
      newsArticleUrl("ka", article.slug),
    );
    for (const locale of Object.keys(article.copy)) {
      expect(alternates.languages).toHaveProperty(locale);
    }
  });

  it("returns no per-article languages for an unknown slug", () => {
    const alternates = newsArticleAlternates("en", "no-such-article");
    expect(alternates.canonical).toMatch(/^https:\/\//);
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
    expect(newsOgImageUrl(article)).toMatch(/^https:\/\//);
  });
});

describe("publishedNewsStaticParams", () => {
  it("has one entry per published article and language", () => {
    const expected = getPublishedNewsArticles().reduce(
      (total, item) => total + Object.keys(item.copy).length,
      0,
    );
    expect(publishedNewsStaticParams()).toHaveLength(expected);
  });
});
