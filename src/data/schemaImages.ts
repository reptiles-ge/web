import manifest from "./schemaImages.json";

export type SchemaCrop = {
  height: number;
  ratio: string;
  url: string;
  width: number;
};

export const SCHEMA_IMAGE_MIN_WIDTH = 1200;

export const SCHEMA_RATIOS = [
  { height: 675, id: "16x9", width: 1200 },
  { height: 900, id: "4x3", width: 1200 },
  { height: 1200, id: "1x1", width: 1200 },
] as const;

const entries: Record<string, readonly SchemaCrop[]> = manifest.entries;

export function schemaImageCrops(src: string): readonly SchemaCrop[] {
  return entries[src] ?? [];
}
