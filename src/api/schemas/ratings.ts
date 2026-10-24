import { z } from "zod";

import { ratingInputSchema } from "@/lib/ratingInput";

export const ratingBody = ratingInputSchema.and(
  z.object({
    pages: z.unknown().optional(),
    referrer: z.unknown().optional(),
    seconds: z.unknown().optional(),
  }),
);

const ADMIN_RATINGS_MAX_LIMIT = 100;

export const adminRatingsQuery = z.object({
  cursor: z.coerce.number().int().min(1).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_RATINGS_MAX_LIMIT)
    .default(50),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});
