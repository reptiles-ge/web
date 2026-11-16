import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  newsArticleFromMdx,
  readNewsInbox,
  withNewsInbox,
} from "@/lib/newsMdxArticle";

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

describe("readNewsInbox", () => {
  const inboxWith = (folders: Record<string, Record<string, string>>) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "news-inbox-"));
    for (const [slug, files] of Object.entries(folders)) {
      fs.mkdirSync(path.join(root, slug));
      for (const [name, raw] of Object.entries(files))
        fs.writeFileSync(path.join(root, slug, name), raw);
    }
    return root;
  };

  it("reads every article folder and reports the broken ones", () => {
    const root = inboxWith({
      "broken-news": { "en.mdx": EN },
      "test-news": { "en.mdx": EN, "ka.mdx": KA },
    });
    fs.writeFileSync(path.join(root, "notes.txt"), "not an article");
    const inbox = readNewsInbox(root);
    expect(inbox.articles.map((article) => article.slug)).toEqual([
      "test-news",
    ]);
    expect(inbox.errors).toEqual(["broken-news: missing ka.mdx"]);
  });

  it("returns nothing when the inbox does not exist", () => {
    expect(readNewsInbox(path.join(os.tmpdir(), "no-such-news-inbox"))).toEqual(
      { articles: [], errors: [] },
    );
  });

  it("puts inbox articles beside the published ones, and the inbox copy wins", () => {
    const { article } = newsArticleFromMdx("test-news", { ka: file(KA) });
    const published = { ...article!, slug: "old-news" };
    const stale = { ...article!, status: "published" as const };
    expect(
      withNewsInbox([published, stale], [article!]).map((item) => [
        item.slug,
        item.status,
      ]),
    ).toEqual([
      ["old-news", "draft"],
      ["test-news", "draft"],
    ]);
  });
});
