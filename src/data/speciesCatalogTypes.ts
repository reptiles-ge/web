import type { SpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import type { Species, SpeciesSummary } from "@/data/speciesTypes";

export type CatalogCard = CatalogExtras &
  SpeciesSummary & { photoCount: number };

export type CatalogFullSpecies = CatalogExtras & Species;

type CatalogExtras = SpeciesAtlasMeta & { lookalikes: string[]; slug: string };
