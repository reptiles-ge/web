import { z } from "zod";

import { locales } from "@/i18n/locales";
import { contentViewInputSchema } from "@/lib/contentViewInput";
import { pageViewInputSchema } from "@/lib/pageViewInput";
import { TRAFFIC_SOURCE_IDS } from "@/lib/trafficSource";

import { listSearch, pageQuery } from "./common";

const viewDay = z.iso.date().optional();

const viewRange = pageQuery.extend({
  from: viewDay,
  q: listSearch,
  to: viewDay,
});

function orderedRange<T extends { from?: string; to?: string }>(query: T) {
  return !query.from || !query.to || query.from <= query.to;
}

const RANGE_ORDER = { message: "from must not be after to", path: ["from"] };

export const viewBody = z.union([pageViewInputSchema, contentViewInputSchema]);

export const adminViewListQuery = viewRange
  .extend({ kind: contentViewInputSchema.shape.kind.optional() })
  .refine(orderedRange, RANGE_ORDER);

const pageViewQuery = viewRange.extend({ lang: z.enum(locales).optional() });

export const adminPageViewListQuery = pageViewQuery.refine(
  orderedRange,
  RANGE_ORDER,
);

export const adminTrafficSourceListQuery = pageViewQuery
  .extend({ source: z.enum(TRAFFIC_SOURCE_IDS).optional() })
  .refine(orderedRange, RANGE_ORDER);
