import { type PageParams, toPage } from "@/lib/pagination";

import type { ApiDatabase } from "./database";

import { readPage } from "./paging";
import { containsPattern } from "./search";

export type StoredRating = {
  country: null | string;
  feedback: null | string;
  locale: string;
  path: string;
  rating: number;
};

export async function insertRating(db: ApiDatabase, rating: StoredRating) {
  await db
    .prepare(
      "INSERT INTO site_ratings (rating, path, locale, feedback, country) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      rating.rating,
      rating.path,
      rating.locale,
      rating.feedback,
      rating.country,
    )
    .run();
}

export async function listRatings(
  db: ApiDatabase,
  filters: { q?: string; rating?: number },
  page: PageParams,
) {
  const { rows, total } = await readPage<{
    country: null | string;
    created_at: string;
    feedback: null | string;
    id: number;
    locale: string;
    path: string;
    rating: number;
  }>(
    db,
    {
      from: "FROM site_ratings WHERE (?1 IS NULL OR rating = ?1) AND (?2 IS NULL OR feedback LIKE ?2 ESCAPE '\\' OR path LIKE ?2 ESCAPE '\\')",
      order: "id DESC",
      select: "id, rating, path, locale, feedback, country, created_at",
    },
    [filters.rating ?? null, containsPattern(filters.q)],
    page,
  );
  const data = rows.map(({ created_at, ...row }) => ({
    ...row,
    createdAt: created_at,
  }));
  return toPage(data, total, page);
}

export async function ratingCounts(db: ApiDatabase) {
  const { results } = await db
    .prepare(
      "SELECT rating, COUNT(*) AS count FROM site_ratings GROUP BY rating",
    )
    .all<{ count: number; rating: number }>();
  return results;
}
