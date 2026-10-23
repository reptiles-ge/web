const ATLAS_PAGE_SIZE = 24;

export function atlasPageCount(total: number, pageSize = ATLAS_PAGE_SIZE) {
  if (total <= 0) return 0;
  return Math.ceil(total / pageSize);
}

export function atlasPageRange(
  page: number,
  total: number,
  pageSize = ATLAS_PAGE_SIZE,
) {
  const pageCount = atlasPageCount(total, pageSize);
  if (pageCount === 0) return { first: 0, last: 0, page: 1 };
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), pageCount);
  const start = (current - 1) * pageSize;
  return {
    first: start + 1,
    last: Math.min(start + pageSize, total),
    page: current,
  };
}
