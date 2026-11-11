import type { SpeciesGroup } from "@/data/speciesAtlasMeta";

export const ANIMAL_GROUPS = [
  "amphibian",
  "bird",
  "fish",
  "insect",
  "lizard",
  "mammal",
  "scorpion",
  "snake",
  "spider",
  "turtle",
] as const satisfies readonly SpeciesGroup[];
