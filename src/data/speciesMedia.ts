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
  bedBugsAtHomeHero:
    "https://cdn.reptiles.ge/images/guides/bed-bugs-at-home-hero.jpg",
  bedBugsAtHomeSigns:
    "https://cdn.reptiles.ge/images/guides/bed-bugs-at-home-signs.jpg",
  clothesMothAdult: "/images/guides/clothes-moth-adult.jpg",
  clothesMothCloset:
    "https://cdn.reptiles.ge/images/guides/clothes-moth-closet.jpg",
  clothesMothLarva: "/images/guides/clothes-moth-larva.jpg",
  cockroachesInHouseHero: "/images/guides/cockroaches-at-home-hero.jpg",
  cockroachesInHouseInspection:
    "/images/guides/cockroaches-at-home-inspection.jpg",
  cockroachesInHouseTrap: "/images/guides/cockroaches-at-home-trap.jpg",
  cta: "https://cdn.reptiles.ge/landing-cta-cover.jpeg",
  detail: "https://cdn.reptiles.ge/vipera-dinnik-3.webp",
  fleaAdultMacro: "/images/guides/flea-adult-macro-fedaro.jpg",
  fleasInHouseHero: "/images/guides/fleas-home-pet-care-hero.jpg",
  gyurzaBiteClinicalAssessment:
    "/images/guides/gyurza-bite-clinical-assessment.jpg",
  gyurzaBiteFieldPhoto:
    "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
  gyurzaBiteHero: "/images/guides/gyurza-bite-hero.jpg",
  gyurzaBiteViperPortrait: "/images/guides/gyurza-bite-viper-portrait.jpg",
  hero: "https://cdn.reptiles.ge/hero-img.webp",
  homeSpotlight: "/images/home/vipera-dinniki-landing.jpg",
  mosquitoesAtHomeCover: "/images/guides/mosquitoes-at-home-cover.jpg",
  mosquitoesAtHomeHero: "/images/guides/mosquitoes-at-home-hero.jpg",
  mosquitoesAtHomeScreen: "/images/guides/mosquitoes-at-home-screen.jpg",
  mosquitoesAtHomeYard: "/images/guides/mosquitoes-at-home-yard.jpg",
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
  scorpionInHouseGap:
    "https://cdn.reptiles.ge/images/guides/scorpion-in-house-gap.jpg",
  scorpionInHouseHero:
    "https://cdn.reptiles.ge/images/guides/scorpion-in-house-hero.jpg",
  scorpionInHouseJar:
    "https://cdn.reptiles.ge/images/guides/scorpion-in-house-jar.jpg",
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
  tickBiteAfter: "https://cdn.reptiles.ge/images/guides/tick-bite-after.jpg",
  tickBiteGrass: "https://cdn.reptiles.ge/images/guides/tick-bite-grass.jpg",
  tickBiteHero: "https://cdn.reptiles.ge/images/guides/tick-bite-hero.jpg",
  tickBiteRemoval:
    "https://cdn.reptiles.ge/images/guides/tick-bite-removal.jpg",
  waspNestComb: "/images/guides/wasp-nest-open-comb.jpg",
  waspNestHero: "/images/guides/wasp-nest-enclosed.jpg",
};
