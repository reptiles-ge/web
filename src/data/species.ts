import type { Species } from "./speciesTypes";

import { species } from "./species.generated";
import { featuredSpeciesIds, unpublishedSpeciesIds } from "./speciesPublish";

export { featuredSpeciesIds, unpublishedSpeciesIds } from "./speciesPublish";

export {
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesFieldRecord,
  type SpeciesSource,
  type SpeciesStat,
} from "./speciesTypes";

const catalogSpeciesIds = [...featuredSpeciesIds] as const;

export function getCatalogSpecies() {
  const byId = new Map(species.map((item) => [item.id, item]));
  const catalog: Species[] = [];
  for (const id of catalogSpeciesIds) {
    if (unpublishedSpeciesIds.has(id)) continue;
    const item = byId.get(id);
    if (item) catalog.push(item);
  }
  return catalog;
}
