import { describe, expect, it } from "vitest";

import type { Species } from "@/data/species";

import {
  creditAuthorPageImageUrls,
  speciesPageImageUrls,
} from "@/lib/sitemapImages";

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
  it("includes only photos credited to a published author with a page", () => {
    const urls = speciesPageImageUrls({
      ...base,
      gallery: [
        {
          credit: { photographer: "სანდრო ხახვა" },
          src: "https://cdn.reptiles.ge/sandro-1.jpg",
        },
        {
          credit: { photographer: "სანდრო ხახვა" },
          src: "https://cdn.reptiles.ge/sandro-1.jpg",
        },
        {
          credit: { photographer: "Charles J. Sharp" },
          src: "https://cdn.reptiles.ge/commons.jpg",
        },
        {
          credit: { photographer: "ნიკა მელიქიშვილი" },
          src: "https://cdn.reptiles.ge/nika.jpg",
        },
        { src: "https://cdn.reptiles.ge/uncredited.jpg" },
        {
          credit: { photographer: "ზაური ხაჩიძე" },
          src: "https://cdn.reptiles.ge/zauri.jpg",
        },
        {
          credit: { photographer: "სანდრო ხახვა" },
          src: "/images/species-placeholder.png",
        },
      ],
      image: "https://cdn.reptiles.ge/hero.jpg",
      imageCredit: { photographer: "ნიკა მელიქიშვილი" },
    } as Species);

    expect(urls).toEqual([
      "https://cdn.reptiles.ge/hero.jpg",
      "https://cdn.reptiles.ge/sandro-1.jpg",
      "https://cdn.reptiles.ge/nika.jpg",
      "https://cdn.reptiles.ge/zauri.jpg",
    ]);
  });

  it("returns an empty list when no photo has a published author page", () => {
    expect(
      speciesPageImageUrls({
        ...base,
        gallery: [{ src: "/images/species-placeholder.jpg" }],
        image: "/images/species-placeholder.png",
      } as Species),
    ).toEqual([]);
  });
});

describe("creditAuthorPageImageUrls", () => {
  it("leads with the portrait and caps unique photo srcs", () => {
    expect(
      creditAuthorPageImageUrls("https://cdn.reptiles.ge/authors/sandro.jpg", [
        { src: "https://cdn.reptiles.ge/a.jpg" },
        { src: "https://cdn.reptiles.ge/a.jpg" },
        { src: "/images/species-placeholder.png" },
        { src: "https://cdn.reptiles.ge/b.jpg" },
      ]),
    ).toEqual([
      "https://cdn.reptiles.ge/authors/sandro.jpg",
      "https://cdn.reptiles.ge/a.jpg",
      "https://cdn.reptiles.ge/b.jpg",
    ]);
  });
});
