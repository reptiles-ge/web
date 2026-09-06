import { describe, expect, it } from "vitest";

import { buildSpeciesSlugMaps } from "@/lib/speciesSlugRules";

describe("species slug rules", () => {
  it("uses KA slug overrides", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "ignored",
        hub: "snakes",
        id: "macrovipera-lebetina",
      },
    ]);
    expect(maps.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(maps.idByAnySlug.giurza).toBe("macrovipera-lebetina");
    expect(maps.hubById["macrovipera-lebetina"]).toBe("snakes");
  });

  it("does not collide with reserved hub slugs", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "species",
        hub: "snakes",
        id: "fake-reserved",
      },
    ]);
    expect(maps.kaSlugById["fake-reserved"]).toBe("species-reserved");
  });
});
