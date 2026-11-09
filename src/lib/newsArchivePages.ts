export const NEWS_PAGE_SIZE = 24;

export function newsPageCount(total: number) {
  return Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
}

export function parseNewsArchivePage(value: string) {
  if (!/^[1-9]\d{0,5}$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
}
