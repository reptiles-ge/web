import { describe, expect, it } from "vitest";

import {
  mergeINaturalistFieldRecords,
  observationToFieldRecord,
  replaceFieldRecordsInMdx,
} from "./inaturalistFieldRecords";

describe("observationToFieldRecord", () => {
  it("maps iNaturalist lng/lat coordinates and observer names", () => {
    expect(
      observationToFieldRecord({
        geojson: { coordinates: [44.804764, 41.685804] },
        id: 316753344,
        observed_on: "2025-09-26",
        place_guess: "Old Tbilisi, Georgia",
        user: { login: "hsde66", name: "Nino Beridze" },
      }),
    ).toEqual({
      date: "2025-09-26",
      lat: 41.6858,
      lng: 44.80476,
      locality: "Old Tbilisi, Georgia",
      note: "iNaturalist observation #316753344",
      observer: "hsde66",
      observerName: "Nino Beridze",
      url: "https://www.inaturalist.org/observations/316753344",
    });
  });

  it("keeps username-only observers without inventing a full name", () => {
    expect(
      observationToFieldRecord({
        geojson: { coordinates: [41.7304, 41.6845] },
        id: 401822281,
        place_guess: "Kobuleti",
        user: { login: "hikuta", name: null },
      }),
    ).toMatchObject({
      observer: "hikuta",
    });
    expect(
      observationToFieldRecord({
        geojson: { coordinates: [41.7304, 41.6845] },
        id: 401822281,
        place_guess: "Kobuleti",
        user: { login: "hikuta", name: null },
      }),
    ).not.toHaveProperty("observerName");
  });
});

describe("mergeINaturalistFieldRecords", () => {
  it("dedupes existing and imported records by observation id and coordinate", () => {
    const result = mergeINaturalistFieldRecords({
      existing: [
        {
          date: "2024-01-01",
          evidence: "observation",
          lat: 41.1,
          lng: 44.1,
          locality: "Tbilisi",
          note: "iNaturalist observation #1",
        },
        {
          date: "2024-01-02",
          evidence: "observation",
          lat: 41.1,
          lng: 44.1,
          locality: "Duplicate Tbilisi",
        },
      ],
      observations: [
        {
          geojson: { coordinates: [44.2, 41.2] },
          id: 1,
          place_guess: "Same observation",
        },
        {
          geojson: { coordinates: [44.1, 41.1] },
          id: 2,
          place_guess: "Same coordinate",
        },
        {
          geojson: { coordinates: [44.3, 41.3] },
          id: 3,
          place_guess: "New place",
        },
      ],
    });

    expect(result.added).toBe(1);
    expect(result.records).toHaveLength(2);
    expect(result.skippedDuplicateCoordinates).toBe(1);
    expect(result.skippedDuplicateObservations).toBe(1);
    expect(result.skippedExistingDuplicateCoordinates).toBe(1);
  });
});

describe("replaceFieldRecordsInMdx", () => {
  it("replaces the fieldRecords frontmatter block", () => {
    expect(
      replaceFieldRecordsInMdx(
        [
          "---",
          "id: test",
          "fieldRecords:",
          "  - locality: Old",
          "    lat: 1",
          "    lng: 2",
          "scientificName: Test test",
          "---",
          "",
          "Body",
        ].join("\n"),
        [{ evidence: "observation", lat: 41.2, lng: 44.3, locality: "New" }],
      ),
    ).toContain(
      [
        "fieldRecords:",
        "  - locality: New",
        "    lat: 41.2",
        "    lng: 44.3",
      ].join("\n"),
    );
  });
});
