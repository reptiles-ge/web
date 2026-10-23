import { describe, expect, it } from "vitest";

import { newsArticleFromMdx } from "@/lib/newsMdxArticle";

const KA = `---
slug: test-news
status: draft
publishedAt: '2026-10-23'
title: სათაური
dek: მოკლედ
lead: შესავალი
metaTitle: მეტა სათაური
metaDescription: მეტა აღწერა
relatedHubIds: [snakes]
relatedRegionIds: []
relatedSpeciesIds: []
sources:
  - name: Source
    url: 'https://example.org'
image:
  src: 'https://cdn.reptiles.ge/cover.jpg'
  alt: ყდა
gallery:
  - src: 'https://cdn.reptiles.ge/one.jpg'
    alt: ერთი
heroImageException: The source has no landscape photo of this event.
---

## პირველი

ტექსტი <Hub id="snakes">გველები</Hub>.

<Figure src="https://cdn.reptiles.ge/one.jpg" />
`;

const EN = `---
title: Title
dek: Short
lead: Lead
metaTitle: Meta title
metaDescription: Meta description
image:
  src: 'https://cdn.reptiles.ge/cover.jpg'
  alt: Cover
gallery:
  - src: 'https://cdn.reptiles.ge/one.jpg'
    alt: One
---

## First

Text.

<Figure src="https://cdn.reptiles.ge/one.jpg" />
`;

const file = (raw: string, locale = "ka") => ({
  path: `src/content/news/test-news/${locale}.mdx`,
  raw,
});

describe("newsArticleFromMdx", () => {
  it("builds one article from the Georgian file and its translations", () => {
    const result = newsArticleFromMdx("test-news", {
      en: file(EN, "en"),
      ka: file(KA),
    });
    expect(result.errors).toEqual([]);
    expect(result.heroImageException).toBe(
      "The source has no landscape photo of this event.",
    );
    expect(result.article).toMatchObject({
      id: "test-news",
      image: {
        alt: { en: "Cover", ka: "ყდა" },
        src: "https://cdn.reptiles.ge/cover.jpg",
      },
      relatedHubIds: ["snakes"],
      slug: "test-news",
      status: "draft",
    });
    expect(result.article?.gallery?.[0]?.alt).toEqual({
      en: "One",
      ka: "ერთი",
    });
    expect(Object.keys(result.article!.copy)).toEqual(["ka", "en"]);
    expect(result.article?.copy.ka.sections[0]).toEqual({
      blocks: [
        {
          parts: [
            "ტექსტი ",
            { id: "snakes", label: "გველები", type: "hub" },
            ".",
          ],
          type: "p",
        },
        { src: "https://cdn.reptiles.ge/one.jpg", type: "figure" },
      ],
      heading: "პირველი",
    });
  });

  it("needs a valid Georgian file", () => {
    expect(newsArticleFromMdx("test-news", {}).errors).toEqual([
      "test-news: missing ka.mdx",
    ]);
    const invalid = newsArticleFromMdx("test-news", {
      ka: file(KA.replace("status: draft", "status: maybe")),
    });
    expect(invalid.article).toBeUndefined();
    expect(invalid.errors[0]).toContain("ka.mdx");
  });

  it("reports a slug mismatch, a broken translation and an unknown photo", () => {
    const result = newsArticleFromMdx("other-news", {
      en: file(EN.replace("one.jpg'", "two.jpg'"), "en"),
      ka: file(KA),
      ru: file(EN.replace("title: Title\n", ""), "ru"),
    });
    expect(result.errors).toEqual([
      "src/content/news/test-news/ka.mdx: folder/slug mismatch: other-news vs test-news",
      "src/content/news/test-news/en.mdx: no ka photo for https://cdn.reptiles.ge/two.jpg",
      expect.stringContaining("src/content/news/test-news/ru.mdx:"),
    ]);
    expect(Object.keys(result.article!.copy)).toEqual(["ka", "en"]);
  });
});
