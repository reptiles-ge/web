import type { NewsArticle, NewsPhoto } from "@/data/news";
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
  fromAtlas: boolean;
  plate: boolean;
};

export function newsCategoryHub(article: NewsArticle): GroupHubId | undefined {
  return article.relatedHubIds[0];
}

export function localizeNewsPhoto(
  photo: NewsPhoto,
  locale: AppLocale,
): NewsVisual {
  return {
    src: photo.src,
    alt: photo.alt[locale],
    credit: photo.credit,
    fromAtlas: Boolean(photo.fromAtlas),
    plate: Boolean(photo.plate),
  };
}

export function getNewsImageSrc(article: NewsArticle): string | null {
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
      src: species.image,
      alt: speciesPhotoAlt(
        item.commonName,
        item.scientificName,
        item.location,
        item.imageCredit,
      ),
      credit: item.imageCredit,
      fromAtlas: true,
      plate: false,
    };
  }

  const region = newsRelatedRegions(article)[0];
  if (region) {
    const name = localizeRegionText(region.name, locale);
    return {
      src: getRegionHeroImage(region.id),
      alt: name,
      fromAtlas: true,
      plate: false,
    };
  }

  return null;
}
