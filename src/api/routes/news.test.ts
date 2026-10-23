import { describe, expect, it } from "vitest";

import {
  getNewsCopy,
  getPublishedNewsArticleBySlug,
  getPublishedNewsArticles,
  getPublishedNewsForCreditAuthor,
  getPublishedNewsForHub,
  getPublishedNewsForRegion,
  getPublishedNewsForSpecies,
} from "@/data/news";
import { locales } from "@/i18n/locales";

import type { NewsSummaryView } from "../db/newsView";

import { type ErrorBody, requestJson } from "../testing/request";
import { createNewsTestDatabase } from "../testing/sqliteDatabase";

const database = createNewsTestDatabase();
const env = { DB: database.db };

type DetailBody = {
  data: NewsSummaryView & {
    gallery: Array<{ alt: string; src: string }>;
    metaDescription: string;
    metaTitle: string;
    sections: unknown[];
  };
  locale: string;
};

type ListBody = {
  data: NewsSummaryView[];
  locale: string;
  nextCursor: null | string;
  total: number;
};

const list = (query = "", locale = "ka") =>
  requestJson<ListBody>(`/v1/news${query}`, env, {
    headers: { "X-Locale": locale },
  });

const slugs = (body: ListBody) => body.data.map((item) => item.slug);

describe("GET /v1/news", () => {
  it.each(locales)(
    "lists published articles newest first, like the site (%s)",
    async (locale) => {
      const { body, response } = await list("", locale);
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toContain("s-maxage");
      expect(response.headers.get("Content-Language")).toBe(locale);
      const expected = getPublishedNewsArticles(locale);
      expect(slugs(body)).toEqual(expected.map((article) => article.slug));
      expect(body.total).toBe(expected.length);
      expect(body.nextCursor).toBeNull();
      expect(body.data.map((item) => item.title)).toEqual(
        expected.map((article) => getNewsCopy(article, locale).title),
      );
      expect(JSON.stringify(body)).not.toContain('"sections"');
    },
  );

  it("filters by hub, region, species and series like the site", async () => {
    const [article] = getPublishedNewsArticles("en").filter(
      (item) =>
        item.relatedHubIds.length &&
        item.relatedRegionIds.length &&
        item.relatedSpeciesIds.length,
    );
    const hub = article!.relatedHubIds[0]!;
    const region = article!.relatedRegionIds[0]!;
    const species = article!.relatedSpeciesIds[0]!;
    expect(slugs((await list(`?hub=${hub}`, "en")).body)).toEqual(
      getPublishedNewsForHub(hub, "en").map((item) => item.slug),
    );
    expect(slugs((await list(`?region=${region}`, "en")).body)).toEqual(
      getPublishedNewsForRegion(region, "en").map((item) => item.slug),
    );
    expect(slugs((await list(`?species=${species}`, "en")).body)).toEqual(
      getPublishedNewsForSpecies(species, "en").map((item) => item.slug),
    );
    const series = await list("?series=batumi-raptor-count-2026", "en");
    expect(series.body.total).toBeGreaterThan(1);
    expect(
      series.body.data.every(
        (item) => item.series?.id === "batumi-raptor-count-2026",
      ),
    ).toBe(true);
    expect(series.body.data[0]?.series?.name).toBe(
      "Batumi Raptor Count, autumn 2026",
    );
  });

  it("filters by an author's id and aliases like the site", async () => {
    const authors = await requestJson<{
      data: Array<{ aliases: string[]; id: string }>;
    }>("/v1/authors?contributor=true", env);
    let matched = 0;
    for (const author of authors.body.data) {
      const expected = getPublishedNewsForCreditAuthor(author, "ka").map(
        (item) => item.slug,
      );
      matched += expected.length;
      expect(
        slugs((await list(`?author=${author.id}`)).body),
        author.id,
      ).toEqual(expected);
    }
    expect(matched).toBeGreaterThan(0);
    expect((await list("?author=no-such-author")).body.total).toBe(0);
  });

  it("pages with limit and cursor", async () => {
    const all = slugs((await list()).body);
    const seen: string[] = [];
    let cursor: null | string = null;
    do {
      const query: string = `?limit=7${cursor ? `&cursor=${cursor}` : ""}`;
      const { body } = await list(query);
      expect(body.total).toBe(all.length);
      seen.push(...slugs(body));
      cursor = body.nextCursor;
    } while (cursor);
    expect(seen).toEqual(all);
  });

  it("rejects bad filters and cursors", async () => {
    for (const query of [
      "?cursor=no-such-article",
      "?limit=0",
      "?limit=101",
      "?hub=fish",
      "?series=unknown",
    ]) {
      const { body, response } = await requestJson<ErrorBody>(
        `/v1/news${query}`,
        env,
      );
      expect(response.status, query).toBe(400);
      expect(body.error.code, query).toBe("invalid_request");
    }
  });
});

describe("GET /v1/news/:slug", () => {
  it("serves every published article in every locale", async () => {
    for (const article of getPublishedNewsArticles()) {
      for (const locale of locales) {
        const copy = getNewsCopy(article, locale);
        const { body, response } = await requestJson<DetailBody>(
          `/v1/news/${article.slug}`,
          env,
          { headers: { "X-Locale": locale } },
        );
        const label = `${article.slug} ${locale}`;
        expect(response.status, label).toBe(200);
        expect(body.locale, label).toBe(locale);
        expect(body.data.title, label).toBe(copy.title);
        expect(body.data.metaTitle, label).toBe(copy.metaTitle);
        expect(body.data.sections, label).toEqual(copy.sections);
        expect(body.data.locales, label).toEqual(Object.keys(article.copy));
        expect(
          body.data.gallery.map((photo) => [photo.src, photo.alt]),
          label,
        ).toEqual(
          (article.gallery ?? []).map((photo) => [
            photo.src,
            photo.alt[locale] ?? photo.alt.ka,
          ]),
        );
      }
    }
  });

  it("falls back to Georgian when the locale has no text", async () => {
    const fallback = createNewsTestDatabase();
    const slug = getPublishedNewsArticles()[0]!.slug;
    fallback.sqlite
      .prepare("DELETE FROM news_texts WHERE article_id = ? AND locale = 'en'")
      .run(slug);
    const fallbackEnv = { DB: fallback.db };
    const { body, response } = await requestJson<DetailBody>(
      `/v1/news/${slug}`,
      fallbackEnv,
      { headers: { "X-Locale": "en" } },
    );
    expect(response.status).toBe(200);
    expect(body.locale).toBe("ka");
    expect(response.headers.get("Content-Language")).toBe("ka");
    expect(body.data.title).toBe(
      getPublishedNewsArticleBySlug(slug)!.copy.ka.title,
    );
    expect(body.data.locales).toEqual(["ka", "ru", "tr"]);
    const en = await requestJson<ListBody>("/v1/news", fallbackEnv, {
      headers: { "X-Locale": "en" },
    });
    expect(slugs(en.body)).not.toContain(slug);
  });

  it("hides drafts and answers 404 for unknown slugs", async () => {
    const drafts = createNewsTestDatabase();
    const slug = getPublishedNewsArticles()[0]!.slug;
    drafts.sqlite
      .prepare("UPDATE news_articles SET status = 'draft' WHERE id = ?")
      .run(slug);
    const draftEnv = { DB: drafts.db };
    const detail = await requestJson<ErrorBody>(`/v1/news/${slug}`, draftEnv);
    expect(detail.response.status).toBe(404);
    expect(detail.body.error.code).toBe("not_found");
    const all = await requestJson<ListBody>("/v1/news", draftEnv);
    expect(slugs(all.body)).not.toContain(slug);

    const missing = await requestJson<ErrorBody>(
      "/v1/news/no-such-article",
      env,
    );
    expect(missing.response.status).toBe(404);
    const invalid = await requestJson<ErrorBody>("/v1/news/Bad%20Slug", env);
    expect(invalid.response.status).toBe(400);
  });
});
