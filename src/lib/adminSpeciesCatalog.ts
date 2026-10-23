import type { AnimalGroup } from "@/data/speciesAtlas";

import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export type AdminSpeciesSummary = {
  commonName: string;
  galleryCount: number;
  group: AnimalGroup;
  id: string;
  image: string;
  scientificName: string;
};

const SPECIES_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSpeciesId(id: string) {
  return SPECIES_ID_RE.test(id);
}

export async function listAdminSpecies(): Promise<AdminSpeciesSummary[]> {
  const catalog = await getSpeciesCatalog("ka");
  return catalog
    .map((item) => ({
      commonName: item.commonName,
      galleryCount: item.photoCount,
      group: item.group,
      id: item.id,
      image: item.image,
      scientificName: item.scientificName,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
