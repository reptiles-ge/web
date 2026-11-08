import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  fetchPhotoCandidates,
  findINaturalistTaxon,
  maybeInGallery,
  type PhotoCandidate,
  rankCandidates,
} from "./photoCandidates";

const OBSERVATIONS = "https://api.inaturalist.org/v1/observations";
const TAXA = "https://api.inaturalist.org/v1/taxa";

function candidate(overrides: Partial<PhotoCandidate>): PhotoCandidate {
  return {
    faves: 0,
    georgia: false,
    key: "1-1",
    licence: "cc-by",
    lookup: {} as PhotoCandidate["lookup"],
    observationUrl: "",
    observedOn: "2025-05-01",
    observer: "ana",
    observerName: "",
    place: "",
    previewUrl: "",
    small: false,
    ...overrides,
  };
}

function observation(id: number, overrides: Record<string, unknown> = {}) {
  return {
    faves_count: 0,
    geojson: { coordinates: [41.6, 41.6] },
    id,
    observed_on: "2025-05-01",
    photos: [photo(id * 10)],
    place_guess: "Batumi, Adjara, Georgia",
    place_ids: [8857],
    user: { login: `user${id}`, name: `User ${id}` },
    ...overrides,
  };
}

function photo(id: number, licence = "cc-by", width = 2048, height = 1365) {
  return {
    id,
    license_code: licence,
    original_dimensions: { height, width },
    url: `https://inaturalist-open-data.s3.amazonaws.com/photos/${id}/square.jpg`,
  };
}

describe("findINaturalistTaxon", () => {
  it("matches the species by its name or by a synonym", async () => {
    let query = "";
    server.use(
      http.get(TAXA, ({ request }) => {
        query = new URL(request.url).search;
        return HttpResponse.json({
          results: [
            {
              id: 1,
              name: "Chroicocephalus genei × brunnicephalus",
              rank: "hybrid",
            },
            {
              id: 144501,
              matched_term: "Larus genei",
              name: "Chroicocephalus genei",
              rank: "species",
            },
          ],
        });
      }),
    );
    await expect(findINaturalistTaxon("Larus genei")).resolves.toMatchObject({
      id: 144501,
    });
    expect(query).toContain("q=Larus+genei");
    await expect(
      findINaturalistTaxon("Chroicocephalus genei"),
    ).resolves.toMatchObject({ id: 144501 });
    await expect(findINaturalistTaxon("Bufo viridis")).resolves.toBeNull();
  });

  it("explains a rate limit and an unreachable API", async () => {
    server.use(http.get(TAXA, () => new HttpResponse(null, { status: 429 })));
    await expect(findINaturalistTaxon("Bufo viridis")).rejects.toThrow(
      "iNaturalist is limiting requests. Try again in a minute.",
    );
    server.use(http.get(TAXA, () => new HttpResponse(null, { status: 500 })));
    await expect(findINaturalistTaxon("Bufo viridis")).rejects.toThrow(
      "Could not reach iNaturalist",
    );
    server.use(http.get(TAXA, () => HttpResponse.error()));
    await expect(findINaturalistTaxon("Bufo viridis")).rejects.toThrow(
      "Could not reach iNaturalist",
    );
  });
});

describe("fetchPhotoCandidates", () => {
  it("asks for research-grade Georgian photos with the licence and keeps only matching photos", async () => {
    let params = new URLSearchParams();
    server.use(
      http.get(OBSERVATIONS, ({ request }) => {
        params = new URL(request.url).searchParams;
        return HttpResponse.json({
          results: [
            observation(1, {
              faves_count: 4,
              photos: [
                photo(10),
                photo(11, "cc-by-nc"),
                photo(12, null as never),
              ],
            }),
            observation(2, {
              geojson: undefined,
              obscured: true,
              photos: [photo(20, "cc-by", 800, 600)],
            }),
            observation(3, { photos: [{ ...photo(30), url: null }] }),
            observation(4, { user: { login: "" } }),
          ],
          total_results: 31,
        });
      }),
    );
    const page = await fetchPhotoCandidates({
      licence: "open",
      page: 2,
      scope: "georgia",
      taxonId: 7,
    });
    expect(Object.fromEntries(params)).toStrictEqual({
      order: "desc",
      order_by: "votes",
      page: "2",
      per_page: "30",
      photo_license: "cc0,cc-by,cc-by-sa",
      photos: "true",
      place_id: "8857",
      quality_grade: "research",
      taxon_id: "7",
    });
    expect(page.total).toBe(31);
    expect(page.candidates.map((item) => item.key)).toStrictEqual([
      "1-10",
      "2-20",
    ]);
    expect(page.candidates[0]).toMatchObject({
      faves: 4,
      georgia: true,
      licence: "cc-by",
      observationUrl: "https://www.inaturalist.org/observations/1",
      observer: "user1",
      observerName: "User 1",
      place: "Batumi, Adjara, Georgia",
      previewUrl:
        "https://inaturalist-open-data.s3.amazonaws.com/photos/10/medium.jpg",
      small: false,
      width: 2048,
    });
    expect(page.candidates[0]!.lookup.photoUrl).toBe(
      "https://inaturalist-open-data.s3.amazonaws.com/photos/10/original.jpg",
    );
    expect(page.candidates[1]).toMatchObject({ small: true });
    expect(page.candidates[1]!.lookup.metadata).toMatchObject({
      georgiaField: false,
      lat: "",
    });
  });

  it("looks outside Georgia and lets any licence through", async () => {
    let params = new URLSearchParams();
    server.use(
      http.get(OBSERVATIONS, ({ request }) => {
        params = new URL(request.url).searchParams;
        return HttpResponse.json({
          results: [
            observation(5, {
              photos: [photo(50, null as never)],
              place_ids: [6803],
              user: { login: "far" },
            }),
          ],
        });
      }),
    );
    const page = await fetchPhotoCandidates({
      licence: "any",
      page: 1,
      scope: "elsewhere",
      taxonId: 7,
    });
    expect(params.get("not_in_place")).toBe("8857");
    expect(params.has("place_id")).toBe(false);
    expect(params.has("photo_license")).toBe(false);
    expect(page).toMatchObject({
      candidates: [
        { georgia: false, licence: "all rights reserved", observerName: "" },
      ],
      total: 0,
    });
  });
});

describe("rankCandidates", () => {
  it("puts Georgia first, then favourites and size, at most two per observer before the rest", () => {
    const ranked = rankCandidates([
      candidate({ faves: 9, key: "far", observer: "x" }),
      candidate({ faves: 1, georgia: true, key: "ge-small", small: true }),
      candidate({
        faves: 1,
        georgia: true,
        height: 900,
        key: "ge-mid",
        width: 1800,
      }),
      candidate({ faves: 1, georgia: true, key: "ge-big", width: 4000 }),
      candidate({ faves: 5, georgia: true, key: "ge-top", observer: "ana" }),
    ]);
    expect(ranked.map((item) => item.key)).toStrictEqual([
      "ge-top",
      "ge-big",
      "far",
      "ge-mid",
      "ge-small",
    ]);
  });
});

describe("maybeInGallery", () => {
  it("matches a gallery photo with the same photographer and date", () => {
    const item = candidate({ observedOn: "2025-05-01", observer: "Ana" });
    expect(
      maybeInGallery(item, [
        { credit: { date: "2025-05-01", photographer: " ana " } },
      ]),
    ).toBe(true);
    expect(
      maybeInGallery(item, [
        { credit: { date: "2025-05-02", photographer: "ana" } },
        {},
      ]),
    ).toBe(false);
    expect(
      maybeInGallery(candidate({ observedOn: "" }), [
        { credit: { date: "", photographer: "ana" } },
      ]),
    ).toBe(false);
  });
});
