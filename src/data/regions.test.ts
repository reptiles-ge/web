import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { getRegionContent } from "@/data/regionContent";
import {
  getRegionsForSpecies,
  localizeRegionTextIfPresent,
  regions,
  toRegionSpeciesCard,
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

const fieldRecordsById = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src/data/fieldRecords.generated.json"),
    "utf8",
  ),
) as Record<string, SpeciesFieldRecord[]>;

describe("region species cards", () => {
  it("keeps only the fields the region cards render", () => {
    const region = regions.find((item) => item.id === "kakheti");
    expect(region).toBeDefined();
    const cards = region!.speciesIds
      .map((id) => getSpeciesById(id))
      .filter((item) => item !== undefined)
      .map((item) => toRegionSpeciesCard(item, "ka"));

    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card).not.toHaveProperty("description");
      expect(card).not.toHaveProperty("faq");
      expect(card).not.toHaveProperty("fieldRecords");
      expect(card).not.toHaveProperty("gallery");
      expect(card).not.toHaveProperty("habitat");
      expect(card).not.toHaveProperty("overview");
      expect(card).not.toHaveProperty("searchText");
      expect(card).not.toHaveProperty("sources");
    }
  });
});

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

  it.each([
    "accipiter-nisus",
    "dendrocopos-major",
    "ciconia-ciconia",
    "coturnix-coturnix",
    "gypaetus-barbatus",
    "gyps-fulvus",
    "neophron-percnopterus",
    "columba-palumbus",
    "garrulus-glandarius",
    "darevskia-obscura",
    "eirenis-modestus",
    "mauremys-caspica",
    "paralaudakia-caucasia",
    "mustela-nivalis",
  ])("lists %s only where the record table confirms distribution", (id) => {
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
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

  it("lists Brown Bear only where the record table confirms distribution", () => {
    const id = "ursus-arctos";
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
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
      fieldRecords: fieldRecordsById[species.id] ?? [],
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
