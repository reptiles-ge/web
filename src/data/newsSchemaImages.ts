import manifest from "./newsSchemaImages.json";

export type NewsSchemaCrop = {
  height: number;
  ratio: string;
  url: string;
  width: number;
};

export const NEWS_SCHEMA_IMAGE_MIN_WIDTH = 1200;

export const NEWS_SCHEMA_RATIOS = [
  { height: 675, id: "16x9", width: 1200 },
  { height: 900, id: "4x3", width: 1200 },
  { height: 1200, id: "1x1", width: 1200 },
] as const;

const entries: Record<string, readonly NewsSchemaCrop[]> = manifest.entries;

export function newsSchemaCrops(src: string): readonly NewsSchemaCrop[] {
  return entries[src] ?? [];
}
