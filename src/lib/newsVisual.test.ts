import { describe, expect, it } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import {
  getNewsImageSrc,
  getNewsVisual,
  localizeNewsPhoto,
  newsCategoryHub,
} from "@/lib/newsVisual";

const articles = getPublishedNewsArticles();
const bare = {
  ...articles[0],
  gallery: undefined,
  image: undefined,
  relatedRegionIds: [],
  relatedSpeciesIds: [],
} as unknown as (typeof articles)[number];

describe("localizeNewsPhoto", () => {
  const photo = {
    alt: { en: "English alt", ka: "ქართული" },
    fromAtlas: true,
    src: "/a.jpg",
  } as never;

  it("picks the locale alt text, falling back to Georgian", () => {
    expect(localizeNewsPhoto(photo, "en").alt).toBe("English alt");
    expect(localizeNewsPhoto(photo, "ru").alt).toBe("ქართული");
  });

  it("normalises the flags to booleans", () => {
    expect(localizeNewsPhoto(photo, "en")).toMatchObject({
      fromAtlas: true,
      plate: false,
      src: "/a.jpg",
    });
  });
});

describe("getNewsImageSrc", () => {
  it("prefers the article's own image", () => {
    expect(
      getNewsImageSrc({
        ...bare,
        image: { alt: { ka: "a" }, src: "/own.jpg" },
      } as never),
    ).toBe("/own.jpg");
  });

  it("returns null when there is nothing to show", () => {
    expect(getNewsImageSrc(bare)).toBeNull();
  });

  it("falls back to the first related species' photo", () => {
    const src = getNewsImageSrc({
      ...bare,
      relatedSpeciesIds: ["macrovipera-lebetina"],
    } as never);
    expect(src).toBeTruthy();
  });

  it("falls back to a region hero when only a region is related", () => {
    const src = getNewsImageSrc({
      ...bare,
      relatedRegionIds: ["kakheti"],
    } as never);
    expect(src).toBeTruthy();
  });
});

describe("getNewsVisual", () => {
  it("returns null for an article with no image or relations", () => {
    expect(getNewsVisual(bare, "en")).toBeNull();
  });

  it("uses the article image when present", () => {
    const visual = getNewsVisual(
      { ...bare, image: { alt: { ka: "ალტ" }, src: "/own.jpg" } } as never,
      "ka",
    );
    expect(visual).toMatchObject({ alt: "ალტ", src: "/own.jpg" });
  });

  it("builds an atlas visual from a related species", () => {
    const visual = getNewsVisual(
      { ...bare, relatedSpeciesIds: ["macrovipera-lebetina"] } as never,
      "en",
    );
    expect(visual?.fromAtlas).toBe(true);
    expect(visual?.alt).toContain("Macrovipera");
  });

  it("builds an atlas visual from a related region", () => {
    const visual = getNewsVisual(
      { ...bare, relatedRegionIds: ["kakheti"] } as never,
      "en",
    );
    expect(visual?.fromAtlas).toBe(true);
    expect(visual?.alt).toBeTruthy();
  });
});

describe("newsCategoryHub", () => {
  it("returns the first related hub, or undefined", () => {
    expect(
      newsCategoryHub({
        ...bare,
        relatedHubIds: ["snakes", "lizards"],
      } as never),
    ).toBe("snakes");
    expect(
      newsCategoryHub({ ...bare, relatedHubIds: [] } as never),
    ).toBeUndefined();
  });
});
