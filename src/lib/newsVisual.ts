import type { NewsArticle, NewsPhoto } from "@/data/news";
import type { PhotoCredit } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { newsRelatedRegions, newsRelatedSpecies } from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";

export type NewsVisual = {
  alt: string;
  credit?: PhotoCredit;
  fromAtlas: boolean;
  plate: boolean;
  src: string;
};

export function getNewsImageSrc(article: NewsArticle): null | string {
  if (article.image?.src) return article.image.src;

  const species = newsRelatedSpecies(article)[0];
  if (species && !isPlaceholderMedia(species.image)) {
    return species.image;
  }

  const region = newsRelatedRegions(article)[0];
  if (region) {
    return getRegionHeroImage(region.id);
  }

  return null;
}

export function getNewsVisual(
  article: NewsArticle,
  locale: AppLocale,
): NewsVisual | null {
  if (article.image) {
    return localizeNewsPhoto(article.image, locale);
  }

  const species = newsRelatedSpecies(article)[0];
  if (species && !isPlaceholderMedia(species.image)) {
    const item = localizeSpecies(species, locale);
    return {
      alt: speciesPhotoAlt(
        item.commonName,
        item.scientificName,
        item.location,
        item.imageCredit,
      ),
      credit: item.imageCredit,
      fromAtlas: true,
      plate: false,
      src: species.image,
    };
  }

  const region = newsRelatedRegions(article)[0];
  if (region) {
    const name = localizeRegionText(region.name, locale);
    return {
      alt: name,
      fromAtlas: true,
      plate: false,
      src: getRegionHeroImage(region.id),
    };
  }

  return null;
}

export function localizeNewsPhoto(
  photo: NewsPhoto,
  locale: AppLocale,
): NewsVisual {
  return {
    alt: photo.alt[locale],
    credit: photo.credit,
    fromAtlas: Boolean(photo.fromAtlas),
    plate: Boolean(photo.plate),
    src: photo.src,
  };
}

export function newsCategoryHub(article: NewsArticle): GroupHubId | undefined {
  return article.relatedHubIds[0];
}
