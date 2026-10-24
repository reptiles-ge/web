import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { clearSiteCache } from "./site";
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
