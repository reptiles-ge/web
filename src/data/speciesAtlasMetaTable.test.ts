import { describe, expect, it } from "vitest";

import {
  getSpeciesAtlasMeta,
  speciesAtlasMeta,
  speciesGroup,
  speciesHabitats,
} from "@/data/speciesAtlasMetaTable";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

describe("species atlas meta table", () => {
  it("reads the seed in tests, not the production build", () => {
    const seed = speciesCatalogFixture("ka");
    expect(Object.keys(speciesAtlasMeta).sort()).toEqual(
      seed.map((item) => item.id).sort(),
    );
    for (const item of seed) {
      expect(getSpeciesAtlasMeta(item.id), item.id).toEqual({
        group: item.group,
        habitats: item.habitats,
      });
    }
  });

  it("prefers the group and habitats the caller already has", () => {
    const species = {
      group: "insect",
      habitats: ["forest"],
      id: "macrovipera-lebetina",
    } as const;
    expect(speciesGroup(species)).toBe("insect");
    expect(speciesHabitats(species)).toEqual(["forest"]);
  });

  it("falls back to the table when the caller has only an id", () => {
    expect(speciesGroup({ id: "macrovipera-lebetina" })).toBe("snake");
    expect(speciesHabitats({ id: "macrovipera-lebetina" })).toEqual(
      getSpeciesAtlasMeta("macrovipera-lebetina").habitats,
    );
  });

  it("keeps the snake fallback for an unknown id", () => {
    expect(getSpeciesAtlasMeta("not-a-species")).toEqual({
      group: "snake",
      habitats: ["forest"],
    });
  });
});
