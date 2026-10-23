import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import {
  NEWS_SCHEMA_IMAGE_MIN_WIDTH,
  newsSchemaCrops,
} from "@/data/newsSchemaImages";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { newsOgImageDimensions, newsOgImageUrl } from "@/lib/news";
import {
  type AtlasPhotoSource,
  getNewsImageSrc,
  newsImageRights,
  type NewsSpecies,
} from "@/lib/newsVisual";
import { absoluteImageUrl } from "@/lib/site";

export type NewsHeroImage = {
  height: number;
  src: string;
  url: string;
  width: number;
};

export function newsHeroImage(
  article: NewsArticle,
  catalog: readonly NewsSpecies[],
): NewsHeroImage | null {
  const src = getNewsImageSrc(article, catalog);
  if (!src) return null;
  const entry = optimizedEntry(src);
  if (entry) {
    return {
      height: entry.height,
      src,
      url: optimizedImgSrc(src, entry.width),
      width: entry.width,
    };
  }
  const photo = article.image?.src === src ? article.image : undefined;
  if (!photo?.width || !photo.height) return null;
  return {
    height: photo.height,
    src,
    url: absoluteImageUrl(src),
    width: photo.width,
  };
}

export function newsSchemaImages(
  article: NewsArticle,
  locale: AppLocale,
  catalog: readonly NewsSpecies[],
  photos: readonly AtlasPhotoSource[],
) {
  const rights = newsImageRights(article, locale, catalog, photos);
  const ogImage = newsOgImageUrl(article, catalog);
  const images = [
    imageObject(ogImage, newsOgImageDimensions(article, catalog), rights),
  ];
  const hero = newsHeroImage(article, catalog);
  if (!hero || hero.width < NEWS_SCHEMA_IMAGE_MIN_WIDTH) return images;

  const seen = new Set([ogImage]);
  if (ogImage === absoluteImageUrl(hero.src)) seen.add(hero.url);
  const candidates = [...newsSchemaCrops(hero.src), hero];
  for (const candidate of candidates) {
    if (seen.has(candidate.url)) continue;
    seen.add(candidate.url);
    images.push(
      imageObject(
        candidate.url,
        { height: candidate.height, width: candidate.width },
        rights,
      ),
    );
  }
  return images;
}

function imageObject(
  url: string,
  dimensions: { height?: number; width?: number },
  rights: ReturnType<typeof newsImageRights>,
) {
  return {
    "@type": "ImageObject" as const,
    contentUrl: url,
    url,
    ...dimensions,
    ...rights,
  };
}
