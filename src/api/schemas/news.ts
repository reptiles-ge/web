import { z } from "zod";

import { newsSeriesIds } from "@/data/newsSeries";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import { pageQuery, speciesIdText } from "./common";

export const newsListQuery = pageQuery.extend({
  author: speciesIdText.optional(),
  hub: z
    .enum(Object.keys(GROUP_HUBS) as [GroupHubId, ...GroupHubId[]])
    .optional(),
  q: z.string().trim().max(100).optional(),
  region: speciesIdText.optional(),
  series: z.enum(newsSeriesIds).optional(),
  species: speciesIdText.optional(),
});

export const newsParam = z.object({
  slug: speciesIdText,
});
