import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { clearPageGroupCache, clearSiteCache, fetchPageGroups } from "./site";
import { SessionExpiredError } from "./species";

const URL = "https://api.reptiles.ge/v1/admin/site/revalidate";

describe("clearSiteCache", () => {
  it("posts with credentials and returns the refreshed species", async () => {
    let credentials: string | undefined;
    server.use(
      http.post(URL, ({ request }) => {
        credentials = request.credentials;
        return HttpResponse.json({ data: { species: ["bubo-bubo"] } });
      }),
    );
    expect(await clearSiteCache()).toEqual(["bubo-bubo"]);
    expect(credentials).toBe("include");
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.post(URL, () => new HttpResponse(null, { status })));
    await expect(clearSiteCache()).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("fails loudly on any other error", async () => {
    server.use(http.post(URL, () => new HttpResponse(null, { status: 502 })));
    await expect(clearSiteCache()).rejects.toThrow(
      "Site cache clear failed: 502",
    );
  });
});

describe("page group client", () => {
  const PAGES = "https://api.reptiles.ge/v1/admin/site/pages";

  it("lists the groups and clears one with credentials", async () => {
    const seen: string[] = [];
    server.use(
      http.all(`${PAGES}*`, ({ request }) => {
        seen.push(
          `${request.method} ${new globalThis.URL(request.url).pathname} ${request.credentials}`,
        );
        return HttpResponse.json({ data: [{ id: "about" }] });
      }),
    );
    expect(await fetchPageGroups()).toEqual([{ id: "about" }]);
    await clearPageGroupCache("about");
    expect(seen).toEqual([
      "GET /v1/admin/site/pages include",
      "POST /v1/admin/site/pages/about/revalidate include",
    ]);
  });

  it("reports an expired session and other failures", async () => {
    server.use(http.get(PAGES, () => new HttpResponse(null, { status: 403 })));
    await expect(fetchPageGroups()).rejects.toBeInstanceOf(SessionExpiredError);
    server.use(
      http.post(
        `${PAGES}/about/revalidate`,
        () => new HttpResponse(null, { status: 502 }),
      ),
    );
    await expect(clearPageGroupCache("about")).rejects.toThrow(
      "Page cache clear failed: 502",
    );
  });
});
