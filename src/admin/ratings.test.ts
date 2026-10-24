import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { fetchAdminRatings } from "./ratings";
import { SessionExpiredError } from "./species";

const URL = "https://api.reptiles.ge/v1/admin/ratings";

describe("fetchAdminRatings", () => {
  it("loads a page with credentials, cursor and rating filter", async () => {
    let request: Request | undefined;
    const page = {
      data: [],
      nextCursor: null,
      summary: { average: null, byRating: {}, count: 0 },
      total: 0,
    };
    server.use(
      http.get(URL, (info) => {
        request = info.request;
        return HttpResponse.json(page);
      }),
    );
    expect(await fetchAdminRatings({ cursor: 7, rating: 2 })).toEqual(page);
    expect(request?.credentials).toBe("include");
    const params = new globalThis.URL(request?.url ?? "").searchParams;
    expect(params.get("cursor")).toBe("7");
    expect(params.get("rating")).toBe("2");
  });

  it("sends no filter when none is set", async () => {
    let url = "";
    server.use(
      http.get(URL, ({ request }) => {
        url = request.url;
        return HttpResponse.json({});
      }),
    );
    await fetchAdminRatings({});
    expect(url).toBe(URL);
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    await expect(fetchAdminRatings({})).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
  });

  it("fails loudly on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminRatings({})).rejects.toThrow(
      "Ratings list failed: 500",
    );
  });
});
