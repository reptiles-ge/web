import { z } from "zod";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";

import { speciesIdText } from "./common";

const ANIMAL_GROUPS = [
  "amphibian",
  "bird",
  "insect",
  "lizard",
  "mammal",
  "scorpion",
  "snake",
  "spider",
  "turtle",
] as const satisfies readonly AnimalGroup[];

export const speciesListQuery = z.object({
  group: z.enum(ANIMAL_GROUPS).optional(),
});

export const speciesParam = z.object({
  idOrSlug: speciesIdText,
});
