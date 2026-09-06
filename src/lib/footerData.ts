import type { AppLocale } from "@/i18n/routing";
import type { SpeciesHref } from "@/lib/speciesRoutes";

import { localizeRegionText, regions } from "@/data/regions";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

export type FooterData = {
  regions: FooterRegionLink[];
  venomous: FooterSpeciesLink[];
};

export type FooterRegionLink = {
  href: ReturnType<typeof regionHref>;
  id: string;
  name: string;
};

export type FooterSpeciesLink = {
  commonName: string;
  href: SpeciesHref;
  id: string;
  scientificName: string;
};

export function getFooterData(locale: AppLocale): FooterData {
  return {
    regions: regions.map((region) => ({
      href: regionHref(region.id),
      id: region.id,
      name: localizeRegionText(region.name, locale),
    })),
    venomous: getVenomousCatalogSpecies()
      .map((item) => localizeSpecies(item, locale))
      .map((item) => ({
        commonName: item.commonName,
        href: speciesHref(item.id, locale),
        id: item.id,
        scientificName: item.scientificName,
      })),
  };
}
