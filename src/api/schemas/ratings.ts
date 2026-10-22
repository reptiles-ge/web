import { z } from "zod";

import { ratingInputSchema } from "@/lib/ratingInput";

const RATING_SUMMARY_MAX_DAYS = 365;

export const ratingBody = ratingInputSchema.and(
  z.object({
    country: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .nullish()
      .catch(null)
      .transform((value) => value ?? null),
  }),
);

export const ratingSummaryQuery = z.object({
  days: z.coerce.number().int().min(1).max(RATING_SUMMARY_MAX_DAYS).default(30),
});
