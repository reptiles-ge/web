import { beforeAll, describe, expect, it } from "vitest";

import type { NewsArticle } from "@/data/newsTypes";

import { NEWS_ARTICLES } from "@/data/news.generated";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { readNewsRecords } from "./news";
import { buildNewsImport, type NewsRecord } from "./newsRows";

type Database = ReturnType<typeof createSpeciesTestDatabase>;

function count(sqlite: Database["sqlite"], table: string) {
  return (
    sqlite.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }
  ).n;
}

function importNews(database: Database, articles: readonly NewsArticle[]) {
  for (const statement of buildNewsImport(articles)) {
    database.sqlite.exec(statement);
  }
}

function withoutAuthorIds(article: NewsArticle): NewsArticle {
  const strip = <T extends NewsArticle["image"]>(photo: T) => {
    if (!photo?.credit?.authorId) return photo;
    const { authorId: _authorId, ...credit } = photo.credit;
    return { ...photo, credit };
  };
  return {
    ...article,
    ...(article.image ? { image: strip(article.image) } : {}),
    ...(article.gallery ? { gallery: article.gallery.map(strip) } : {}),
  };
}

describe("news in D1", () => {
  let database: Database;
  let records: NewsRecord[];

  beforeAll(async () => {
    database = createSpeciesTestDatabase();
    importNews(database, NEWS_ARTICLES);
    records = await readNewsRecords(database.db);
  });

  it("reads back every compiled article, in order", () => {
    expect(records.map((record) => record.position)).toStrictEqual(
      NEWS_ARTICLES.map((_, index) => index),
    );
    expect(
      records.map((record) => withoutAuthorIds(record.article)),
    ).toStrictEqual(NEWS_ARTICLES);
  });

  it("writes every record back to the same rows it was read from", async () => {
    const fresh = createSpeciesTestDatabase();
    importNews(
      fresh,
      records.map((record) => record.article),
    );
    expect(await readNewsRecords(fresh.db)).toStrictEqual(records);
  });

  it("reads one article on its own", async () => {
    const [first, second] = records;
    expect(
      await readNewsRecords(database.db, second!.article.id),
    ).toStrictEqual([second]);
    expect(await readNewsRecords(database.db, first!.article.id)).toStrictEqual(
      [first],
    );
    expect(await readNewsRecords(database.db, "missing-article")).toStrictEqual(
      [],
    );
  });

  it("links photo credits to authors through their aliases", () => {
    const linked = database.sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM news_media JOIN author_aliases ON alias = credit_person WHERE news_media.author_id = author_aliases.author_id",
      )
      .get() as { n: number };
    const aliased = database.sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM news_media WHERE credit_person IN (SELECT alias FROM author_aliases)",
      )
      .get() as { n: number };
    expect(linked.n).toBe(aliased.n);
    expect(
      records.some((record) =>
        [record.article.image, ...(record.article.gallery ?? [])].some(
          (photo) => photo?.credit?.authorId,
        ),
      ),
    ).toBe(true);
  });

  it("keeps one row per article, locale and source", () => {
    const { sqlite } = database;
    expect(count(sqlite, "news_articles")).toBe(NEWS_ARTICLES.length);
    expect(count(sqlite, "news_texts")).toBe(
      NEWS_ARTICLES.reduce(
        (sum, article) => sum + Object.keys(article.copy).length,
        0,
      ),
    );
    expect(count(sqlite, "news_sources")).toBe(
      NEWS_ARTICLES.reduce((sum, article) => sum + article.sources.length, 0),
    );
  });

  it("refuses a second import", () => {
    expect(() => importNews(database, NEWS_ARTICLES)).toThrow();
  });

  it("enforces slugs, lookups, foreign keys and checks", () => {
    const { sqlite } = database;
    const insertArticle =
      (id: string, series: null | string = null) =>
      () =>
        sqlite
          .prepare(
            "INSERT INTO news_articles (id, status, position, published_at, series_id) VALUES (?, 'draft', 9999, '2026-01-01', ?)",
          )
          .run(id, series);
    for (const id of ["Bad-Slug", "bad--slug", "bad-", "2026", "page", "-x"]) {
      expect(insertArticle(id), id).toThrow();
    }
    expect(insertArticle("test-article", "unknown-series")).toThrow();
    const id = NEWS_ARTICLES[0]!.id;
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO news_species (article_id, position, species_id) VALUES (?, 99, 'missing-species')",
        )
        .run(id),
    ).toThrow();
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO news_sources (article_id, position, url, name, name_ka) VALUES (?, 99, 'https://example.org', 'Both', 'ორივე')",
        )
        .run(id),
    ).toThrow();
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO news_sections (article_id, locale, position, heading, blocks) VALUES (?, 'ka', 99, 'x', '{}')",
        )
        .run(id),
    ).toThrow();
  });
});
