import { z } from "zod";

import { newsSeriesIds } from "@/data/newsSeries";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import { speciesIdText } from "./common";

const NEWS_MAX_LIMIT = 100;

export const newsListQuery = z.object({
  author: speciesIdText.optional(),
  cursor: speciesIdText.optional(),
  hub: z
    .enum(Object.keys(GROUP_HUBS) as [GroupHubId, ...GroupHubId[]])
    .optional(),
  limit: z.coerce.number().int().min(1).max(NEWS_MAX_LIMIT).optional(),
  region: speciesIdText.optional(),
  series: z.enum(newsSeriesIds).optional(),
  species: speciesIdText.optional(),
});

export const newsParam = z.object({
  slug: speciesIdText,
});
