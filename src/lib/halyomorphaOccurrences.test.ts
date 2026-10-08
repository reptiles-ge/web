import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { getRegionsForSpecies } from "@/data/mapRegions";
import { getSpeciesById } from "@/data/species";

import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
  occurrenceStatusForCount,
} from "./halyomorphaOccurrences";

const fieldRecordsById = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src/data/fieldRecords.generated.json"),
    "utf8",
  ),
) as Record<string, SpeciesFieldRecord[]>;

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
    const bearThreshold = confirmedRecordThresholdForSpecies("ursus-arctos");
    expect(occurrenceStatusForCount(7, bearThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(8, bearThreshold)).toBe("confirmed");
    const weaselThreshold =
      confirmedRecordThresholdForSpecies("mustela-nivalis");
    expect(occurrenceStatusForCount(0, weaselThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, weaselThreshold)).toBe("confirmed");
    const renardiThreshold =
      confirmedRecordThresholdForSpecies("vipera-renardi");
    expect(occurrenceStatusForCount(0, renardiThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, renardiThreshold)).toBe("confirmed");
    const zamenisThreshold = confirmedRecordThresholdForSpecies(
      "zamenis-hohenackeri",
    );
    expect(occurrenceStatusForCount(0, zamenisThreshold)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, zamenisThreshold)).toBe("confirmed");
    const karakurtThreshold = confirmedRecordThresholdForSpecies(
      "latrodectus-tredecimguttatus",
    );
    expect(occurrenceStatusForCount(0, karakurtThreshold)).toBe(
      "recorded-only",
    );
    expect(occurrenceStatusForCount(1, karakurtThreshold)).toBe("confirmed");
    const longissimusThreshold = confirmedRecordThresholdForSpecies(
      "zamenis-longissimus",
    );
    expect(occurrenceStatusForCount(0, longissimusThreshold)).toBe(
      "recorded-only",
    );
    expect(occurrenceStatusForCount(1, longissimusThreshold)).toBe("confirmed");
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

  it("counts iNaturalist records only for trusted sources or hostnames", () => {
    const count = (url?: string, source?: string) =>
      getHalyomorphaOccurrenceSummary(
        [
          {
            accessibleLabel: "Test record",
            id: "test-record",
            imageAlt: "Test record",
            kind: "location",
            lat: 41.7,
            lng: 44.8,
            locality: "Tbilisi",
            source,
            url,
          },
        ],
        "en",
      ).iNaturalistRecordCount;

    expect(count("https://inaturalist.org/observations/123")).toBe(1);
    expect(count("https://www.inaturalist.org/observations/123")).toBe(1);
    expect(count("https://INATURALIST.ORG/observations/123")).toBe(1);
    expect(count("https://inaturalist.org.evil.example/observations/123")).toBe(
      0,
    );
    expect(count("https://evil.example/inaturalist.org")).toBe(0);
    expect(count("https://inaturalist.org@evil.example/observations/123")).toBe(
      0,
    );
    expect(count("not a URL with inaturalist.org")).toBe(0);
    expect(count(undefined, "iNaturalist")).toBe(1);
  });

  it("uses only confirmed Zamenis regions as distribution", () => {
    const species = getSpeciesById("zamenis-hohenackeri");
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
      confirmedRecordThresholdForSpecies(species.id),
    );
    const confirmedIds = summary.recordsByRegion
      .filter((region) => region.status === "confirmed")
      .map((region) => region.id)
      .sort();

    expect(confirmedIds).toEqual([
      "kvemo-kartli",
      "mtskheta-mtianeti",
      "samtskhe-javakheti",
      "shida-kartli",
      "tbilisi",
    ]);
    expect(
      getRegionsForSpecies(species.id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(confirmedIds);
  });

  it("keeps Golden Jackal distribution aligned with reviewed field records", () => {
    const species = getSpeciesById("canis-aureus");
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
      confirmedRecordThresholdForSpecies(species.id),
    );

    expect(summary.totalRecords).toBe(21);
    expect(
      summary.recordsByRegion
        .map(({ count, id, status }) => ({ count, id, status }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    ).toEqual([
      { count: 4, id: "adjara", status: "confirmed" },
      { count: 5, id: "kakheti", status: "confirmed" },
      { count: 5, id: "kvemo-kartli", status: "confirmed" },
      { count: 5, id: "mtskheta-mtianeti", status: "confirmed" },
      { count: 1, id: "samegrelo-zemo-svaneti", status: "confirmed" },
      { count: 1, id: "samtskhe-javakheti", status: "confirmed" },
    ]);
    expect(
      getRegionsForSpecies(species.id)
        .map((region) => region.id)
        .sort(),
    ).toEqual([
      "adjara",
      "kakheti",
      "kvemo-kartli",
      "mtskheta-mtianeti",
      "samegrelo-zemo-svaneti",
      "samtskhe-javakheti",
    ]);
  });

  it("confirms Artvin lizard regions from five records", () => {
    const species = getSpeciesById("darevskia-derjugini");
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
      confirmedRecordThresholdForSpecies(species.id),
    );

    expect(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    ).toEqual([
      "abkhazia",
      "adjara",
      "guria",
      "imereti",
      "kakheti",
      "mtskheta-mtianeti",
      "racha",
      "samegrelo-zemo-svaneti",
      "samtskhe-javakheti",
    ]);
    expect(
      summary.recordsByRegion
        .filter((region) => region.status === "recorded-only")
        .map((region) => region.id)
        .sort(),
    ).toEqual(["kvemo-kartli", "shida-kartli", "tbilisi"]);
    expect(
      getRegionsForSpecies(species.id)
        .map((region) => region.id)
        .sort(),
    ).toEqual([
      "abkhazia",
      "adjara",
      "guria",
      "imereti",
      "kakheti",
      "mtskheta-mtianeti",
      "racha",
      "samegrelo-zemo-svaneti",
      "samtskhe-javakheti",
    ]);
  });

  it("uses checklist localities, not obscured point counts, for Caucasian Salamander regions", () => {
    const species = getSpeciesById("mertensiella-caucasica");
    expect(species).toBeDefined();
    if (!species) return;

    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(records, "ka");

    expect(summary.totalRecords).toBe(19);
    expect(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    ).toEqual(["adjara", "guria", "samtskhe-javakheti", "shida-kartli"]);
    expect(
      summary.recordsByRegion.filter(
        (region) => region.status === "recorded-only",
      ),
    ).toEqual([]);
  });
});
