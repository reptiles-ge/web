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

  it("keeps a stable publishedAt on compiled species", () => {
    const giurza = getSpeciesById("macrovipera-lebetina");
    expect(giurza?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza!.publishedAt <= giurza!.updatedAt).toBe(true);
    expect(giurza?.publishedAt).not.toContain("Invalid");
  });
});
