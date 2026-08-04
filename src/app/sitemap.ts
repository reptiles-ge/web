import { getRegionSpecies, regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/site";
import type { MetadataRoute } from "next";

function toLastModified(isoDate: string | null | undefined): Date {
  if (!isoDate) return new Date("2026-01-01T00:00:00.000Z");
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function maxUpdatedAt(dates: Array<string | null | undefined>): Date {
  const latest = dates
    .filter((value): value is string => Boolean(value))
    .sort()
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
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/contact")),
      lastModified: atlasLastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/about")),
      lastModified: atlasLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/species")),
      lastModified: atlasLastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/venomous-snakes")),
      lastModified: atlasLastModified,
      changeFrequency: "weekly",
      priority: 0.98,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/regions")),
      lastModified: atlasLastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    });

    for (const region of regions) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/regions/${region.id}`)),
        lastModified: maxUpdatedAt(
          getRegionSpecies(region).map((item) => item.updatedAt),
        ),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const item of catalog) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/species/${item.id}`)),
        lastModified: toLastModified(item.updatedAt),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
