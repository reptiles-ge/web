import { describe, expect, it } from "vitest";

import {
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
} from "@/data/creditAuthors";
import {
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
  });
});
