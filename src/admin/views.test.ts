import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { SessionExpiredError } from "./species";
import { fetchAdminViews } from "./views";

const URL = "https://api.reptiles.ge/v1/admin/views";

describe("admin views client", () => {
  it("loads one page with its filters and credentials", async () => {
    const seen: Array<{ credentials: string; path: string }> = [];
    const page = {
      data: [],
      limit: 20,
      page: 2,
      pageCount: 2,
      total: 21,
      views: 300,
    };
    server.use(
      http.get(URL, ({ request }) => {
        const url = new globalThis.URL(request.url);
        seen.push({
          credentials: request.credentials,
          path: `${url.pathname}${url.search}`,
        });
        return HttpResponse.json(page);
      }),
    );
    expect(
      await fetchAdminViews({
        days: 7,
        kind: "news",
        limit: 20,
        page: 2,
        q: "",
      }),
    ).toEqual(page);
    expect(seen).toEqual([
      {
        credentials: "include",
        path: "/v1/admin/views?days=7&kind=news&limit=20&page=2",
      },
    ]);
  });

  it("reports an expired session and other failures", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 401 })));
    await expect(
      fetchAdminViews({ limit: 50, page: 1 }),
    ).rejects.toBeInstanceOf(SessionExpiredError);
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminViews({ limit: 50, page: 1 })).rejects.toThrow(
      "Views list failed: 500",
    );
  });
});
