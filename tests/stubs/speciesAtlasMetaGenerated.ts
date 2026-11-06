import type { SpeciesAtlasMeta } from "@/data/speciesAtlasMeta";

import { lazySeedRecord, seedSpecies } from "./seedRecord";

export const speciesAtlasMetaById: Record<string, SpeciesAtlasMeta> =
  lazySeedRecord(() =>
    Object.fromEntries(
      seedSpecies().map((item) => [
        item.id,
        { group: item.group, habitats: item.habitats },
      ]),
    ),
  );
