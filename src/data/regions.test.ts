import { describe, expect, it } from "vitest";

import { getRegionContent } from "@/data/regionContent";
import { localizeRegionTextIfPresent, regions } from "@/data/regions";
import { getCatalogSpecies, unpublishedSpeciesIds } from "@/data/species";

describe("region speciesIds", () => {
  it("only lists published catalog ids", () => {
    const published = new Set(getCatalogSpecies().map((item) => item.id));
    for (const region of regions) {
      for (const id of region.speciesIds) {
        expect(unpublishedSpeciesIds.has(id), `${region.id}:${id}`).toBe(
          false,
        );
        expect(published.has(id), `${region.id}:${id}`).toBe(true);
      }
    }
  });
});

describe("region FAQ locale gating", () => {
  it("omits English-only FAQ copy for Russian", () => {
    const content = getRegionContent("adjara");
    for (const entry of content.faq) {
      expect(localizeRegionTextIfPresent(entry.question, "ru")).toBeNull();
      expect(localizeRegionTextIfPresent(entry.answer, "ru")).toBeNull();
      expect(localizeRegionTextIfPresent(entry.question, "ka")).toBeTruthy();
    }
  });
});
