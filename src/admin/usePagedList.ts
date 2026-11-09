import { useEffect, useEffectEvent, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  type Page,
  PAGE_SIZE_OPTIONS,
} from "@/lib/pagination";

import type { ServerPaging } from "./AdminListView";
import type { PagedQuery } from "./pagination";

import { SessionExpiredError } from "./adminResponse";

const SEARCH_DELAY_MS = 300;

export type UrlFilters<F> = {
  [K in keyof F]?: ((value: string) => F[K] | undefined) | readonly F[K][];
};

type FilterValues = Parameters<ServerPaging["onChange"]>[0]["filters"];

type Request<F> = { attempt: number; query: PagedQuery<F> };

type Result<T, F, E> = {
  page?: E & Page<T>;
  request?: Request<F>;
  status: "error" | "ready";
};

export function serverPaging<F>(
  list: {
    query: PagedQuery<F>;
    setFilters: (filters: Partial<F>) => void;
    setPage: (page: number, limit: number) => void;
  },
  readFilters: (filters: FilterValues) => Partial<F> = () => ({}),
): ServerPaging {
  return {
    limit: list.query.limit,
    onChange: ({ filters, limit, page }) => {
      const next = readFilters(filters);
      const changed = (Object.keys(next) as Array<keyof F>).some(
        (key) => next[key] !== list.query[key],
      );
      if (changed) list.setFilters(next);
      else list.setPage(page, limit);
    },
    page: list.query.page,
  };
}

export function usePagedList<T, F, E = unknown>(
  load: (query: PagedQuery<F>) => Promise<E & Page<T>>,
  onSessionExpired: () => void,
  urlFilters: UrlFilters<F> = {},
) {
  const [request, setRequest] = useState<Request<F>>(() => ({
    attempt: 0,
    query: readUrlQuery(
      typeof window === "undefined" ? "" : window.location.search,
      urlFilters,
    ),
  }));
  const [result, setResult] = useState<Result<T, F, E>>({ status: "ready" });
  const [search, setSearch] = useState(() => request.query.q ?? "");
  const syncUrl = useEffectEvent((query: PagedQuery<F>) => {
    const next = writeUrlQuery(query, urlFilters);
    if (window.location.search === next) return;
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${next}${window.location.hash}`,
    );
  });

  useEffect(() => {
    syncUrl(request.query);
  }, [request.query]);
  const expire = useEffectEvent(onSessionExpired);
  const fetchPage = useEffectEvent(() => load(request.query));

  useEffect(() => {
    let active = true;
    fetchPage().then(
      (page) => {
        if (active) setResult({ page, request, status: "ready" });
      },
      (error: unknown) => {
        if (!active) return;
        if (error instanceof SessionExpiredError) expire();
        else setResult((last) => ({ ...last, request, status: "error" }));
      },
    );
    return () => {
      active = false;
    };
  }, [request]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = search.trim() || undefined;
      setRequest((last) =>
        last.query.q === q
          ? last
          : { ...last, query: { ...last.query, page: 1, q } },
      );
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);

  function changeQuery(change: (query: PagedQuery<F>) => PagedQuery<F>) {
    setRequest((last) => ({ ...last, query: change(last.query) }));
  }

  const status: "error" | "loading" | "ready" =
    result.request === request ? result.status : "loading";

  return {
    items: result.page?.data ?? [],
    lastPage: result.page,
    query: request.query,
    reload: () =>
      setRequest((last) => ({ ...last, attempt: last.attempt + 1 })),
    search,
    setFilters: (filters: Partial<F>) =>
      changeQuery((last) => ({ ...last, ...filters, page: 1 })),
    setPage: (page: number, limit: number) =>
      changeQuery((last) => ({
        ...last,
        limit,
        page: limit === last.limit ? page : 1,
      })),
    setSearch,
    status,
    total: result.page?.total ?? 0,
  };
}

function readUrlQuery<F>(
  search: string,
  filters: UrlFilters<F>,
): PagedQuery<F> {
  const params = new URLSearchParams(search);
  const limit = Number(params.get("limit"));
  const page = Number(params.get("page"));
  const q = params.get("q")?.trim() || undefined;
  const query = {
    limit: (PAGE_SIZE_OPTIONS as readonly number[]).includes(limit)
      ? limit
      : DEFAULT_PAGE_SIZE,
    page: Number.isInteger(page) && page > 1 ? page : 1,
    q,
  } as PagedQuery<F>;
  for (const key of Object.keys(filters) as Array<keyof F & string>) {
    const value = params.get(key);
    const filter = filters[key];
    const match =
      typeof filter === "function"
        ? value === null
          ? undefined
          : filter(value)
        : filter?.find((option) => String(option) === value);
    if (match !== undefined) query[key] = match as PagedQuery<F>[typeof key];
  }
  return query;
}

function writeUrlQuery<F>(query: PagedQuery<F>, filters: UrlFilters<F>) {
  const params = new URLSearchParams();
  for (const key of Object.keys(filters) as Array<keyof F & string>) {
    const value = query[key];
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  if (query.q) params.set("q", query.q);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.limit !== DEFAULT_PAGE_SIZE) {
    params.set("limit", String(query.limit));
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}
