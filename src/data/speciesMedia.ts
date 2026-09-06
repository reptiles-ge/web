import type { GalleryImage, PhotoCredit } from "./speciesTypes";

export function hasPhotoCredit(credit?: PhotoCredit): credit is PhotoCredit {
  return Boolean(credit?.photographer || credit?.location || credit?.date);
}

export function mergeGallery(
  base: GalleryImage[],
  translated?: GalleryImage[],
): GalleryImage[] {
  if (!translated?.length) return base;
  const bySrc = new Map(translated.map((item) => [item.src, item]));
  return base.map((item) => {
    const extra = bySrc.get(item.src);
    if (!extra) return item;
    const credit = overlayPhotoCredit(item.credit, extra.credit);
    return credit ? { credit, src: item.src } : { src: item.src };
  });
}

export function overlayPhotoCredit(
  base?: PhotoCredit,
  extra?: PhotoCredit,
): PhotoCredit | undefined {
  const photographer = extra?.photographer ?? base?.photographer;
  const url = extra?.url ?? base?.url;
  const location = extra?.location ?? base?.location;
  const date = extra?.date ?? base?.date;
  const merged: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(url ? { url } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
  };
  return hasPhotoCredit(merged) ? merged : undefined;
}

export function resolvePhotoCredit(
  ...credits: Array<PhotoCredit | undefined>
): PhotoCredit | undefined {
  return credits.find(hasPhotoCredit);
}

export const images = {
  cta: "https://cdn.reptiles.ge/landing-cta-cover.jpeg",
  detail: "https://cdn.reptiles.ge/vipera-dinnik-3.webp",
  hero: "https://cdn.reptiles.ge/hero-img.webp",
};
