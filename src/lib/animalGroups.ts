import type { AnimalGroup } from "@/data/speciesAtlasMeta";

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
] as const satisfies readonly AnimalGroup[];
