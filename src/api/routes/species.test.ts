import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { locales } from "@/i18n/locales";
import { localizeSpecies, speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

type DetailBody = {
  data: Record<string, unknown> & {
    group: string;
    habitats: string[];
    id: string;
    lookalikes: Array<{ commonName: string; id: string; slug: string }>;
    slug: string;
  };
  locale: string;
};

type ListBody = {
  data: Array<Record<string, unknown> & { id: string }>;
  locale: string;
  total: number;
};

const env = { DB: createSpeciesTestDatabase().db };

function expectedList(locale: (typeof locales)[number], group?: string) {
  return getCatalogSpecies()
    .filter((item) => !group || speciesAtlasMeta[item.id]?.group === group)
    .map((item) => {
      const localized = localizeSpecies(item, locale);
      return {
        commonName: localized.commonName,
        danger: localized.danger ?? null,
        group: speciesAtlasMeta[item.id]?.group,
        id: item.id,
        image: localized.image,
        scientificName: localized.scientificName,
        slug: getSpeciesPublicSlug(item.id, locale),
        updatedAt: speciesUpdatedAt(item, locale),
      };
    });
}

describe("GET /v1/species", () => {
  it("matches the MDX catalog in every locale", async () => {
    for (const locale of locales) {
      const { body, response } = await requestJson<ListBody>(
        `/v1/species?locale=${locale}`,
        env,
      );
      expect(response.status).toBe(200);
      expect(body.locale).toBe(locale);
      expect(body.data).toStrictEqual(expectedList(locale));
      expect(body.total).toBe(body.data.length);
    }
  });

  it("defaults to Georgian and filters by group", async () => {
    const { body, response } = await requestJson<ListBody>(
      "/v1/species?group=snake",
      env,
    );
    expect(body.locale).toBe("ka");
    expect(body.data).toStrictEqual(expectedList("ka", "snake"));
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
  });

  it("rejects an unknown locale or group", async () => {
    for (const url of ["/v1/species?locale=de", "/v1/species?group=fish"]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});

describe("GET /v1/species/:idOrSlug", () => {
  it("matches every published profile in every locale", async () => {
    for (const item of getCatalogSpecies()) {
      for (const locale of locales) {
        const { body, response } = await requestJson<DetailBody>(
          `/v1/species/${item.id}?locale=${locale}`,
          env,
        );
        expect(response.status).toBe(200);
        const { group, habitats, lookalikes, slug, ...profile } = body.data;
        expect(profile).toStrictEqual(
          await Response.json(localizeSpecies(item, locale)).json(),
        );
        expect(group).toBe(speciesAtlasMeta[item.id]?.group);
        expect(habitats).toStrictEqual(speciesAtlasMeta[item.id]?.habitats);
        expect(slug).toBe(getSpeciesPublicSlug(item.id, locale));
        expect(lookalikes.map((peer) => peer.id)).toStrictEqual(
          getSpeciesLookalikes(item.id),
        );
      }
    }
  });

  it("names lookalikes in the requested locale", async () => {
    const { body } = await requestJson<DetailBody>(
      "/v1/species/anguis-colchica?locale=en",
      env,
    );
    const peer = body.data.lookalikes.find(
      (entry) => entry.id === "pseudopus-apodus",
    );
    expect(peer).toStrictEqual({
      commonName: localizeSpecies(getSpeciesById("pseudopus-apodus")!, "en")
        .commonName,
      id: "pseudopus-apodus",
      slug: "pseudopus-apodus",
    });
  });

  it("resolves Georgian slugs, aliases and upper case", async () => {
    for (const [path, id] of [
      ["giurza", "macrovipera-lebetina"],
      ["GIURZA", "macrovipera-lebetina"],
      ["goshawk", "accipiter-gentilis"],
    ] as const) {
      const { body, response } = await requestJson<DetailBody>(
        `/v1/species/${path}`,
        env,
      );
      expect(response.status, path).toBe(200);
      expect(body.data.id).toBe(id);
    }
  });

  it("hides unpublished and unknown species", async () => {
    for (const path of ["dolichophis-caspius", "no-such-species"]) {
      const { body, response } = await requestJson<ErrorBody>(
        `/v1/species/${path}`,
        env,
      );
      expect(response.status).toBe(404);
      expect(body.error.code).toBe("not_found");
    }
  });

  it("rejects a malformed slug or locale", async () => {
    for (const url of [
      "/v1/species/bad_slug!",
      "/v1/species/giurza?locale=de",
    ]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});
