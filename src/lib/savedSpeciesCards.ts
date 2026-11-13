import type { CatalogCard } from "@/data/speciesCatalogTypes";
import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { atlasSpeciesImage } from "@/data/atlasFilters";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { optimizedImgSrc } from "@/data/optimizedImages";
import { speciesGroup } from "@/data/speciesAtlasMetaTable";
import { getPathname } from "@/i18n/navigation";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { absoluteUrl } from "@/lib/site";
import { speciesImage } from "@/lib/speciesContent";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { type SpeciesHref, speciesHref } from "@/lib/speciesRoutes";

export type SavedSpeciesCard = {
  commonName: string;
  danger: DangerLevel | null;
  href: SpeciesHref;
  id: string;
  publicUrl: string;
  regions: string[];
  scientificName: string;
  thumb: string;
};

const THUMB_WIDTH = 640;

export function buildSavedSpeciesCards(
  catalog: CatalogCard[],
  locale: AppLocale,
): SavedSpeciesCard[] {
  return catalog.map((item) => {
    const group = speciesGroup(item);
    const href = speciesHref({ group, id: item.id, slug: item.slug }, locale);
    const photo = atlasSpeciesImage({
      image: speciesImage(item),
      mobileImage: item.mobileImage,
    });
    return {
      commonName: item.commonName,
      danger: getSpeciesRiskChip(item, group)?.level ?? null,
      href,
      id: item.id,
      publicUrl: absoluteUrl(getPathname({ href, locale })).replace(
        /^https?:\/\//,
        "",
      ),
      regions: getRegionsForSpecies(item.id).map((region) =>
        localizeRegionText(region.name, locale),
      ),
      scientificName: item.scientificName,
      thumb: optimizedImgSrc(
        photo || GROUP_HUB_ILLUSTRATIONS[ANIMAL_GROUP_TO_HUB[group]],
        THUMB_WIDTH,
      ),
    };
  });
}
