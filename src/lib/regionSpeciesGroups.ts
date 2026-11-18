import type { RegionSpeciesCardItem } from "@/data/regions";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";

import { speciesGroup } from "@/data/speciesAtlasMetaTable";
import { ANIMAL_GROUP_TO_HUB, type GroupHubId } from "@/lib/groupHubs";

export type RegionSpeciesGroup = {
  group: AnimalGroup;
  hub: GroupHubId;
  items: RegionSpeciesCardItem[];
};

const GROUP_ORDER: readonly AnimalGroup[] = [
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
  "scorpion",
  "insect",
  "fish",
];

export function groupRegionSpecies(
  species: readonly RegionSpeciesCardItem[],
  locale: string,
): RegionSpeciesGroup[] {
  const byGroup = new Map<AnimalGroup, RegionSpeciesCardItem[]>();
  for (const item of species) {
    const group = speciesGroup(item);
    byGroup.set(group, [...(byGroup.get(group) ?? []), item]);
  }
  return GROUP_ORDER.flatMap((group) => {
    const items = byGroup.get(group);
    if (!items) return [];
    return [
      {
        group,
        hub: ANIMAL_GROUP_TO_HUB[group],
        items: items.toSorted((a, b) =>
          a.commonName.localeCompare(b.commonName, locale),
        ),
      },
    ];
  });
}
