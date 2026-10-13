import type { CreditAuthor } from "@/data/creditAuthors";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { PhotoCredit } from "@/data/speciesTypes";

import { photoLicenses } from "@/data/photoLicenses";
import { getCatalogSpecies } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { isCoverCrop } from "@/lib/coverCrop";
import { photoContributor } from "@/lib/imageRights";
import { isPlaceholderMedia } from "@/lib/speciesContent";

export type PhotoUsePhoto = {
  author?: CreditAuthor;
  credit?: PhotoCredit;
  group: AnimalGroup;
  speciesId: string;
  src: string;
};

export const PHOTO_USE_SHOWCASE_GROUPS: readonly AnimalGroup[] = [
  "snake",
  "lizard",
  "amphibian",
  "turtle",
  "bird",
  "mammal",
  "spider",
  "scorpion",
];

const CC_PREFIX = "https://creativecommons.org/";

export function getPhotoUseCreditExample(
  photos: PhotoUsePhoto[] = getPhotoUsePhotos(),
) {
  const photo = photos.find(
    (item) =>
      !item.author &&
      item.credit?.photographer?.trim() &&
      item.credit.url &&
      photoLicenses[item.src]?.license?.startsWith(CC_PREFIX),
  );
  if (!photo) return undefined;
  return {
    licenseUrl: photoLicenses[photo.src].license as string,
    photo,
    sourceUrl: photo.credit?.url as string,
  };
}

export function getPhotoUsePhotos(): PhotoUsePhoto[] {
  const seen = new Set<string>();
  const photos: PhotoUsePhoto[] = [];
  for (const species of getCatalogSpecies()) {
    const group = getSpeciesAtlasMeta(species.id).group;
    for (const item of species.gallery) {
      if (!item.src || seen.has(item.src)) continue;
      if (isCoverCrop(item.src) || isPlaceholderMedia(item.src)) continue;
      seen.add(item.src);
      photos.push({
        author: photoContributor(item.credit),
        credit: item.credit,
        group,
        speciesId: species.id,
        src: item.src,
      });
    }
  }
  return photos;
}

export function getPhotoUseShowcase(
  photos: PhotoUsePhoto[] = getPhotoUsePhotos(),
) {
  const usedAuthors = new Set<string>();
  const picks: Array<PhotoUsePhoto & { author: CreditAuthor }> = [];
  for (const group of PHOTO_USE_SHOWCASE_GROUPS) {
    const candidates = photos.filter(
      (photo): photo is PhotoUsePhoto & { author: CreditAuthor } =>
        photo.group === group && Boolean(photo.author),
    );
    const pick =
      candidates.find((photo) => !usedAuthors.has(photo.author.id)) ??
      candidates[0];
    if (!pick) continue;
    usedAuthors.add(pick.author.id);
    picks.push(pick);
  }
  return picks;
}

export function getPhotoUseStats(
  photos: PhotoUsePhoto[] = getPhotoUsePhotos(),
) {
  const authors = new Set<string>();
  let contributors = 0;
  let open = 0;
  for (const photo of photos) {
    const name = photo.credit?.photographer?.trim();
    if (name) authors.add(photo.author?.id ?? name);
    if (photo.author) contributors += 1;
    else if (photoLicenses[photo.src]?.license?.startsWith(CC_PREFIX)) {
      open += 1;
    }
  }
  return { authors: authors.size, contributors, open, photos: photos.length };
}

export function photoLicenseLabel(url: string) {
  const path = url.slice(CC_PREFIX.length).replace(/\/$/, "").split("/");
  if (path[0] === "publicdomain") {
    return path[1] === "zero" ? `CC0 ${path[2]}` : "Public Domain Mark";
  }
  const [, kind, version, port] = path;
  return ["CC", kind.toUpperCase(), version, port?.toUpperCase()]
    .filter(Boolean)
    .join(" ");
}
