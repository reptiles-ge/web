import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { server } from "../../tests/msw/server";
import { refreshSpeciesApiCache } from "./speciesApiRefresh";

function recordBypass(body: (url: URL) => object = () => ({ data: [] })) {
  const seen: Array<{
    bypass: null | string;
    locale: null | string;
    url: string;
  }> = [];
  server.use(
    http.get("https://api.reptiles.ge/*", ({ request }) => {
      seen.push({
        bypass: request.headers.get("X-Cache-Bypass"),
        locale: request.headers.get("X-Locale"),
        url: request.url,
      });
      return HttpResponse.json(body(new URL(request.url)));
    }),
  );
  return seen;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("refreshSpeciesApiCache", () => {
  it("leaves the catalog to the API purge instead of refetching it", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["species"]);
    expect(seen).toEqual([]);
  });

  it("refreshes the profile in each locale and the field records of a species tag", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["species:macrovipera-lebetina"]);
    expect(
      seen.map(({ locale, url }) => `${locale} ${new URL(url).pathname}`),
    ).toEqual([
      "ka /v1/species/giurza",
      "en /v1/species/macrovipera-lebetina",
      "ru /v1/species/macrovipera-lebetina",
      "tr /v1/species/macrovipera-lebetina",
      "en /v1/species/macrovipera-lebetina/field-records",
    ]);
  });

  it("refreshes the news list, the home page list and an article in every locale", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["news", "news:lagodekhi-iucn-mwvane-sia"]);
    expect(new Set(seen.map(({ bypass }) => bypass))).toEqual(
      new Set(["fresh-secret"]),
    );
    expect(
      seen.map(({ locale, url }) => {
        const { pathname, search } = new URL(url);
        return `${locale} ${pathname}${search}`;
      }),
    ).toEqual([
      "ka /v1/news?limit=5&page=1",
      "ka /v1/news?limit=24&page=1",
      "ka /v1/news?limit=100&page=1",
      "en /v1/news?limit=5&page=1",
      "en /v1/news?limit=24&page=1",
      "en /v1/news?limit=100&page=1",
      "ru /v1/news?limit=5&page=1",
      "ru /v1/news?limit=24&page=1",
      "ru /v1/news?limit=100&page=1",
      "tr /v1/news?limit=5&page=1",
      "tr /v1/news?limit=24&page=1",
      "tr /v1/news?limit=100&page=1",
      "ka /v1/news/lagodekhi-iucn-mwvane-sia",
      "en /v1/news/lagodekhi-iucn-mwvane-sia",
      "ru /v1/news/lagodekhi-iucn-mwvane-sia",
      "tr /v1/news/lagodekhi-iucn-mwvane-sia",
    ]);
  });

  it("follows every page of the index and full news lists", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass((url) => ({
      data: [],
      pageCount: Math.ceil(53 / Number(url.searchParams.get("limit"))),
    }));
    await refreshSpeciesApiCache(["news"]);
    expect(
      seen
        .filter(({ locale }) => locale === "ka")
        .map(({ url }) => new URL(url).search),
    ).toEqual([
      "?limit=5&page=1",
      "?limit=24&page=1",
      "?limit=24&page=2",
      "?limit=24&page=3",
      "?limit=100&page=1",
    ]);
  });

  it("refreshes the contributor list and one contributor in every locale", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["authors", "author:sandro-khakhva"]);
    expect(new Set(seen.map(({ bypass }) => bypass))).toEqual(
      new Set(["fresh-secret"]),
    );
    expect(
      seen.map(({ locale, url }) => `${locale} ${new URL(url).pathname}`),
    ).toEqual([
      "ka /v1/contributors",
      "en /v1/contributors",
      "ru /v1/contributors",
      "tr /v1/contributors",
      "ka /v1/contributors/sandro-khakhva",
      "en /v1/contributors/sandro-khakhva",
      "ru /v1/contributors/sandro-khakhva",
      "tr /v1/contributors/sandro-khakhva",
    ]);
  });

  it("does nothing without a secret", async () => {
    const seen = recordBypass();
    await refreshSpeciesApiCache(["species", "species:macrovipera-lebetina"]);
    expect(seen).toEqual([]);
  });

  it("keeps going when one request fails", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    let calls = 0;
    server.use(
      http.get("https://api.reptiles.ge/*", () => {
        calls += 1;
        return calls === 1 ? HttpResponse.error() : HttpResponse.json({});
      }),
    );
    await refreshSpeciesApiCache(["species:macrovipera-lebetina"]);
    expect(calls).toBe(5);
    expect(error).toHaveBeenCalledWith(
      "Species API cache refresh failed",
      expect.any(Error),
    );
  });
});
