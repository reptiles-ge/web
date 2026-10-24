export function summariseRatings(
  counts: Array<{ count: number; rating: number }>,
) {
  const byRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let count = 0;
  let total = 0;
  for (const row of counts) {
    byRating[row.rating] = row.count;
    count += row.count;
    total += row.rating * row.count;
  }
  return {
    average: count ? Math.round((total / count) * 100) / 100 : null,
    byRating,
    count,
  };
}
