import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import { getRegionSpecies, regions } from "@/data/regions";
import { getCatalogSpecies, type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { speciesUpdatedAt } from "@/i18n/localizeSpecies";
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
  quizDateFields,
  regionDateFields,
} from "@/lib/structuredDataDates";

describe("atlasDateFields", () => {
  it.each(routing.locales)(
    "dates the %s atlas by its newest species page",
    (locale) => {
      const fields = atlasDateFields(locale);
      const newest = Math.max(
        ...getCatalogSpecies().map((item) =>
          Date.parse(speciesUpdatedAt(item, locale)),
        ),
      );
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
      ...items.map((item) => Date.parse(speciesUpdatedAt(item, locale))),
    );

  it.each(routing.locales)(
    "dates every %s group hub by its newest member species",
    (locale) => {
      for (const hub of GROUP_HUB_LIST) {
        const members = getCatalogSpecies().filter(
          (item) => getSpeciesAtlasMeta(item.id).group === hub.group,
        );
        if (members.length === 0) continue;
        expect(
          Date.parse(pageDateFields(hub.path, locale).dateModified),
          hub.path,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it.each(routing.locales)(
    "dates every %s collection guide by its newest member species",
    (locale) => {
      for (const guide of CLUSTER_GUIDE_LIST) {
        if (guide.schema !== "collection") continue;
        const members = getCatalogSpecies().filter(guide.matches);
        if (members.length === 0) continue;
        expect(
          Date.parse(pageDateFields(guide.pathname, locale).dateModified),
          guide.pathname,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it.each(routing.locales)(
    "dates every %s region by its newest listed species",
    (locale) => {
      for (const region of regions) {
        const members = getRegionSpecies(region);
        if (members.length === 0) continue;
        expect(
          Date.parse(regionDateFields(region.id, locale).dateModified),
          region.id,
        ).toBeGreaterThanOrEqual(newest(members, locale));
      }
    },
  );

  it("dates a contributor by the newest species carrying their photos", () => {
    for (const author of getPublishedCreditAuthors()) {
      const ids = new Set(
        getCreditAuthorSpeciesIds(getCreditAuthorPhotos(author)),
      );
      const members = getCatalogSpecies().filter((item) => ids.has(item.id));
      if (members.length === 0) continue;
      expect(
        Date.parse(authorDateFields(author.slug, "en").dateModified),
        author.slug,
      ).toBeGreaterThanOrEqual(newest(members, "en"));
    }
  });

  it("dates a quiz by the newest species in its pool", () => {
    const pool = getCatalogSpecies().filter(
      (item) => getSpeciesAtlasMeta(item.id).group === "snake",
    );
    expect(
      Date.parse(quizDateFields("snake", "ka").dateModified),
    ).toBeGreaterThanOrEqual(newest(pool, "ka"));
  });

  it("keeps fixed pages on their own date", () => {
    expect(pageDateFields("/contact", "en")).toEqual(
      pageDateFields("/contact", "ka"),
    );
  });
});

describe("speciesUpdatedAt", () => {
  it("never dates a translation before the Georgian profile", () => {
    for (const item of getCatalogSpecies()) {
      for (const locale of routing.locales) {
        expect(
          Date.parse(speciesUpdatedAt(item, locale)),
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
  ["authorDateFields", () => authorDateFields("sandro-khakhva", "tr")],
])("%s", (_name, fields) => {
  it("returns a modified and a published date", () => {
    const result = fields();
    expect(Object.keys(result).sort()).toEqual([
      "dateModified",
      "datePublished",
    ]);
    expect(Number.isNaN(Date.parse(result.datePublished))).toBe(false);
    expect(Number.isNaN(Date.parse(result.dateModified))).toBe(false);
  });
});
