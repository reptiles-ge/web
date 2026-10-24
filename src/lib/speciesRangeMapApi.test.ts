import { describe, expect, it } from "vitest";

import { getSpeciesRangeMap } from "./speciesRangeMapApi";

describe("getSpeciesRangeMap", () => {
  it("reads the map settings and the texts of one locale", async () => {
    const ka = await getSpeciesRangeMap("trachemys-scripta", "ka");
    expect(ka).toMatchObject({
      iNaturalistTaxonId: 39782,
      rangeSource: "record-summary",
    });
    expect(ka?.copy.rangeTitle).toBe(
      "სად არის წითელყურა კუ დაფიქსირებული საქართველოში",
    );
    const en = await getSpeciesRangeMap("trachemys-scripta", "en");
    expect(en?.copy.rangeTitle).toBe(
      "Where pond sliders are recorded in Georgia",
    );
  });

  it("keeps a species threshold", async () => {
    expect(
      (await getSpeciesRangeMap("aquila-chrysaetos", "en"))?.confirmedThreshold,
    ).toBe(4);
  });

  it("answers null for a species without a map or an unknown id", async () => {
    expect(await getSpeciesRangeMap("bubo-bubo", "en")).toBeNull();
    expect(await getSpeciesRangeMap("no-such-species", "en")).toBeNull();
  });
});
