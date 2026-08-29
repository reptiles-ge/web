export const ATLAS_PAGE_SIZE = 12;

export function initialAtlasVisibleCount(
  total: number,
  pageSize = ATLAS_PAGE_SIZE,
) {
  if (total <= 0) return 0;
  return Math.min(pageSize, total);
}

export function nextAtlasVisibleCount(
  loaded: number,
  total: number,
  pageSize = ATLAS_PAGE_SIZE,
) {
  if (total <= 0) return 0;
  if (loaded >= total) return total;
  return Math.min(loaded + pageSize, total);
}
