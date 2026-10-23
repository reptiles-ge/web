import type { DangerLevel } from "@/data/speciesTypes";

export type AtlasCardItem = Pick<
  SpeciesListItem,
  | "commonName"
  | "danger"
  | "id"
  | "image"
  | "location"
  | "mobileImage"
  | "regionIds"
  | "scientificName"
>;

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
  updatedAt: string;
};
