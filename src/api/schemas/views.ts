import { z } from "zod";

import { locales } from "@/i18n/locales";
import { contentViewInputSchema } from "@/lib/contentViewInput";
import { pageViewInputSchema } from "@/lib/pageViewInput";
import { TRAFFIC_SOURCE_IDS } from "@/lib/trafficSource";

import { listSearch, pageQuery } from "./common";

const VIEW_PERIOD_DAYS = ["1", "7", "30"] as const;

const viewPeriod = z
  .enum(VIEW_PERIOD_DAYS)
  .optional()
  .transform((value) => (value === undefined ? undefined : Number(value)));

export const viewBody = z.union([pageViewInputSchema, contentViewInputSchema]);

export const adminViewListQuery = pageQuery.extend({
  days: viewPeriod,
  kind: contentViewInputSchema.shape.kind.optional(),
  q: listSearch,
});

export const adminPageViewListQuery = pageQuery.extend({
  days: viewPeriod,
  lang: z.enum(locales).optional(),
  q: listSearch,
});

export const adminTrafficSourceListQuery = adminPageViewListQuery.extend({
  source: z.enum(TRAFFIC_SOURCE_IDS).optional(),
});
