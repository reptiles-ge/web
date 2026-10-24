import type { ReactElement } from "react";

import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { type AppLocale, routing } from "@/i18n/routing";
import { NEWS_PAGE_SIZE } from "@/lib/newsPages";

import en from "../../../../messages/en.json";
import ka from "../../../../messages/ka.json";
import ru from "../../../../messages/ru.json";
import tr from "../../../../messages/tr.json";
import { MANY_NEWS_TOTAL } from "../../../../tests/fixtures/manyNews";
import NewsIndexRoute, { generateMetadata } from "./page";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "news";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
  setRequestLocale: () => undefined,
}));

vi.mock("@/lib/newsApi", async () => {
  const { manyNewsListArticles } =
    await import("../../../../tests/fixtures/manyNews");
  const actual =
    await vi.importActual<typeof import("@/data/news")>("@/data/news");
  return {
    getNewsListArticles: async (locale: AppLocale) =>
      manyNewsListArticles(actual, locale),
  };
});

describe("news index metadata", () => {
  it.each(routing.locales)(
    "leaves the %s Atom feed link to the locale layout",
    async (locale) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(metadata.alternates).not.toHaveProperty("types");
      expect(metadata.alternates?.canonical).toBeTruthy();
      expect(metadata.alternates?.languages).toHaveProperty("x-default");
      expect(metadata.title).toBe(messages[locale].news.metaTitle);
    },
  );

  it("returns nothing for an unknown locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "xx" }) }),
    ).toEqual({});
  });
});

describe("news index page", () => {
  it("lists only the first page and hands the page count to the pagination", async () => {
    const element = (await NewsIndexRoute({
      params: Promise.resolve({ locale: "en" }),
    })) as ReactElement<{
      children: ReactElement<Record<string, unknown>>[];
    }>;
    const [jsonLd, page] = element.props.children;
    const collection = (jsonLd!.props.data as unknown[])[1] as {
      mainEntity: { itemListElement: unknown[]; numberOfItems: number };
    };

    expect(collection.mainEntity.numberOfItems).toBe(NEWS_PAGE_SIZE);
    expect(collection.mainEntity.itemListElement).toHaveLength(NEWS_PAGE_SIZE);
    expect(page!.props.articles).toHaveLength(NEWS_PAGE_SIZE);
    expect(page!.props.pageCount).toBe(3);
    expect(page!.props.total).toBe(MANY_NEWS_TOTAL);
  });

  it("404s an unknown locale", async () => {
    await expect(
      NewsIndexRoute({ params: Promise.resolve({ locale: "xx" }) }),
    ).rejects.toThrow("notFound");
  });
});
