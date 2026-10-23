import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getAllNewsArticles } from "@/data/news";
import { newsSlugs } from "@/data/newsPublish";
import { regions } from "@/data/regions";
import { GROUP_HUBS } from "@/lib/groupHubs";
import {
  NEWS_SHORTER_TRANSLATIONS,
  NEWS_UNLISTED_REGION_LINKS,
  newsArticleIssues,
  newsArticleLocales,
  newsBodyLinks,
  newsReferenceIssues,
} from "@/lib/newsRules";

import {
  contributorsFixture,
  speciesCatalogFixture,
} from "../../tests/fixtures/speciesCatalog";

const articles = getAllNewsArticles();

describe("news MDX content", () => {
  it("has one folder per registered slug", () => {
    const folders = fs
      .readdirSync(path.join(process.cwd(), "src/content/news"), {
        withFileTypes: true,
      })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(folders).toEqual([...newsSlugs].sort());
    expect(articles.map((article) => article.slug)).toEqual([...newsSlugs]);
  });

  it("passes the shared news rules", () => {
    for (const article of articles) {
      expect(newsArticleIssues(article), article.slug).toEqual([]);
    }
  });

  it("links only to species, regions, hubs and contributors that exist", () => {
    const known = {
      authorIds: new Set(contributorsFixture().map((author) => author.id)),
      hubIds: new Set(Object.keys(GROUP_HUBS)),
      regionIds: new Set(regions.map((region) => region.id)),
      speciesIds: new Set(speciesCatalogFixture("ka").map((item) => item.id)),
    };
    for (const article of articles) {
      expect(newsReferenceIssues(article, known), article.slug).toEqual([]);
    }
  });

  it("keeps only shorter-translation exceptions that are still shorter", () => {
    for (const slug of NEWS_SHORTER_TRANSLATIONS) {
      const article = articles.find((item) => item.slug === slug);
      expect(article, slug).toBeDefined();
      if (!article) continue;
      const counts = newsArticleLocales(article).map(
        (locale) => article.copy[locale].sections.length,
      );
      expect(new Set(counts).size, slug).toBeGreaterThan(1);
    }
  });

  it("keeps only region exceptions the article still links and leaves out", () => {
    for (const [slug, ids] of Object.entries(NEWS_UNLISTED_REGION_LINKS)) {
      const article = articles.find((item) => item.slug === slug);
      expect(article, slug).toBeDefined();
      if (!article) continue;
      const links = newsBodyLinks(article);
      for (const id of ids) {
        expect(links.region.has(id), `${slug} ${id}`).toBe(true);
        expect(article.relatedRegionIds, `${slug} ${id}`).not.toContain(id);
      }
    }
  });
});
