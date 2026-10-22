import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { locales } from "@/i18n/locales";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

const CARD_KEYS = [
  "commonName",
  "danger",
  "description",
  "family",
  "genus",
  "id",
  "image",
  "imageCredit",
  "location",
  "mobileImage",
  "mobileImageCredit",
  "publishedAt",
  "scientificName",
  "stats",
  "updatedAt",
] as const;

type CatalogBody = {
  data: Array<Record<string, unknown>>;
  locale: string;
  total: number;
  view: string;
};

async function expected(
  locale: (typeof locales)[number],
  view: "card" | "full",
) {
  return Promise.all(
    getCatalogSpecies().map(async (item) => {
      const localized = (await Response.json(
        localizeSpecies(item, locale),
      ).json()) as Record<string, unknown>;
      const fields =
        view === "full"
          ? localized
          : Object.fromEntries(
              CARD_KEYS.filter((key) => localized[key] !== undefined).map(
                (key) => [key, localized[key]],
              ),
            );
      return {
        ...fields,
        group: speciesAtlasMeta[item.id]?.group,
        habitats: speciesAtlasMeta[item.id]?.habitats,
        lookalikes: getSpeciesLookalikes(item.id),
        slug: getSpeciesPublicSlug(item.id, locale),
      };
    }),
  );
}

describe("GET /v1/catalog", () => {
  it("matches the site catalog in every locale, card and full", async () => {
    for (const locale of locales) {
      for (const view of ["card", "full"] as const) {
        const { body, response } = await requestJson<CatalogBody>(
          `/v1/catalog?locale=${locale}&view=${view}`,
          env,
        );
        expect(response.status).toBe(200);
        expect(body.data).toStrictEqual(await expected(locale, view));
        expect(body).toMatchObject({ locale, total: body.data.length, view });
      }
    }
  });

  it("defaults to the Georgian card view, cached at the edge", async () => {
    const { body, response } = await requestJson<CatalogBody>(
      "/v1/catalog",
      env,
    );
    expect(body).toMatchObject({ locale: "ka", view: "card" });
    expect(Object.keys(body.data[0]!)).not.toContain("overview");
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
  });

  it("rejects an unknown view or locale", async () => {
    for (const url of ["/v1/catalog?view=huge", "/v1/catalog?locale=de"]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});
