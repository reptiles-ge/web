import type { PhotoCredit, Species } from "@/data/species";

import { hasPublishedCreditAuthorPage } from "@/data/creditAuthors";
import { absoluteImageUrl } from "@/lib/site";
import { isPlaceholderMedia } from "@/lib/speciesContent";

const MAX_SITEMAP_IMAGES = 8;

export function creditAuthorPageImageUrls(
  portraitSrc: string,
  photos: Array<{ src: string }>,
): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  function push(src?: string) {
    if (!src || isPlaceholderMedia(src) || urls.length >= MAX_SITEMAP_IMAGES) {
      return;
    }
    const url = absoluteImageUrl(src);
    if (seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  }

  push(portraitSrc);
  for (const photo of photos) {
    push(photo.src);
  }
  return urls;
}

export function speciesPageImageUrls(species: Species): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  function push(src?: string, credit?: PhotoCredit) {
    if (!src || isPlaceholderMedia(src) || urls.length >= MAX_SITEMAP_IMAGES) {
      return;
    }
    if (!hasPublishedCreditAuthorPage(credit?.photographer)) return;
    const url = absoluteImageUrl(src);
    if (seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  }

  push(species.image, species.imageCredit);
  push(species.mobileImage, species.mobileImageCredit);
  for (const photo of species.gallery) {
    push(photo.src, photo.credit);
  }
  return urls;
}
