import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";
import type { Species, SpeciesTranslation } from "@/data/speciesTypes";

import {
  species,
  speciesEn,
  speciesRu,
  speciesTr,
} from "@/data/species.generated";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import {
  featuredSpeciesIds,
  unpublishedSpeciesIds,
} from "@/data/speciesPublish";
import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { LOOKALIKES } from "@/lib/speciesLookalikes";
import { buildSpeciesSlugMaps } from "@/lib/speciesSlugRules";

export type SpeciesCatalogData = {
  atlasMeta: Record<string, { group: AnimalGroup; habitats: HabitatTag[] }>;
  catalogIds: string[];
  idByAnySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
  lookalikes: Record<string, string[]>;
  species: Species[];
  translations: Record<TranslationLocale, Record<string, SpeciesTranslation>>;
  unpublishedIds: string[];
};

export type TranslationLocale = "en" | "ru" | "tr";

export function speciesImportSource(): SpeciesCatalogData {
  const order = new Map<string, number>(
    featuredSpeciesIds.map((id, index) => [id, index]),
  );
  const commonNames = new Map(
    species.map((item) => [item.id, item.commonName]),
  );
  const { idByAnySlug, kaSlugById } = buildSpeciesSlugMaps(
    featuredSpeciesIds
      .filter((id) => !unpublishedSpeciesIds.has(id))
      .map((id) => ({
        commonName: commonNames.get(id) ?? id,
        hub: ANIMAL_GROUP_TO_HUB[speciesAtlasMeta[id].group],
        id,
      })),
  );
  return {
    atlasMeta: Object.fromEntries(
      featuredSpeciesIds.map((id) => {
        const meta = speciesAtlasMeta[id];
        if (!meta) throw new Error(`Missing speciesAtlasMeta for ${id}`);
        return [id, { group: meta.group, habitats: [...meta.habitats] }];
      }),
    ),
    catalogIds: [...featuredSpeciesIds],
    idByAnySlug,
    kaSlugById,
    lookalikes: Object.fromEntries(
      Object.entries(LOOKALIKES).map(([id, peers]) => [id, [...peers]]),
    ),
    species: [...species].sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
    ),
    translations: { en: speciesEn, ru: speciesRu, tr: speciesTr },
    unpublishedIds: [...unpublishedSpeciesIds],
  };
}
