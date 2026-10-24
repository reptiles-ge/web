import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { fetchAdminSpecies, SessionExpiredError } from "./species";

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
