import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

import { newsSeriesIds } from "@/data/newsSeries";
import { routing } from "@/i18n/routing";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import { toNewsListArticle } from "../../tests/fixtures/manyNews";
import {
  getPublishedNewsArticles,
  getPublishedNewsArticlesInSeries,
  getPublishedNewsForCreditAuthor,
  getPublishedNewsForHub,
  getPublishedNewsForRegion,
  getPublishedNewsForSpecies,
} from "../../tests/fixtures/newsSeed";
import { contributorsFixture } from "../../tests/fixtures/speciesCatalog";
import { server } from "../../tests/msw/server";
import {
  getNewsArticle,
  getNewsArticles,
  getNewsList,
  getNewsListArticles,
  getNewsListArticlesForAuthor,
  getNewsListArticlesForHub,
  getNewsListArticlesForRegion,
  getNewsListArticlesForSpecies,
  getNewsListArticlesInSeries,
  getNewsListArticlesPage,
  getNewsSummaries,
  HOME_NEWS_LIMIT,
} from "./newsApi";

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
      expect(found?.views, article.slug).toBe(0);
      const { views: _views, ...rest } = found!;
      expect(withoutAuthorIds(rest), article.slug).toStrictEqual(article);
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

describe("getNewsArticles", () => {
  it("rebuilds every published article, newest first", async () => {
    const articles = await getNewsArticles();
    expect(articles.map((article) => article.slug)).toEqual(
      getPublishedNewsArticles().map((article) => article.slug),
    );
    expect(
      articles.map(({ views: _views, ...rest }) => withoutAuthorIds(rest)),
    ).toStrictEqual(getPublishedNewsArticles());
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

describe("getNewsListArticles with a limit", () => {
  it("asks the API for the first articles only", async () => {
    const queries: string[] = [];
    const listen = ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      if (url.pathname === "/v1/news") queries.push(url.search);
    };
    server.events.on("request:start", listen);
    const found = await getNewsListArticles("en", HOME_NEWS_LIMIT);
    server.events.removeListener("request:start", listen);
    expect(queries).toEqual([`?limit=${HOME_NEWS_LIMIT}&page=1`]);
    expect(found.map(({ slug }) => slug)).toEqual(
      getPublishedNewsArticles("en")
        .slice(0, HOME_NEWS_LIMIT)
        .map(({ slug }) => slug),
    );
  });
});

describe("getNewsListArticlesForAuthor", () => {
  it("lists the articles that name a contributor, from the API", async () => {
    let matched = 0;
    for (const author of contributorsFixture("en")) {
      const expected = getPublishedNewsForCreditAuthor(author, "en").map(
        (article) => toNewsListArticle(article, "en"),
      );
      matched += expected.length;
      const found = await getNewsListArticlesForAuthor("en", author.id);
      expect(found.map(withoutAuthorIds), author.id).toStrictEqual(expected);
    }
    expect(matched).toBeGreaterThan(0);
  });

  it("asks the API for the author filter", async () => {
    const queries: string[] = [];
    const listen = ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      if (url.pathname === "/v1/news") queries.push(url.search);
    };
    server.events.on("request:start", listen);
    await getNewsListArticlesForAuthor("ka", "no-such-author");
    server.events.removeListener("request:start", listen);
    expect(queries).toEqual(["?author=no-such-author&limit=100&page=1"]);
  });
});

function listedQueries(run: () => Promise<unknown>) {
  const queries: string[] = [];
  const listen = ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    if (url.pathname === "/v1/news") queries.push(url.search);
  };
  server.events.on("request:start", listen);
  return run().then(() => {
    server.events.removeListener("request:start", listen);
    return queries;
  });
}

describe("filtered news lists", () => {
  it("lists the articles of a hub, from the API", async () => {
    let matched = 0;
    for (const hub of Object.keys(GROUP_HUBS) as GroupHubId[]) {
      const expected = getPublishedNewsForHub(hub, "en").map((article) =>
        toNewsListArticle(article, "en"),
      );
      matched += expected.length;
      const found = await getNewsListArticlesForHub("en", hub);
      expect(found.map(withoutAuthorIds), hub).toStrictEqual(expected);
    }
    expect(matched).toBeGreaterThan(0);
  });

  it("lists the articles of a region, from the API", async () => {
    const regions = new Set(
      getPublishedNewsArticles().flatMap((article) => article.relatedRegionIds),
    );
    expect(regions.size).toBeGreaterThan(0);
    for (const region of regions) {
      const expected = getPublishedNewsForRegion(region, "ka").map((article) =>
        toNewsListArticle(article, "ka"),
      );
      expect(expected.length, region).toBeGreaterThan(0);
      const found = await getNewsListArticlesForRegion("ka", region);
      expect(found.map(withoutAuthorIds), region).toStrictEqual(expected);
    }
  });

  it("lists the articles that relate to or link a species, from the API", async () => {
    const species = new Set(
      getPublishedNewsArticles().flatMap(
        (article) => article.relatedSpeciesIds,
      ),
    );
    expect(species.size).toBeGreaterThan(0);
    for (const id of species) {
      const expected = getPublishedNewsForSpecies(id, "ka").map((article) =>
        toNewsListArticle(article, "ka"),
      );
      expect(expected.length, id).toBeGreaterThan(0);
      const found = await getNewsListArticlesForSpecies("ka", id);
      expect(found.map(withoutAuthorIds), id).toStrictEqual(expected);
    }
  });

  it("lists a series oldest first, from the API", async () => {
    let matched = 0;
    for (const series of newsSeriesIds) {
      const first = getPublishedNewsArticles("en").find(
        (article) => article.series === series,
      );
      const expected = first
        ? getPublishedNewsArticlesInSeries(first, "en").map((article) =>
            toNewsListArticle(article, "en"),
          )
        : [];
      matched += expected.length;
      const found = await getNewsListArticlesInSeries("en", series);
      expect(found.map(withoutAuthorIds), series).toStrictEqual(expected);
    }
    expect(matched).toBeGreaterThan(1);
  });

  it("asks the API for each filter", async () => {
    expect(
      await listedQueries(() => getNewsListArticlesForHub("ka", "fish")),
    ).toEqual(["?hub=fish&limit=100&page=1"]);
    expect(
      await listedQueries(() =>
        getNewsListArticlesForRegion("ka", "no-region"),
      ),
    ).toEqual(["?limit=100&page=1&region=no-region"]);
    expect(
      await listedQueries(() =>
        getNewsListArticlesForSpecies("ka", "no-such-species"),
      ),
    ).toEqual(["?limit=100&page=1&species=no-such-species"]);
  });
});

describe("getNewsListArticlesPage", () => {
  it("asks the API for one page with the topic and search", async () => {
    const queries: string[] = [];
    const listen = ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      if (url.pathname === "/v1/news") queries.push(url.search);
    };
    server.events.on("request:start", listen);
    const found = await getNewsListArticlesPage("en", 2, 3, "birds", "count");
    server.events.removeListener("request:start", listen);
    expect(queries).toEqual(["?hub=birds&limit=3&page=2&q=count"]);
    expect(found).toMatchObject({ limit: 3, page: 2 });
    expect(found.facets.hub.birds).toBeGreaterThanOrEqual(found.total);
  });
});

describe("getNewsSummaries", () => {
  it("merges the locale lists into the same summary the compiled articles give", async () => {
    expect(await getNewsSummaries()).toStrictEqual(
      getPublishedNewsArticles().map((article) => ({
        copy: Object.fromEntries(
          Object.entries(article.copy).map(([locale, copy]) => [
            locale,
            { dek: copy.dek, metaTitle: copy.metaTitle, title: copy.title },
          ]),
        ),
        id: article.id,
        publishedAt: article.publishedAt,
        slug: article.slug,
        sources: article.sources,
        status: "published",
        ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
      })),
    );
  });

  it("refuses a locale the article lists but the locale list lacks", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/news", ({ request }) =>
        request.headers.get("x-locale") === "en"
          ? HttpResponse.json({ data: [], pageCount: 1 })
          : undefined,
      ),
    );
    await expect(getNewsSummaries()).rejects.toThrow(
      `News API has no en text for ${getPublishedNewsArticles()[0]!.slug}`,
    );
  });
});
