import type { DangerLevel } from "@/data/species";

import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { type CatalogCard } from "@/lib/speciesCatalogApi";

export const DANGEROUS_ANIMAL_GUIDES = {
  macroviperaBite: { href: "/snakes/giurzas-nakbeni", key: "gyurzaBite" },
  scorpion: { href: "/scorpions/morielis-nakbeni", key: "scorpionSting" },
  snake: { href: "/snakes/gvelis-nakbeni", key: "snakeBite" },
  spider: { href: "/spiders/obobis-nakbeni", key: "spiderBite" },
} as const;

export type DangerousAnimalGuide =
  (typeof DANGEROUS_ANIMAL_GUIDES)[keyof typeof DANGEROUS_ANIMAL_GUIDES];

export type DangerousAnimalRow = {
  commonName: string;
  danger: Extract<DangerLevel, "High" | "Moderate">;
  guide: DangerousAnimalGuide;
  id: string;
  location: string;
  scientificName: string;
};

const GROUP_RANK = { scorpion: 2, snake: 0, spider: 1 } as const;
const DANGER_RANK = { High: 0, Moderate: 1 } as const;

export function dangerousAnimalRows(
  catalog: readonly CatalogCard[],
): DangerousAnimalRow[] {
  return catalog
    .flatMap((item, index) => {
      if (item.danger !== "High" && item.danger !== "Moderate") return [];
      const { group } = getSpeciesAtlasMeta(item.id);
      if (group !== "snake" && group !== "spider" && group !== "scorpion") {
        return [];
      }
      const guide =
        item.id === "macrovipera-lebetina"
          ? DANGEROUS_ANIMAL_GUIDES.macroviperaBite
          : DANGEROUS_ANIMAL_GUIDES[group];
      return [
        {
          index,
          rank: GROUP_RANK[group],
          row: {
            commonName: item.commonName,
            danger: item.danger,
            guide,
            id: item.id,
            location: item.location,
            scientificName: item.scientificName,
          },
        },
      ];
    })
    .sort(
      (a, b) =>
        DANGER_RANK[a.row.danger] - DANGER_RANK[b.row.danger] ||
        a.rank - b.rank ||
        a.index - b.index,
    )
    .map(({ row }) => row);
}
