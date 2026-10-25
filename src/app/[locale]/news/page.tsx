import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { NewsTopicFacets } from "@/lib/newsBrowserQuery";

import { JsonLd } from "@/components/JsonLd";
import { NewsIndexPage } from "@/components/NewsIndexPage";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  newsIndexDateFields,
  newsIndexHref,
  newsIndexUrl,
  newsOgImageUrl,
} from "@/lib/news";
import { getNewsListPage, newsListingJsonLd } from "@/lib/newsPages";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { absoluteUrl, localePath } from "@/lib/site";

const EMPTY_FACETS: NewsTopicFacets = {
  hub: {
    all: 0,
    amphibians: 0,
    birds: 0,
    insects: 0,
    lizards: 0,
    mammals: 0,
    scorpions: 0,
    snakes: 0,
    spiders: 0,
    turtles: 0,
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "news" });
  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    locale,
    ogImageUrl: newsOgImageUrl(),
    pagePath: newsIndexHref(),
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function NewsIndexRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const [t, tShared, newsPage] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getNewsListPage(locale, 1),
  ]);
  const articles = newsPage?.articles ?? [];
  const url = newsIndexUrl(locale);
  const jsonLd = newsListingJsonLd({
    articles,
    breadcrumbs: [
      {
        name: tShared("breadcrumbHome"),
        url: absoluteUrl(localePath(locale, "/")),
      },
      { name: t("breadcrumbNews"), url },
    ],
    dates: newsIndexDateFields(articles),
    description: t("metaDescription"),
    locale,
    name: t("metaTitle"),
    url,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <NewsIndexPage
        articles={articles}
        facets={newsPage?.facets ?? EMPTY_FACETS}
        locale={locale}
        pageCount={newsPage?.pageCount ?? 1}
        total={newsPage?.total ?? 0}
      />
    </>
  );
}
