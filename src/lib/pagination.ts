export const DEFAULT_PAGE_SIZE = 50;

export const MAX_PAGE_SIZE = 100;

export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

export type Page<T> = PageParams & {
  data: T[];
  pageCount: number;
  total: number;
};

export type PageParams = { limit: number; page: number };

export function pageOffset({ limit, page }: PageParams) {
  return (page - 1) * limit;
}

export function toPage<T>(
  data: T[],
  total: number,
  { limit, page }: PageParams,
): Page<T> {
  return {
    data,
    limit,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
    total,
  };
}
