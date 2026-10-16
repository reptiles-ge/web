import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getPublishedCreditAuthorBySlug } from "@/data/creditAuthors";
import {
  getAllNewsArticles,
  getNewsArticleLocales,
  newsPhotoBySrc,
} from "@/data/news";
import { newsSlugs } from "@/data/newsPublish";
import { getRegionById } from "@/data/regions";
import { getSpeciesById } from "@/data/species";
import { GROUP_HUBS } from "@/lib/groupHubs";

const articles = getAllNewsArticles();

const SHORTER_TRANSLATIONS = new Set([
  "bezoar-goat-restoration-javakheti-2026",
  "caucasian-toad-bufo-verrucosissimus-taxonomy-2026",
  "georgian-snakes-area-of-occupancy-2026",
  "leatherback-turtle-first-turkish-black-sea-records-2026",
]);

function figures(
  sections: (typeof articles)[number]["copy"]["ka"]["sections"],
) {
  return sections.map((section) =>
    section.blocks.flatMap((block) =>
      block.type === "figure" ? [block.src] : [],
    ),
  );
}

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

  it("keeps sections and figures in step across locales", () => {
    for (const article of articles) {
      const ka = article.copy.ka.sections;
      for (const locale of getNewsArticleLocales(article)) {
        const label = `${article.slug} ${locale}`;
        const sections = article.copy[locale].sections;
        expect(figures(sections).flat(), label).toEqual(figures(ka).flat());
        if (!SHORTER_TRANSLATIONS.has(article.slug))
          expect(sections.length, label).toBe(ka.length);
      }
    }
  });

  it("only shows figures from the article's own photos", () => {
    for (const article of articles) {
      for (const src of figures(article.copy.ka.sections).flat()) {
        expect(
          newsPhotoBySrc(article, src),
          `${article.slug} ${src}`,
        ).toBeDefined();
      }
    }
  });

  it("links only to species, regions, hubs and contributors that exist", () => {
    for (const article of articles) {
      for (const locale of getNewsArticleLocales(article)) {
        for (const section of article.copy[locale].sections) {
          for (const block of section.blocks) {
            if (block.type !== "p") continue;
            for (const part of block.parts) {
              if (typeof part === "string") continue;
              const label = `${article.slug} ${locale} ${JSON.stringify(part)}`;
              if (part.type === "species")
                expect(getSpeciesById(part.id), label).toBeDefined();
              if (part.type === "region")
                expect(getRegionById(part.id), label).toBeDefined();
              if (part.type === "hub")
                expect(GROUP_HUBS[part.id], label).toBeDefined();
              if (part.type === "credit-author")
                expect(
                  getPublishedCreditAuthorBySlug(part.slug),
                  label,
                ).toBeDefined();
            }
          }
        }
      }
    }
  });
});
