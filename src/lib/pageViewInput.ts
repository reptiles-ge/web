import { z } from "zod";

import { locales } from "@/i18n/locales";
import { pageViewTemplate } from "@/lib/pageViewPath";

export const CLICK_ID_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
  "yclid",
  "ttclid",
  "twclid",
  "li_fat_id",
] as const;

export const UTM_SOURCE_PATTERN = /^[a-z0-9._-]{1,60}$/;

const trafficEntrySchema = z.object({
  clickId: z.enum(CLICK_ID_PARAMS).optional(),
  referrer: z
    .string()
    .max(253)
    .regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)
    .optional(),
  utmSource: z.string().regex(UTM_SOURCE_PATTERN).optional(),
});

export const pageViewInputSchema = z.object({
  entry: trafficEntrySchema.optional(),
  locale: z.enum(locales),
  path: z
    .string()
    .min(1)
    .max(200)
    .refine((path) => pageViewTemplate(path) !== undefined, "Unknown page"),
});

export type PageViewInput = z.infer<typeof pageViewInputSchema>;

export type TrafficEntry = z.infer<typeof trafficEntrySchema>;
