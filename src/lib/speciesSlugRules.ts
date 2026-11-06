import type { GroupHubId } from "@/lib/groupHubs";

export type PublishedSlugRow = {
  hub: GroupHubId;
  id: string;
  slug: string;
  slugAliases: readonly string[];
};

export type SpeciesSlugMaps = {
  hubById: Record<string, GroupHubId>;
  idByAnySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
};

export function buildPublishedSlugMaps(
  rows: PublishedSlugRow[],
): SpeciesSlugMaps {
  const hubById: Record<string, GroupHubId> = {};
  const idByAnySlug: Record<string, string> = {};
  const kaSlugById: Record<string, string> = {};

  for (const row of rows) {
    hubById[row.id] = row.hub;
    kaSlugById[row.id] = row.slug;
    idByAnySlug[row.id] = row.id;
    idByAnySlug[row.slug] = row.id;
    for (const alias of row.slugAliases) idByAnySlug[alias] = row.id;
  }

  return { hubById, idByAnySlug, kaSlugById };
}
