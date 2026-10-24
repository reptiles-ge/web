import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

import { getPublishedNewsArticles } from "@/data/news";
import { routing } from "@/i18n/routing";

import { toNewsListArticle } from "../../tests/fixtures/manyNews";
import { server } from "../../tests/msw/server";
import { getNewsArticle, getNewsList, getNewsListArticles } from "./newsApi";

function strip(photo: NewsPhoto): NewsPhoto {
  if (!photo.credit?.authorId) return photo;
  const { authorId: _authorId, ...credit } = photo.credit;
  return { ...photo, credit };
}

function withoutAuthorIds<T extends Pick<NewsArticle, "gallery" | "image">>(
  article: T,
): T {
  return {
    ...article,
    ...(article.image ? { image: strip(article.image) } : {}),
    ...(article.gallery ? { gallery: article.gallery.map(strip) } : {}),
  };
}

describe("getNewsArticle", () => {
  it("rebuilds every published article from the API in all its locales", async () => {
    for (const article of getPublishedNewsArticles()) {
      const found = await getNewsArticle(article.slug);
      expect(found && withoutAuthorIds(found), article.slug).toStrictEqual(
        article,
      );
    }
  });

  it("keeps the author link of a credited photo", async () => {
    const articles = await Promise.all(
      getPublishedNewsArticles().map(({ slug }) => getNewsArticle(slug)),
    );
    expect(articles.some((article) => article?.image?.credit?.authorId)).toBe(
      true,
    );
  });

  it("answers null for an unknown slug and throws on other errors", async () => {
    expect(await getNewsArticle("no-such-article")).toBeNull();
    server.use(
      http.get("https://api.reptiles.ge/v1/news/:slug", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    await expect(getNewsArticle("broken-article")).rejects.toThrow(
      "News API answered 500 for broken-article",
    );
  });
});

describe("getNewsList", () => {
  it("lists the published articles of a locale, newest first", async () => {
    expect((await getNewsList("en")).map((item) => item.slug)).toEqual(
      getPublishedNewsArticles("en").map((item) => item.slug),
    );
    server.use(
      http.get("https://api.reptiles.ge/v1/news", () =>
        HttpResponse.json({}, { status: 503 }),
      ),
    );
    await expect(getNewsList("ru")).rejects.toThrow("News API answered 503");
  });
});

describe("getNewsListArticles", () => {
  it.each(routing.locales)(
    "rebuilds the %s list articles the index and archive render",
    async (locale) => {
      const found = await getNewsListArticles(locale);
      expect(found.map(withoutAuthorIds)).toStrictEqual(
        getPublishedNewsArticles(locale).map((article) =>
          toNewsListArticle(article, locale),
        ),
      );
    },
  );
});
