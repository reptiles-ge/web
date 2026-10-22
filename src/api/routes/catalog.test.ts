import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { SPECIES_CARD_KEYS } from "@/data/speciesTypes";
import { locales } from "@/i18n/locales";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getSpeciesLookalikes } from "@/lib/speciesLookalikes";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

type CatalogBody = {
  data: Array<Record<string, unknown>>;
  locale: string;
  nextCursor: null | string;
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
              SPECIES_CARD_KEYS.filter(
                (key) => localized[key] !== undefined,
              ).map((key) => [key, localized[key]]),
            );
      return {
        ...fields,
        group: speciesAtlasMeta[item.id]?.group,
        habitats: speciesAtlasMeta[item.id]?.habitats,
        lookalikes: getSpeciesLookalikes(item.id),
        ...(view === "card" ? { photoCount: item.gallery.length } : {}),
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
          `/v1/catalog?view=${view}`,
          env,
          { headers: { "X-Locale": locale } },
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Language")).toBe(locale);
        expect(body.data).toStrictEqual(await expected(locale, view));
        expect(body).toMatchObject({
          locale,
          nextCursor: null,
          total: body.data.length,
          view,
        });
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

  it("pages through the catalog with a cursor and limit", async () => {
    const { body: all } = await requestJson<CatalogBody>("/v1/catalog", env);
    const ids: string[] = [];
    let cursor: null | string = "";
    while (cursor !== null) {
      const query: string = cursor ? `&cursor=${cursor}` : "";
      const { body } = await requestJson<CatalogBody>(
        `/v1/catalog?limit=40${query}`,
        env,
      );
      expect(body.total).toBe(all.total);
      expect(body.data.length).toBeLessThanOrEqual(40);
      ids.push(...body.data.map((entry) => entry.id as string));
      cursor = body.nextCursor;
    }
    expect(ids).toStrictEqual(all.data.map((entry) => entry.id));
  });

  it("ignores a locale query parameter", async () => {
    const { body } = await requestJson<CatalogBody>(
      "/v1/catalog?locale=en",
      env,
    );
    expect(body.locale).toBe("ka");
  });

  it("rejects an unknown locale header", async () => {
    const { body, response } = await requestJson<ErrorBody>(
      "/v1/catalog",
      env,
      { headers: { "X-Locale": "de" } },
    );
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("rejects an unknown view, limit or cursor", async () => {
    for (const url of [
      "/v1/catalog?view=huge",
      "/v1/catalog?limit=0",
      "/v1/catalog?limit=101",
      "/v1/catalog?limit=abc",
      "/v1/catalog?cursor=not-a-species",
      "/v1/catalog?cursor=dolichophis-caspius",
    ]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});
