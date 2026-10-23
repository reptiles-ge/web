import type { DangerLevel } from "@/data/speciesTypes";

export type AtlasIndexItem = Pick<
  SpeciesListItem,
  | "commonName"
  | "danger"
  | "id"
  | "location"
  | "regionIds"
  | "scientificName"
  | "searchText"
> & { hasPhoto: boolean };

export type AtlasPhoto = Pick<SpeciesListItem, "image" | "mobileImage">;

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
  regionIds: string[];
  scientificName: string;
  searchText: string;
  updatedAt: string;
};
