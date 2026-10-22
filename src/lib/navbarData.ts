import type { NavbarData } from "@/components/NavbarMenu";
import type { AppLocale } from "@/i18n/routing";

import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";
import { getAtlasStats } from "@/data/speciesAtlas";
import { GROUP_HUB_ILLUSTRATIONS, type GroupHubId } from "@/lib/groupHubs";

export async function getNavbarData(locale: AppLocale): Promise<NavbarData> {
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
    stats: await getAtlasStats(locale),
  };
}
