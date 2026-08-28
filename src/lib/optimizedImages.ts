import { optimizedImages } from "@/data/optimizedImages.generated";
import type { OptimizedImageMap } from "@/data/optimizedImages";

export function pickOptimizedImages(
  srcs: readonly (string | null | undefined)[],
): OptimizedImageMap {
  const picked: OptimizedImageMap = {};

  for (const src of srcs) {
    if (!src) continue;
    const asset = optimizedImages[src];
    if (asset) picked[src] = asset;
  }

  return picked;
}
