import type { AppLocale } from "@/i18n/routing";

import { needsFeedback, normalizeFeedback } from "@/lib/ratingFeedback";

export type ApiDatabase = {
  prepare: (query: string) => ApiStatement;
};

export type NewRating = {
  country: null | string;
  feedback: null | string;
  locale: AppLocale;
  path: string;
  rating: number;
};

type ApiStatement = {
  all: <T>() => Promise<{ results: T[] }>;
  bind: (...values: unknown[]) => ApiStatement;
  first: <T>() => Promise<null | T>;
  run: () => Promise<unknown>;
};

const MAX_PATH_LENGTH = 300;

export async function insertRating(db: ApiDatabase, rating: NewRating) {
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

export function parseRating(
  body: unknown,
  locales: readonly AppLocale[],
): NewRating | null {
  if (!body || typeof body !== "object") return null;
  const { country, locale, path, rating } = body as Record<string, unknown>;
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof path !== "string" ||
    path.length > MAX_PATH_LENGTH ||
    !/^\/(?!\/)\S*$/.test(path) ||
    typeof locale !== "string" ||
    !(locales as readonly string[]).includes(locale)
  ) {
    return null;
  }
  const feedback = normalizeFeedback((body as { feedback?: unknown }).feedback);
  if (needsFeedback(rating) && !feedback) return null;
  return {
    country:
      typeof country === "string" && /^[A-Z]{2}$/.test(country)
        ? country
        : null,
    feedback,
    locale: locale as AppLocale,
    path,
    rating,
  };
}

export async function ratingSummary(db: ApiDatabase, since: string) {
  const { results } = await db
    .prepare(
      "SELECT rating, COUNT(*) AS count FROM site_ratings WHERE created_at >= ? GROUP BY rating",
    )
    .bind(since)
    .all<{ count: number; rating: number }>();
  const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  let count = 0;
  let total = 0;
  for (const row of results) {
    byRating[row.rating] = row.count;
    count += row.count;
    total += row.rating * row.count;
  }
  return {
    average: count ? Math.round((total / count) * 100) / 100 : null,
    byRating,
    count,
    since,
  };
}
