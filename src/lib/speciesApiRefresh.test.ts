import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { server } from "../../tests/msw/server";
import { refreshSpeciesApiCache } from "./speciesApiRefresh";

function recordBypass() {
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
      return HttpResponse.json({ data: [] });
    }),
  );
  return seen;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("refreshSpeciesApiCache", () => {
  it("refreshes every catalog view in every locale with the bypass secret", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["species"]);
    expect(seen).toHaveLength(16);
    expect(new Set(seen.map(({ bypass }) => bypass))).toEqual(
      new Set(["fresh-secret"]),
    );
    expect(
      seen
        .filter(({ locale }) => locale === "ka")
        .map(({ url }) => new URL(url).search),
    ).toEqual(["?view=card", "?view=full", "?view=photos", "?view=quiz"]);
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

  it("refreshes the news list and an article in every locale", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    const seen = recordBypass();
    await refreshSpeciesApiCache(["news", "news:lagodekhi-iucn-mwvane-sia"]);
    expect(new Set(seen.map(({ bypass }) => bypass))).toEqual(
      new Set(["fresh-secret"]),
    );
    expect(
      seen.map(({ locale, url }) => `${locale} ${new URL(url).pathname}`),
    ).toEqual([
      "ka /v1/news",
      "en /v1/news",
      "ru /v1/news",
      "tr /v1/news",
      "ka /v1/news/lagodekhi-iucn-mwvane-sia",
      "en /v1/news/lagodekhi-iucn-mwvane-sia",
      "ru /v1/news/lagodekhi-iucn-mwvane-sia",
      "tr /v1/news/lagodekhi-iucn-mwvane-sia",
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
    await refreshSpeciesApiCache(["species"]);
    expect(calls).toBe(16);
    expect(error).toHaveBeenCalledWith(
      "Species API cache refresh failed",
      expect.any(Error),
    );
  });
});
