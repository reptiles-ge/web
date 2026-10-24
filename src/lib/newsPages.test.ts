import { describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { getPublishedNewsArticles } from "@/data/news";
import { newsArticleUrl, newsDateTime } from "@/lib/news";
import {
  getNewsListPage,
  getNewsListPageCounts,
  getNewsPage,
  NEWS_PAGE_SIZE,
  newsArchiveAlternates,
  newsArchiveHref,
  newsArchivePages,
  newsArchiveStaticParams,
  newsListingJsonLd,
  newsPageCount,
  newsPageCounts,
  newsPageDateModified,
  newsPageHref,
  newsPageUrl,
  parseNewsArchivePage,
} from "@/lib/newsPages";

import {
  MANY_NEWS_EDITED_AT,
  MANY_NEWS_TOTAL,
  MANY_NEWS_TR_TOTAL,
  toNewsListArticle,
} from "../../tests/fixtures/manyNews";

vi.mock("@/i18n/navigation", async () => {
  const { fakeGetPathname } = await import("../../tests/fixtures/manyNews");
  return { getPathname: fakeGetPathname };
});

vi.mock("@/data/news", async (importOriginal) => {
  const { withManyNews } = await import("../../tests/fixtures/manyNews");
  return withManyNews(await importOriginal());
});

vi.mock("@/lib/newsApi", async () => {
  const { manyNewsListArticles, manyNewsListPage } =
    await import("../../tests/fixtures/manyNews");
  const actual =
    await vi.importActual<typeof import("@/data/news")>("@/data/news");
  return {
    getNewsListArticles: async (locale: AppLocale) =>
      manyNewsListArticles(actual, locale),
    getNewsListArticlesPage: async (
      locale: AppLocale,
      page: number,
      limit: number,
    ) => manyNewsListPage(actual, locale, page, limit),
  };
});

describe("news pages", () => {
  it("keeps the first page to the page size and puts the rest on archive pages", () => {
    const first = getNewsPage("en", 1);
    const second = getNewsPage("en", 2);
    const third = getNewsPage("en", 3);

    expect(first?.articles).toHaveLength(NEWS_PAGE_SIZE);
    expect(second?.articles).toHaveLength(NEWS_PAGE_SIZE);
    expect(third?.articles).toHaveLength(MANY_NEWS_TOTAL - 2 * NEWS_PAGE_SIZE);
    expect(third).toMatchObject({
      first: 2 * NEWS_PAGE_SIZE + 1,
      last: MANY_NEWS_TOTAL,
      page: 3,
      pageCount: 3,
      total: MANY_NEWS_TOTAL,
    });
    expect(second?.articles[0]?.slug).toBe(
      getPublishedNewsArticles("en")[NEWS_PAGE_SIZE]?.slug,
    );
  });

  it("returns nothing outside the page range", () => {
    expect(getNewsPage("en", 0)).toBeNull();
    expect(getNewsPage("en", 4)).toBeNull();
    expect(getNewsPage("en", 1.5)).toBeNull();
    expect(getNewsPage("tr", 3)).toBeNull();
  });

  it("counts pages per locale", () => {
    expect(newsPageCount("ka")).toBe(3);
    expect(newsPageCount("tr")).toBe(
      Math.ceil(MANY_NEWS_TR_TOTAL / NEWS_PAGE_SIZE),
    );
    expect(newsArchivePages("ka", newsPageCounts())).toEqual([2, 3]);
    expect(newsArchivePages("tr", newsPageCounts())).toEqual([2]);
  });

  it("pages the API list the same way", async () => {
    expect(await getNewsListPageCounts()).toEqual(newsPageCounts());
    const second = await getNewsListPage("en", 2);
    expect(second).toMatchObject({
      first: NEWS_PAGE_SIZE + 1,
      last: 2 * NEWS_PAGE_SIZE,
      page: 2,
      pageCount: 3,
      total: MANY_NEWS_TOTAL,
    });
    expect(second?.articles).toEqual(
      getNewsPage("en", 2)!.articles.map((article) =>
        toNewsListArticle(article, "en"),
      ),
    );
    expect(await getNewsListPage("tr", 3)).toBeNull();
  });

  it("only emits archive pages that have articles", () => {
    const params = newsArchiveStaticParams(newsPageCounts());
    expect(params).toContainEqual({ locale: "ka", page: "3" });
    expect(params).not.toContainEqual({ locale: "tr", page: "3" });
    expect(params.some((param) => param.page === "1")).toBe(false);
    for (const param of params) {
      expect(
        getNewsPage(param.locale, Number(param.page))?.articles.length,
      ).toBeGreaterThan(0);
    }
  });

  it("parses only canonical archive page numbers", () => {
    expect(parseNewsArchivePage("2")).toBe(2);
    expect(parseNewsArchivePage("12")).toBe(12);
    for (const value of ["1", "0", "02", "-2", "2.5", "two", "", "1234567"]) {
      expect(parseNewsArchivePage(value), value).toBeNull();
    }
  });

  it("links page one to the news index and later pages to the archive", () => {
    expect(newsPageHref(1)).toBe("/news");
    expect(newsPageHref(2)).toEqual(newsArchiveHref(2));
    expect(newsPageUrl("ka", 1)).toBe("https://reptiles.ge/news");
    expect(newsPageUrl("ka", 2)).toBe("https://reptiles.ge/news/page/2");
    expect(newsPageUrl("en", 3)).toBe("https://reptiles.ge/en/news/page/3");
  });

  it("self-canonicalises and lists hreflang only for locales that have the page", () => {
    expect(newsArchiveAlternates("en", 2, newsPageCounts())).toEqual({
      canonical: "https://reptiles.ge/en/news/page/2",
      languages: {
        en: "https://reptiles.ge/en/news/page/2",
        ka: "https://reptiles.ge/news/page/2",
        ru: "https://reptiles.ge/ru/news/page/2",
        tr: "https://reptiles.ge/tr/news/page/2",
        "x-default": "https://reptiles.ge/news/page/2",
      },
    });
    expect(
      newsArchiveAlternates("ka", 3, newsPageCounts()).languages,
    ).not.toHaveProperty("tr");
    expect(newsArchiveAlternates("ka", 4, newsPageCounts()).languages).toEqual(
      {},
    );
  });

  it("dates a page by its newest edit or by the latest article that shifted it", () => {
    const [first] = getPublishedNewsArticles("ka");
    const newest = newsDateTime(first!.publishedAt);
    expect(newsPageDateModified(first, getNewsPage("ka", 3)!.articles)).toBe(
      newest,
    );
    expect(newsPageDateModified(first, getNewsPage("ka", 2)!.articles)).toBe(
      newsDateTime(MANY_NEWS_EDITED_AT),
    );
    expect(newsPageDateModified(first, [])).toBe(newest);
    expect(newsPageDateModified(undefined, [])).toBeNull();
    expect(
      newsPageDateModified(undefined, getNewsPage("ka", 2)!.articles),
    ).toBe(newsDateTime(MANY_NEWS_EDITED_AT));
  });

  it("builds BreadcrumbList and a CollectionPage limited to the listed articles", () => {
    const articles = getNewsPage("en", 2)!.articles.map((article) =>
      toNewsListArticle(article, "en"),
    );
    const [breadcrumb, collection] = newsListingJsonLd({
      articles,
      breadcrumbs: [
        { name: "Home", url: "https://reptiles.ge/en" },
        { name: "News", url: "https://reptiles.ge/en/news" },
        { name: "Page 2", url: "https://reptiles.ge/en/news/page/2" },
      ],
      dates: { dateModified: "2026-10-01T00:00:00+04:00" },
      description: "Older news",
      locale: "en",
      name: "News, page 2",
      url: "https://reptiles.ge/en/news/page/2",
    });

    expect(breadcrumb).toMatchObject({ "@type": "BreadcrumbList" });
    expect(
      (breadcrumb as { itemListElement: { position: number }[] })
        .itemListElement,
    ).toHaveLength(3);
    expect(collection).toMatchObject({
      "@type": "CollectionPage",
      dateModified: "2026-10-01T00:00:00+04:00",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: NEWS_PAGE_SIZE,
      },
      url: "https://reptiles.ge/en/news/page/2",
    });
    const items = (
      collection as {
        mainEntity: { itemListElement: { position: number; url: string }[] };
      }
    ).mainEntity.itemListElement;
    expect(items[0]).toMatchObject({
      position: 1,
      url: newsArticleUrl("en", articles[0]!.slug),
    });
  });
});
