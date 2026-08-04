import type { RegionPathId } from "@/data/georgia-paths";

export function getRegionHeroImage(id: RegionPathId) {
  return `/images/regions/${id}.jpg`;
}
