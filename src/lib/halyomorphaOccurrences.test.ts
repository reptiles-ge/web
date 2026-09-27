import { describe, expect, it } from "vitest";

import { getRegionsForSpecies } from "@/data/mapRegions";
import { getSpeciesById } from "@/data/species";

import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
  occurrenceStatusForCount,
} from "./halyomorphaOccurrences";

describe("occurrenceStatusForCount", () => {
  it("marks fewer than five records as recorded only", () => {
    expect(occurrenceStatusForCount(0)).toBe("recorded-only");
    expect(occurrenceStatusForCount(4)).toBe("recorded-only");
    expect(occurrenceStatusForCount(5)).toBe("confirmed");
  });

  it("allows species-specific confirmation thresholds", () => {
    const aquilaThreshold =
      confirmedRecordThresholdForSpecies("aquila-chrysaetos");
    expect(occurrenceStatusForCount(3, aquilaThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(4, aquilaThreshold)).toBe("confirmed");
    expect(occurrenceStatusForCount(0, 1)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, 1)).toBe("confirmed");
    const quailThreshold =
      confirmedRecordThresholdForSpecies("coturnix-coturnix");
    expect(occurrenceStatusForCount(0, quailThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, quailThreshold)).toBe("confirmed");
    const platycepsThreshold =
      confirmedRecordThresholdForSpecies("platyceps-najadum");
    expect(occurrenceStatusForCount(2, platycepsThreshold)).toBe(
      "recorded-only",
    );
    expect(occurrenceStatusForCount(3, platycepsThreshold)).toBe("confirmed");
  });

  it("counts a photographed iNaturalist observation once", () => {
    const records = getHalyomorphaFieldRecords({
      fieldRecords: [
        {
          date: "2026-06-28",
          lat: 41.80236,
          lng: 44.67689,
          locality: "Telovani",
          observerName: "Alex",
          url: "https://www.inaturalist.org/observations/123",
        },
      ],
      gallery: [
        {
          credit: {
            date: "2026-06-28",
            lat: 41.80236,
            lng: 44.67689,
            location: "Telovani",
            photoConfidence: "georgia-field",
            photographer: "Alex",
            url: "https://www.inaturalist.org/photos/456",
          },
          src: "https://cdn.reptiles.ge/test.jpg",
        },
      ],
      locale: "en",
      speciesName: "Test snake",
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      kind: "photo",
      url: "https://www.inaturalist.org/observations/123",
    });
  });

  it("uses only confirmed Zamenis regions as distribution", () => {
    const species = getSpeciesById("zamenis-hohenackeri");
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
      confirmedRecordThresholdForSpecies(species.id),
    );
    const confirmedIds = summary.recordsByRegion
      .filter((region) => region.status === "confirmed")
      .map((region) => region.id)
      .sort();

    expect(confirmedIds).toEqual(["samtskhe-javakheti", "tbilisi"]);
    expect(
      getRegionsForSpecies(species.id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(confirmedIds);
  });
});
