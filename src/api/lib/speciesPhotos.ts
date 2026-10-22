import type { GalleryImage, PhotoCredit } from "@/data/speciesTypes";

import { matchesCoverSource } from "@/lib/coverCrop";

import type { SpeciesRecord } from "../db/speciesRows";

import { TRANSLATION_LOCALES } from "../db/speciesRows";
import { ApiError } from "./errors";

export type CoverTarget = "both" | "desktop" | "mobile";

type Coordinates = { lat: number; lng: number };

export function removePhoto(record: SpeciesRecord, src: string) {
  const { base } = record;
  const index = base.gallery.findIndex((item) => item.src === src);
  if (index < 0) throw unknownPhoto(src);
  const remaining = base.gallery.filter((item) => item.src !== src);
  const replacement = remaining[Math.min(index, remaining.length - 1)];
  if (!replacement) {
    throw new ApiError(
      400,
      "invalid_request",
      "Cannot delete the last gallery photo",
    );
  }
  const target = coverTargetFor(base.image, base.mobileImage ?? "", src);
  base.gallery = remaining;
  for (const locale of TRANSLATION_LOCALES) {
    const translation = record.translations[locale];
    if (translation.gallery) {
      translation.gallery = translation.gallery.filter(
        (item) => item.src !== src,
      );
      if (translation.gallery.length === 0) delete translation.gallery;
    }
  }
  if (target) applyCover(record, target, replacement.src, replacement.src);
  return { coverReassigned: Boolean(target) };
}

export function reorderPhotos(record: SpeciesRecord, srcs: string[]) {
  const current = record.base.gallery;
  if (current.length < 2) {
    throw new ApiError(
      400,
      "invalid_request",
      "Need at least two photos to reorder",
    );
  }
  const bySrc = new Map(current.map((item) => [item.src, item]));
  if (srcs.length !== current.length || new Set(srcs).size !== srcs.length) {
    throw new ApiError(
      400,
      "invalid_request",
      "Gallery order must include every photo once",
    );
  }
  record.base.gallery = srcs.map((src) => {
    const item = bySrc.get(src);
    if (!item) throw unknownPhoto(src);
    return item;
  });
}

export function setCover(
  record: SpeciesRecord,
  target: CoverTarget,
  src: string,
  coverSrc = src,
) {
  if (!record.base.gallery.some((item) => item.src === src)) {
    throw unknownPhoto(src);
  }
  applyCover(record, target, src, coverSrc);
}

export function setPhotoCoordinates(
  record: SpeciesRecord,
  src: string,
  coordinates: Coordinates | null,
) {
  const { base } = record;
  const item = base.gallery.find((entry) => entry.src === src);
  if (!item) throw unknownPhoto(src);
  const credit = withCoordinates(item.credit, coordinates);
  setCredit(item, "credit", credit);
  if (matchesCoverSource(base.image, src)) {
    setCredit(base, "imageCredit", credit);
  }
  if (base.mobileImage && matchesCoverSource(base.mobileImage, src)) {
    setCredit(base, "mobileImageCredit", credit);
  }
  return credit;
}

function applyCover(
  record: SpeciesRecord,
  target: CoverTarget,
  src: string,
  coverSrc: string,
) {
  const { base } = record;
  const kaCredit = base.gallery.find((item) => item.src === src)?.credit;
  const desktop = target === "desktop" || target === "both";
  const mobile = target === "mobile" || target === "both";
  if (desktop) {
    base.image = coverSrc;
    setCredit(base, "imageCredit", kaCredit);
  }
  if (mobile) {
    base.mobileImage = coverSrc;
    setCredit(base, "mobileImageCredit", kaCredit);
  }
  for (const locale of TRANSLATION_LOCALES) {
    const translation = record.translations[locale];
    const overlayCredit = translation.gallery?.find(
      (item: GalleryImage) => item.src === src,
    )?.credit;
    if (desktop && translation.imageCredit) {
      setCredit(translation, "imageCredit", overlayCredit);
    }
    if (mobile && translation.mobileImageCredit) {
      setCredit(translation, "mobileImageCredit", overlayCredit);
    }
  }
}

function coverTargetFor(
  image: string,
  mobileImage: string,
  src: string,
): CoverTarget | null {
  const desktop = matchesCoverSource(image, src);
  const mobile = matchesCoverSource(mobileImage, src);
  if (desktop && mobile) return "both";
  if (desktop) return "desktop";
  if (mobile) return "mobile";
  return null;
}

function setCredit<K extends string>(
  target: Partial<Record<K, PhotoCredit>>,
  key: K,
  credit: PhotoCredit | undefined,
) {
  if (credit) target[key] = { ...credit };
  else delete target[key];
}

function unknownPhoto(src: string) {
  return new ApiError(404, "not_found", `Unknown gallery src: ${src}`);
}

function withCoordinates(
  credit: PhotoCredit | undefined,
  coordinates: Coordinates | null,
) {
  const { lat: _lat, lng: _lng, ...rest } = credit ?? {};
  const next: PhotoCredit = coordinates ? { ...rest, ...coordinates } : rest;
  return Object.keys(next).length > 0 ? next : undefined;
}
