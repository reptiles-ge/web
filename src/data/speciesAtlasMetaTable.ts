import type { SpeciesAtlasMeta } from "@/data/speciesAtlasMeta";

import { speciesAtlasMetaById } from "@/data/speciesAtlasMeta.generated";

export const speciesAtlasMeta: Readonly<Record<string, SpeciesAtlasMeta>> =
  speciesAtlasMetaById;

export function getSpeciesAtlasMeta(id: string): SpeciesAtlasMeta {
  return (
    speciesAtlasMeta[id] ?? {
      group: "snake",
      habitats: ["forest"],
    }
  );
}
