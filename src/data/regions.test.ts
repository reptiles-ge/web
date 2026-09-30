import { describe, expect, it } from "vitest";

import { getRegionContent } from "@/data/regionContent";
import {
  getRegionsForSpecies,
  localizeRegionTextIfPresent,
  regions,
} from "@/data/regions";
import {
  getCatalogSpecies,
  getSpeciesById,
  unpublishedSpeciesIds,
} from "@/data/species";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";

describe("region speciesIds", () => {
  it("only lists published catalog ids", () => {
    const published = new Set(getCatalogSpecies().map((item) => item.id));
    for (const region of regions) {
      for (const id of region.speciesIds) {
        expect(unpublishedSpeciesIds.has(id), `${region.id}:${id}`).toBe(false);
        expect(published.has(id), `${region.id}:${id}`).toBe(true);
      }
    }
  });

  it.each(["coturnix-coturnix", "columba-palumbus"])(
    "lists %s only where the record table confirms distribution",
    (id) => {
      const species = getSpeciesById(id);
      expect(species).toBeDefined();
      if (!species) return;
      const records = getHalyomorphaFieldRecords({
        fieldRecords: species.fieldRecords ?? [],
        gallery: species.gallery,
        locale: "ka",
        speciesName: species.commonName,
      });
      const summary = getHalyomorphaOccurrenceSummary(
        records,
        "ka",
        confirmedRecordThresholdForSpecies(id),
      );
      expect(
        getRegionsForSpecies(id)
          .map((region) => region.id)
          .sort(),
      ).toEqual(
        summary.recordsByRegion
          .filter((region) => region.status === "confirmed")
          .map((region) => region.id)
          .sort(),
      );
    },
  );

  it("lists Brown Bear only where the record table confirms distribution", () => {
    const id = "ursus-arctos";
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: species.fieldRecords ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(
      records,
      "ka",
      confirmedRecordThresholdForSpecies(id),
    );
    expect(
      getRegionsForSpecies(id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    );
  });

  it("lists Caucasian Salamander only where the record table confirms distribution", () => {
    const id = "mertensiella-caucasica";
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: species.fieldRecords ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(
      records,
      "ka",
      confirmedRecordThresholdForSpecies(id),
    );
    expect(
      getRegionsForSpecies(id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    );
  });
});

describe("region FAQ locale gating", () => {
  it("localizes Guria FAQ copy in every active locale", () => {
    const content = getRegionContent("guria");
    for (const entry of content.faq) {
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        expect(
          localizeRegionTextIfPresent(entry.question, locale),
        ).toBeTruthy();
        expect(localizeRegionTextIfPresent(entry.answer, locale)).toBeTruthy();
      }
    }
  });
});
