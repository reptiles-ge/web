import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HomeFresh } from "@/components/home/HomeFresh";
import { getPublishedNewsArticles } from "@/data/news";
import { getNewsListArticles, HOME_NEWS_LIMIT } from "@/lib/newsApi";

import en from "../../../messages/en.json";
import { toNewsListArticle } from "../../../tests/fixtures/manyNews";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "home.fresh" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

vi.mock("@/lib/newsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/newsApi")>()),
  getNewsListArticles: vi.fn(),
}));

vi.mock("@/data/speciesAtlas", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/data/speciesAtlas")>()),
  getRecentlyUpdatedSpecies: vi.fn(async () => []),
}));

vi.mock("@/lib/newsVisualLoader", () => ({
  loadNewsVisuals: vi.fn(async () => [null]),
}));

vi.mock("@/components/home/TrackedSpeciesLink", () => ({
  TrackedSpeciesLink: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
}));

const LATEST = getPublishedNewsArticles("en")
  .slice(0, HOME_NEWS_LIMIT)
  .map((article) => toNewsListArticle(article, "en"));

beforeEach(() => {
  vi.mocked(getNewsListArticles).mockReset().mockResolvedValue(LATEST);
});

describe("HomeFresh", () => {
  it("asks the news API for five articles and shows them", async () => {
    const node = await HomeFresh({ locale: "en" });
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        {node}
      </NextIntlClientProvider>,
    );

    expect(getNewsListArticles).toHaveBeenCalledExactlyOnceWith(
      "en",
      HOME_NEWS_LIMIT,
    );
    const [lead, ...rest] = LATEST;
    expect(
      screen.getByRole("heading", { level: 3, name: lead!.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(lead!.dek)).toBeInTheDocument();
    for (const article of rest) {
      expect(screen.getByText(article.title)).toBeInTheDocument();
    }
  });

  it("renders nothing without news or updated species", async () => {
    vi.mocked(getNewsListArticles).mockResolvedValue([]);
    expect(await HomeFresh({ locale: "en" })).toBeNull();
  });
});
