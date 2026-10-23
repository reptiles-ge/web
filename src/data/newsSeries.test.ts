import { describe, expect, it } from "vitest";

import {
  getPublishedNewsArticleBySlug,
  getPublishedNewsArticles,
  getPublishedNewsArticlesInSeries,
} from "@/data/news";
import { NEWS_SERIES, newsSeriesIds, newsSeriesName } from "@/data/newsSeries";
import { routing } from "@/i18n/routing";
import { newsKaFrontmatterSchema } from "@/lib/newsFrontmatter";

const frontmatter = {
  dek: "Dek",
  lead: "Lead",
  metaDescription: "Description",
  metaTitle: "Meta title",
  publishedAt: "2026-10-20",
  relatedHubIds: [],
  relatedRegionIds: [],
  relatedSpeciesIds: [],
  slug: "example",
  sources: [{ name: "Source", url: "https://example.org" }],
  status: "published",
  title: "Title",
};

describe("news series registry", () => {
  it("names every series in every locale", () => {
    for (const id of newsSeriesIds) {
      for (const locale of routing.locales) {
        expect(newsSeriesName(id, locale).trim(), `${id}:${locale}`).not.toBe(
          "",
        );
      }
    }
  });

  it("only registers series with at least two published articles", () => {
    for (const id of Object.keys(NEWS_SERIES)) {
      const members = getPublishedNewsArticles().filter(
        (article) => article.series === id,
      );
      expect(members.length, id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("news series frontmatter", () => {
  it("accepts a registered series id", () => {
    const result = newsKaFrontmatterSchema.safeParse({
      ...frontmatter,
      series: "batumi-raptor-count-2026",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown series id", () => {
    const result = newsKaFrontmatterSchema.safeParse({
      ...frontmatter,
      series: "batumi-raptor-count-2025",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["series"]);
  });

  it("keeps series optional", () => {
    expect(newsKaFrontmatterSchema.safeParse(frontmatter).success).toBe(true);
  });
});

describe("getPublishedNewsArticlesInSeries", () => {
  it("lists the Batumi count series oldest first", () => {
    const article = getPublishedNewsArticleBySlug("batumi-19300-raptors-2026");
    expect(article?.series).toBe("batumi-raptor-count-2026");
    const series = getPublishedNewsArticlesInSeries(article!, "en");
    expect(series.map((item) => item.slug)).toEqual([
      "batumi-19300-raptors-2026",
      "batumi-239735-raptors-record-day-2026",
      "crested-honey-buzzard-batumi-2026",
      "batumi-milioni-mtatsebeli-39-darghveva",
      "batumi-raptor-count-2026-season-ends",
    ]);
    const dates = series.map((item) => item.publishedAt);
    expect(dates).toEqual([...dates].sort());
  });

  it("returns nothing for an article outside a series", () => {
    const article = getPublishedNewsArticleBySlug(
      "from-the-sky-raptor-poaching-film-batumi",
    );
    expect(article?.series).toBeUndefined();
    expect(getPublishedNewsArticlesInSeries(article!)).toEqual([]);
  });
});
