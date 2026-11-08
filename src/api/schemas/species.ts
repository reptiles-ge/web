import { z } from "zod";

import { ANIMAL_GROUPS } from "@/lib/animalGroups";

import { listSearch, pageQuery, speciesIdText } from "./common";
import { SPECIES_STATUSES } from "./speciesRecord";

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
