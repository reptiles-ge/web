import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

const featured = [
  "vipera-dinniki",
  "macrovipera-lebetina",
  "vipera-kaznakovi",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return featured.map((id) => ({
    url: absoluteUrl(`/species/${id}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));
}
