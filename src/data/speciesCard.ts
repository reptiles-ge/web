import type { Species } from "@/data/speciesTypes";

import {
  getSpeciesActivityStat,
  getSpeciesHabitatStat,
  getSpeciesSizeStat,
} from "@/lib/speciesContent";

declare const speciesCardBrand: unique symbol;

export type SpeciesCard = Pick<
  Species,
  | "commonName"
  | "danger"
  | "description"
  | "family"
  | "genus"
  | "id"
  | "image"
  | "location"
  | "mobileImage"
  | "scientificName"
> & { readonly [speciesCardBrand]: true };

export type SpeciesIndexRow = SpeciesCard & {
  activity: null | string;
  habitat: null | string;
  size: null | string;
};

export function toSpeciesCard(species: Species): SpeciesCard {
  return {
    commonName: species.commonName,
    danger: species.danger,
    description: species.description,
    family: species.family,
    genus: species.genus,
    id: species.id,
    image: species.image,
    location: species.location,
    mobileImage: species.mobileImage,
    scientificName: species.scientificName,
  } as SpeciesCard;
}

export function toSpeciesCards(list: readonly Species[]): SpeciesCard[] {
  return list.map(toSpeciesCard);
}

export function toSpeciesIndexRows(
  list: readonly Species[],
): SpeciesIndexRow[] {
  return list.map((species) => ({
    ...toSpeciesCard(species),
    activity: getSpeciesActivityStat(species),
    habitat: getSpeciesHabitatStat(species),
    size: getSpeciesSizeStat(species),
  }));
}
