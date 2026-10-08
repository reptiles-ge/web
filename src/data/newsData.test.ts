import { describe, expect, it } from "vitest";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import {
  getAllNewsArticles,
  getNewsArticleLocales,
  getNewsCopy,
  getPublishedNewsArticleBySlug,
  getPublishedNewsArticles,
  getPublishedNewsForCreditAuthor,
  getPublishedNewsForHub,
  getPublishedNewsForRegion,
  getPublishedNewsForSpecies,
  newsArticlePhotos,
  newsLocalizedDek,
  newsLocalizedTitle,
  newsPhotoBySrc,
  newsRelatedHubs,
  newsRelatedRegions,
  newsRelatedSpecies,
  newsSearchKeywords,
  newsSourceOrg,
} from "@/data/news";

const published = getPublishedNewsArticles();
const article = published[0];

describe("news registry", () => {
  it("has unique slugs", () => {
    const slugs = getAllNewsArticles().map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only publishes articles with Georgian copy", () => {
    for (const item of getAllNewsArticles()) {
      expect(item.copy.ka, item.slug).toBeDefined();
    }
  });

  it("sorts published articles newest first", () => {
    for (let index = 1; index < published.length; index += 1) {
      expect(
        published[index - 1].publishedAt >= published[index].publishedAt,
      ).toBe(true);
    }
  });

  it("keeps drafts out of every published lookup", () => {
    for (const item of getAllNewsArticles().filter(
      (entry) => entry.status !== "published",
    )) {
      expect(
        getPublishedNewsArticleBySlug(item.slug),
        item.slug,
      ).toBeUndefined();
      expect(published.map((entry) => entry.slug)).not.toContain(item.slug);
    }
  });

  it("filters by locale when asked", () => {
    for (const item of getPublishedNewsArticles("en")) {
      expect(item.copy.en, item.slug).toBeDefined();
    }
  });
});

describe("copy helpers", () => {
  it("lists the locales an article has", () => {
    expect(getNewsArticleLocales(article)).toContain("ka");
  });

  it("falls back to Georgian copy for a missing locale", () => {
    const onlyKa = {
      ...article,
      copy: { ka: article.copy.ka },
    } as unknown as typeof article;
    expect(getNewsCopy(onlyKa, "en")).toBeUndefined();
    expect(newsLocalizedTitle(onlyKa, "en")).toBe(article.copy.ka.title);
    expect(newsLocalizedDek(onlyKa, "tr")).toBe(article.copy.ka.dek);
  });
});

describe("relations", () => {
  it("resolves related hubs, regions and species that exist", () => {
    for (const item of published) {
      expect(newsRelatedHubs(item)).toHaveLength(item.relatedHubIds.length);
      expect(newsRelatedRegions(item), item.slug).toHaveLength(
        item.relatedRegionIds.length,
      );
      expect(newsRelatedSpecies(item), item.slug).toHaveLength(
        item.relatedSpeciesIds.length,
      );
    }
  });

  it("finds articles by hub, region and species", () => {
    const withSpecies = published.find((item) => item.relatedSpeciesIds.length);
    if (withSpecies) {
      const id = withSpecies.relatedSpeciesIds[0];
      expect(getPublishedNewsForSpecies(id).map((item) => item.slug)).toContain(
        withSpecies.slug,
      );
    }
    const withHub = published.find((item) => item.relatedHubIds.length);
    if (withHub) {
      expect(
        getPublishedNewsForHub(withHub.relatedHubIds[0]).map(
          (item) => item.slug,
        ),
      ).toContain(withHub.slug);
    }
    const withRegion = published.find((item) => item.relatedRegionIds.length);
    if (withRegion) {
      expect(
        getPublishedNewsForRegion(withRegion.relatedRegionIds[0]).map(
          (item) => item.slug,
        ),
      ).toContain(withRegion.slug);
    }
    expect(getPublishedNewsForSpecies("no-such-species")).toEqual([]);
    expect(getPublishedNewsForRegion("no-such-region")).toEqual([]);
  });

  it("only returns published articles for a credit author", () => {
    for (const author of getPublishedCreditAuthors()) {
      for (const item of getPublishedNewsForCreditAuthor(author)) {
        expect(item.status).toBe("published");
      }
    }
  });
});

describe("photos", () => {
  it("lists the cover first, then the gallery", () => {
    const cover = { alt: { ka: "a" }, src: "/cover.jpg" };
    const extra = { alt: { ka: "b" }, src: "/extra.jpg" };
    const item = { ...article, gallery: [extra], image: cover } as never;
    expect(newsArticlePhotos(item).map((photo) => photo.src)).toEqual([
      "/cover.jpg",
      "/extra.jpg",
    ]);
    expect(newsPhotoBySrc(item, "/cover.jpg")?.src).toBe("/cover.jpg");
    expect(newsPhotoBySrc(item, "/extra.jpg")?.src).toBe("/extra.jpg");
    expect(newsPhotoBySrc(item, "/missing.jpg")).toBeUndefined();
  });

  it("returns an empty list for an article without photos", () => {
    const item = { ...article, gallery: undefined, image: undefined } as never;
    expect(newsArticlePhotos(item)).toEqual([]);
  });
});

describe("search and source helpers", () => {
  it("includes the slug, titles and source names as keywords", () => {
    const keywords = newsSearchKeywords(article);
    expect(keywords).toContain(article.slug);
    expect(keywords).toContain(article.copy.ka.title);
    expect(keywords.every(Boolean)).toBe(true);
  });

  it("takes the organisation before the dash in the first source", () => {
    expect(
      newsSourceOrg({
        ...article,
        sources: [{ name: "IUCN — Red List", url: "u" }],
      }),
    ).toBe("IUCN");
    expect(newsSourceOrg({ ...article, sources: [] })).toBe("");
  });
});
