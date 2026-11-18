import { describe, expect, it } from "vitest";

import { getRegionContent } from "@/data/regionContent";
import { regions } from "@/data/regions";
import { regionHabitatKind } from "@/lib/regionHabitatKind";

describe("regionHabitatKind", () => {
  it.each([
    ["Humid subtropical forests.", "forest"],
    ["Wooded valleys.", "forest"],
    ["High-mountain forests", "forest"],
    ["Mountain valleys.", "mountain"],
    ["Dry foothills", "mountain"],
    ["Volcanic plateaus", "mountain"],
    ["Black Sea coast and humid lowlands.", "water"],
    ["Highland lakes", "water"],
    ["River valleys.", "water"],
    ["Alazani valley", "open"],
    ["Subalpine meadows", "open"],
    ["Semi-arid zones", "open"],
    ["Suburban valleys.", "settlement"],
    ["Parks and green areas.", "settlement"],
  ])("reads %s as %s", (text, kind) => {
    expect(regionHabitatKind(text)).toBe(kind);
  });

  it("returns null for a habitat it does not know", () => {
    expect(regionHabitatKind("Caves")).toBeNull();
  });

  it("knows every habitat listed on a region page", () => {
    for (const region of regions) {
      for (const habitat of getRegionContent(region.id).habitats) {
        expect(regionHabitatKind(habitat.en), habitat.en).not.toBeNull();
      }
    }
  });
});
