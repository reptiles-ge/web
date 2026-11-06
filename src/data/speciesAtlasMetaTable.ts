import type {
  AnimalGroup,
  HabitatTag,
  SpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";

import { speciesAtlasMetaById } from "@/data/speciesAtlasMeta.generated";

export const speciesAtlasMeta: Readonly<Record<string, SpeciesAtlasMeta>> =
  speciesAtlasMetaById;

type SpeciesWithMeta = {
  group?: AnimalGroup;
  habitats?: readonly HabitatTag[];
  id: string;
};

export function getSpeciesAtlasMeta(id: string): SpeciesAtlasMeta {
  return (
    speciesAtlasMeta[id] ?? {
      group: "snake",
      habitats: ["forest"],
    }
  );
}

export function speciesGroup(species: SpeciesWithMeta): AnimalGroup {
  return species.group ?? getSpeciesAtlasMeta(species.id).group;
}

export function speciesHabitats(
  species: SpeciesWithMeta,
): readonly HabitatTag[] {
  return species.habitats ?? getSpeciesAtlasMeta(species.id).habitats;
}
