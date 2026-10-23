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

const contributors = contributorDirectoryFixture();
import NewsArticleRoute, { generateMetadata } from "./page";

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

const article = getPublishedNewsArticles()[0];

async function articleJsonLd(locale: string) {
  const page = (await NewsArticleRoute({
    params: Promise.resolve({ locale, slug: article.slug }),
  })) as ReactElement<{ children: ReactElement<{ data: unknown[] }>[] }>;
  const [jsonLd] = page.props.children;
  return jsonLd.props.data[0] as Record<string, unknown>;
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
