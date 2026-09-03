import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { NewsArticlePage } from "@/components/NewsArticlePage";
import { getNewsCopy, getPublishedNewsArticleBySlug } from "@/data/news";
import { getRegionById, localizeRegionText } from "@/data/regions";
import { getSpeciesById } from "@/data/species";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  newsArticleAlternates,
  newsArticleUrl,
  newsDateTime,
  newsIndexUrl,
  newsOgImageUrl,
  publishedNewsStaticParams,
} from "@/lib/news";
import {
  absoluteUrl,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      robots: { follow: false, index: false },
      title: "News",
    };
  }

  const locale = localeParam as AppLocale;
  const article = getPublishedNewsArticleBySlug(slug);
  if (!article) {
    const t = await getTranslations({ locale, namespace: "news" });
    return {
      robots: { follow: false, index: false },
      title: t("notFound"),
    };
  }

  const copy = getNewsCopy(article, locale);
  const title = copy.metaTitle;
  const description = copy.metaDescription;
  const url = newsArticleUrl(locale, article.slug);
  const ogImage = newsOgImageUrl(article);
  const published = newsDateTime(article.publishedAt);

  return {
    alternates: newsArticleAlternates(locale, article.slug),
    description,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      publishedTime: published,
      siteName: siteConfig.name,
      title,
      type: "article",
      url,
      ...(article.updatedAt
        ? { modifiedTime: newsDateTime(article.updatedAt) }
        : {}),
      images: [openGraphJpeg(ogImage, title)],
    },
    robots: {
      follow: true,
      index: true,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImage],
      title,
    },
  };
}

export function generateStaticParams() {
  return publishedNewsStaticParams();
}

export default async function NewsArticleRoute({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const article = getPublishedNewsArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "news" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const copy = getNewsCopy(article, locale);
  const url = newsArticleUrl(locale, article.slug);
  const ogImage = newsOgImageUrl(article);
  const published = newsDateTime(article.publishedAt);
  const org = organizationJsonLd();

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
        item: newsIndexUrl(locale),
        name: t("breadcrumbNews"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: url,
        name: copy.title,
        position: 3,
      },
    ],
  };

  const aboutPlaces = article.relatedRegionIds.flatMap((id) => {
    const region = getRegionById(id);
    if (!region) return [];
    return [
      {
        "@type": "AdministrativeArea" as const,
        name: localizeRegionText(region.name, locale),
      },
    ];
  });
  const mentions = article.relatedSpeciesIds.flatMap((id) => {
    const species = getSpeciesById(id);
    if (!species) return [];
    return [
      {
        "@type": "Taxon" as const,
        name: species.scientificName,
        taxonRank: "Species",
      },
    ];
  });
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    datePublished: published,
    description: copy.metaDescription,
    headline: copy.title,
    ...(article.updatedAt
      ? { dateModified: newsDateTime(article.updatedAt) }
      : {}),
    about: [
      ...aboutPlaces,
      {
        "@type": "Place",
        name: georgiaPlaceName(locale),
      },
    ],
    author: { "@id": siteEntityId("organization") },
    citation: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
    })),
    image: {
      "@type": "ImageObject",
      contentUrl: ogImage,
      url: ogImage,
    },
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntityOfPage: {
      "@id": url,
      "@type": "WebPage",
    },
    mentions,
    publisher: org,
    url,
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <NewsArticlePage article={article} locale={locale} />
    </>
  );
}
