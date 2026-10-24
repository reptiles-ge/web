import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpecies,
  fetchAdminSpeciesRecord,
  SessionExpiredError,
} from "./species";

const URL = "https://api.reptiles.ge/v1/admin/species";

describe("fetchAdminSpecies", () => {
  it("loads the list with credentials", async () => {
    let credentials: string | undefined;
    server.use(
      http.get(URL, ({ request }) => {
        credentials = request.credentials;
        return HttpResponse.json({ data: [{ id: "bubo-bubo" }], total: 1 });
      }),
    );
    expect(await fetchAdminSpecies()).toEqual([{ id: "bubo-bubo" }]);
    expect(credentials).toBe("include");
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    await expect(fetchAdminSpecies()).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
  });

  it("fails loudly on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminSpecies()).rejects.toThrow(
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
