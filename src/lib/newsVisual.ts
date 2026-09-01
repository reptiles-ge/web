import type { NewsArticle } from "@/data/news";
import { newsRelatedRegions, newsRelatedSpecies } from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import type { PhotoCredit } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { isPlaceholderMedia } from "@/lib/speciesContent";

export type NewsVisual = {
  src: string;
  alt: string;
  credit?: PhotoCredit;
};

export function newsCategoryHub(article: NewsArticle): GroupHubId | undefined {
  return article.relatedHubIds[0];
}

export function getNewsVisual(
  article: NewsArticle,
  locale: AppLocale,
): NewsVisual | null {
  const species = newsRelatedSpecies(article)[0];
  if (species && !isPlaceholderMedia(species.image)) {
    const item = localizeSpecies(species, locale);
    return {
      src: species.image,
      alt: speciesPhotoAlt(
        item.commonName,
        item.scientificName,
        item.location,
        item.imageCredit,
      ),
      credit: item.imageCredit,
    };
  }

  const region = newsRelatedRegions(article)[0];
  if (region) {
    const name = localizeRegionText(region.name, locale);
    return {
      src: getRegionHeroImage(region.id),
      alt: name,
    };
  }

  return null;
}
