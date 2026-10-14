import { describe, expect, it, vi } from "vitest";

import { BATUMI_19300_RAPTORS_2026 } from "@/content/news/batumi-19300-raptors-2026";
import { buildLlmsFullText, buildLlmsIndexText } from "@/lib/llmsFiles";

vi.mock("@/content/news/batumi-19300-raptors-2026", async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import("@/content/news/batumi-19300-raptors-2026")
    >();
  const article = original.BATUMI_19300_RAPTORS_2026;
  const { ru: _ru, tr: _tr, ...copy } = article.copy;
  return { BATUMI_19300_RAPTORS_2026: { ...article, copy } };
});

describe("llms files with a news article missing a locale", () => {
  const slug = BATUMI_19300_RAPTORS_2026.slug;

  it.each(["ru", "tr"] as const)(
    "builds the %s files without the untranslated article",
    (locale) => {
      const index = buildLlmsIndexText(locale);
      const full = buildLlmsFullText(locale);
      expect(index).not.toContain(`/news/${slug}`);
      expect(full).not.toContain(`/${locale}/news/${slug}`);
    },
  );

  it("keeps the article in the en files", () => {
    expect(buildLlmsIndexText("en")).toContain(`/en/news/${slug}`);
    expect(buildLlmsFullText("en")).toContain(`/en/news/${slug}`);
  });
});
