import type { AppLocale } from "@/i18n/routing";
import type { SpeciesHref } from "@/lib/speciesRoutes";

import { localizeRegionText, regions } from "@/data/regions";
import {
  type AtlasStats,
  getAtlasStats,
  getVenomousCatalogSpecies,
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

export async function getFooterData(locale: AppLocale): Promise<FooterData> {
  const [stats, venomous] = await Promise.all([
    getAtlasStats(locale),
    getVenomousCatalogSpecies(locale),
  ]);
  return {
    regions: regions.map((region) => ({
      href: regionHref(region.id),
      id: region.id,
      name: localizeRegionText(region.name, locale),
    })),
    stats,
    venomous: venomous.map((item) => ({
      commonName: item.commonName,
      href: speciesHref(item.id, locale),
      id: item.id,
      scientificName: item.scientificName,
    })),
  };
}
