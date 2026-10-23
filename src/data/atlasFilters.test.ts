import { describe, expect, it } from "vitest";

import type { AtlasIndexItem } from "@/data/speciesListItem";

import { defaultAtlasFilters, filterAtlasSpecies } from "@/data/atlasFilters";

const giurza: AtlasIndexItem = {
  commonName: "გიურზა",
  danger: "High",
  hasPhoto: true,
  id: "macrovipera-lebetina",
  location: "კახეთი",
  regionIds: ["kakheti"],
  scientificName: "Macrovipera lebetinus",
  searchText: "გიურზა blunt-nosed viper macrovipera lebetinus viperidae კახეთი",
};

const grassSnake: AtlasIndexItem = {
  commonName: "ჩვეულებრივი ანკარა",
  danger: "Harmless",
  hasPhoto: true,
  id: "natrix-natrix",
  location: "კოლხეთი",
  regionIds: [],
  scientificName: "Natrix natrix",
  searchText: "ჩვეულებრივი ანკარა grass snake natrix natrix colubridae კოლხეთი",
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
