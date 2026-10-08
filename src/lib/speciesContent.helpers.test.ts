import { describe, expect, it } from "vitest";

import type { Species } from "@/data/speciesTypes";

import {
  filterDisplayStats,
  getSpeciesActivityStat,
  getSpeciesCoverSrc,
  getSpeciesGalleryPreview,
  getSpeciesHabitatStat,
  getSpeciesHeroSources,
  getSpeciesIdentificationPhoto,
  getSpeciesSizeStat,
  hasRealIdentification,
  isPlaceholderBody,
  isPlaceholderMedia,
} from "@/lib/speciesContent";

const PLACEHOLDER = "/images/species-placeholder.png";

function species(overrides: Partial<Species>): Species {
  return {
    gallery: [],
    image: PLACEHOLDER,
    stats: [],
    ...overrides,
  } as Species;
}

describe("isPlaceholderMedia", () => {
  it.each([null, undefined, ""])("treats %j as a placeholder", (src) => {
    expect(isPlaceholderMedia(src)).toBe(true);
  });

  it.each([
    "/images/species-placeholder.png",
    "/images/species-placeholder.svg",
    "https://reptiles.ge/images/species-placeholder.jpg",
  ])("treats %s as a placeholder", (src) => {
    expect(isPlaceholderMedia(src)).toBe(true);
  });

  it("accepts a real photo", () => {
    expect(isPlaceholderMedia("https://cdn.reptiles.ge/a.jpg")).toBe(false);
  });
});

describe("isPlaceholderBody", () => {
  it("treats empty and whitespace as placeholder", () => {
    expect(isPlaceholderBody("")).toBe(true);
    expect(isPlaceholderBody("   ")).toBe(true);
  });

  it.each([
    "See checklist account for details.",
    "იხილეთ ჩეკლისტი",
    "Administrative regions are not inferred.",
    "This value is not invented.",
  ])("flags %j", (text) => {
    expect(isPlaceholderBody(text)).toBe(true);
  });

  it("accepts real prose", () => {
    expect(isPlaceholderBody("Lives on dry rocky slopes.")).toBe(false);
  });
});

describe("filterDisplayStats", () => {
  const stats = [
    { label: "Size", value: "80 cm" },
    { label: "Habitat", value: "  " },
    { label: "Status in Georgia", value: "See checklist" },
    { label: "Venom", value: "Hemotoxic" },
  ];

  it("drops empty and placeholder values", () => {
    expect(filterDisplayStats(stats).map((stat) => stat.label)).toEqual([
      "Size",
      "Venom",
    ]);
  });

  it("drops safety stats for groups without a venom concept", () => {
    expect(filterDisplayStats(stats, "bird").map((stat) => stat.label)).toEqual(
      ["Size"],
    );
  });

  it("keeps safety stats for snakes", () => {
    expect(
      filterDisplayStats(stats, "snake").map((stat) => stat.label),
    ).toEqual(["Size", "Venom"]);
  });
});

describe("stat lookups", () => {
  const item = species({
    stats: [
      { label: "ზომა", value: "1 მ" },
      { label: "Habitat", value: "Forest" },
      { label: "Season", value: "April–October" },
    ],
  });

  it("finds size, habitat and activity in any language", () => {
    expect(getSpeciesSizeStat(item)).toBe("1 მ");
    expect(getSpeciesHabitatStat(item)).toBe("Forest");
    expect(getSpeciesActivityStat(item)).toBe("April–October");
  });

  it("returns null when absent", () => {
    expect(getSpeciesSizeStat(species({}))).toBeNull();
  });
});

describe("hasRealIdentification", () => {
  it("is false without identification or traits", () => {
    expect(hasRealIdentification(undefined)).toBe(false);
    expect(hasRealIdentification({ traits: [] } as never)).toBe(false);
    expect(hasRealIdentification({ traits: ["  "] } as never)).toBe(false);
  });

  it("is false when every trait is checklist metadata", () => {
    expect(
      hasRealIdentification({
        traits: ["Checklist-confirmed", "Colubridae", "2021", "Smith, 1999"],
      } as never),
    ).toBe(false);
  });

  it("is true once a real trait is present", () => {
    expect(
      hasRealIdentification({
        traits: ["Colubridae", "Keeled dorsal scales"],
      } as never),
    ).toBe(true);
  });
});

describe("cover and hero sources", () => {
  it("prefers the mobile cover, then the image, else null", () => {
    expect(getSpeciesCoverSrc({ image: "/a.jpg", mobileImage: "/m.jpg" })).toBe(
      "/m.jpg",
    );
    expect(
      getSpeciesCoverSrc({ image: "/a.jpg", mobileImage: PLACEHOLDER }),
    ).toBe("/a.jpg");
    expect(getSpeciesCoverSrc({ image: PLACEHOLDER })).toBeNull();
  });

  it("has no hero or gallery for a species with only placeholders", () => {
    expect(getSpeciesHeroSources(species({}))).toEqual({
      desktopHeroSrc: null,
      gallery: [],
      mobileHeroSrc: null,
      primary: undefined,
    });
  });

  it("falls back to the cover image as a one-photo gallery", () => {
    const sources = getSpeciesHeroSources(species({ image: "/a.jpg" }));
    expect(sources.desktopHeroSrc).toBe("/a.jpg");
    expect(sources.gallery.map((item) => item.src)).toEqual(["/a.jpg"]);
  });

  it("filters placeholders out of a real gallery", () => {
    const sources = getSpeciesHeroSources(
      species({
        gallery: [{ src: "/a.jpg" }, { src: PLACEHOLDER }, { src: "/b.jpg" }],
        image: "/a.jpg",
      }),
    );
    expect(sources.gallery.map((item) => item.src)).toEqual([
      "/a.jpg",
      "/b.jpg",
    ]);
  });

  it("previews non-hero photos first and limits the count", () => {
    const item = species({
      gallery: [{ src: "/a.jpg" }, { src: "/b.jpg" }, { src: "/c.jpg" }],
      image: "/a.jpg",
    });
    expect(getSpeciesGalleryPreview(item)).toEqual([
      "/b.jpg",
      "/c.jpg",
      "/a.jpg",
    ]);
    expect(getSpeciesGalleryPreview(item, 1)).toEqual(["/b.jpg"]);
  });

  it("picks the first gallery photo that is not the hero for identification", () => {
    const item = species({
      gallery: [{ src: "/a.jpg" }, { src: "/b.jpg" }],
      image: "/a.jpg",
    });
    expect(getSpeciesIdentificationPhoto(item)?.src).toBe("/b.jpg");
    expect(
      getSpeciesIdentificationPhoto(species({ image: "/a.jpg" })),
    ).toBeNull();
  });
});
