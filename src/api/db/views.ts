import type { ContentViewKind } from "@/lib/contentViewInput";

import type { ApiDatabase } from "./database";

export type ContentView = {
  day: string;
  id: string;
  kind: ContentViewKind;
  visitor: string;
};

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
