import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import {
  CLUSTER_GUIDES,
  isBirdSpecies,
  isDarevskiaSpecies,
  isMammalSpecies,
  isSnakeSpecies,
} from "@/lib/clusterGuides";

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

describe("Darevskia cluster", () => {
  it("matches catalog Darevskia one by one", () => {
    const darevskia = getCatalogSpecies().filter(isDarevskiaSpecies);
    expect(darevskia.length).toBeGreaterThan(1);
    expect(new Set(darevskia.map((item) => item.id)).size).toBe(
      darevskia.length,
    );
    expect(CLUSTER_GUIDES["lizard-darevskia"].pathname).toBe(
      "/lizards/darevskia",
    );
    expect(darevskia.every((item) => item.genus === "Darevskia")).toBe(true);
  });
});

describe("bird and mammal indexes", () => {
  it("lists published birds and mammals on dedicated index paths", () => {
    expect(CLUSTER_GUIDES["bird-index"].pathname).toBe("/birds/saxeoebebi");
    expect(CLUSTER_GUIDES["mammal-index"].pathname).toBe(
      "/mammals/saxeoebebi",
    );
    const catalog = getCatalogSpecies();
    const birds = catalog.filter(isBirdSpecies);
    const mammals = catalog.filter(isMammalSpecies);
    expect(birds.length).toBeGreaterThan(0);
    expect(mammals.length).toBeGreaterThan(0);
    expect(birds.every((item) => CLUSTER_GUIDES["bird-index"].matches(item))).toBe(
      true,
    );
    expect(
      mammals.every((item) => CLUSTER_GUIDES["mammal-index"].matches(item)),
    ).toBe(true);
  });
});
