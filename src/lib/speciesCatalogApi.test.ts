import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import {
  catalogSpeciesFixture,
  localizedFixture,
} from "../../tests/fixtures/speciesCatalog";
import { reptilesApi } from "../../tests/msw/reptilesApi";
import { recordRequests, server } from "../../tests/msw/server";
import { getSpeciesCatalog } from "./speciesCatalogApi";

describe("getSpeciesCatalog", () => {
  it("loads the card view by default and the full view on request", async () => {
    server.use(reptilesApi);
    const requests = recordRequests();
    const cards = await getSpeciesCatalog("en");
    const full = await getSpeciesCatalog("en", "full");
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/catalog?view=card",
      "https://api.reptiles.ge/v1/catalog?view=full",
    ]);
    expect(cards[0]?.commonName).toBe(
      localizedFixture(catalogSpeciesFixture()[0]!, "en").commonName,
    );
    expect(cards.map((entry) => entry.id)).toEqual(
      catalogSpeciesFixture().map((entry) => entry.id),
    );
    expect(cards[0]).not.toHaveProperty("overview");
    expect(full[0]).toHaveProperty("overview");
    expect(cards[0]).toMatchObject({
      group: expect.any(String),
      lookalikes: expect.any(Array),
      slug: expect.any(String),
    });
  });

  it("fails loudly when the API errors, with no fallback", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getSpeciesCatalog("ka")).rejects.toThrow(
      "Species catalog API answered 500",
    );
  });
});
