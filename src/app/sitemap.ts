import { catalogSpeciesIds } from "@/data/species";
import { regions } from "@/data/regions";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: absoluteUrl(localePath(locale, "/")),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/contact")),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/regions")),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });

    for (const region of regions) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/regions/${region.id}`)),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const id of catalogSpeciesIds) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/species/${id}`)),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
