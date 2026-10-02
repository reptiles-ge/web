export const GUIDE_ARTICLE_PATHS = [
  "/insects/baghlinjo-sakhlshi",
  "/insects/chianchvelebi-sakhlshi",
  "/insects/chrchili-tansatsmelshi",
  "/insects/farosana-sakhlshi",
  "/insects/krazanis-bude",
  "/insects/koghoebi-sakhlshi-da-ezoshi",
  "/insects/rtsqilebi-sakhlshi",
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
