import type { RegionPathId } from "@/data/georgia-paths";

const CDN = "https://cdn.reptiles.ge";

export const REGIONS_INDEX_HERO_IMAGE = "/images/home/groups/snakes.jpg";

const REGION_HERO_FILES: Partial<Record<RegionPathId, string>> = {
  "samegrelo-zemo-svaneti": "samegrelo",
};

export function getRegionHeroImage(id: RegionPathId) {
  const file = REGION_HERO_FILES[id] ?? id;
  return `${CDN}/regions/${file}.jpg`;
}
