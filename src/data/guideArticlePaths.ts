export const GUIDE_ARTICLE_PATHS = [
  "/insects/farosana-sakhlshi",
  "/insects/krazanis-bude",
  "/mammals/ghamura-sakhlshi",
] as const;

export type GuideArticlePath = (typeof GUIDE_ARTICLE_PATHS)[number];
