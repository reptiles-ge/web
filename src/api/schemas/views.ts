import { z } from "zod";

import { contentViewInputSchema } from "@/lib/contentViewInput";

import { pageQuery } from "./common";

export const VIEW_PERIOD_DAYS = ["1", "7", "30"] as const;

export const viewBody = contentViewInputSchema;

export const adminViewListQuery = pageQuery.extend({
  days: z
    .enum(VIEW_PERIOD_DAYS)
    .optional()
    .transform((value) => (value === undefined ? undefined : Number(value))),
  kind: contentViewInputSchema.shape.kind.optional(),
  q: z.string().trim().max(100).optional(),
});
