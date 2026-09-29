export const GUIDE_ARTICLE_PATHS = [
  "/insects/chianchvelebi-sakhlshi",
  "/insects/farosana-sakhlshi",
  "/insects/krazanis-bude",
  "/insects/taraknebi-sakhlshi",
  "/insects/tkipis-nakbeni",
  "/mammals/ghamura-sakhlshi",
  "/mammals/tagvi-sakhlshi",
  "/scorpions/morielis-nakbeni",
  "/scorpions/morieli-sakhlshi",
  "/snakes/giurzas-nakbeni",
  "/snakes/gvelis-nakbeni",
] as const;

export type GuideArticlePath = (typeof GUIDE_ARTICLE_PATHS)[number];
