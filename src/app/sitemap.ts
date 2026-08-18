import { getRegionSpecies, regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import { absoluteUrl, localePath, speciesPageUrl } from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";
import { compareIsoDateTimes, parseToSiteDateTime } from "@/lib/siteTime";
import type { MetadataRoute } from "next";

const FALLBACK_LASTMOD = "2026-01-01T00:00:00+04:00";

function toLastModified(isoDate: string | null | undefined): string {
  if (!isoDate) return FALLBACK_LASTMOD;
  return parseToSiteDateTime(isoDate) ?? FALLBACK_LASTMOD;
}

function maxUpdatedAt(dates: Array<string | null | undefined>): string {
  const latest = dates
    .filter((value): value is string => Boolean(value))
    .sort(compareIsoDateTimes)
    .at(-1);
  return toLastModified(latest);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalogSpecies();
  const atlasLastModified = toLastModified(getAtlasStats(catalog).lastUpdated);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: absoluteUrl(localePath(locale, "/")),
      lastModified: atlasLastModified,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/contact")),
      lastModified: atlasLastModified,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/about")),
      lastModified: atlasLastModified,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/species")),
      lastModified: atlasLastModified,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/venomous-snakes")),
      lastModified: atlasLastModified,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/snakes-in-the-yard")),
      lastModified: atlasLastModified,
    });

    for (const guide of CLUSTER_GUIDE_LIST) {
      entries.push({
        url: absoluteUrl(localePath(locale, guide.pathname)),
        lastModified: atlasLastModified,
      });
    }

    for (const hub of GROUP_HUB_LIST) {
      entries.push({
        url: absoluteUrl(localePath(locale, hub.path)),
        lastModified: atlasLastModified,
      });
    }

    entries.push({
      url: absoluteUrl(localePath(locale, "/regions")),
      lastModified: atlasLastModified,
    });

    for (const region of regions) {
      entries.push({
        url: absoluteUrl(localePath(locale, regionHref(region.id))),
        lastModified: maxUpdatedAt(
          getRegionSpecies(region).map((item) => item.updatedAt),
        ),
      });
    }

    for (const item of catalog) {
      entries.push({
        url: speciesPageUrl(locale, item.id),
        lastModified: toLastModified(item.updatedAt),
      });
    }
  }

  return entries;
}
