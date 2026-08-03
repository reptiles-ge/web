import { featuredSpeciesIds } from "@/data/species";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...featuredSpeciesIds.map((id) => ({
      url: absoluteUrl(`/species/${id}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
