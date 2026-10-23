import { describe, expect, it } from "vitest";

import type { NewsArticle } from "@/data/newsTypes";

import { NEWS_ARTICLES } from "@/data/news.generated";

import { newsArticleSchema } from "./newsRecord";

const withFigures = NEWS_ARTICLES.find(
  (article) =>
    article.gallery &&
    article.copy.ka.sections.some((section) =>
      section.blocks.some((block) => block.type === "figure"),
    ),
)!;

function article(change: (draft: NewsArticle) => void = () => {}) {
  const draft = structuredClone(withFigures) as NewsArticle;
  change(draft);
  return draft;
}

function firstFigure(draft: NewsArticle, locale: "en" | "ka") {
  for (const section of draft.copy[locale].sections) {
    for (const block of section.blocks) {
      if (block.type === "figure") return block;
    }
  }
  throw new Error("No figure");
}

function messages(value: unknown) {
  const result = newsArticleSchema.safeParse(value);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.message);
}

describe("newsArticleSchema", () => {
  it("accepts every compiled article", () => {
    for (const item of NEWS_ARTICLES) {
      expect(messages(item), item.slug).toEqual([]);
    }
  });

  it("requires Georgian copy and a valid slug", () => {
    expect(
      messages(
        article((draft) => {
          delete (draft.copy as Partial<NewsArticle["copy"]>).ka;
        }),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      messages(
        article((draft) => {
          draft.id = "Bad Slug";
          draft.slug = "Bad Slug";
        }),
      ).join(),
    ).toContain("lowercase Latin words");
    expect(
      messages(
        article((draft) => {
          draft.id = "other-slug";
        }),
      ),
    ).toContain("id must equal slug");
  });

  it("refuses unknown keys, hubs and series", () => {
    expect(messages({ ...article(), extra: true }).length).toBeGreaterThan(0);
    expect(
      messages({ ...article(), relatedHubIds: ["fish"] }).length,
    ).toBeGreaterThan(0);
    expect(
      messages({ ...article(), series: "unknown-series" }).length,
    ).toBeGreaterThan(0);
  });

  it("checks photos, credits and sources", () => {
    expect(
      messages(
        article((draft) => {
          draft.gallery = [...draft.gallery!, draft.gallery![0]!];
        }),
      ).join(),
    ).toContain("listed twice");
    expect(
      messages(
        article((draft) => {
          draft.gallery![0]!.credit = { lat: 41.7 };
        }),
      ),
    ).toContain("lat and lng must be set together");
    expect(
      messages(
        article((draft) => {
          draft.sources = [
            { name: { ka: "წყარო" } as never, url: "https://example.org" },
          ];
        }),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      messages(
        article((draft) => {
          draft.sources = [];
        }),
      ).length,
    ).toBeGreaterThan(0);
  });

  it("keeps figures to the article's own photos, in the same order", () => {
    expect(
      messages(
        article((draft) => {
          firstFigure(draft, "ka").src = "https://cdn.reptiles.ge/other.jpg";
        }),
      ).join(),
    ).toContain("is not one of the article's photos");
    expect(
      messages(
        article((draft) => {
          firstFigure(draft, "en").src = "https://cdn.reptiles.ge/other.jpg";
        }),
      ),
    ).toContain("en figures differ from ka");
  });

  it("keeps section counts and related ids in step with the text", () => {
    expect(
      messages(
        article((draft) => {
          draft.copy.en.sections = draft.copy.en.sections.slice(1);
        }),
      ).join(),
    ).toMatch(/en has \d+ sections, ka has \d+/);
    expect(
      messages(
        article((draft) => {
          draft.copy.ka.sections[0]!.blocks.push({
            parts: [{ id: "vipera-dinniki", label: "x", type: "species" }],
            type: "p",
          });
        }),
      ),
    ).toContain("Linked species vipera-dinniki is missing");
    expect(
      messages(
        article((draft) => {
          draft.relatedRegionIds = ["tbilisi", "tbilisi"];
        }),
      ),
    ).toContain("Duplicate id");
  });
});
