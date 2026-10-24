import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  clearAuthorCache,
  clearAuthorsCache,
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
