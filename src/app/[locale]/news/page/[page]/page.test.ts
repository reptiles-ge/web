import type { ReactElement } from "react";

import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { NEWS_PAGE_SIZE } from "@/lib/newsPages";

import en from "../../../../../../messages/en.json";
import ka from "../../../../../../messages/ka.json";
import ru from "../../../../../../messages/ru.json";
import tr from "../../../../../../messages/tr.json";
import NewsArchiveRoute, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";

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

vi.mock("@/i18n/navigation", async () => {
  const { fakeGetPathname } =
    await import("../../../../../../tests/fixtures/manyNews");
  return { getPathname: fakeGetPathname };
});

vi.mock("@/data/news", async (importOriginal) => {
  const { withManyNews } =
    await import("../../../../../../tests/fixtures/manyNews");
  return withManyNews(await importOriginal());
});

function params(locale: string, page: string) {
  return { params: Promise.resolve({ locale, page }) };
}

describe("news archive route", () => {
  it("404s anything it did not generate", () => {
    expect(dynamicParams).toBe(false);
    expect(generateStaticParams()).toEqual([
      { locale: "ka", page: "2" },
      { locale: "ka", page: "3" },
      { locale: "en", page: "2" },
      { locale: "en", page: "3" },
      { locale: "ru", page: "2" },
      { locale: "ru", page: "3" },
      { locale: "tr", page: "2" },
    ]);
  });

  it.each(routing.locales)(
    "gives %s page 2 a unique title, description and self-canonical",
    async (locale) => {
      const metadata = await generateMetadata(params(locale, "2"));
      const prefix = locale === "ka" ? "" : `/${locale}`;
      expect(metadata.title).toBe(
        createTranslator({
          locale,
          messages: messages[locale],
          namespace: "news",
        })("archiveMetaTitle", { page: 2 }),
      );
      expect(metadata.title).not.toBe(messages[locale].news.metaTitle);
      expect(metadata.description).toContain("2");
      expect(metadata.alternates?.canonical).toBe(
        `https://reptiles.ge${prefix}/news/page/2`,
      );
      expect(metadata.alternates?.languages).toHaveProperty(
        "x-default",
        "https://reptiles.ge/news/page/2",
      );
      expect(metadata.alternates?.types).toEqual({
        "application/atom+xml": expect.any(String),
      });
      expect(metadata.robots).toMatchObject({ follow: true, index: true });
    },
  );

  it("leaves a locale out of hreflang when it has no such page", async () => {
    const metadata = await generateMetadata(params("en", "3"));
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual([
      "en",
      "ka",
      "ru",
      "x-default",
    ]);
  });

  it.each([
    ["xx", "2"],
    ["en", "1"],
    ["en", "02"],
    ["en", "4"],
    ["tr", "3"],
    ["en", "page"],
  ])("returns no metadata and 404s for %s/%s", async (locale, page) => {
    expect(await generateMetadata(params(locale, page))).toEqual({});
    await expect(NewsArchiveRoute(params(locale, page))).rejects.toThrow(
      "notFound",
    );
  });

  it("renders BreadcrumbList and a CollectionPage of only that page's articles", async () => {
    const element = (await NewsArchiveRoute(
      params("en", "2"),
    )) as ReactElement<{
      children: ReactElement<{ data?: unknown[] }>[];
    }>;
    const [jsonLd, page] = element.props.children;
    const [breadcrumb, collection] = jsonLd!.props.data as [
      { itemListElement: { item: string; name: string }[] },
      {
        dateModified: string;
        mainEntity: { itemListElement: unknown[]; numberOfItems: number };
        url: string;
      },
    ];

    expect(breadcrumb.itemListElement.map((crumb) => crumb.item)).toEqual([
      "https://reptiles.ge/en",
      "https://reptiles.ge/en/news",
      "https://reptiles.ge/en/news/page/2",
    ]);
    expect(breadcrumb.itemListElement[2]?.name).toBe("Page 2");
    expect(collection.url).toBe("https://reptiles.ge/en/news/page/2");
    expect(collection.mainEntity.numberOfItems).toBe(NEWS_PAGE_SIZE);
    expect(collection.mainEntity.itemListElement).toHaveLength(NEWS_PAGE_SIZE);
    expect(Date.parse(collection.dateModified)).not.toBeNaN();
    expect(page).toBeDefined();
  });
});
