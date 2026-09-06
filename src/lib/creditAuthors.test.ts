import { describe, expect, it } from "vitest";

import {
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
} from "@/data/creditAuthors";
import { getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  getHomeContributorCards,
  legacyPhotographerRedirectPath,
  pickCreditAuthorPreviewPhotos,
} from "@/lib/creditAuthors";
import { pathnames } from "@/i18n/pathnames";

describe("credit authors", () => {
  it("resolves Sandro Khakhva from both name spellings", () => {
    expect(getPublishedCreditAuthorByName("სანდრო ხახვა")?.slug).toBe(
      "sandro-khakhva",
    );
    expect(getPublishedCreditAuthorByName("Sandro Khakhva")?.slug).toBe(
      "sandro-khakhva",
    );
    expect(getPublishedCreditAuthorByName("ალექსანდრე ხახვა")?.slug).toBe(
      "sandro-khakhva",
    );
    expect(getPublishedCreditAuthorByName("Alexandre Khakhva")?.slug).toBe(
      "sandro-khakhva",
    );
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.published).toBe(
      true,
    );
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.portraitSrc).toBe(
      "https://cdn.reptiles.ge/authors/sandro-khakhva.jpg",
    );
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.bio?.ka).toContain(
      "აჭარიდან",
    );
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.links).toEqual({
      facebook: "https://www.facebook.com/sandro.khakhva.9",
      instagram: "https://www.instagram.com/wildtrail.geo",
    });
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.role).toBe(
      "herpetologist",
    );
  });

  it("resolves Zauri Khachidze as a published ranger", () => {
    expect(getPublishedCreditAuthorByName("ზაური ხაჩიძე")?.slug).toBe(
      "zauri-khachidze",
    );
    expect(getPublishedCreditAuthorByName("Zauri Khachidze")?.slug).toBe(
      "zauri-khachidze",
    );
    const author = getPublishedCreditAuthorBySlug("zauri-khachidze");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("ranger");
    expect(author?.portraitSrc).toBe(
      "https://cdn.reptiles.ge/authors/zauri-khachidze.jpg",
    );
    expect(author?.bio?.ka).toContain("ბორჯომ-ხარაგაულის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/zauri.xachidze/",
    });
    const photos = getCreditAuthorPhotos(author!);
    expect(photos.length).toBeGreaterThanOrEqual(20);
    expect(getCreditAuthorSpeciesIds(photos)).toEqual(
      expect.arrayContaining([
        "vipera-kaznakovi",
        "ursus-arctos",
        "pelodytes-caucasicus",
      ]),
    );
    expect(
      getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos)),
    ).toEqual(expect.arrayContaining(["snakes", "mammals", "amphibians"]));
  });

  it("collects his atlas photos without duplicates", () => {
    const author = getPublishedCreditAuthorBySlug("sandro-khakhva");
    expect(author).toBeTruthy();
    const photos = getCreditAuthorPhotos(author!);
    const srcs = photos.map((photo) => photo.src);
    expect(photos.length).toBeGreaterThanOrEqual(20);
    expect(new Set(srcs).size).toBe(photos.length);
    expect(getCreditAuthorSpeciesIds(photos)).toEqual(
      expect.arrayContaining([
        "vipera-kaznakovi",
        "mertensiella-caucasica",
        "natrix-tessellata",
      ]),
    );
    expect(
      getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos)),
    ).toEqual(expect.arrayContaining(["snakes", "amphibians"]));
  });

  it("builds homepage contributor cards from published author pages", () => {
    const cards = getHomeContributorCards();
    expect(cards.map((card) => card.author.slug)).toEqual([
      "zauri-khachidze",
      "sandro-khakhva",
    ]);
    expect(cards.map((card) => card.photoCount)).toEqual(
      [...cards.map((card) => card.photoCount)].sort((a, b) => b - a),
    );
    for (const card of cards) {
      expect(card.photoCount).toBeGreaterThanOrEqual(20);
      expect(card.speciesCount).toBeGreaterThan(0);
      expect(card.preview).toHaveLength(4);
      const species = new Set(card.preview.map((photo) => photo.speciesId));
      expect(species.size).toBe(4);
    }
  });

  it("prefers distinct species for homepage mosaics", () => {
    expect(
      pickCreditAuthorPreviewPhotos(
        [
          { speciesId: "a", src: "https://cdn.reptiles.ge/a1.jpg", updatedAt: "" },
          { speciesId: "a", src: "https://cdn.reptiles.ge/a2.jpg", updatedAt: "" },
          { speciesId: "b", src: "/images/species-placeholder.png", updatedAt: "" },
          { speciesId: "b", src: "https://cdn.reptiles.ge/b1.jpg", updatedAt: "" },
          { speciesId: "c", src: "https://cdn.reptiles.ge/c1.jpg", updatedAt: "" },
        ],
        3,
      ).map((photo) => photo.src),
    ).toEqual([
      "https://cdn.reptiles.ge/a1.jpg",
      "https://cdn.reptiles.ge/b1.jpg",
      "https://cdn.reptiles.ge/c1.jpg",
    ]);
  });

  it("301s legacy photographer prefixes to the live slugs", () => {
    expect(legacyPhotographerRedirectPath("/avtorebi/sandro-khakhva")).toBe(
      "/fotografebi/sandro-khakhva",
    );
    expect(legacyPhotographerRedirectPath("/authors/zauri-khachidze")).toBe(
      "/fotografebi/zauri-khachidze",
    );
    expect(legacyPhotographerRedirectPath("/photographers/sandro-khakhva")).toBe(
      "/fotografebi/sandro-khakhva",
    );
    expect(
      legacyPhotographerRedirectPath("/en/authors/sandro-khakhva"),
    ).toBe("/en/photographers/sandro-khakhva");
    expect(
      legacyPhotographerRedirectPath("/ru/avtorebi/zauri-khachidze"),
    ).toBe("/ru/photographers/zauri-khachidze");
    expect(
      legacyPhotographerRedirectPath("/tr/fotografebi/sandro-khakhva"),
    ).toBe("/tr/photographers/sandro-khakhva");
    expect(
      legacyPhotographerRedirectPath("/fotografebi/sandro-khakhva"),
    ).toBeNull();
    expect(
      legacyPhotographerRedirectPath("/en/photographers/sandro-khakhva"),
    ).toBeNull();
  });
});
