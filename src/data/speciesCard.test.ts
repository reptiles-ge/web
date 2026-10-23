import { describe, expect, it } from "vitest";

import {
  toSpeciesCard,
  toSpeciesCards,
  toSpeciesIndexRows,
} from "@/data/speciesCard";

import { catalogSpeciesFixture } from "../../tests/fixtures/speciesCatalog";

describe("species cards", () => {
  it("copies identity fields and index stats from a catalog species", () => {
    const species = catalogSpeciesFixture()[0];
    expect(toSpeciesCard(species).id).toBe(species.id);
    expect(toSpeciesCards([species])).toEqual([toSpeciesCard(species)]);
    expect(toSpeciesIndexRows([species])[0].id).toBe(species.id);
  });
});
