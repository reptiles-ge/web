import type { NewsArticle, NewsPhoto } from "@/data/news";
import type {
  PhotoCredit,
  SpeciesPhotoFields,
  SpeciesSummary,
} from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";
import type { ContributorDirectory } from "@/lib/contributorCredits";
import type { GroupHubId } from "@/lib/groupHubs";

import { newsRelatedRegions, newsRelatedSpecies } from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import { photoRights, siteImageRights } from "@/lib/imageRights";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";

export type AtlasPhotoSource = Pick<
  SpeciesPhotoFields,
  "gallery" | "image" | "imageCredit"
>;

export type NewsSpecies = Pick<
  SpeciesSummary,
  "commonName" | "id" | "image" | "imageCredit" | "scientificName"
>;

export type NewsVisual = {
  alt: string;
  credit?: PhotoCredit;
  fromAtlas: boolean;
  plate: boolean;
  src: string;
};

type NewsVisualSource = Pick<
  NewsArticle,
  "image" | "relatedRegionIds" | "relatedSpeciesIds"
>;

export function getNewsImageSrc(
  article: NewsVisualSource,
  catalog: readonly NewsSpecies[],
): null | string {
  if (article.image?.src) return article.image.src;

  const species = newsAtlasSpecies(article, catalog);
  if (species) return species.image;

  const region = newsRelatedRegions(article)[0];
  if (region) {
    return getRegionHeroImage(region.id);
  }

  return null;
}

export function getNewsVisual(
  article: NewsVisualSource,
  locale: AppLocale,
  catalog: readonly NewsSpecies[],
  contributors: ContributorDirectory,
): NewsVisual | null {
  if (article.image) {
    return localizeNewsPhoto(article.image, locale);
  }

  const item = newsAtlasSpecies(article, catalog);
  if (item) {
    return {
      alt: speciesPhotoAlt(
        item.commonName,
        item.scientificName,
        item.imageCredit,
        contributors,
      ),
      credit: item.imageCredit,
      fromAtlas: true,
      plate: false,
      src: item.image,
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
    alt: photo.alt[locale] ?? photo.alt.ka,
    credit: photo.credit,
    fromAtlas: Boolean(photo.fromAtlas),
    plate: Boolean(photo.plate),
    src: photo.src,
  };
}

export function newsAtlasSpecies<T extends NewsSpecies>(
  article: Pick<NewsArticle, "relatedSpeciesIds">,
  catalog: readonly T[],
): T | undefined {
  const species = newsRelatedSpecies(article, catalog)[0];
  return species && !isPlaceholderMedia(species.image) ? species : undefined;
}

export function newsCategoryHub(
  article: Pick<NewsArticle, "relatedHubIds">,
): GroupHubId | undefined {
  return article.relatedHubIds[0];
}

export function newsImageRights(
  article: NewsArticle,
  locale: AppLocale,
  catalog: readonly NewsSpecies[],
  photos: readonly AtlasPhotoSource[],
  contributors: ContributorDirectory,
) {
  const visual = getNewsVisual(article, locale, catalog, contributors);
  if (!visual) return siteImageRights(locale);
  return photoRights(
    visual.src,
    visual.credit ?? atlasPhotoCredit(visual.src, photos),
    locale,
    contributors,
  );
}

function atlasPhotoCredit(src: string, photos: readonly AtlasPhotoSource[]) {
  for (const species of photos) {
    const photo = species.gallery.find((item) => item.src === src);
    if (photo?.credit) return photo.credit;
    if (species.image === src && species.imageCredit) {
      return species.imageCredit;
    }
  }
  return undefined;
}
