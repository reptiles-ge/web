import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";

import { reptilesApi } from "../../tests/msw/reptilesApi";
import { recordRequests, server } from "../../tests/msw/server";
import { getSpeciesProfile } from "./speciesProfileApi";

describe("getSpeciesProfile", () => {
  it("loads the localized profile from api.reptiles.ge", async () => {
    server.use(reptilesApi);
    const requests = recordRequests();
    const profile = await getSpeciesProfile("macrovipera-lebetina", "en");
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/species/macrovipera-lebetina?locale=en",
    ]);
    expect(profile?.group).toBe("snake");
    expect(profile?.species).toStrictEqual(
      JSON.parse(
        JSON.stringify(
          localizeSpecies(getSpeciesById("macrovipera-lebetina")!, "en"),
        ),
      ),
    );
  });

  it("returns null for a species the API does not publish", async () => {
    server.use(reptilesApi);
    expect(await getSpeciesProfile("dolichophis-caspius", "ka")).toBeNull();
  });

  it("fails loudly when the API errors, with no fallback", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/species/:id", () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getSpeciesProfile("testudo-graeca", "ka")).rejects.toThrow(
      "Species API answered 500 for testudo-graeca",
    );
  });
});
