import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import {
  NEWS_SCHEMA_IMAGE_MIN_WIDTH,
  newsSchemaCrops,
} from "@/data/newsSchemaImages";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { newsOgImageDimensions, newsOgImageUrl } from "@/lib/news";
import { getNewsImageSrc, newsImageRights } from "@/lib/newsVisual";
import { absoluteImageUrl } from "@/lib/site";

export type NewsHeroImage = {
  height: number;
  src: string;
  url: string;
  width: number;
};

export function newsHeroImage(article: NewsArticle): NewsHeroImage | null {
  const src = getNewsImageSrc(article);
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

export function newsSchemaImages(article: NewsArticle, locale: AppLocale) {
  const rights = newsImageRights(article, locale);
  const ogImage = newsOgImageUrl(article);
  const images = [imageObject(ogImage, newsOgImageDimensions(article), rights)];
  const hero = newsHeroImage(article);
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
