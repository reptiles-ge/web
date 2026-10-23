import { describe, expect, it } from "vitest";

import type { NewsArticle } from "@/data/newsTypes";

import {
  NEWS_SHORTER_TRANSLATIONS,
  newsArticleIssues,
  newsReferenceIssues,
} from "@/lib/newsRules";

const copy = (heading: string): NewsArticle["copy"]["ka"] => ({
  dek: "dek",
  lead: "lead",
  metaDescription: "meta",
  metaTitle: "meta",
  sections: [
    {
      blocks: [
        {
          parts: [
            { id: "vipera-dinniki", label: "x", type: "species" },
            { id: "kakheti", label: "x", type: "region" },
            { id: "snakes", label: "x", type: "hub" },
            { label: "x", slug: "nika-shamiladze", type: "credit-author" },
          ],
          type: "p",
        },
      ],
      heading,
    },
  ],
  title: "title",
});

const base: NewsArticle = {
  copy: { en: copy("One"), ka: copy("ერთი") } as NewsArticle["copy"],
  id: "test-news",
  publishedAt: "2026-10-23",
  relatedHubIds: ["snakes"],
  relatedRegionIds: ["kakheti"],
  relatedSpeciesIds: ["vipera-dinniki"],
  slug: "test-news",
  sources: [{ name: "Source", url: "https://example.org" }],
  status: "draft",
};

describe("newsArticleIssues", () => {
  it("accepts an article whose links are all listed", () => {
    expect(newsArticleIssues(base)).toEqual([]);
  });

  it("lets a listed article keep a shorter translation", () => {
    const [slug] = [...NEWS_SHORTER_TRANSLATIONS];
    const shorter: NewsArticle = {
      ...base,
      copy: {
        ...base.copy,
        en: { ...base.copy.en, sections: [] },
      },
    };
    expect(newsArticleIssues(shorter).map((issue) => issue.message)).toContain(
      "en has 0 sections, ka has 1",
    );
    expect(
      newsArticleIssues({ ...shorter, id: slug!, slug: slug! }).map(
        (issue) => issue.message,
      ),
    ).not.toContain("en has 0 sections, ka has 1");
  });

  it("reports missing related ids for every link kind", () => {
    expect(
      newsArticleIssues({
        ...base,
        relatedHubIds: [],
        relatedRegionIds: [],
        relatedSpeciesIds: [],
      }).map((issue) => issue.message),
    ).toEqual([
      "Linked species vipera-dinniki is missing",
      "Linked region kakheti is missing",
      "Linked hub snakes is missing",
    ]);
  });
});

describe("newsReferenceIssues", () => {
  const known = {
    authorIds: new Set(["nika-shamiladze"]),
    hubIds: new Set(["snakes"]),
    regionIds: new Set(["kakheti"]),
    speciesIds: new Set(["vipera-dinniki"]),
  };

  it("accepts ids that exist", () => {
    expect(newsReferenceIssues(base, known)).toEqual([]);
  });

  it("reports every unknown link and related id", () => {
    const empty = {
      authorIds: new Set<string>(),
      hubIds: new Set<string>(),
      regionIds: new Set<string>(),
      speciesIds: new Set<string>(),
    };
    expect(
      newsReferenceIssues(base, empty).map((issue) => issue.message),
    ).toEqual([
      "Unknown species vipera-dinniki",
      "Unknown region kakheti",
      "Unknown hub snakes",
      "Unknown author nika-shamiladze",
      "Unknown species vipera-dinniki",
      "Unknown region kakheti",
      "Unknown hub snakes",
    ]);
  });
});
