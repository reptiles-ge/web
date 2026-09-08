import { describe, expect, it } from "vitest";

import {
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
} from "@/data/creditAuthors";
import { pathnames } from "@/i18n/pathnames";
import {
  getCreditAuthorCards,
  getCreditAuthorPhotos,
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
    expect(getPublishedCreditAuthorBySlug("sandro-khakhva")?.bio?.ka).toContain(
      "დამწყები ჰერპეტოლოგი და ნატურალისტი",
    );
    expect(
      getPublishedCreditAuthorBySlug("sandro-khakhva")?.links,
    ).toBeUndefined();
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
    expect(author?.bio?.ka).toContain("ბორჯომ-ხარაგაულის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/zauri.xachidze/",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
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
    expect(author?.bio?.ka).toContain("ილიას სახელმწიფო უნივერსიტეტის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/ioane.rost.iashvili.2025/",
      instagram: "https://www.instagram.com/ioane_rostiashvili/",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
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
    expect(author?.bio?.ka).toContain("ეკოლოგიის ინსტიტუტის");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/giorgi.iankoshvili/",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
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
    expect(author?.bio?.ka).toContain("ნატურალისტი");
    expect(author?.links).toBeUndefined();
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
  });

  it("resolves Nika Melikishvili as a published photographer", () => {
    expect(getPublishedCreditAuthorByName("ნიკა მელიქიშვილი")?.slug).toBe(
      "nika-melikishvili",
    );
    expect(getPublishedCreditAuthorByName("Nika Melikishvili")?.slug).toBe(
      "nika-melikishvili",
    );
    const author = getPublishedCreditAuthorBySlug("nika-melikishvili");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("photographer");
    expect(author?.bio?.ka).toContain("ბუნების ფოტოგრაფი");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/nika.melikishvili",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
  });

  it("resolves Saba Todua as a published herpetologist", () => {
    expect(getPublishedCreditAuthorByName("საბა თოდუა")?.slug).toBe(
      "saba-todua",
    );
    expect(getPublishedCreditAuthorByName("Saba Todua")?.slug).toBe(
      "saba-todua",
    );
    const author = getPublishedCreditAuthorBySlug("saba-todua");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("herpetologist");
    expect(author?.bio?.ka).toContain("მოყვარული ჰერპეტოლოგი");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/todua.saba.54438",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
  });

  it("resolves Close to wildlife as a published photographer page", () => {
    expect(getPublishedCreditAuthorByName("ველურ ბუნებასთან ახლოს")?.slug).toBe(
      "velur-bunebastan-axlos",
    );
    expect(getPublishedCreditAuthorByName("Close to wildlife")?.slug).toBe(
      "velur-bunebastan-axlos",
    );
    const author = getPublishedCreditAuthorBySlug("velur-bunebastan-axlos");
    expect(author?.published).toBe(true);
    expect(author?.role).toBe("photographer");
    expect(author?.bio?.ka).toContain("ქვეწარმავლებსა და ამფიბიებს");
    expect(author?.links).toEqual({
      facebook: "https://www.facebook.com/profile.php?id=61585670878935",
    });
    expect(getCreditAuthorPhotos(author!).length).toBeGreaterThan(0);
  });

  it("collects atlas photos without duplicates", () => {
    const author = getPublishedCreditAuthorBySlug("sandro-khakhva");
    expect(author).toBeTruthy();
    const photos = getCreditAuthorPhotos(author!);
    const srcs = photos.map((photo) => photo.src);
    expect(photos.length).toBeGreaterThan(0);
    expect(new Set(srcs).size).toBe(photos.length);
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
      "nika-melikishvili",
      "velur-bunebastan-axlos",
      "zakro-songulashvili",
      "saba-todua",
    ]);
    expect(cards.map((card) => card.photoCount)).toEqual(
      [...cards.map((card) => card.photoCount)].sort((a, b) => b - a),
    );
    for (const card of cards) {
      expect(card.photoCount).toBeGreaterThan(0);
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
