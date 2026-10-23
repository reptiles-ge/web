import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  useAtlasCounts,
  useAtlasPage,
} from "@/components/species-atlas/useAtlasResults";
import { type AtlasFacets, defaultAtlasFilters } from "@/data/atlasFilters";
import { type AtlasPage } from "@/lib/atlasList";
import { type AtlasQuery, defaultAtlasQuery } from "@/lib/atlasQuery";

const facets = { group: { all: 2, snake: 1 } } as unknown as AtlasFacets;

const initial: AtlasPage = {
  facets,
  items: [
    {
      commonName: "გიურზა",
      id: "macrovipera-lebetina",
      image: "https://cdn.reptiles.ge/giurza.jpg",
      location: "",
      regionIds: [],
      scientificName: "Macrovipera lebetinus",
    },
  ],
  page: 1,
  total: 2,
};

const snakes: AtlasQuery = {
  ...defaultAtlasQuery,
  filters: { ...defaultAtlasFilters, group: "snake" },
};

function respondWith(body: unknown, ok = true) {
  const fetchMock = vi.fn(async () => ({
    json: async () => body,
    ok,
    status: ok ? 200 : 500,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function flush() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(250);
  });
}

describe("useAtlasPage", () => {
  it("serves the server page without a request", () => {
    const fetchMock = respondWith(initial);
    const { result } = renderHook(() =>
      useAtlasPage("ka", defaultAtlasQuery, initial),
    );
    expect(result.current).toMatchObject({ loading: false, page: initial });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the last page while the next one loads, then caches it", async () => {
    const next = { ...initial, page: 1, total: 1 };
    const fetchMock = respondWith(next);
    const { rerender, result } = renderHook(
      ({ query }) => useAtlasPage("en", query, initial),
      { initialProps: { query: defaultAtlasQuery } },
    );
    rerender({ query: snakes });
    expect(result.current).toMatchObject({ loading: true, page: initial });
    await flush();
    expect(fetchMock).toHaveBeenCalledWith("/api/atlas/en?group=snake", {
      signal: expect.any(AbortSignal),
    });
    expect(result.current).toMatchObject({ loading: false, page: next });
    rerender({ query: defaultAtlasQuery });
    rerender({ query: snakes });
    await flush();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("reports a failed request and retries it", async () => {
    const fetchMock = respondWith({}, false);
    const { result } = renderHook(() => useAtlasPage("ka", snakes, initial));
    await flush();
    expect(result.current).toMatchObject({ failed: true, loading: false });
    await flush();
    expect(fetchMock).toHaveBeenCalledOnce();
    respondWith(initial);
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
    await flush();
    expect(result.current).toMatchObject({ failed: false, loading: false });
  });
});

describe("useAtlasCounts", () => {
  const current = { facets, filters: defaultAtlasFilters, total: 2 };

  it("uses the current counts when the draft has not changed or is closed", () => {
    const fetchMock = respondWith({});
    const { rerender, result } = renderHook(
      ({ enabled, filters }) => useAtlasCounts("ka", filters, current, enabled),
      { initialProps: { enabled: true, filters: defaultAtlasFilters } },
    );
    expect(result.current).toBe(current);
    rerender({ enabled: false, filters: snakes.filters });
    expect(result.current).toBe(current);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks only for the counts of a changed draft", async () => {
    const counts = { facets, total: 1 };
    const fetchMock = respondWith(counts);
    const { result } = renderHook(() =>
      useAtlasCounts("ka", snakes.filters, current, true),
    );
    await flush();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/atlas/ka?group=snake&counts=1",
      { signal: expect.any(AbortSignal) },
    );
    expect(result.current).toEqual(counts);
  });
});
