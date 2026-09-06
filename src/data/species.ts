import type { Species } from "./speciesTypes";

import { species } from "./species.generated";
import { featuredSpeciesIds, unpublishedSpeciesIds } from "./speciesPublish";

export {
  featuredSpeciesIds,
  unpublishedSpeciesIds,
} from "./speciesPublish";

export {
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesSource,
  type SpeciesStat,
} from "./speciesTypes";

export const catalogSpeciesIds = [...featuredSpeciesIds] as const;

export function getCatalogSpecies() {
  const catalog: Species[] = [];
  for (const id of catalogSpeciesIds) {
    if (!isPublishedSpeciesId(id)) continue;
    const item = getSpeciesById(id);
    if (item) catalog.push(item);
  }
  return catalog;
}

export { species };

export function getSpeciesById(id: string) {
  if (!isPublishedSpeciesId(id)) return undefined;
  return species.find((item) => item.id === id);
}

export function isPublishedSpeciesId(id: string) {
  return !unpublishedSpeciesIds.has(id);
}
