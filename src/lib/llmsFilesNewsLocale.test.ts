import { describe, expect, it } from "vitest";

import {
  buildLlmsFullText,
  buildLlmsIndexText,
  createLlmsSpecies,
} from "@/lib/llmsFiles";

import { getPublishedNewsArticles } from "../../tests/fixtures/newsSeed";
import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

const slug = "batumi-19300-raptors-2026";

const LLMS = createLlmsSpecies(
  {
    en: speciesCatalogFixture("en"),
    ka: speciesCatalogFixture("ka"),
    ru: speciesCatalogFixture("ru"),
    tr: speciesCatalogFixture("tr"),
  },
  getPublishedNewsArticles().map((article) => {
    if (article.slug !== slug) return article;
    const { ru: _ru, tr: _tr, ...copy } = article.copy;
    return { ...article, copy };
  }),
);

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
