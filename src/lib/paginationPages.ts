export function paginationPages(current: number, pageCount: number) {
  const pages: Array<null | number> = [];
  for (let page = 1; page <= pageCount; page += 1) {
    const edge = page === 1 || page === pageCount;
    const near = Math.abs(page - current) <= 1;
    if (edge || near) {
      pages.push(page);
    } else if (pages.at(-1) !== null) {
      pages.push(null);
    }
  }
  return pages;
}
