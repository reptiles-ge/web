import { catalogSpeciesIds } from "@/data/species";
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
