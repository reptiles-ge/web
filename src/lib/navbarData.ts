import type { NavbarData } from "@/components/NavbarMenu";
import type { CatalogCard } from "@/lib/speciesCatalogApi";

import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";
import { summarizeAtlas } from "@/data/speciesAtlas";
import { GROUP_HUB_ILLUSTRATIONS, type GroupHubId } from "@/lib/groupHubs";

export function getNavbarData(catalog: readonly CatalogCard[]): NavbarData {
  const entries = Object.entries(GROUP_HUB_ILLUSTRATIONS) as Array<
    [GroupHubId, string]
  >;
  return {
    images: Object.fromEntries(
      entries.map(([id, src]) => [
        id,
        {
          sources: pictureSources(src, { sizes: "" }).map((source) => ({
            srcSet: source.props.srcSet,
            type: source.props.type,
          })),
          src: optimizedImgSrc(src, 400),
        },
      ]),
    ) as NavbarData["images"],
    stats: summarizeAtlas(catalog),
  };
}
