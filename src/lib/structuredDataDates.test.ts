import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { getRegionSpecies, regions } from "@/data/regions";
import { type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { routing } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import {
  atlasDateFields,
  authorDateFields,
  hasMeaningfulUpdate,
  pageDateFields,
  pageModifiedDate,
  quizDateFields,
  regionDateFields,
} from "@/lib/structuredDataDates";

import {
  catalogSpeciesFixture,
  contributorsFixture,
  fixtureUpdatedAt,
  speciesCatalogFixture,
} from "../../tests/fixtures/speciesCatalog";

describe("atlasDateFields", () => {
  it.each(routing.locales)(
    "dates the %s atlas by its newest species page",
    async (locale) => {
      const dates = catalogSpeciesFixture().map((item) =>
        fixtureUpdatedAt(item, locale),
      );
      const newest = Math.max(...dates.map((date) => Date.parse(date)));
      const fields = atlasDateFields(
        locale,
        dates.find((date) => Date.parse(date) === newest) ?? null,
      );
      expect(fields).toStrictEqual(await pageDateFields("/species", locale));
      expect(Date.parse(fields.dateModified)).toBeGreaterThanOrEqual(newest);
      expect(Date.parse(fields.dateModified)).toBeGreaterThanOrEqual(
        Date.parse(fields.datePublished),
      );
    },
  );
});

describe("member-derived dates", () => {
  const newest = (items: Species[], locale: AppLocale) =>
    Math.max(
      ...items.map((item) => Date.parse(fixtureUpdatedAt(item, locale))),
    );

  it.each(routing.locales)(
    "dates every %s group hub by its newest member species",
    async (locale) => {
      for (const hub of GROUP_HUB_LIST) {
        const members = catalogSpeciesFixture().filter(
          (item) => getSpeciesAtlasMeta(item.id).group === hub.group,
        );
        if (members.length === 0) continue;
        expect(
          Date.parse(
            (await await pageDateFields(hub.path, locale)).dateModified,
          ),
          hub.path,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it.each(routing.locales)(
    "dates every %s collection guide by its newest member species",
    async (locale) => {
      for (const guide of CLUSTER_GUIDE_LIST) {
        if (guide.schema !== "collection") continue;
        const members = catalogSpeciesFixture().filter(guide.matches);
        if (members.length === 0) continue;
        expect(
          Date.parse(
            (await await pageDateFields(guide.pathname, locale)).dateModified,
          ),
          guide.pathname,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it.each(routing.locales)(
    "dates every %s region by its newest listed species",
    async (locale) => {
      for (const region of regions) {
        const members = getRegionSpecies(region, catalogSpeciesFixture());
        if (members.length === 0) continue;
        expect(
          Date.parse(
            (await await regionDateFields(region.id, locale)).dateModified,
          ),
          region.id,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it("dates a contributor by the newest species carrying their photos", async () => {
    for (const author of contributorsFixture()) {
      const ids = new Set(
        getCreditAuthorSpeciesIds(
          getCreditAuthorPhotos(author, speciesCatalogFixture("ka")),
        ),
      );
      const members = catalogSpeciesFixture().filter((item) =>
        ids.has(item.id),
      );
      if (members.length === 0) continue;
      expect(
        Date.parse((await authorDateFields(author, "en")).dateModified!),
        author.id,
      ).toBeGreaterThanOrEqual(newest(members, "en"));
    }
  });

  it("dates a quiz by the newest species in its pool", async () => {
    const pool = catalogSpeciesFixture().filter(
      (item) => getSpeciesAtlasMeta(item.id).group === "snake",
    );
    expect(
      Date.parse((await await quizDateFields("snake", "ka")).dateModified),
    ).toBeGreaterThanOrEqual(newest(pool, "ka"));
  });

  it.each(routing.locales)(
    "keeps fixed pages on their own date in %s",
    async (locale) => {
      const fresh = speciesCatalogFixture(locale).map((item) => ({
        ...item,
        updatedAt: "2099-01-01T00:00:00+04:00",
      }));
      expect(await pageModifiedDate("/contact", locale, fresh)).toBe(
        await pageModifiedDate("/contact", locale, []),
      );
    },
  );
});

describe("fixtureUpdatedAt", () => {
  it("never dates a translation before the Georgian profile", () => {
    for (const item of catalogSpeciesFixture()) {
      for (const locale of routing.locales) {
        expect(
          Date.parse(fixtureUpdatedAt(item, locale)),
          `${item.id} ${locale}`,
        ).toBeGreaterThanOrEqual(Date.parse(item.updatedAt));
      }
    }
  });
});

describe("hasMeaningfulUpdate", () => {
  it("is false when either date is missing", () => {
    expect(hasMeaningfulUpdate(undefined, "2026-02-01")).toBe(false);
    expect(hasMeaningfulUpdate("2026-01-01", null)).toBe(false);
    expect(hasMeaningfulUpdate("", "2026-02-01")).toBe(false);
  });

  it("is true when the update is on a later calendar day", () => {
    expect(hasMeaningfulUpdate("2026-01-01", "2026-02-01")).toBe(true);
  });

  it("is false for the same day, or an update before publishing", () => {
    expect(hasMeaningfulUpdate("2026-01-01", "2026-01-01")).toBe(false);
    expect(hasMeaningfulUpdate("2026-02-01", "2026-01-01")).toBe(false);
  });

  it("falls back to string inequality for unparseable dates", () => {
    expect(hasMeaningfulUpdate("soon", "later")).toBe(true);
    expect(hasMeaningfulUpdate("same", "same")).toBe(false);
  });
});

describe.each([
  ["pageDateFields", () => pageDateFields("/species", "ka")],
  ["quizDateFields", () => quizDateFields("snake", "en")],
  ["regionDateFields", () => regionDateFields("kakheti", "ru")],
  ["authorDateFields", () => authorDateFields(sandroKhakhva(), "tr")],
])("%s", (_name, fields) => {
  it("returns a modified and a published date", async () => {
    const result = await fields();
    expect(Object.keys(result).sort()).toEqual([
      "dateModified",
      "datePublished",
    ]);
    expect(Number.isNaN(Date.parse(result.datePublished!))).toBe(false);
    expect(Number.isNaN(Date.parse(result.dateModified!))).toBe(false);
  });
});

function sandroKhakhva() {
  return contributorsFixture().find(({ id }) => id === "sandro-khakhva")!;
}
