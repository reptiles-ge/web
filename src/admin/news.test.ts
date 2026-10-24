import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { clearNewsCache, fetchAdminNews } from "./news";
import { SessionExpiredError } from "./species";

const URL = "https://api.reptiles.ge/v1/admin/news";

describe("fetchAdminNews", () => {
  it("loads the list with credentials", async () => {
    let credentials: string | undefined;
    server.use(
      http.get(URL, ({ request }) => {
        credentials = request.credentials;
        return HttpResponse.json({ data: [{ id: "batumi" }], total: 1 });
      }),
    );
    expect(await fetchAdminNews()).toEqual([{ id: "batumi" }]);
    expect(credentials).toBe("include");
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    await expect(fetchAdminNews()).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("fails loudly on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchAdminNews()).rejects.toThrow("News list failed: 500");
  });
});

describe("clearNewsCache", () => {
  const CLEAR = `${URL}/batumi-raptor-count/revalidate`;

  it("posts for one article with credentials", async () => {
    let credentials: string | undefined;
    server.use(
      http.post(CLEAR, ({ request }) => {
        credentials = request.credentials;
        return HttpResponse.json({ data: { id: "batumi-raptor-count" } });
      }),
    );
    await expect(
      clearNewsCache("batumi-raptor-count"),
    ).resolves.toBeUndefined();
    expect(credentials).toBe("include");
  });

  it("reports an expired session and other failures", async () => {
    server.use(http.post(CLEAR, () => new HttpResponse(null, { status: 401 })));
    await expect(clearNewsCache("batumi-raptor-count")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    server.use(http.post(CLEAR, () => new HttpResponse(null, { status: 502 })));
    await expect(clearNewsCache("batumi-raptor-count")).rejects.toThrow(
      "Article cache clear failed: 502",
    );
  });
});
