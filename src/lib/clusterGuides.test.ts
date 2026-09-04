import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { CLUSTER_GUIDES, isDarevskiaSpecies, isSnakeSpecies } from "@/lib/clusterGuides";

describe("isSnakeSpecies", () => {
  it("treats published snakes as snakes", () => {
    const snake = getSpeciesById("macrovipera-lebetina");
    expect(snake).toBeDefined();
    expect(isSnakeSpecies(snake!)).toBe(true);
  });

  it("never treats the glass lizard as a snake", () => {
    const glassLizard = getSpeciesById("pseudopus-apodus");
    expect(glassLizard).toBeDefined();
    expect(isSnakeSpecies(glassLizard!)).toBe(false);
  });

  it("keeps the quiz pool free of glass lizards", () => {
    const snakes = getCatalogSpecies().filter(isSnakeSpecies);
    expect(snakes.some((item) => item.id === "pseudopus-apodus")).toBe(false);
    expect(snakes.some((item) => item.id === "macrovipera-lebetina")).toBe(
      true,
    );
  });
});
