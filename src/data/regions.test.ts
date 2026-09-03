import { describe, expect, it } from "vitest";

import { regions } from "@/data/regions";
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
