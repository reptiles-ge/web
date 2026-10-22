import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { routing } from "@/i18n/routing";

import app, { API_LOCALES } from "./index";

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

async function getJson<T>(path: string) {
  const response = await app.request(path);
  return { body: (await response.json()) as T, response };
}

describe("api", () => {
  it("supports every site locale", () => {
    expect([...API_LOCALES]).toEqual([...routing.locales]);
  });

  it("lists every published species in Georgian by default", async () => {
    const { body, response } = await getJson<SpeciesListBody>("/v1/species");
    expect(response.status).toBe(200);
    expect(body.locale).toBe("ka");
    expect(body.total).toBe(getCatalogSpecies().length);
    expect(body.data.map((item) => item.id)).toEqual(
      getCatalogSpecies().map((item) => item.id),
    );
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("uses Georgian slugs in ka and ids elsewhere", async () => {
    const ka = await getJson<SpeciesListBody>("/v1/species?locale=ka");
    const en = await getJson<SpeciesListBody>("/v1/species?locale=en");
    const kaGiurza = ka.body.data.find(
      (item) => item.id === "macrovipera-lebetina",
    );
    const enGiurza = en.body.data.find(
      (item) => item.id === "macrovipera-lebetina",
    );
    expect(kaGiurza?.slug).toBe("giurza");
    expect(enGiurza?.slug).toBe("macrovipera-lebetina");
    expect(enGiurza?.commonName).not.toBe(kaGiurza?.commonName);
  });

  it("filters by group", async () => {
    const { body } = await getJson<SpeciesListBody>("/v1/species?group=snake");
    expect(body.total).toBeGreaterThan(0);
    expect(
      body.data.every((item) => speciesAtlasMeta[item.id]?.group === "snake"),
    ).toBe(true);
    expect(body.data.every((item) => item.group === "snake")).toBe(true);
  });

  it("rejects an unknown locale or group", async () => {
    const locale = await app.request("/v1/species?locale=de");
    const group = await app.request("/v1/species?group=fish");
    expect(locale.status).toBe(400);
    expect(group.status).toBe(400);
  });

  it("answers unknown paths with a JSON 404", async () => {
    const { body, response } = await getJson<{ error: string }>("/v1/nothing");
    expect(response.status).toBe(404);
    expect(body.error).toBe("not_found");
  });
});
