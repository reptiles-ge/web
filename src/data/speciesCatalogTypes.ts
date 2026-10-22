import type { SpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import type {
  Species,
  SpeciesPhotoFields,
  SpeciesQuizFields,
  SpeciesSummary,
} from "@/data/speciesTypes";

export type CatalogCard = CatalogExtras &
  SpeciesSummary & { photoCount: number };

export type CatalogFullSpecies = CatalogExtras & Species;

export type CatalogPhotoSpecies = CatalogExtras & SpeciesPhotoFields;

export type CatalogQuizSpecies = CatalogExtras & SpeciesQuizFields;

type CatalogExtras = SpeciesAtlasMeta & { lookalikes: string[]; slug: string };
