import { describe, expect, it, vi } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import {
  buildLlmsFullText,
  buildLlmsIndexText,
  createLlmsSpecies,
} from "@/lib/llmsFiles";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

const LLMS = createLlmsSpecies(
  {
    en: speciesCatalogFixture("en"),
    ka: speciesCatalogFixture("ka"),
    ru: speciesCatalogFixture("ru"),
    tr: speciesCatalogFixture("tr"),
  },
  getPublishedNewsArticles(),
);

const { slug } = vi.hoisted(() => ({ slug: "batumi-19300-raptors-2026" }));

vi.mock("@/data/news.generated", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/data/news.generated")>();
  return {
    NEWS_ARTICLES: original.NEWS_ARTICLES.map((article) => {
      if (article.slug !== slug) return article;
      const { ru: _ru, tr: _tr, ...copy } = article.copy;
      return { ...article, copy };
    }),
  };
});

describe("llms files with a news article missing a locale", () => {
  it.each(["ru", "tr"] as const)(
    "builds the %s files without the untranslated article",
    (locale) => {
      const index = buildLlmsIndexText(LLMS, locale);
      const full = buildLlmsFullText(LLMS, locale);
      expect(index).not.toContain(`/news/${slug}`);
      expect(full).not.toContain(`/${locale}/news/${slug}`);
    },
  );

  it("keeps the article in the en files", () => {
    expect(buildLlmsIndexText(LLMS, "en")).toContain(`/en/news/${slug}`);
    expect(buildLlmsFullText(LLMS, "en")).toContain(`/en/news/${slug}`);
  });
});
