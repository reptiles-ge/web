import type { Metadata } from "next";

import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { generateMetadata as aboutMetadata } from "@/app/[locale]/about/page";
import { generateMetadata as authorMetadata } from "@/app/[locale]/authors/[slug]/page";
import { generateMetadata as authorsMetadata } from "@/app/[locale]/authors/page";
import { generateMetadata as contactMetadata } from "@/app/[locale]/contact/page";
import { generateMetadata as dangerousAnimalsMetadata } from "@/app/[locale]/dangerous-animals/page";
import { generateMetadata as newsArticleMetadata } from "@/app/[locale]/news/[slug]/page";
import { generateMetadata as newsIndexMetadata } from "@/app/[locale]/news/page";
import { generateMetadata as homeMetadata } from "@/app/[locale]/page";
import { generateMetadata as regionMetadata } from "@/app/[locale]/regions/[id]/page";
import { generateMetadata as riskToHumansMetadata } from "@/app/[locale]/risk-to-humans/page";
import { generateMetadata as venomousSnakesMetadata } from "@/app/[locale]/venomous-snakes/page";
import { GUIDE_ARTICLE_PATHS } from "@/data/guideArticlePaths";
import { getPublishedNewsArticles } from "@/data/news";
import { regions } from "@/data/regions";
import {
  getSpeciesAtlasMeta,
  getVenomousCatalogSpecies,
} from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { CLUSTER_GUIDES, type ClusterGuideId } from "@/lib/clusterGuides";
import { createClusterGuideRoute } from "@/lib/createClusterGuideRoute";
import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";
import { siteConfig } from "@/lib/site";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import { contributorsFixture } from "../../tests/fixtures/speciesCatalog";

const messages = { en, ka, ru, tr };

vi.mock("@/i18n/navigation", async () => {
  const { pathnames } = await import("@/i18n/pathnames");
  return {
    getPathname: ({
      href,
      locale,
    }: {
      href: string | { params?: Record<string, string>; pathname: string };
      locale: string;
    }) => {
      const key = typeof href === "string" ? href : href.pathname;
      const entry = pathnames[key as keyof typeof pathnames];
      const pattern =
        typeof entry === "string" ? entry : entry[locale as keyof typeof entry];
      const path =
        typeof href === "string"
          ? pattern
          : pattern.replace(
              /\[(\w+)\]/g,
              (_match, name: string) => href.params?.[name] ?? name,
            );
      if (locale === "ka") return path;
      return path === "/" ? `/${locale}` : `/${locale}${path}`;
    },
  };
});

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: messages[locale],
      namespace: namespace as "site",
    }),
  setRequestLocale: () => undefined,
}));

type Locale = (typeof routing.locales)[number];
type MetadataLoader = (locale: Locale) => Metadata | Promise<Metadata>;

const BRAND_SUFFIX = ` — ${siteConfig.titleBrand}`;

function localeParams(locale: Locale) {
  return { params: Promise.resolve({ locale }) };
}

const pageGroups: Record<string, Array<[string, MetadataLoader]>> = {
  "cluster guide": (Object.keys(CLUSTER_GUIDES) as ClusterGuideId[]).map(
    (id) => [
      id,
      (locale) =>
        createClusterGuideRoute(id).generateMetadata(localeParams(locale)),
    ],
  ),
  "guide article": GUIDE_ARTICLE_PATHS.map((path) => [
    path,
    (locale) =>
      createGuideArticleRoute(path).generateMetadata(localeParams(locale)),
  ]),
  "news article": getPublishedNewsArticles().map((article) => [
    article.slug,
    (locale) =>
      newsArticleMetadata({
        params: Promise.resolve({ locale, slug: article.slug }),
      }),
  ]),
  region: regions.map((region) => [
    region.id,
    (locale) =>
      regionMetadata({ params: Promise.resolve({ id: region.id, locale }) }),
  ]),
  "standalone guide": [
    [
      "dangerous-animals",
      (locale) => dangerousAnimalsMetadata(localeParams(locale)),
    ],
    ["risk-to-humans", (locale) => riskToHumansMetadata(localeParams(locale))],
    [
      "venomous-snakes",
      (locale) => venomousSnakesMetadata(localeParams(locale)),
    ],
  ],
};

function renderedTitle(title: Metadata["title"]) {
  if (typeof title === "string") return `${title}${BRAND_SUFFIX}`;
  return (title as { absolute: string }).absolute;
}

const cases = Object.entries(pageGroups).flatMap(([group, pages]) =>
  routing.locales.map((locale) => [group, locale, pages] as const),
);

describe("content page titles", () => {
  it.each(cases)(
    "renders %s titles in %s without the brand suffix, within 60 characters",
    async (_group, locale, pages) => {
      for (const [id, load] of pages) {
        const metadata = await load(locale);
        const title = renderedTitle(metadata.title);
        expect(metadata.title, `${id} ${locale}`).toEqual({ absolute: title });
        expect(title.endsWith(BRAND_SUFFIX), `${id} ${locale}`).toBe(false);
        expect(title.length, `${id} ${locale}: ${title}`).toBeLessThanOrEqual(
          60,
        );
      }
    },
  );

  it.each(routing.locales)(
    "keeps every %s content title unique",
    async (locale) => {
      const titles = new Map<string, string>();
      for (const [group, pages] of Object.entries(pageGroups)) {
        for (const [id, load] of pages) {
          const title = renderedTitle((await load(locale)).title);
          expect(titles.get(title), `${group} ${id}: ${title}`).toBeUndefined();
          titles.set(title, `${group} ${id}`);
        }
      }
    },
  );
});

describe("venomous snakes title", () => {
  it.each(routing.locales)(
    "puts the catalog venomous snake count in the %s title",
    async (locale) => {
      const title = renderedTitle(
        (await venomousSnakesMetadata(localeParams(locale))).title,
      );
      expect(title).toContain(
        String((await getVenomousCatalogSpecies(locale)).length),
      );
    },
  );
});

describe("region page titles", () => {
  it.each(regions.map((region) => [region.id, region] as const))(
    "lists snakes, lizards, amphibians, and birds on %s as the title says",
    (_id, region) => {
      const groups = new Set(
        region.speciesIds.map((id) => getSpeciesAtlasMeta(id).group),
      );
      for (const group of ["amphibian", "bird", "lizard", "snake"] as const) {
        expect(groups.has(group), group).toBe(true);
      }
    },
  );
});

describe("home meta description", () => {
  it.each(routing.locales)("fits the %s description", async (locale) => {
    const metadata = await homeMetadata(localeParams(locale));
    const description = String(metadata.description);
    expect(description.length).toBeLessThanOrEqual(locale === "ka" ? 160 : 155);
  });
});

const brandedPages: Array<[string, MetadataLoader]> = [
  ["about", (locale) => aboutMetadata(localeParams(locale))],
  ["contact", (locale) => contactMetadata(localeParams(locale))],
  ["contributors", (locale) => authorsMetadata(localeParams(locale))],
  ["news", (locale) => newsIndexMetadata(localeParams(locale))],
  ...contributorsFixture().map((author): [string, MetadataLoader] => [
    author.id,
    (locale) =>
      authorMetadata({
        params: Promise.resolve({ locale, slug: author.id }),
      }),
  ]),
];

describe("branded page titles", () => {
  it.each(routing.locales)(
    "leads the %s home title with the Reptiles.ge brand",
    async (locale) => {
      const title = renderedTitle(
        (await homeMetadata(localeParams(locale))).title,
      );
      expect(title.startsWith(`${siteConfig.titleBrand} — `)).toBe(true);
      expect(title.length).toBeLessThanOrEqual(60);
    },
  );

  it.each(routing.locales)(
    "keeps the Reptiles.ge brand on %s branded pages within 60 characters",
    async (locale) => {
      for (const [id, load] of brandedPages) {
        const title = renderedTitle((await load(locale)).title);
        expect(title, `${id} ${locale}`).toContain(siteConfig.titleBrand);
        expect(title.length, `${id} ${locale}: ${title}`).toBeLessThanOrEqual(
          60,
        );
      }
    },
  );
});
