import { describe, expect, it } from "vitest";

import type { Species } from "@/data/species";

import { speciesPageImageUrls } from "@/lib/sitemapImages";

const base = {
  behavior: "",
  commonName: "გიურზა",
  conservation: "",
  description: "",
  diet: "",
  facts: [],
  family: "Viperidae",
  genus: "Macrovipera",
  habitat: "",
  id: "macrovipera-lebetina",
  location: "",
  overview: "",
  publishedAt: "2026-01-01",
  scientificName: "Macrovipera lebetina",
  sources: [],
  stats: [],
  updatedAt: "2026-01-01",
} satisfies Partial<Species>;

describe("speciesPageImageUrls", () => {
  it("skips placeholders and dedupes identical srcs", () => {
    const urls = speciesPageImageUrls({
      ...base,
      gallery: [
        { src: "https://cdn.reptiles.ge/macrovipera-lebetina.jpg" },
        { src: "/images/species-placeholder.png" },
        { src: "https://cdn.reptiles.ge/gallery/giurza-2.jpg" },
      ],
      image: "https://cdn.reptiles.ge/macrovipera-lebetina.jpg",
    } as Species);

    expect(urls).toEqual([
      "https://cdn.reptiles.ge/macrovipera-lebetina.jpg",
      "https://cdn.reptiles.ge/gallery/giurza-2.jpg",
    ]);
  });

  it("returns an empty list when every photo is a placeholder", () => {
    expect(
      speciesPageImageUrls({
        ...base,
        gallery: [{ src: "/images/species-placeholder.jpg" }],
        image: "/images/species-placeholder.png",
      } as Species),
    ).toEqual([]);
  });
});
