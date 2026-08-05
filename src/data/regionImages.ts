import type { RegionPathId } from "@/data/georgia-paths";

const CDN = "https://cdn.reptiles.ge";

export function getRegionHeroImage(id: RegionPathId) {
  return `${CDN}/regions/${id}.jpg`;
}
