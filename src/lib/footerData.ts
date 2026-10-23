import type { AppLocale } from "@/i18n/routing";
import type { CatalogCard } from "@/lib/speciesCatalogApi";
import type { SpeciesHref } from "@/lib/speciesRoutes";

import { localizeRegionText, regions } from "@/data/regions";
import {
  type AtlasStats,
  pickVenomousSnakes,
  summarizeAtlas,
} from "@/data/speciesAtlas";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

export type FooterData = {
  regions: FooterRegionLink[];
  stats: AtlasStats;
  venomous: FooterSpeciesLink[];
};

type FooterRegionLink = {
  href: ReturnType<typeof regionHref>;
  id: string;
  name: string;
};

type FooterSpeciesLink = {
  commonName: string;
  href: SpeciesHref;
  id: string;
  scientificName: string;
};

export function getFooterData(
  locale: AppLocale,
  catalog: readonly CatalogCard[],
): FooterData {
  return {
    regions: regions.map((region) => ({
      href: regionHref(region.id),
      id: region.id,
      name: localizeRegionText(region.name, locale),
    })),
    stats: summarizeAtlas(catalog),
    venomous: pickVenomousSnakes(catalog).map((item) => ({
      commonName: item.commonName,
      href: speciesHref(item.id, locale),
      id: item.id,
      scientificName: item.scientificName,
    })),
  };
}
