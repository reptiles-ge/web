import { z } from "zod";

import { locales } from "@/i18n/locales";
import { needsFeedback, normalizeFeedback } from "@/lib/ratingFeedback";

export const ratingInputSchema = z
  .object({
    feedback: z.unknown().optional().transform(normalizeFeedback),
    locale: z.enum(locales),
    path: z
      .string()
      .max(300)
      .regex(/^\/(?!\/)[^\s\\]*$/),
    rating: z.int().min(1).max(5),
  })
  .refine((value) => !needsFeedback(value.rating) || value.feedback, {
    message: "Feedback is required below 5 stars",
    path: ["feedback"],
  });

export function ratingPageUrl(path: string, origin: string | URL) {
  try {
    const base = new URL(origin);
    const url = new URL(path, base);
    return url.origin === base.origin ? url.href : null;
  } catch {
    return null;
  }
}
