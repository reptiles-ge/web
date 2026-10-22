import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";

import { reptilesApi } from "../../tests/msw/reptilesApi";
import { recordRequests, server } from "../../tests/msw/server";
import { getSpeciesProfile } from "./speciesProfileApi";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSpeciesProfile", () => {
  it("sends the cache bypass secret only when it is configured", async () => {
    const seen: Array<null | string> = [];
    server.use(
      http.get("https://api.reptiles.ge/v1/species/:slug", ({ request }) => {
        seen.push(request.headers.get("X-Cache-Bypass"));
        return HttpResponse.json(
          { error: { code: "not_found" } },
          { status: 404 },
        );
      }),
    );
    await getSpeciesProfile("testudo-graeca", "ka");
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    await getSpeciesProfile("testudo-graeca", "en");
    expect(seen).toEqual([null, "fresh-secret"]);
  });

  it("loads the localized profile from api.reptiles.ge", async () => {
    server.use(reptilesApi);
    const requests = recordRequests();
    const profile = await getSpeciesProfile("macrovipera-lebetina", "en");
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/species/macrovipera-lebetina",
    ]);
    expect(profile?.group).toBe("snake");
    expect(profile?.species).toStrictEqual(
      await Response.json(
        localizeSpecies(getSpeciesById("macrovipera-lebetina")!, "en"),
      ).json(),
    );
  });

  it("asks for the Georgian slug in Georgian", async () => {
    server.use(reptilesApi);
    const requests = recordRequests();
    const profile = await getSpeciesProfile("macrovipera-lebetina", "ka");
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/species/giurza",
    ]);
    expect(profile?.species.id).toBe("macrovipera-lebetina");
  });

  it("returns null for a species the API does not publish", async () => {
    server.use(reptilesApi);
    expect(await getSpeciesProfile("dolichophis-caspius", "ka")).toBeNull();
  });

  it("fails loudly when the API errors, with no fallback", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/species/:slug", () =>
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
