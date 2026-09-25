export const GUIDE_ARTICLE_PATHS = [
  "/insects/chianchvelebi-sakhlshi",
  "/insects/farosana-sakhlshi",
  "/insects/krazanis-bude",
  "/mammals/ghamura-sakhlshi",
  "/mammals/tagvi-sakhlshi",
  "/scorpions/morielis-nakbeni",
  "/snakes/gvelis-nakbeni",
] as const;

export type GuideArticlePath = (typeof GUIDE_ARTICLE_PATHS)[number];
