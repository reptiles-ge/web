import { useEffect, useEffectEvent, useState } from "react";

import { DEFAULT_PAGE_SIZE, type Page } from "@/lib/pagination";

import type { ServerPaging } from "./AdminListView";
import type { PagedQuery } from "./pagination";

import { SessionExpiredError } from "./adminResponse";

const SEARCH_DELAY_MS = 300;

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
) {
  const [request, setRequest] = useState<Request<F>>(() => ({
    attempt: 0,
    query: { limit: DEFAULT_PAGE_SIZE, page: 1 } as PagedQuery<F>,
  }));
  const [result, setResult] = useState<Result<T, F, E>>({ status: "ready" });
  const [search, setSearch] = useState("");
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
