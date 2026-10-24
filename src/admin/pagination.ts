import type { PageParams } from "@/lib/pagination";

export type PagedQuery<F> = PageParams & Partial<F> & { q?: string };

type QueryParams<Q> = {
  [K in keyof Q]?: QueryValue<NonNullable<Q[K]>>;
};

type QueryValue<V> = V extends boolean | number ? `${V}` : V;

export function toQueryParams<Q extends object>(query: Q) {
  return Object.fromEntries(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined || value === null || value === ""
        ? []
        : [[key, String(value)]],
    ),
  ) as QueryParams<Q>;
}
