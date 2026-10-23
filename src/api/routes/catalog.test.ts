import { describe, expect, it } from "vitest";

import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import {
  SPECIES_CARD_KEYS,
  SPECIES_PHOTO_KEYS,
  SPECIES_QUIZ_KEYS,
} from "@/data/speciesTypes";
import { locales } from "@/i18n/locales";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import {
  catalogSpeciesFixture,
  localizedFixture,
  lookalikesFixture,
} from "../../../tests/fixtures/speciesCatalog";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

type CatalogBody = {
  data: Array<Record<string, unknown>>;
  facets: Record<
    "danger" | "group" | "habitat" | "region",
    Record<string, number>
  >;
  locale: string;
  nextCursor: null | string;
  stats: { lastUpdated: null | string; photos: number; venomous: number };
  total: number;
  view: string;
};

const ids = (body: CatalogBody) => body.data.map((entry) => entry.id);

const VIEW_KEYS = {
  card: SPECIES_CARD_KEYS,
  photos: SPECIES_PHOTO_KEYS,
  quiz: SPECIES_QUIZ_KEYS,
} as const;

async function expected(
  locale: (typeof locales)[number],
  view: "card" | "full" | "photos" | "quiz",
) {
  return Promise.all(
    catalogSpeciesFixture().map(async (item) => {
      const localized = (await Response.json(
        localizedFixture(item, locale),
      ).json()) as Record<string, unknown>;
      const fields =
        view === "full"
          ? localized
          : Object.fromEntries(
              VIEW_KEYS[view]
                .filter((key) => localized[key] !== undefined)
                .map((key) => [key, localized[key]]),
            );
      return {
        ...fields,
        group: speciesAtlasMeta[item.id]?.group,
        habitats: speciesAtlasMeta[item.id]?.habitats,
        lookalikes: lookalikesFixture(item.id),
        ...(view === "card" ? { photoCount: item.gallery.length } : {}),
        slug: getSpeciesPublicSlug(item.id, locale),
      };
    }),
  );
}

describe("GET /v1/catalog", () => {
  it("matches the site catalog in every locale and view", async () => {
    for (const locale of locales) {
      for (const view of ["card", "full", "photos", "quiz"] as const) {
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

  it("filters by group, danger, habitat and region, and counts every match", async () => {
    const { body: all } = await requestJson<CatalogBody>("/v1/catalog", env);
    const { body } = await requestJson<CatalogBody>(
      "/v1/catalog?group=snake&danger=venomous&habitat=mountain&region=kakheti",
      env,
    );
    expect(body.total).toBe(body.data.length);
    expect(body.total).toBeGreaterThan(0);
    expect(body.total).toBeLessThan(all.total);
    for (const entry of body.data) {
      expect(entry.group).toBe("snake");
      expect(["High", "Moderate"]).toContain(entry.danger);
      expect(entry.habitats).toContain("mountain");
    }
    expect(body.facets.group.snake).toBe(body.total);
    expect(body.facets.danger.venomous).toBe(body.total);
    expect(body.facets.region.kakheti).toBe(body.total);
    expect(body.stats.venomous).toBe(body.total);
  });

  it("counts each filter value while keeping the other filters", async () => {
    const { body: all } = await requestJson<CatalogBody>("/v1/catalog", env);
    const { all: groupAll, ...groups } = all.facets.group;
    expect(groupAll).toBe(all.total);
    expect(Object.values(groups).reduce((sum, n) => sum + n, 0)).toBe(
      all.total,
    );
    const { body: snakes } = await requestJson<CatalogBody>(
      "/v1/catalog?group=snake",
      env,
    );
    expect(snakes.total).toBe(all.facets.group.snake);
    expect(snakes.facets.group).toStrictEqual(all.facets.group);
    expect(snakes.facets.danger.all).toBe(snakes.total);
    expect(all.stats.photos).toBe(
      all.data.reduce((sum, entry) => sum + (entry.photoCount as number), 0),
    );
  });

  it("searches names and places in every locale", async () => {
    for (const locale of locales) {
      const { body } = await requestJson<CatalogBody>(
        `/v1/catalog?q=${encodeURIComponent("გიურზა")}`,
        env,
        { headers: { "X-Locale": locale } },
      );
      expect(ids(body)).toStrictEqual(["macrovipera-lebetina"]);
    }
    const { body } = await requestJson<CatalogBody>(
      "/v1/catalog?q=VIPERIDAE",
      env,
    );
    expect(ids(body)).toContain("vipera-kaznakovi");
  });

  it("returns a numbered page of the sorted matches", async () => {
    const { body: sorted } = await requestJson<CatalogBody>(
      "/v1/catalog?sort=featured",
      env,
    );
    const { body: page } = await requestJson<CatalogBody>(
      "/v1/catalog?sort=featured&limit=24&page=2",
      env,
    );
    expect(ids(page)).toStrictEqual(ids(sorted).slice(24, 48));
    expect(page.total).toBe(sorted.total);
    expect(page.nextCursor).toBe(ids(sorted)[47]);
    const { body: past } = await requestJson<CatalogBody>(
      "/v1/catalog?limit=24&page=99",
      env,
    );
    expect(past.data).toStrictEqual([]);
    expect(past.nextCursor).toBeNull();
  });

  it("sorts by name, range and update time", async () => {
    const { body: az } = await requestJson<CatalogBody>(
      "/v1/catalog?sort=az",
      env,
      { headers: { "X-Locale": "en" } },
    );
    const names = az.data.map((entry) => entry.commonName as string);
    expect(names).toStrictEqual(
      [...names].sort((a, b) => a.localeCompare(b, "en")),
    );
    const { body: updated } = await requestJson<CatalogBody>(
      "/v1/catalog?sort=updated&limit=4",
      env,
    );
    const times = updated.data.map((entry) =>
      Date.parse(entry.updatedAt as string),
    );
    expect(times).toStrictEqual([...times].sort((a, b) => b - a));
    expect(updated.data[0]?.updatedAt).toBe(updated.stats.lastUpdated);
    const { body: range } = await requestJson<CatalogBody>(
      "/v1/catalog?sort=range&limit=1",
      env,
    );
    expect(range.data[0]?.id).toBeDefined();
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

  it("rejects an unknown view, limit, cursor, page, filter or sort", async () => {
    for (const url of [
      "/v1/catalog?view=huge",
      "/v1/catalog?limit=0",
      "/v1/catalog?limit=101",
      "/v1/catalog?limit=abc",
      "/v1/catalog?cursor=not-a-species",
      "/v1/catalog?cursor=dolichophis-caspius",
      "/v1/catalog?page=2",
      "/v1/catalog?limit=10&page=0",
      "/v1/catalog?limit=10&page=2&cursor=vipera-kaznakovi",
      "/v1/catalog?group=fish",
      "/v1/catalog?danger=mild",
      "/v1/catalog?habitat=desert",
      "/v1/catalog?region=paris",
      "/v1/catalog?sort=random",
      `/v1/catalog?q=${"a".repeat(101)}`,
    ]) {
      const { body, response } = await requestJson<ErrorBody>(url, env);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});
