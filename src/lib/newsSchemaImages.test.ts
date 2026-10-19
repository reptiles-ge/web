import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NewsSchemaCrop } from "@/data/newsSchemaImages";

import { getPublishedNewsArticles, type NewsArticle } from "@/data/news";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { routing } from "@/i18n/routing";
import { newsOgImageUrl } from "@/lib/news";
import { newsHeroImage, newsSchemaImages } from "@/lib/newsSchemaImages";
import { newsImageRights } from "@/lib/newsVisual";

const crops = vi.hoisted(() => new Map<string, NewsSchemaCrop[]>());

vi.mock("@/data/newsSchemaImages", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/data/newsSchemaImages")>()),
  newsSchemaCrops: (src: string) => crops.get(src) ?? [],
}));

const articles = getPublishedNewsArticles();

function articleWith(image: NewsArticle["image"]) {
  return {
    ...articles[0],
    image,
    relatedRegionIds: [],
    relatedSpeciesIds: [],
  } as NewsArticle;
}

const wide = articleWith({
  alt: { ka: "ფოტო" },
  height: 1333,
  src: "https://cdn.reptiles.ge/news-schema-test-wide.jpg",
  width: 2000,
});

beforeEach(() => {
  crops.clear();
});

describe("newsHeroImage", () => {
  it("is null without a photo", () => {
    expect(newsHeroImage(articleWith(undefined))).toBeNull();
  });

  it("is null when the photo size is unknown", () => {
    expect(
      newsHeroImage(
        articleWith({
          alt: { ka: "ფოტო" },
          src: "https://cdn.reptiles.ge/news-schema-test-unsized.jpg",
        }),
      ),
    ).toBeNull();
  });

  it("uses the frontmatter size and an absolute URL", () => {
    expect(
      newsHeroImage(
        articleWith({
          alt: { ka: "ფოტო" },
          height: 1080,
          src: "/images/news/test/hero.jpg",
          width: 1920,
        }),
      ),
    ).toEqual({
      height: 1080,
      src: "/images/news/test/hero.jpg",
      url: "https://reptiles.ge/images/news/test/hero.jpg",
      width: 1920,
    });
  });

  it("prefers the largest optimized derivative the page serves", () => {
    const article = articles.find(
      (item) => item.image && optimizedEntry(item.image.src),
    );
    expect(article).toBeDefined();
    const src = article!.image!.src;
    const entry = optimizedEntry(src)!;
    expect(newsHeroImage(article!)).toEqual({
      height: entry.height,
      src,
      url: optimizedImgSrc(src, entry.width),
      width: entry.width,
    });
  });
});

describe("newsSchemaImages", () => {
  it.each(routing.locales)(
    "leads with the share card and its rights in %s",
    (locale) => {
      for (const article of articles) {
        const [first] = newsSchemaImages(article, locale);
        expect(first, article.slug).toMatchObject({
          "@type": "ImageObject",
          contentUrl: newsOgImageUrl(article),
          url: newsOgImageUrl(article),
          ...newsImageRights(article, locale),
        });
      }
    },
  );

  it("lists only sized, absolute, unique images", () => {
    for (const article of articles) {
      const images = newsSchemaImages(article, "ka");
      const urls = images.map((image) => image.url);
      expect(new Set(urls).size, article.slug).toBe(urls.length);
      for (const image of images) {
        expect(image.url, article.slug).toMatch(/^https:\/\//);
        expect(image.width, article.slug).toBeGreaterThan(0);
        expect(image.height, article.slug).toBeGreaterThan(0);
      }
      for (const image of images.slice(1)) {
        expect(image.width, article.slug).toBeGreaterThanOrEqual(1200);
      }
    }
  });

  it("adds a wide hero after the share card", () => {
    expect(newsSchemaImages(wide, "en").map((image) => image.url)).toEqual([
      newsOgImageUrl(wide),
      "https://cdn.reptiles.ge/news-schema-test-wide.jpg",
    ]);
  });

  it("leaves out a hero narrower than 1200 px", () => {
    const narrow = articleWith({
      alt: { ka: "ფოტო" },
      height: 500,
      src: "https://cdn.reptiles.ge/news-schema-test-narrow.jpg",
      width: 750,
    });
    expect(newsSchemaImages(narrow, "en")).toHaveLength(1);
  });

  it("does not repeat a hero that is already the share image", () => {
    const local = articleWith({
      alt: { ka: "ფოტო" },
      height: 1080,
      src: "/images/news/test/hero.jpg",
      width: 1920,
    });
    expect(newsSchemaImages(local, "en")).toHaveLength(1);
  });

  it("lists the generated crops before the full hero", () => {
    crops.set("https://cdn.reptiles.ge/news-schema-test-wide.jpg", [
      {
        height: 675,
        ratio: "16x9",
        url: "https://cdn.reptiles.ge/schema/16x9/news-schema-test-wide.jpg",
        width: 1200,
      },
      {
        height: 900,
        ratio: "4x3",
        url: "https://cdn.reptiles.ge/schema/4x3/news-schema-test-wide.jpg",
        width: 1200,
      },
      {
        height: 1200,
        ratio: "1x1",
        url: "https://cdn.reptiles.ge/schema/1x1/news-schema-test-wide.jpg",
        width: 1200,
      },
    ]);
    const images = newsSchemaImages(wide, "ru");
    expect(images.map((image) => [image.width, image.height])).toEqual([
      [1200, 630],
      [1200, 675],
      [1200, 900],
      [1200, 1200],
      [2000, 1333],
    ]);
    for (const image of images) {
      expect(image).toMatchObject(newsImageRights(wide, "ru"));
    }
  });
});
