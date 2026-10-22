import type { ApiDatabase } from "./database";

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

export async function ratingCountsSince(db: ApiDatabase, since: string) {
  const { results } = await db
    .prepare(
      "SELECT rating, COUNT(*) AS count FROM site_ratings WHERE created_at >= ? GROUP BY rating",
    )
    .bind(since)
    .all<{ count: number; rating: number }>();
  return results;
}
