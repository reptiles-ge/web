import { describe, expect, it } from "vitest";

import {
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
} from "@/data/creditAuthors";
import { pathnames } from "@/i18n/pathnames";
import {
  getCreditAuthorCards,
  getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  getHomeContributorCards,
  pickCreditAuthorPreviewPhotos,
} from "@/lib/creditAuthors";
import { legacyPhotographerRedirectPath } from "@/lib/photographerRedirects";

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
    expect(getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos))).toEqual(
      expect.arrayContaining(["snakes", "mammals", "amphibians"]),
    );
  });

  it("resolves Ioane Rostiashvili as a published herpetologist", () => {
    expect(getPublishedCreditAuthorByName("იოანე როსტიაშვილი")?.slug).toBe(
      "ioane-rostiashvili",
    );
    expect(getPublishedCreditAuthorByName("Ioane Rostiashvili")?.slug).toBe(
      "ioane-rostiashvili",
    );
    const author = getPublishedCreditAuthorBySlug("ioane-rostiashvili");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("herpetologist");
    expect(author?.portraitSrc).toBe(
      "https://cdn.reptiles.ge/authors/ioane-rostiashvili.jpg",
    );
    expect(author?.bio?.ka).toContain("ილიას სახელმწიფო უნივერსიტეტის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/ioane.rost.iashvili.2025/",
      instagram: "https://www.instagram.com/ioane_rostiashvili/",
    });
    const photos = getCreditAuthorPhotos(author!);
    expect(photos.length).toBeGreaterThanOrEqual(20);
    expect(getCreditAuthorSpeciesIds(photos)).toEqual(
      expect.arrayContaining([
        "macrovipera-lebetina",
        "dolichophis-schmidti",
        "bufotes-viridis",
      ]),
    );
    expect(getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos))).toEqual(
      expect.arrayContaining(["snakes", "amphibians"]),
    );
  });

  it("resolves Giorgi Iankoshvili as a published herpetologist", () => {
    expect(getPublishedCreditAuthorByName("გიორგი იანქოშვილი")?.slug).toBe(
      "giorgi-iankoshvili",
    );
    expect(getPublishedCreditAuthorByName("Giorgi Iankoshvili")?.slug).toBe(
      "giorgi-iankoshvili",
    );
    const author = getPublishedCreditAuthorBySlug("giorgi-iankoshvili");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("herpetologist");
    expect(author?.portraitSrc).toBe(
      "https://cdn.reptiles.ge/authors/giorgi-iankoshvili.jpg",
    );
    expect(author?.bio?.ka).toContain("ეკოლოგიის ინსტიტუტის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/giorgi.iankoshvili/",
    });
    const photos = getCreditAuthorPhotos(author!);
    expect(photos.length).toBeGreaterThanOrEqual(10);
    expect(getCreditAuthorSpeciesIds(photos)).toEqual(
      expect.arrayContaining([
        "macrovipera-lebetina",
        "vipera-darevskii",
        "mertensiella-caucasica",
      ]),
    );
    expect(getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos))).toEqual(
      expect.arrayContaining(["snakes", "amphibians"]),
    );
  });

  it("resolves Zakro Songulashvili as a published herpetologist", () => {
    expect(getPublishedCreditAuthorByName("ზაქრო სონგულაშვილი")?.slug).toBe(
      "zakro-songulashvili",
    );
    expect(getPublishedCreditAuthorByName("Zakro Songulashvili")?.slug).toBe(
      "zakro-songulashvili",
    );
    const author = getPublishedCreditAuthorBySlug("zakro-songulashvili");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("herpetologist");
    expect(author?.portraitSrc).toBe(
      "https://cdn.reptiles.ge/authors/zakro-songulashvili.jpg",
    );
    expect(author?.bio?.ka).toContain("ნატურალისტი");
    expect(author?.links).toBeUndefined();
    const photos = getCreditAuthorPhotos(author!);
    expect(photos.length).toBeGreaterThanOrEqual(10);
    expect(getCreditAuthorSpeciesIds(photos)).toEqual(
      expect.arrayContaining([
        "macrovipera-lebetina",
        "argiope-lobata",
        "bufotes-viridis",
      ]),
    );
    expect(getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos))).toEqual(
      expect.arrayContaining(["snakes", "spiders", "amphibians"]),
    );
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
    expect(getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos))).toEqual(
      expect.arrayContaining(["snakes", "amphibians"]),
    );
  });

  it("builds homepage contributor cards from published author pages", () => {
    const cards = getHomeContributorCards();
    expect(cards.map((card) => card.author.slug)).toEqual([
      "zauri-khachidze",
      "ioane-rostiashvili",
    ]);
    expect(getCreditAuthorCards().map((card) => card.author.slug)).toEqual([
      "zauri-khachidze",
      "ioane-rostiashvili",
      "sandro-khakhva",
      "giorgi-iankoshvili",
      "zakro-songulashvili",
    ]);
    expect(cards.map((card) => card.photoCount)).toEqual(
      [...cards.map((card) => card.photoCount)].sort((a, b) => b - a),
    );
    for (const card of cards) {
      expect(card.photoCount).toBeGreaterThanOrEqual(10);
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
          {
            speciesId: "a",
            src: "https://cdn.reptiles.ge/a1.jpg",
            updatedAt: "",
          },
          {
            speciesId: "a",
            src: "https://cdn.reptiles.ge/a2.jpg",
            updatedAt: "",
          },
          {
            speciesId: "b",
            src: "/images/species-placeholder.png",
            updatedAt: "",
          },
          {
            speciesId: "b",
            src: "https://cdn.reptiles.ge/b1.jpg",
            updatedAt: "",
          },
          {
            speciesId: "c",
            src: "https://cdn.reptiles.ge/c1.jpg",
            updatedAt: "",
          },
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
    expect(pathnames["/authors"]).toEqual({
      en: "/contributors",
      ka: "/kontributorebi",
      ru: "/contributors",
      tr: "/contributors",
    });
    expect(pathnames["/authors/[slug]"]).toEqual({
      en: "/contributors/[slug]",
      ka: "/kontributorebi/[slug]",
      ru: "/contributors/[slug]",
      tr: "/contributors/[slug]",
    });
    expect(legacyPhotographerRedirectPath("/avtorebi/sandro-khakhva")).toBe(
      "/kontributorebi/sandro-khakhva",
    );
    expect(legacyPhotographerRedirectPath("/authors/zauri-khachidze")).toBe(
      "/kontributorebi/zauri-khachidze",
    );
    expect(
      legacyPhotographerRedirectPath("/photographers/sandro-khakhva"),
    ).toBe("/kontributorebi/sandro-khakhva");
    expect(legacyPhotographerRedirectPath("/fotografebi/sandro-khakhva")).toBe(
      "/kontributorebi/sandro-khakhva",
    );
    expect(legacyPhotographerRedirectPath("/en/authors/sandro-khakhva")).toBe(
      "/en/contributors/sandro-khakhva",
    );
    expect(legacyPhotographerRedirectPath("/ru/avtorebi/zauri-khachidze")).toBe(
      "/ru/contributors/zauri-khachidze",
    );
    expect(
      legacyPhotographerRedirectPath("/tr/fotografebi/sandro-khakhva"),
    ).toBe("/tr/contributors/sandro-khakhva");
    expect(
      legacyPhotographerRedirectPath("/en/photographers/sandro-khakhva"),
    ).toBe("/en/contributors/sandro-khakhva");
    expect(legacyPhotographerRedirectPath("/photographers")).toBe(
      "/kontributorebi",
    );
    expect(legacyPhotographerRedirectPath("/authors")).toBe("/kontributorebi");
    expect(legacyPhotographerRedirectPath("/avtorebi")).toBe("/kontributorebi");
    expect(legacyPhotographerRedirectPath("/fotografebi")).toBe(
      "/kontributorebi",
    );
    expect(legacyPhotographerRedirectPath("/en/authors")).toBe(
      "/en/contributors",
    );
    expect(legacyPhotographerRedirectPath("/en/fotografebi")).toBe(
      "/en/contributors",
    );
    expect(legacyPhotographerRedirectPath("/en/photographers")).toBe(
      "/en/contributors",
    );
    expect(legacyPhotographerRedirectPath("/en/kontributorebi")).toBe(
      "/en/contributors",
    );
    expect(legacyPhotographerRedirectPath("/kontributorebi")).toBeNull();
    expect(
      legacyPhotographerRedirectPath("/kontributorebi/sandro-khakhva"),
    ).toBeNull();
    expect(
      legacyPhotographerRedirectPath("/en/contributors/sandro-khakhva"),
    ).toBeNull();
    expect(legacyPhotographerRedirectPath("/en/contributors")).toBeNull();
  });
});
