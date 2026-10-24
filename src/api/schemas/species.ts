import { z } from "zod";

import { ANIMAL_GROUPS } from "@/lib/animalGroups";

import { listSearch, pageQuery, speciesIdText } from "./common";

const SPECIES_STATUSES = ["draft", "published", "unpublished"] as const;

export const adminSpeciesListQuery = pageQuery.extend({
  group: z.enum(ANIMAL_GROUPS).optional(),
  q: listSearch,
  status: z.enum(SPECIES_STATUSES).optional(),
});

export const speciesListQuery = z.object({
  group: z.enum(ANIMAL_GROUPS).optional(),
});

export const speciesParam = z.object({
  slug: speciesIdText,
});
