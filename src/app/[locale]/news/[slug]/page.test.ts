import type { ReactElement } from "react";

import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import { routing } from "@/i18n/routing";
import { newsSchemaImages } from "@/lib/newsSchemaImages";
import { INDEXABLE_ROBOTS } from "@/lib/robots";

import en from "../../../../../messages/en.json";
import ka from "../../../../../messages/ka.json";
import ru from "../../../../../messages/ru.json";
import tr from "../../../../../messages/tr.json";
import {
  contributorDirectoryFixture,
  speciesCatalogFixture,
} from "../../../../../tests/fixtures/speciesCatalog";
import { defined } from "../../../../../tests/support/defined";

const contributors = contributorDirectoryFixture();
import NewsArticleRoute, {
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
    namespace: "groupHubShared" | "nav" | "news";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
  setRequestLocale: () => undefined,
}));

const article = defined(getPublishedNewsArticles()[0]);

async function articleJsonLd(locale: string) {
  const page = (await NewsArticleRoute({
    params: Promise.resolve({ locale, slug: article.slug }),
  })) as ReactElement<{ children: ReactElement<{ data: unknown[] }>[] }>;
  const [jsonLd] = page.props.children;
  return defined(jsonLd).props.data[0] as Record<string, unknown>;
}

describe("news article JSON-LD", () => {
  it.each(routing.locales)(
    "lists every schema image of the %s article",
    async (locale) => {
      const articleLd = await articleJsonLd(locale);
      expect(articleLd["@type"]).toBe("NewsArticle");
      expect(articleLd.image).toEqual(
        newsSchemaImages(
          article,
          locale,
          speciesCatalogFixture(locale),
          speciesCatalogFixture("ka"),
          contributors,
        ),
      );
      expect(Array.isArray(articleLd.image)).toBe(true);
    },
  );

  it("dates the article with a full time and the Tbilisi offset", async () => {
    const articleLd = await articleJsonLd("en");
    const dateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+04:00$/;
    expect(articleLd.datePublished).toMatch(dateTime);
    expect(articleLd.dateModified).toMatch(dateTime);
  });

  it("defines each node with an id once and refers to it after that", async () => {
    const counts = new Map<string, number>();
    const visit = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (!value || typeof value !== "object") return;
      const node = value as Record<string, unknown>;
      if (typeof node["@id"] === "string" && Object.keys(node).length > 1) {
        counts.set(node["@id"], (counts.get(node["@id"]) ?? 0) + 1);
      }
      Object.values(node).forEach(visit);
    };
    for (const locale of routing.locales) {
      counts.clear();
      visit(await articleJsonLd(locale));
      for (const [id, count] of counts) expect(count, id).toBe(1);
    }
  });
});

describe("news article metadata", () => {
  it.each(routing.locales)(
    "allows large image previews for the %s article",
    async (locale) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug: article.slug }),
      });
      expect(metadata.robots).toEqual(INDEXABLE_ROBOTS);
      expect(metadata.robots).toMatchObject({ "max-image-preview": "large" });
    },
  );
});

describe("news article routes", () => {
  it("prerenders one page per published article and language from the API", async () => {
    const expected = routing.locales.flatMap((locale) =>
      getPublishedNewsArticles(locale).map(({ slug }) => ({ locale, slug })),
    );
    expect(await generateStaticParams()).toEqual(expected);
    expect(dynamicParams).toBe(true);
  });

  it("answers 404 for an article the API does not have", async () => {
    await expect(
      NewsArticleRoute({
        params: Promise.resolve({ locale: "en", slug: "no-such-article" }),
      }),
    ).rejects.toThrow();
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "no-such-article" }),
    });
    expect(metadata.robots).toBeNull();
  });
});
