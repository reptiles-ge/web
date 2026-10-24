import { describe, expect, it } from "vitest";

import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { locales } from "@/i18n/locales";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import {
  catalogSpeciesFixture,
  fixtureUpdatedAt,
  localizedFixture,
  lookalikesFixture,
  speciesFixture,
} from "../../../tests/fixtures/speciesCatalog";
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
  return catalogSpeciesFixture()
    .filter((item) => !group || speciesAtlasMeta[item.id]?.group === group)
    .map((item) => {
      const localized = localizedFixture(item, locale);
      return {
        commonName: localized.commonName,
        danger: localized.danger ?? null,
        group: speciesAtlasMeta[item.id]?.group,
        id: item.id,
        image: localized.image,
        scientificName: localized.scientificName,
        slug: getSpeciesPublicSlug(item.id, locale),
        updatedAt: fixtureUpdatedAt(item, locale),
      };
    });
}

describe("GET /v1/species", () => {
  it("matches the MDX catalog in every locale", async () => {
    for (const locale of locales) {
      const { body, response } = await requestJson<ListBody>(
        "/v1/species",
        env,
        { headers: { "X-Locale": locale } },
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
    for (const [url, headers] of [
      ["/v1/species", { "X-Locale": "de" }],
      ["/v1/species?group=fish", {}],
    ] as const) {
      const { body, response } = await requestJson<ErrorBody>(url, env, {
        headers,
      });
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});

describe("GET /v1/species/:slug", () => {
  it("matches every published profile in every locale", async () => {
    for (const item of catalogSpeciesFixture()) {
      for (const locale of locales) {
        const { body, response } = await requestJson<DetailBody>(
          `/v1/species/${getSpeciesPublicSlug(item.id, locale)}`,
          env,
          { headers: { "X-Locale": locale } },
        );
        expect(response.status).toBe(200);
        const { group, habitats, lookalikes, slug, ...profile } = body.data;
        expect(profile).toStrictEqual(
          await Response.json(localizedFixture(item, locale)).json(),
        );
        expect(group).toBe(speciesAtlasMeta[item.id]?.group);
        expect(habitats).toStrictEqual(speciesAtlasMeta[item.id]?.habitats);
        expect(slug).toBe(getSpeciesPublicSlug(item.id, locale));
        expect(lookalikes.map((peer) => peer.id)).toStrictEqual(
          lookalikesFixture(item.id),
        );
      }
    }
  });

  it("names lookalikes in the requested locale", async () => {
    const { body } = await requestJson<DetailBody>(
      "/v1/species/anguis-colchica",
      env,
      { headers: { "X-Locale": "en" } },
    );
    const peer = body.data.lookalikes.find(
      (entry) => entry.id === "pseudopus-apodus",
    );
    expect(peer).toStrictEqual({
      commonName: localizedFixture(speciesFixture("pseudopus-apodus")!, "en")
        .commonName,
      id: "pseudopus-apodus",
      slug: "pseudopus-apodus",
    });
  });

  it("resolves the locale's public slug in any case", async () => {
    for (const [slug, locale] of [
      ["giurza", "ka"],
      ["GIURZA", "ka"],
      ["macrovipera-lebetina", "en"],
      ["macrovipera-lebetina", "tr"],
    ] as const) {
      const { body, response } = await requestJson<DetailBody>(
        `/v1/species/${slug}`,
        env,
        { headers: { "X-Locale": locale } },
      );
      expect(response.status, `${slug} ${locale}`).toBe(200);
      expect(body.data.id).toBe("macrovipera-lebetina");
    }
  });

  it("refuses ids in Georgian, Georgian slugs elsewhere and aliases", async () => {
    for (const [slug, locale] of [
      ["macrovipera-lebetina", "ka"],
      ["giurza", "en"],
      ["goshawk", "ka"],
      ["accipiter-gentilis", "ka"],
    ] as const) {
      const { body, response } = await requestJson<ErrorBody>(
        `/v1/species/${slug}`,
        env,
        { headers: { "X-Locale": locale } },
      );
      expect(response.status, `${slug} ${locale}`).toBe(404);
      expect(body.error.code).toBe("not_found");
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

  it("returns the profile's views summed over every day", async () => {
    const database = createSpeciesTestDatabase();
    database.sqlite.exec(
      "INSERT INTO content_views (kind, target_id, day, views) VALUES ('species', 'macrovipera-lebetina', '2026-10-23', 4), ('species', 'macrovipera-lebetina', '2026-10-24', 3), ('species', 'pseudopus-apodus', '2026-10-24', 9), ('news', 'macrovipera-lebetina', '2026-10-24', 5)",
    );
    const viewed = await requestJson<DetailBody & { views: number }>(
      "/v1/species/giurza",
      { DB: database.db },
    );
    const unseen = await requestJson<DetailBody & { views: number }>(
      "/v1/species/paralaudakia-caucasia",
      { DB: database.db },
      { headers: { "X-Locale": "en" } },
    );

    expect(viewed.body.data.id).toBe("macrovipera-lebetina");
    expect(viewed.body.views).toBe(7);
    expect(unseen.body.views).toBe(0);
  });

  it("rejects a malformed slug or locale", async () => {
    for (const [url, headers] of [
      ["/v1/species/bad_slug!", {}],
      ["/v1/species/giurza", { "X-Locale": "de" }],
    ] as const) {
      const { body, response } = await requestJson<ErrorBody>(url, env, {
        headers,
      });
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});

describe("GET /v1/species/:slug/field-records", () => {
  it("returns the species' records by the locale's slug, and 404 otherwise", async () => {
    const database = createSpeciesTestDatabase();
    database.sqlite.exec(
      "DELETE FROM species_field_records WHERE species_id = 'macrovipera-lebetina'",
    );
    database.sqlite
      .prepare(
        "INSERT INTO species_field_records (species_id, position, locality, lat, lng, evidence, observer) VALUES ('macrovipera-lebetina', 0, 'Vashlovani', 41.2, 46.2, 'observation', 'nika')",
      )
      .run();
    const local = { DB: database.db };
    const { body, response } = await requestJson<{
      data: unknown[];
      id: string;
      total: number;
    }>("/v1/species/giurza/field-records", local);
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [
        {
          evidence: "observation",
          lat: 41.2,
          lng: 46.2,
          locality: "Vashlovani",
          observer: "nika",
        },
      ],
      id: "macrovipera-lebetina",
      total: 1,
    });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
    const missing = await requestJson<ErrorBody>(
      "/v1/species/dolichophis-caspius/field-records",
      local,
    );
    expect(missing.response.status).toBe(404);
    const english = await requestJson<{ id: string }>(
      "/v1/species/macrovipera-lebetina/field-records",
      local,
      { headers: { "X-Locale": "en" } },
    );
    expect(english.body.id).toBe("macrovipera-lebetina");
    for (const [slug, locale] of [
      ["macrovipera-lebetina", "ka"],
      ["giurza", "en"],
    ] as const) {
      const wrong = await requestJson<ErrorBody>(
        `/v1/species/${slug}/field-records`,
        local,
        { headers: { "X-Locale": locale } },
      );
      expect(wrong.response.status, `${slug} ${locale}`).toBe(404);
    }
  });
});
