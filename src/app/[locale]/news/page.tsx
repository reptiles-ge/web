import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { NewsIndexPage } from "@/components/NewsIndexPage";
import { getPublishedNewsArticles } from "@/data/news";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  newsArticleUrl,
  newsIndexHref,
  newsIndexUrl,
  newsOgImageUrl,
} from "@/lib/news";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  organizationJsonLd,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const orgLd = {
  "@context": "https://schema.org",
  ...organizationJsonLd(),
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

  const t = await getTranslations({ locale, namespace: "news" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const articles = getPublishedNewsArticles(locale);
  const url = newsIndexUrl(locale);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: tShared("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: url,
        name: t("breadcrumbNews"),
        position: 2,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    ...pageDateFields("/news"),
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        name: article.copy[locale]?.title ?? article.copy.ka.title,
        position: index + 1,
        url: newsArticleUrl(locale, article.slug),
      })),
      numberOfItems: articles.length,
    },
    name: t("metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd, collectionLd, orgLd]} />
      <NewsIndexPage articles={articles} locale={locale} />
    </>
  );
}
