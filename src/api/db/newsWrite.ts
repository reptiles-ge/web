import type { NewsArticle } from "@/data/newsTypes";

import type { ApiDatabase } from "./database";

import { type NewsRecord, newsRecordRows } from "./newsRows";
import { NEWS_TABLES } from "./newsSchema";
import { renderBoundInserts } from "./sqlRender";

export type NewsRevision = {
  actor: string;
  source: "admin" | "ai" | "api" | "import";
  summary: string;
};

const RELINK_ARTICLE_MEDIA =
  "UPDATE news_media SET author_id = (SELECT author_id FROM author_aliases WHERE alias = news_media.credit_person) WHERE article_id = ?";

export async function createNewsArticle(
  db: ApiDatabase,
  article: NewsArticle,
  revision: NewsRevision,
) {
  const last = await db
    .prepare("SELECT MAX(position) AS position FROM news_articles")
    .first<{ position: null | number }>();
  const rows = newsRecordRows({
    article: { ...article, status: "draft" },
    position: (last?.position ?? -1) + 1,
  });
  await db.batch([
    ...NEWS_TABLES.flatMap((table) =>
      renderBoundInserts(table.name, table.columns, rows.get(table.name)!).map(
        ({ sql, values }) => db.prepare(sql).bind(...values),
      ),
    ),
    db
      .prepare(
        "INSERT INTO news_revisions (article_id, version, actor, source, summary) VALUES (?, 1, ?, ?, ?)",
      )
      .bind(article.id, revision.actor, revision.source, revision.summary),
    db.prepare(RELINK_ARTICLE_MEDIA).bind(article.id),
  ]);
  return 1;
}

export async function readNewsKnownIds(db: ApiDatabase) {
  const [species, authors] = await db.batch([
    db.prepare("SELECT id FROM species WHERE status = 'published'"),
    db.prepare("SELECT id FROM authors WHERE is_contributor = 1"),
  ]);
  const ids = (result: undefined | { results: unknown[] }) =>
    new Set((result?.results as Array<{ id: string }>).map((row) => row.id));
  return { authorIds: ids(authors), speciesIds: ids(species) };
}

export async function readNewsState(db: ApiDatabase, id: string) {
  return db
    .prepare("SELECT status, version FROM news_articles WHERE id = ?")
    .bind(id)
    .first<{ status: NewsArticle["status"]; version: number }>();
}

export async function setNewsStatus(
  db: ApiDatabase,
  id: string,
  status: NewsArticle["status"],
  expectedVersion: number,
  revision: NewsRevision,
) {
  await db.batch([
    db
      .prepare(
        "INSERT INTO news_revisions (article_id, version, actor, source, summary) VALUES (?, (SELECT version + 1 FROM news_articles WHERE id = ? AND version = ?), ?, ?, ?)",
      )
      .bind(
        id,
        id,
        expectedVersion,
        revision.actor,
        revision.source,
        revision.summary,
      ),
    db
      .prepare(
        "UPDATE news_articles SET status = ?, version = version + 1 WHERE id = ? AND version = ?",
      )
      .bind(status, id, expectedVersion),
  ]);
  return expectedVersion + 1;
}

const COPY_TABLES = NEWS_TABLES.filter(
  (table) => table.name === "news_texts" || table.name === "news_sections",
);

export async function writeNewsCopy(
  db: ApiDatabase,
  record: NewsRecord,
  expectedVersion: number,
  revision: NewsRevision,
  updatedAt: null | string,
) {
  const id = record.article.id;
  const rows = newsRecordRows(record);
  await db.batch([
    db
      .prepare(
        "INSERT INTO news_revisions (article_id, version, actor, source, summary) VALUES (?, (SELECT version + 1 FROM news_articles WHERE id = ? AND version = ?), ?, ?, ?)",
      )
      .bind(
        id,
        id,
        expectedVersion,
        revision.actor,
        revision.source,
        revision.summary,
      ),
    db
      .prepare(
        "UPDATE news_articles SET version = version + 1, updated_at = COALESCE(?, updated_at) WHERE id = ? AND version = ?",
      )
      .bind(updatedAt, id, expectedVersion),
    db.prepare("DELETE FROM news_sections WHERE article_id = ?").bind(id),
    db.prepare("DELETE FROM news_texts WHERE article_id = ?").bind(id),
    ...COPY_TABLES.flatMap((table) =>
      renderBoundInserts(table.name, table.columns, rows.get(table.name)!).map(
        ({ sql, values }) => db.prepare(sql).bind(...values),
      ),
    ),
  ]);
  return expectedVersion + 1;
}
