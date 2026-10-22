import { z } from "zod";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";

import { localeQuery } from "./common";

export const ANIMAL_GROUPS = [
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
  locale: localeQuery,
});

export const speciesParam = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
});

export const speciesDetailQuery = z.object({
  locale: localeQuery,
});
