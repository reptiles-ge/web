import { describe, expect, it } from "vitest";

import { getGuideArticles } from "@/data/guideArticles";
import { getCatalogSpecies } from "@/data/species";
import { getSpeciesReading } from "@/lib/speciesArticles";

describe("getSpeciesReading", () => {
  it("leads venomous snake profiles with the bite guide", () => {
    expect(getSpeciesReading("macrovipera-lebetina").featured?.href).toBe(
      "/snakes/gvelis-nakbeni",
    );
  });

  it("links every guide article to its related species", () => {
    for (const article of getGuideArticles()) {
      for (const id of article.relatedSpeciesIds ?? []) {
        const { articles, featured } = getSpeciesReading(id);
        const hrefs = [featured, ...articles].map((item) => item?.href);
        expect(hrefs, id).toContain(article.pathname);
      }
    }
  });

  it("gives every article a cover and never repeats the featured one", () => {
    for (const species of getCatalogSpecies()) {
      const { articles, featured, shortcuts } = getSpeciesReading(species.id);
      for (const article of articles) {
        expect(article.image, `${species.id} ${article.href}`).toBeTruthy();
      }
      if (articles.length > 1) {
        expect(articles.map((item) => item.href)).not.toContain(featured?.href);
      }
      const shortcutHrefs = new Set(shortcuts.map((item) => item.href));
      for (const article of articles) {
        expect(shortcutHrefs.has(article.href)).toBe(false);
      }
    }
  });
});
