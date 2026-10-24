import { MAX_PAGE_SIZE, type Page, type PageParams } from "@/lib/pagination";

export type PagedQuery<F> = PageParams & Partial<F> & { q?: string };

type QueryParams<Q> = {
  [K in keyof Q]?: QueryValue<NonNullable<Q[K]>>;
};

type QueryValue<V> = V extends boolean | number ? `${V}` : V;

export async function fetchAllPages<T>(
  load: (page: PageParams) => Promise<Page<T>>,
) {
  const first = await load({ limit: MAX_PAGE_SIZE, page: 1 });
  const rest = await Promise.all(
    Array.from({ length: first.pageCount - 1 }, (_, index) =>
      load({ limit: MAX_PAGE_SIZE, page: index + 2 }),
    ),
  );
  return [first, ...rest].flatMap((page) => page.data);
}

export function toQueryParams<Q extends object>(query: Q) {
  return Object.fromEntries(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined || value === null || value === ""
        ? []
        : [[key, String(value)]],
    ),
  ) as QueryParams<Q>;
}
