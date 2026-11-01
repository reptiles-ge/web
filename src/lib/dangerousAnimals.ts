import type { DangerLevel } from "@/data/species";

import { type AnimalGroup, getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { type CatalogCard } from "@/lib/speciesCatalogApi";

export const BITE_GUIDES = [
  { href: "/snakes/gvelis-nakbeni", key: "snakeBite" },
  { href: "/snakes/giurzas-nakbeni", key: "gyurzaBite" },
  { href: "/spiders/obobis-nakbeni", key: "spiderBite" },
  { href: "/scorpions/morielis-nakbeni", key: "scorpionSting" },
  { href: "/insects/tkipis-nakbeni", key: "tickBite" },
] as const;

type DangerousAnimalGuide = (typeof BITE_GUIDES)[number];

const [SNAKE_BITE, GYURZA_BITE, SPIDER_BITE, SCORPION_STING] = BITE_GUIDES;

const GROUP_GUIDES: Partial<Record<AnimalGroup, DangerousAnimalGuide>> = {
  scorpion: SCORPION_STING,
  snake: SNAKE_BITE,
  spider: SPIDER_BITE,
};

export type DangerousAnimalRow = {
  commonName: string;
  danger: Extract<DangerLevel, "High" | "Moderate">;
  guide?: DangerousAnimalGuide;
  id: string;
  location: string;
  scientificName: string;
};

const GROUP_RANK: Partial<Record<AnimalGroup, number>> = {
  scorpion: 2,
  snake: 0,
  spider: 1,
};
const DANGER_RANK = { High: 0, Moderate: 1 } as const;

export function dangerousAnimalRows(
  catalog: readonly CatalogCard[],
): DangerousAnimalRow[] {
  return catalog
    .flatMap((item, index) => {
      if (item.danger !== "High" && item.danger !== "Moderate") return [];
      const { group } = getSpeciesAtlasMeta(item.id);
      const guide =
        item.id === "macrovipera-lebetina" ? GYURZA_BITE : GROUP_GUIDES[group];
      return [
        {
          index,
          rank: GROUP_RANK[group] ?? 3,
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
