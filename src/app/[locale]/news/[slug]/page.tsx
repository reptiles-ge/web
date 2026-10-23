import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { NewsArticlePage } from "@/components/NewsArticlePage";
import { getNewsCopy, newsRelatedSpecies, newsSourceName } from "@/data/news";
import { newsSeriesName } from "@/data/newsSeries";
import { getRegionById, localizeRegionText } from "@/data/regions";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { getContributorDirectory } from "@/lib/authorsApi";
import {
  newsArticleAlternates,
  newsArticleUrl,
  newsDateTime,
  newsIndexUrl,
  newsOgImageUrl,
} from "@/lib/news";
import { getNewsArticle, getNewsList } from "@/lib/newsApi";
import { newsSchemaImages } from "@/lib/newsSchemaImages";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import {
  absoluteUrl,
  localePath,
  openGraphJpeg,
  organizationRef,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import {
  getCreditPhotoCatalog,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      robots: null,
      title: "News",
    };
  }

  const locale = localeParam as AppLocale;
  const article = await getNewsArticle(slug);
  const copy = article ? getNewsCopy(article, locale) : undefined;
  if (!article || !copy) {
    const t = await getTranslations({ locale, namespace: "news" });
    return {
      robots: null,
      title: t("notFound"),
    };
  }

  const title = copy.metaTitle;
  const url = newsArticleUrl(locale, article.slug);
  const description = copy.metaDescription;
  const ogImage = newsOgImageUrl(article, await getSpeciesCatalog(locale));
  const published = newsDateTime(article.publishedAt);

  return {
    alternates: newsArticleAlternates(locale, article),
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
    robots: INDEXABLE_ROBOTS,
    title: { absolute: title },
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImage],
      title,
    },
  };
}

export async function generateStaticParams() {
  const lists = await Promise.all(
    routing.locales.map(
      async (locale) => [locale, await getNewsList(locale)] as const,
    ),
  );
  return lists.flatMap(([locale, items]) =>
    items.map(({ slug }) => ({ locale, slug })),
  );
}

export default async function NewsArticleRoute({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const article = await getNewsArticle(slug);
  const copy = article ? getNewsCopy(article, locale) : undefined;
  if (!article || !copy) {
    notFound();
  }

  const [t, tNav, tShared, catalog, creditPhotos, contributors] =
    await Promise.all([
      getTranslations({ locale, namespace: "news" }),
      getTranslations({ locale, namespace: "nav" }),
      getTranslations({ locale, namespace: "groupHubShared" }),
      getSpeciesCatalog(locale),
      getCreditPhotoCatalog(),
      getContributorDirectory(locale),
    ]);
  const url = newsArticleUrl(locale, article.slug);
  const published = newsDateTime(article.publishedAt);
  const modified = newsDateTime(article.updatedAt ?? article.publishedAt);

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
  const mentions = newsRelatedSpecies(article, catalog).map((species) => ({
    "@type": "Taxon" as const,
    name: species.scientificName,
    taxonRank: "Species",
  }));
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    about: [
      ...aboutPlaces,
      {
        "@type": "Place",
        name: georgiaPlaceName(locale),
      },
    ],
    articleSection: article.relatedHubIds.map((hub) => tNav(hub)),
    author: organizationRef(),
    citation: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: newsSourceName(source, locale),
      url: source.url,
    })),
    dateModified: modified,
    datePublished: published,
    description: copy.metaDescription,
    headline: copy.title,
    image: newsSchemaImages(
      article,
      locale,
      catalog,
      creditPhotos,
      contributors,
    ),
    inLanguage: locale,
    isPartOf: article.series
      ? [
          { "@id": siteEntityId("website") },
          {
            "@type": "CreativeWorkSeries",
            name: newsSeriesName(article.series, locale),
          },
        ]
      : { "@id": siteEntityId("website") },
    mainEntityOfPage: {
      "@id": url,
      "@type": "WebPage",
    },
    mentions,
    publisher: organizationRef(),
    url,
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <NewsArticlePage article={article} locale={locale} />
    </>
  );
}
