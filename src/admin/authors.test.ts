import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  clearAuthorCache,
  clearAuthorsCache,
  fetchAdminAuthorPhotos,
  fetchAdminAuthorRecord,
  fetchAdminAuthors,
} from "./authors";
import { SessionExpiredError } from "./species";

const URL = "https://api.reptiles.ge/v1/admin/authors";

describe("admin authors client", () => {
  it("loads the list and posts both clears with credentials", async () => {
    const seen: Array<{ credentials: string; method: string; path: string }> =
      [];
    server.use(
      http.all(`${URL}*`, ({ request }) => {
        seen.push({
          credentials: request.credentials,
          method: request.method,
          path: new globalThis.URL(request.url).pathname,
        });
        return HttpResponse.json({ data: [{ id: "sandro-khakhva" }] });
      }),
    );
    expect(await fetchAdminAuthors()).toEqual([{ id: "sandro-khakhva" }]);
    await clearAuthorCache("sandro-khakhva");
    await clearAuthorsCache();
    expect(seen).toEqual([
      { credentials: "include", method: "GET", path: "/v1/admin/authors" },
      {
        credentials: "include",
        method: "POST",
        path: "/v1/admin/authors/sandro-khakhva/revalidate",
      },
      {
        credentials: "include",
        method: "POST",
        path: "/v1/admin/authors/revalidate",
      },
    ]);
  });

  it("reports an expired session and other failures", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 401 })));
    await expect(fetchAdminAuthors()).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    server.use(
      http.post(
        `${URL}/revalidate`,
        () => new HttpResponse(null, { status: 502 }),
      ),
    );
    await expect(clearAuthorsCache()).rejects.toThrow(
      "Authors cache clear failed: 502",
    );
  });
});

describe("admin author detail client", () => {
  it("reads the record and the credited photos with credentials", async () => {
    const seen: string[] = [];
    server.use(
      http.get(`${URL}/*`, ({ request }) => {
        seen.push(
          `${new globalThis.URL(request.url).pathname} ${request.credentials}`,
        );
        return HttpResponse.json({
          data: request.url.endsWith("/photos")
            ? [{ speciesId: "bubo-bubo" }]
            : { id: "sandro-khakhva" },
        });
      }),
    );
    expect(await fetchAdminAuthorRecord("sandro-khakhva")).toEqual({
      id: "sandro-khakhva",
    });
    expect(await fetchAdminAuthorPhotos("sandro-khakhva")).toEqual([
      { speciesId: "bubo-bubo" },
    ]);
    expect(seen).toEqual([
      "/v1/admin/authors/sandro-khakhva include",
      "/v1/admin/authors/sandro-khakhva/photos include",
    ]);
  });

  it("returns null for an unknown author and reports other failures", async () => {
    server.use(
      http.get(`${URL}/*`, () => new HttpResponse(null, { status: 404 })),
    );
    expect(await fetchAdminAuthorRecord("nobody")).toBeNull();
    expect(await fetchAdminAuthorPhotos("nobody")).toBeNull();
    server.use(
      http.get(`${URL}/*`, () => new HttpResponse(null, { status: 500 })),
    );
    await expect(fetchAdminAuthorRecord("sandro-khakhva")).rejects.toThrow(
      "Author record failed: 500",
    );
  });
});
