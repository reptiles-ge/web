import { describe, expect, it } from "vitest";

import {
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
} from "@/data/creditAuthors";
import {
  getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";

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
});
