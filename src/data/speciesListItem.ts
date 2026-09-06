import type { DangerLevel } from "@/data/speciesTypes";

export type SpeciesListItem = {
  commonName: string;
  danger?: DangerLevel;
  description: string;
  family: string;
  genus: string;
  id: string;
  image: string;
  location: string;
  mobileImage?: string;
  scientificName: string;
  searchText: string;
  updatedAt: string;
};
