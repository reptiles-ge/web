import { describe, expect, it } from "vitest";

import type { SpeciesListItem } from "@/data/speciesListItem";

import { defaultAtlasFilters, filterAtlasSpecies } from "@/data/atlasFilters";

const giurza: SpeciesListItem = {
  commonName: "გიურზა",
  danger: "High",
  description: "Card blurb",
  family: "Viperidae",
  genus: "Macrovipera",
  id: "macrovipera-lebetina",
  image: "https://cdn.reptiles.ge/macrovipera-lebetina.png",
  location: "კახეთი",
  scientificName: "Macrovipera lebetinus",
  searchText: "გიურზა blunt-nosed viper macrovipera lebetinus viperidae კახეთი",
  updatedAt: "2026-01-01T00:00:00+04:00",
};

const grassSnake: SpeciesListItem = {
  commonName: "ჩვეულებრივი ანკარა",
  danger: "Harmless",
  description: "Card blurb",
  family: "Colubridae",
  genus: "Natrix",
  id: "natrix-natrix",
  image: "https://cdn.reptiles.ge/natrix-natrix.png",
  location: "კოლხეთი",
  scientificName: "Natrix natrix",
  searchText: "ჩვეულებრივი ანკარა grass snake natrix natrix colubridae კოლხეთი",
  updatedAt: "2026-01-02T00:00:00+04:00",
};

describe("filterAtlasSpecies", () => {
  it("filters by danger without needing full profile fields", () => {
    const venomous = filterAtlasSpecies([giurza, grassSnake], {
      ...defaultAtlasFilters,
      danger: "venomous",
    });
    expect(venomous.map((item) => item.id)).toEqual(["macrovipera-lebetina"]);
  });

  it("searches names and locations, not description-only text", () => {
    const byName = filterAtlasSpecies([giurza, grassSnake], {
      ...defaultAtlasFilters,
      query: "გიურზა",
    });
    expect(byName.map((item) => item.id)).toEqual(["macrovipera-lebetina"]);

    const byDescription = filterAtlasSpecies([giurza, grassSnake], {
      ...defaultAtlasFilters,
      query: "card blurb",
    });
    expect(byDescription).toEqual([]);
  });
});
