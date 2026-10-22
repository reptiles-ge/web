import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";

import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

type SpeciesListBody = {
  data: Array<{
    commonName: string;
    group: null | string;
    id: string;
    slug: string;
  }>;
  locale: string;
  total: number;
};

const env = { DB: createTestDatabase().db };

describe("GET /v1/species", () => {
  it("lists every published species in Georgian by default", async () => {
    const { body, response } = await requestJson<SpeciesListBody>(
      "/v1/species",
      env,
    );
    expect(response.status).toBe(200);
    expect(body.locale).toBe("ka");
    expect(body.data.map((item) => item.id)).toEqual(
      getCatalogSpecies().map((item) => item.id),
    );
    expect(body.total).toBe(body.data.length);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
  });

  it("uses Georgian slugs in ka and ids elsewhere", async () => {
    const ka = await requestJson<SpeciesListBody>("/v1/species?locale=ka", env);
    const en = await requestJson<SpeciesListBody>("/v1/species?locale=en", env);
    const find = (body: SpeciesListBody) =>
      body.data.find((item) => item.id === "macrovipera-lebetina");
    expect(find(ka.body)?.slug).toBe("giurza");
    expect(find(en.body)?.slug).toBe("macrovipera-lebetina");
    expect(find(en.body)?.commonName).not.toBe(find(ka.body)?.commonName);
  });

  it("filters by group", async () => {
    const { body } = await requestJson<SpeciesListBody>(
      "/v1/species?group=snake",
      env,
    );
    expect(body.total).toBeGreaterThan(0);
    expect(
      body.data.every(
        (item) =>
          item.group === "snake" &&
          speciesAtlasMeta[item.id]?.group === "snake",
      ),
    ).toBe(true);
  });

  it("rejects an unknown locale or group with the shared error shape", async () => {
    for (const url of ["/v1/species?locale=de", "/v1/species?group=fish"]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
      expect(body.error.details).toEqual([
        expect.objectContaining({ path: expect.any(String) }),
      ]);
    }
  });
});
