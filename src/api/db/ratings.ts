import type { ApiDatabase } from "./database";

export type AdminRatingsFilter = {
  cursor: number | undefined;
  limit: number;
  rating: number | undefined;
};

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

export async function listRatings(db: ApiDatabase, filter: AdminRatingsFilter) {
  const { results } = await db
    .prepare(
      "SELECT id, rating, path, locale, feedback, country, created_at FROM site_ratings WHERE rating BETWEEN ? AND ? AND id < ? ORDER BY id DESC LIMIT ?",
    )
    .bind(
      filter.rating ?? 1,
      filter.rating ?? 5,
      filter.cursor ?? Number.MAX_SAFE_INTEGER,
      filter.limit,
    )
    .all<{
      country: null | string;
      created_at: string;
      feedback: null | string;
      id: number;
      locale: string;
      path: string;
      rating: number;
    }>();
  return results.map(({ created_at, ...row }) => ({
    ...row,
    createdAt: created_at,
  }));
}

export async function ratingCounts(db: ApiDatabase) {
  const { results } = await db
    .prepare(
      "SELECT rating, COUNT(*) AS count FROM site_ratings GROUP BY rating",
    )
    .all<{ count: number; rating: number }>();
  return results;
}

export async function ratingCountsSince(db: ApiDatabase, since: string) {
  const { results } = await db
    .prepare(
      "SELECT rating, COUNT(*) AS count FROM site_ratings WHERE created_at >= ? GROUP BY rating",
    )
    .bind(since)
    .all<{ count: number; rating: number }>();
  return results;
}
