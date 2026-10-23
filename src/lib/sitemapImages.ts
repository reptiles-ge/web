import type { Species } from "@/data/species";

import { optimizedImgSrc } from "@/data/optimizedImages";
import { absoluteImageUrl, absoluteUrl, CDN_BASE } from "@/lib/site";
import { isPlaceholderMedia } from "@/lib/speciesContent";

const MAX_SITEMAP_IMAGES = 8;

const FIRST_PARTY_IMAGE_HOSTS = new Set([
  new URL(absoluteUrl("/")).host,
  new URL(CDN_BASE).host,
]);

export function creditAuthorPageImageUrls(
  portraitSrc: string,
  photos: Array<{ src: string }>,
): string[] {
  return collectImageUrls(
    [portraitSrc, ...photos.map((photo) => photo.src)],
    MAX_SITEMAP_IMAGES,
  );
}

export function guidePageImageUrls(srcs: Array<string | undefined>) {
  return collectImageUrls(srcs, MAX_SITEMAP_IMAGES);
}

export function speciesPageImageUrls(
  species: Pick<Species, "gallery" | "image" | "mobileImage">,
): string[] {
  return collectImageUrls([
    species.image,
    species.mobileImage,
    ...species.gallery.map((photo) => photo.src),
  ]);
}

function collectImageUrls(
  srcs: Array<string | undefined>,
  limit = Number.POSITIVE_INFINITY,
) {
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const src of srcs) {
    if (urls.length >= limit) break;
    const url = sitemapImageUrl(src);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

function sitemapImageUrl(src: string | undefined) {
  if (!src || isPlaceholderMedia(src)) return null;
  const url = absoluteImageUrl(optimizedImgSrc(src));
  if (!URL.canParse(url)) return null;
  return FIRST_PARTY_IMAGE_HOSTS.has(new URL(url).host) ? url : null;
}
