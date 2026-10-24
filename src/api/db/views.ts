import type { ContentViewKind } from "@/lib/contentViewInput";

import { pageOffset, type PageParams, toPage } from "@/lib/pagination";

import type { ApiDatabase } from "./database";

import { containsPattern } from "./search";

export type AdminViewFilters = {
  kind?: ContentViewKind;
  q?: string;
  since?: string;
};

export type ContentView = {
  day: string;
  id: string;
  kind: ContentViewKind;
  visitor: string;
};

type AdminViewRow = {
  kind: ContentViewKind;
  last_day: string;
  name_en: null | string;
  name_ka: null | string;
  target_id: string;
  views: number;
};

const ADMIN_VIEW_FROM =
  "FROM (SELECT v.kind, v.target_id, SUM(v.views) AS views, MAX(v.day) AS last_day, COALESCE(sk.common_name, nk.title) AS name_ka, COALESCE(se.common_name, ne.title) AS name_en FROM content_views v LEFT JOIN species_texts sk ON v.kind = 'species' AND sk.species_id = v.target_id AND sk.locale = 'ka' LEFT JOIN species_texts se ON v.kind = 'species' AND se.species_id = v.target_id AND se.locale = 'en' LEFT JOIN news_texts nk ON v.kind = 'news' AND nk.article_id = v.target_id AND nk.locale = 'ka' LEFT JOIN news_texts ne ON v.kind = 'news' AND ne.article_id = v.target_id AND ne.locale = 'en' WHERE (?1 IS NULL OR v.day >= ?1) AND (?2 IS NULL OR v.kind = ?2) GROUP BY v.kind, v.target_id) t WHERE (?3 IS NULL OR t.target_id LIKE ?3 ESCAPE '\\' OR t.name_ka LIKE ?3 ESCAPE '\\' OR t.name_en LIKE ?3 ESCAPE '\\')";

const PUBLISHED_TARGET: Record<ContentViewKind, string> = {
  news: "SELECT 1 FROM news_articles WHERE id = ? AND status = 'published'",
  species: "SELECT 1 FROM species WHERE id = ? AND status = 'published'",
};

export async function forgetViewVisitorsBefore(db: ApiDatabase, day: string) {
  await db.batch([
    db.prepare("DELETE FROM content_view_visitors WHERE day < ?").bind(day),
    db.prepare("DELETE FROM content_view_salts WHERE day < ?").bind(day),
  ]);
}

export async function listAdminViews(
  db: ApiDatabase,
  filters: AdminViewFilters,
  page: PageParams,
) {
  const where = [
    filters.since ?? null,
    filters.kind ?? null,
    containsPattern(filters.q),
  ];
  const [rows, count] = await Promise.all([
    db
      .prepare(
        `SELECT t.kind, t.target_id, t.views, t.last_day, t.name_ka, t.name_en ${ADMIN_VIEW_FROM} ORDER BY t.views DESC, t.last_day DESC, t.kind, t.target_id LIMIT ?4 OFFSET ?5`,
      )
      .bind(...where, page.limit, pageOffset(page))
      .all<AdminViewRow>(),
    db
      .prepare(
        `SELECT COUNT(*) AS total, COALESCE(SUM(t.views), 0) AS views ${ADMIN_VIEW_FROM}`,
      )
      .bind(...where)
      .first<{ total: number; views: number }>(),
  ]);
  const data = rows.results.map((row) => ({
    id: row.target_id,
    kind: row.kind,
    lastDay: row.last_day,
    name: { en: row.name_en, ka: row.name_ka },
    views: row.views,
  }));
  return {
    ...toPage(data, count?.total ?? 0, page),
    views: count?.views ?? 0,
  };
}

export async function readViewSalt(
  db: ApiDatabase,
  day: string,
  candidate: string,
) {
  const [, selected] = await db.batch([
    db
      .prepare(
        "INSERT INTO content_view_salts (day, salt) VALUES (?, ?) ON CONFLICT (day) DO NOTHING",
      )
      .bind(day, candidate),
    db.prepare("SELECT salt FROM content_view_salts WHERE day = ?").bind(day),
  ]);
  const row = selected?.results[0] as undefined | { salt: string };
  return row?.salt ?? candidate;
}

export async function readViewTotal(
  db: ApiDatabase,
  kind: ContentViewKind,
  id: string,
) {
  const row = await db
    .prepare(
      "SELECT COALESCE(SUM(views), 0) AS views FROM content_views WHERE kind = ? AND target_id = ?",
    )
    .bind(kind, id)
    .first<{ views: number }>();
  return row?.views ?? 0;
}

export async function recordView(db: ApiDatabase, view: ContentView) {
  const { results } = await db
    .prepare(
      `INSERT OR IGNORE INTO content_view_visitors (day, kind, target_id, visitor) SELECT ?, ?, ?, ? WHERE EXISTS (${PUBLISHED_TARGET[view.kind]}) RETURNING visitor`,
    )
    .bind(view.day, view.kind, view.id, view.visitor, view.id)
    .all<{ visitor: string }>();
  if (results.length === 0) return;
  await db
    .prepare(
      "INSERT INTO content_views (kind, target_id, day, views) VALUES (?, ?, ?, 1) ON CONFLICT (kind, target_id, day) DO UPDATE SET views = views + 1",
    )
    .bind(view.kind, view.id, view.day)
    .run();
}
