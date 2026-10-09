import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import {
  toSpeciesCard,
  toSpeciesCards,
  toSpeciesIndexRows,
} from "@/data/speciesCard";

describe("species cards", () => {
  it("copies identity fields and index stats from a catalog species", () => {
    const species = getCatalogSpecies()[0];
    expect(toSpeciesCard(species).id).toBe(species.id);
    expect(toSpeciesCards([species])).toEqual([toSpeciesCard(species)]);
    expect(toSpeciesIndexRows([species])[0].id).toBe(species.id);
  });
});
