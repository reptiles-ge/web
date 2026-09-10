import { describe, expect, it } from "vitest";

import { speciesArticleSpatialCoverage } from "@/lib/speciesSpatialCoverage";

describe("speciesArticleSpatialCoverage", () => {
  it("always includes Georgia as Country", () => {
    const coverage = speciesArticleSpatialCoverage("anas-platyrhynchos", "en");
    expect(coverage[0]).toEqual({
      "@type": "Country",
      name: "Georgia",
    });
  });

  it("adds AdministrativeArea places for mapped atlas regions", () => {
    const coverage = speciesArticleSpatialCoverage("vipera-kaznakovi", "ka");
    expect(coverage[0]).toEqual({
      "@type": "Country",
      name: "საქართველო",
    });
    expect(coverage.length).toBeGreaterThan(1);
    for (const place of coverage.slice(1)) {
      expect(place["@type"]).toBe("AdministrativeArea");
      if (place["@type"] !== "AdministrativeArea") continue;
      expect(place).toMatchObject({
        containedInPlace: {
          "@type": "Country",
          name: "საქართველო",
        },
      });
      expect(place.name.length).toBeGreaterThan(0);
      expect(place.url.startsWith("http")).toBe(true);
    }
  });
});
