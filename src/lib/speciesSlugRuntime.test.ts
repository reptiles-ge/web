import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { createApiClient } from "@/lib/apiClient";
import {
  getSpeciesSlugMaps,
  liveSpeciesAlternates,
  liveSpeciesPageUrl,
  liveSpeciesPath,
  liveSpeciesPublicSlug,
  readFreshSpeciesSlugMaps,
  resolveLiveSpeciesIdInHub,
  speciesSlugMapsFromCatalog,
} from "@/lib/speciesSlugRuntime";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";
import { reptilesApi } from "../../tests/msw/reptilesApi";
import { recordRequests, server } from "../../tests/msw/server";

vi.mock("@/i18n/navigation", async () => {
  const { pathnames } = await import("@/i18n/pathnames");
  return {
    getPathname: ({
      href,
      locale,
    }: {
      href: string | { params?: Record<string, string>; pathname: string };
      locale: string;
    }) => {
      const key = typeof href === "string" ? href : href.pathname;
      const entry = pathnames[key as keyof typeof pathnames];
      const pattern =
        typeof entry === "string" ? entry : entry[locale as keyof typeof entry];
      const path =
        typeof href === "string"
          ? pattern
          : pattern.replace(
              /\[(\w+)\]/g,
              (_match, name: string) => href.params?.[name] ?? name,
            );
      return locale === "ka" ? path : `/${locale}${path}`;
    },
  };
});

const NEW_SPECIES = {
  ...speciesCatalogFixture("ka").find(
    (item) => item.id === "macrovipera-lebetina",
  )!,
  group: "bird" as const,
  id: "new-bird",
  slug: "akhali-chiti",
  slugAliases: ["dzveli-chiti"],
};

describe("species slug maps from the live catalog", () => {
  it("resolves a species the build-time table does not know", () => {
    const maps = speciesSlugMapsFromCatalog([NEW_SPECIES]);
    expect(maps.hubById["new-bird"]).toBe("birds");
    expect(maps.idByAnySlug["akhali-chiti"]).toBe("new-bird");
    expect(maps.idByAnySlug["dzveli-chiti"]).toBe("new-bird");
    expect(liveSpeciesPublicSlug(maps, "new-bird", "ka")).toBe("akhali-chiti");
    expect(liveSpeciesPublicSlug(maps, "new-bird", "en")).toBe("new-bird");
    expect(liveSpeciesPath(maps, "new-bird", "ka")).toBe(
      "/prinvelebi/akhali-chiti",
    );
    expect(liveSpeciesPath(maps, "new-bird", "en")).toBe("/en/birds/new-bird");
    expect(liveSpeciesPageUrl(maps, "ru", "new-bird")).toBe(
      "https://reptiles.ge/ru/birds/new-bird",
    );
    expect(liveSpeciesAlternates(maps, "en", "new-bird")).toEqual({
      canonical: "https://reptiles.ge/en/birds/new-bird",
      languages: {
        en: "https://reptiles.ge/en/birds/new-bird",
        ka: "https://reptiles.ge/prinvelebi/akhali-chiti",
        ru: "https://reptiles.ge/ru/birds/new-bird",
        tr: "https://reptiles.ge/tr/birds/new-bird",
        "x-default": "https://reptiles.ge/prinvelebi/akhali-chiti",
      },
    });
  });

  it("falls back to the id and the build-time hub for an unknown species", () => {
    const maps = speciesSlugMapsFromCatalog([]);
    expect(liveSpeciesPublicSlug(maps, "macrovipera-lebetina", "ka")).toBe(
      "macrovipera-lebetina",
    );
    expect(liveSpeciesPath(maps, "macrovipera-lebetina", "ka")).toBe(
      "/gvelebi/macrovipera-lebetina",
    );
  });

  it("loads the maps from the Georgian card catalog", async () => {
    server.use(reptilesApi);
    const requests = recordRequests();
    const first = await getSpeciesSlugMaps();
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/catalog?view=card",
    ]);
    expect(first.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(await resolveLiveSpeciesIdInHub("snakes", "giurza")).toBe(
      "macrovipera-lebetina",
    );
    expect(
      await resolveLiveSpeciesIdInHub("snakes", "macrovipera-lebetina"),
    ).toBe("macrovipera-lebetina");
    expect(
      await resolveLiveSpeciesIdInHub("lizards", "giurza"),
    ).toBeUndefined();
    expect(await resolveLiveSpeciesIdInHub("snakes", "saxeoebebi")).toBe(
      undefined,
    );
  });

  it("reads a fresh catalog with the bypass options for cache refreshes", async () => {
    let bypass: null | string = null;
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", ({ request }) => {
        bypass = request.headers.get("X-Cache-Bypass");
        return HttpResponse.json({ data: [NEW_SPECIES] });
      }),
    );
    const maps = await readFreshSpeciesSlugMaps(createApiClient(), {
      headers: { "X-Cache-Bypass": "fresh-secret" },
      init: { cache: "no-store" },
    });
    expect(bypass).toBe("fresh-secret");
    expect(maps?.kaSlugById["new-bird"]).toBe("akhali-chiti");
  });

  it("returns nothing when the fresh catalog cannot be read", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", () =>
        HttpResponse.json({ error: { code: "unavailable" } }, { status: 503 }),
      ),
    );
    expect(
      await readFreshSpeciesSlugMaps(createApiClient(), {
        headers: { "X-Cache-Bypass": "fresh-secret" },
        init: { cache: "no-store" },
      }),
    ).toBeUndefined();
  });
});
