import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpecies,
  fetchAdminSpeciesRecord,
  fetchAllAdminSpecies,
  SessionExpiredError,
} from "./species";

const URL = "https://api.reptiles.ge/v1/admin/species";

describe("fetchAdminSpecies", () => {
  it("loads one page with its filters and credentials", async () => {
    let credentials: string | undefined;
    let search = "";
    const page = {
      data: [{ id: "bubo-bubo" }],
      limit: 20,
      page: 2,
      pageCount: 2,
      total: 21,
    };
    server.use(
      http.get(URL, ({ request }) => {
        credentials = request.credentials;
        search = new globalThis.URL(request.url).search;
        return HttpResponse.json(page);
      }),
    );
    expect(
      await fetchAdminSpecies({
        group: "bird",
        limit: 20,
        page: 2,
        q: "bubo",
        status: undefined,
      }),
    ).toEqual(page);
    expect(credentials).toBe("include");
    expect(search).toBe("?group=bird&limit=20&page=2&q=bubo");
  });

  it("loads every page for the full list", async () => {
    const pages: string[] = [];
    server.use(
      http.get(URL, ({ request }) => {
        const params = new globalThis.URL(request.url).searchParams;
        const page = Number(params.get("page"));
        pages.push(`${params.get("limit")}:${page}`);
        return HttpResponse.json({
          data: [{ id: `species-${page}` }],
          limit: 100,
          page,
          pageCount: 3,
          total: 201,
        });
      }),
    );
    expect(await fetchAllAdminSpecies()).toEqual([
      { id: "species-1" },
      { id: "species-2" },
      { id: "species-3" },
    ]);
    expect(pages.sort()).toEqual(["100:1", "100:2", "100:3"]);
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    await expect(
      fetchAdminSpecies({ limit: 50, page: 1 }),
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("fails loudly on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminSpecies({ limit: 50, page: 1 })).rejects.toThrow(
      "Species list failed: 500",
    );
  });
});

describe("species detail client", () => {
  it("reads the record and field records, and posts a clear, with credentials", async () => {
    const seen: string[] = [];
    server.use(
      http.all(`${URL}/*`, ({ request }) => {
        seen.push(
          `${request.method} ${new globalThis.URL(request.url).pathname} ${request.credentials}`,
        );
        return HttpResponse.json({
          data: request.url.endsWith("/field-records")
            ? [{ lat: 41.7, lng: 44.8, locality: "Tbilisi" }]
            : { record: { status: "published" }, version: 3 },
        });
      }),
    );
    expect(await fetchAdminSpeciesRecord("bubo-bubo")).toEqual({
      record: { status: "published" },
      version: 3,
    });
    expect(await fetchAdminFieldRecords("bubo-bubo")).toEqual([
      { lat: 41.7, lng: 44.8, locality: "Tbilisi" },
    ]);
    await clearSpeciesCache("bubo-bubo");
    expect(seen).toEqual([
      "GET /v1/admin/species/bubo-bubo include",
      "GET /v1/admin/species/bubo-bubo/field-records include",
      "POST /v1/admin/species/bubo-bubo/revalidate include",
    ]);
  });

  it("returns null for an unknown species and reports other failures", async () => {
    server.use(
      http.get(`${URL}/*`, () => new HttpResponse(null, { status: 404 })),
    );
    expect(await fetchAdminSpeciesRecord("nope")).toBeNull();
    expect(await fetchAdminFieldRecords("nope")).toBeNull();
    server.use(
      http.get(`${URL}/*`, () => new HttpResponse(null, { status: 401 })),
    );
    await expect(fetchAdminSpeciesRecord("bubo-bubo")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    server.use(
      http.post(`${URL}/*`, () => new HttpResponse(null, { status: 502 })),
    );
    await expect(clearSpeciesCache("bubo-bubo")).rejects.toThrow(
      "Species cache clear failed: 502",
    );
  });
});
