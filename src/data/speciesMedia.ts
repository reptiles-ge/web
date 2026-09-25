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
  antsInHouseBait:
    "https://cdn.reptiles.ge/external/ant-bait-station-along-skirting-board.jpg",
  antsInHouseCleaning:
    "https://cdn.reptiles.ge/external/ants-countertop-cleaning-soapy-water.jpg",
  antsInHouseGap:
    "https://cdn.reptiles.ge/external/ants-entering-through-pipe-gap-kitchen.jpg",
  antsInHouseHero:
    "https://cdn.reptiles.ge/external/ants-kitchen-trail-crumbs-spilled-juice.jpg",
  antsInHouseSealing:
    "https://cdn.reptiles.ge/external/ants-home-sealing-skirting-board-crack.jpg",
  batInHouseHero: "/images/guides/bat-house-hero.jpg",
  batInHouseRoost: "/images/guides/bat-roost-natural.jpg",
  batInHouseWall: "/images/guides/bat-on-wall.jpg",
  cta: "https://cdn.reptiles.ge/landing-cta-cover.jpeg",
  detail: "https://cdn.reptiles.ge/vipera-dinnik-3.webp",
  hero: "https://cdn.reptiles.ge/hero-img.webp",
  mouseInHouseCleanup:
    "https://cdn.reptiles.ge/external/mouse-dropping-disinfectant-cleanup.jpg",
  mouseInHouseHero:
    "https://cdn.reptiles.ge/external/house-mouse-kitchen-skirting-board-gap.jpg",
  mouseInHouseSealing:
    "https://cdn.reptiles.ge/external/mouse-entry-gap-steel-wool-sealant.jpg",
  mouseInHouseSigns:
    "https://cdn.reptiles.ge/external/mouse-signs-pantry-chewed-package.jpg",
  mouseInHouseTrap:
    "https://cdn.reptiles.ge/external/mouse-snap-trap-against-skirting-board.jpg",
  scorpionStingCoolCompress:
    "https://cdn.reptiles.ge/images/guides/scorpion-sting-cool-compress.jpg",
  scorpionStingHero:
    "https://cdn.reptiles.ge/images/guides/scorpion-sting-hero.jpg",
  snakeBiteCall112:
    "https://cdn.reptiles.ge/images/guides/snake-bite-call-112.jpg",
  snakeBiteClinicalAssessment:
    "https://cdn.reptiles.ge/images/guides/snake-bite-clinical-assessment.jpg",
  snakeBiteHero: "https://cdn.reptiles.ge/images/guides/snake-bite-hero.jpg",
  snakeBiteKeepDistance:
    "https://cdn.reptiles.ge/images/guides/snake-bite-keep-distance.jpg",
  snakeBiteRemoveRing:
    "https://cdn.reptiles.ge/images/guides/snake-bite-remove-ring.jpg",
  stinkBugInHouseGap:
    "https://cdn.reptiles.ge/images/guides/stink-bug-window-gap.jpg",
  stinkBugInHouseHero:
    "https://cdn.reptiles.ge/images/guides/stink-bug-house-hero.jpg",
  stinkBugInHouseSealing:
    "https://cdn.reptiles.ge/images/guides/stink-bug-sealing-frame.jpg",
  stinkBugInHouseSoapyWater:
    "https://cdn.reptiles.ge/images/guides/stink-bug-soapy-water.jpg",
  waspNestComb: "/images/guides/wasp-nest-open-comb.jpg",
  waspNestHero: "/images/guides/wasp-nest-enclosed.jpg",
};
