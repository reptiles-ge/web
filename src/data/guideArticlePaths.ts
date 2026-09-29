export const GUIDE_ARTICLE_PATHS = [
  "/insects/chianchvelebi-sakhlshi",
  "/insects/farosana-sakhlshi",
  "/insects/futkari-krazana-onavari",
  "/insects/krazanis-bude",
  "/insects/tkipis-nakbeni",
  "/mammals/ghamura-sakhlshi",
  "/mammals/tagvi-sakhlshi",
  "/scorpions/morielis-nakbeni",
  "/snakes/giurzas-nakbeni",
  "/snakes/gvelis-nakbeni",
] as const;

export type GuideArticlePath = (typeof GUIDE_ARTICLE_PATHS)[number];
