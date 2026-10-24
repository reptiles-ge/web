import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { fetchAdminRatings } from "./ratings";
import { SessionExpiredError } from "./species";

const URL = "https://api.reptiles.ge/v1/admin/ratings";

describe("fetchAdminRatings", () => {
  it("loads a page with credentials, search and rating filter", async () => {
    let request: Request | undefined;
    const page = {
      data: [],
      limit: 20,
      page: 3,
      pageCount: 1,
      summary: { average: null, byRating: {}, count: 0 },
      total: 0,
    };
    server.use(
      http.get(URL, (info) => {
        request = info.request;
        return HttpResponse.json(page);
      }),
    );
    expect(
      await fetchAdminRatings({ limit: 20, page: 3, q: "photo", rating: 2 }),
    ).toEqual(page);
    expect(request?.credentials).toBe("include");
    expect(new globalThis.URL(request?.url ?? "").search).toBe(
      "?limit=20&page=3&q=photo&rating=2",
    );
  });

  it("sends only the page when no filter is set", async () => {
    let url = "";
    server.use(
      http.get(URL, ({ request }) => {
        url = request.url;
        return HttpResponse.json({});
      }),
    );
    await fetchAdminRatings({ limit: 50, page: 1, q: "", rating: undefined });
    expect(url).toBe(`${URL}?limit=50&page=1`);
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    await expect(
      fetchAdminRatings({ limit: 50, page: 1 }),
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("fails loudly on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminRatings({ limit: 50, page: 1 })).rejects.toThrow(
      "Ratings list failed: 500",
    );
  });
});
