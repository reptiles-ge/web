import { delay, http } from "msw";
import { describe, expect, it } from "vitest";

import { prefetchSpeciesPage } from "@/lib/createSpeciesRoute";
import { getSpeciesProfileBySlug } from "@/lib/speciesProfileApi";
import { getSpeciesRangeMapBySlug } from "@/lib/speciesRangeMapApi";

import { reptilesApi } from "../../tests/msw/reptilesApi";
import { recordRequests, server } from "../../tests/msw/server";

const API = "https://api.reptiles.ge";

function holdCatalog() {
  server.use(
    http.get(`${API}/v1/catalog`, async () => {
      await delay("infinite");
    }),
    reptilesApi,
  );
}

async function settled() {
  await new Promise((resolve) => setTimeout(resolve, 50));
}

describe("species page prefetch", () => {
  it("asks for the Georgian profile and range map without waiting for the catalog", async () => {
    holdCatalog();
    const requests = recordRequests();
    prefetchSpeciesPage("snakes", "giurza", "ka");
    await settled();
    requests.stop();
    expect(requests.urls).toEqual(
      expect.arrayContaining([
        `${API}/v1/species/giurza`,
        `${API}/v1/species/giurza/range-map`,
        `${API}/v1/news?limit=100&page=1&species=macrovipera-lebetina`,
        `${API}/v1/species/macrovipera-lebetina/field-records`,
      ]),
    );
  });

  it("asks for both profiles of a translated page by id and Georgian slug", async () => {
    holdCatalog();
    const requests = recordRequests();
    prefetchSpeciesPage("snakes", "macrovipera-lebetina", "en");
    await settled();
    requests.stop();
    const profiles = requests.urls.filter((url) =>
      /\/v1\/species\/[^/]+$/.test(url),
    );
    expect(profiles.sort()).toEqual([
      `${API}/v1/species/giurza`,
      `${API}/v1/species/macrovipera-lebetina`,
    ]);
    expect(requests.urls).toContain(
      `${API}/v1/species/macrovipera-lebetina/range-map`,
    );
  });

  it("starts nothing for a slug of another hub or an unknown slug", async () => {
    holdCatalog();
    const requests = recordRequests();
    prefetchSpeciesPage("lizards", "giurza", "ka");
    prefetchSpeciesPage("snakes", "no-such-species", "en");
    await settled();
    requests.stop();
    expect(requests.urls).toEqual([]);
  });
});

describe("slug loaders", () => {
  it("load a profile and range map by slug without the catalog", async () => {
    holdCatalog();
    const requests = recordRequests();
    const [profile, map] = await Promise.all([
      getSpeciesProfileBySlug("giurza", "ka", "macrovipera-lebetina"),
      getSpeciesRangeMapBySlug("giurza", "ka", "macrovipera-lebetina"),
    ]);
    requests.stop();
    expect(profile?.species.id).toBe("macrovipera-lebetina");
    expect(map).not.toBeUndefined();
    expect(requests.urls.some((url) => url.includes("/v1/catalog"))).toBe(
      false,
    );
  });

  it("answers null for a stale slug", async () => {
    server.use(reptilesApi);
    expect(
      await getSpeciesProfileBySlug(
        "no-such-slug",
        "ka",
        "macrovipera-lebetina",
      ),
    ).toBeNull();
  });
});
