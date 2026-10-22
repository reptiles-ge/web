import { z } from "zod";

import { ratingInputSchema } from "@/lib/ratingInput";

const RATING_SUMMARY_MAX_DAYS = 365;

export const ratingBody = ratingInputSchema.and(
  z.object({
    pages: z.unknown().optional(),
    referrer: z.unknown().optional(),
    seconds: z.unknown().optional(),
  }),
);

export const ratingSummaryQuery = z.object({
  days: z.coerce.number().int().min(1).max(RATING_SUMMARY_MAX_DAYS).default(30),
});
