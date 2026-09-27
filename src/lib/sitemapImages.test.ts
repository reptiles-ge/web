import { describe, expect, it } from "vitest";

import type { Species } from "@/data/species";

import {
  creditAuthorPageImageUrls,
  guidePageImageUrls,
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
  it("includes every distinct published image, regardless of author page", () => {
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
      "https://cdn.reptiles.ge/commons.jpg",
      "https://cdn.reptiles.ge/nika.jpg",
      "https://cdn.reptiles.ge/uncredited.jpg",
      "https://cdn.reptiles.ge/zauri.jpg",
    ]);
  });

  it("emits the same optimized URL the page serves", () => {
    const src = "https://cdn.reptiles.ge/macrovipera-lebetina-nika-4.jpg";
    const urls = speciesPageImageUrls({
      ...base,
      gallery: [],
      image: src,
      imageCredit: { photographer: "ნიკა მელიქიშვილი" },
    } as Species);

    expect(urls).toEqual([
      "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-4-1024.webp",
    ]);
  });

  it("returns an empty list when every image is a placeholder", () => {
    expect(
      speciesPageImageUrls({
        ...base,
        gallery: [{ src: "/images/species-placeholder.jpg" }],
        image: "/images/species-placeholder.png",
      } as Species),
    ).toEqual([]);
  });

  it("includes gallery images past the old eight-photo limit", () => {
    const gallery = Array.from({ length: 12 }, (_, index) => ({
      src: `https://cdn.reptiles.ge/photo-${index + 1}.jpg`,
    }));
    const urls = speciesPageImageUrls({
      ...base,
      gallery,
      image: "",
    } as Species);

    expect(urls).toHaveLength(12);
    expect(urls.at(-1)).toBe("https://cdn.reptiles.ge/photo-12.jpg");
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

describe("guidePageImageUrls", () => {
  it("lists optimized guide heroes without requiring a photo credit", () => {
    expect(
      guidePageImageUrls([
        "/images/guides/wasp-nest-enclosed.jpg",
        undefined,
        "/images/guides/wasp-nest-enclosed.jpg",
      ]),
    ).toEqual([
      "https://cdn.reptiles.ge/optimized/images/guides/wasp-nest-enclosed-1200.webp",
    ]);
  });
});
