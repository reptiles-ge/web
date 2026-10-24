import { z } from "zod";

import { ratingInputSchema } from "@/lib/ratingInput";

import { listSearch, pageQuery } from "./common";

export const ratingBody = ratingInputSchema.and(
  z.object({
    pages: z.unknown().optional(),
    referrer: z.unknown().optional(),
    seconds: z.unknown().optional(),
  }),
);

export const adminRatingsQuery = pageQuery.extend({
  q: listSearch,
  rating: z.coerce.number().int().min(1).max(5).optional(),
});
