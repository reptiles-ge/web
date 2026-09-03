import type { GalleryImage, PhotoCredit, Species } from "./speciesTypes";

import { species } from "./species.generated";
import {
  featuredSpeciesIds,
  unpublishedSpeciesIds,
} from "./speciesPublish";

export { featuredSpeciesIds, unpublishedSpeciesIds } from "./speciesPublish";

export {
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesIdentification,
  type SpeciesSource,
  type SpeciesStat,
} from "./speciesTypes";

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

export const catalogSpeciesIds = [...featuredSpeciesIds] as const;

export function getCatalogSpecies() {
  const catalog: Species[] = [];
  for (const id of catalogSpeciesIds) {
    if (!isPublishedSpeciesId(id)) continue;
    const item = getSpeciesById(id);
    if (item) catalog.push(item);
  }
  return catalog;
}

export { species };

export function getSpeciesById(id: string) {
  if (!isPublishedSpeciesId(id)) return undefined;
  return species.find((item) => item.id === id);
}

export function isPublishedSpeciesId(id: string) {
  return !unpublishedSpeciesIds.has(id);
}
