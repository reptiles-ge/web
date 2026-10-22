import { z } from "zod";

import { speciesIdText } from "./common";

const CATALOG_MAX_LIMIT = 100;

export const catalogQuery = z.object({
  cursor: speciesIdText.optional(),
  limit: z.coerce.number().int().min(1).max(CATALOG_MAX_LIMIT).optional(),
  view: z.enum(["card", "full", "quiz"]).default("card"),
});
