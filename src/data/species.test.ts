import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";

describe("catalog publish", () => {
  it("omits unpublished dolichophis-caspius", () => {
    expect(
      getCatalogSpecies().some((item) => item.id === "dolichophis-caspius"),
    ).toBe(false);
    expect(getSpeciesById("dolichophis-caspius")).toBeUndefined();
  });

  it("includes published snakes used on live pages", () => {
    expect(getSpeciesById("macrovipera-lebetina")?.id).toBe(
      "macrovipera-lebetina",
    );
  });
});
