import { z } from "zod";

import { REGION_IDS } from "../lib/catalogFilter";
import { speciesIdText } from "./common";
import { ANIMAL_GROUPS } from "./species";
import { HABITATS } from "./speciesRecord";

const CATALOG_MAX_LIMIT = 100;

export const catalogQuery = z
  .object({
    cursor: speciesIdText.optional(),
    danger: z.enum(["harmless", "venomous"]).optional(),
    group: z.enum(ANIMAL_GROUPS).optional(),
    habitat: z.enum(HABITATS).optional(),
    limit: z.coerce.number().int().min(1).max(CATALOG_MAX_LIMIT).optional(),
    page: z.coerce.number().int().min(1).optional(),
    q: z.string().trim().max(100).optional(),
    region: z.enum(REGION_IDS as [string, ...string[]]).optional(),
    sort: z
      .enum(["catalog", "featured", "az", "range", "updated"])
      .default("catalog"),
    view: z.enum(["card", "full", "photos", "quiz"]).default("card"),
  })
  .refine((query) => query.page === undefined || query.limit !== undefined, {
    message: "page needs limit",
    path: ["page"],
  })
  .refine((query) => query.page === undefined || query.cursor === undefined, {
    message: "Use page or cursor, not both",
    path: ["page"],
  });
