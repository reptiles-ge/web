export const REGION_ATLAS_GROUPS = [
  "snakes",
  "lizardsTurtles",
  "amphibians",
  "birds",
  "other",
] as const;

export type RegionAtlasGroup = (typeof REGION_ATLAS_GROUPS)[number];
