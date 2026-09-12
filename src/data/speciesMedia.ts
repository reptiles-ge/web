import { hasPhotoCoordinates } from "@/lib/photoCoordinates";

import type { GalleryImage, PhotoCredit } from "./speciesTypes";

export function hasPhotoCredit(credit?: PhotoCredit): credit is PhotoCredit {
  return Boolean(
    credit?.photographer ||
      credit?.location ||
      credit?.date ||
      hasPhotoCoordinates(credit),
  );
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
    const photoConfidence = extra.photoConfidence ?? item.photoConfidence;
    return {
      ...(credit ? { credit } : {}),
      ...(photoConfidence ? { photoConfidence } : {}),
      src: item.src,
    };
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
  const lat = base?.lat ?? extra?.lat;
  const lng = base?.lng ?? extra?.lng;
  const photoConfidence = extra?.photoConfidence ?? base?.photoConfidence;
  const merged: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(url ? { url } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
    ...(typeof lat === "number" && typeof lng === "number" ? { lat, lng } : {}),
    ...(photoConfidence ? { photoConfidence } : {}),
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
