import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#0f1410",
    categories: ["education", "science", "reference"],
    description: siteConfig.description,
    display: "standalone",
    lang: siteConfig.language,
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    start_url: "/",
    theme_color: "#142018",
  };
}
