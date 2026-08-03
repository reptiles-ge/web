import { species } from "@/data/species";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const speciesEntries: MetadataRoute.Sitemap = species.map((item) => ({
    url: absoluteUrl(`/species/${item.id}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...speciesEntries,
  ];
}
