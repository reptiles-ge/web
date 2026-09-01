import { JsonLd } from "@/components/JsonLd";
import { NewsArticlePage } from "@/components/NewsArticlePage";
import {
  getNewsCopy,
  getPublishedNewsArticleBySlug,
} from "@/data/news";
import { getRegionById, localizeRegionText } from "@/data/regions";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
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
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNewsStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      title: "News",
      robots: { index: false, follow: false },
    };
  }

  const locale = localeParam as AppLocale;
  const article = getPublishedNewsArticleBySlug(slug);
  if (!article) {
    const t = await getTranslations({ locale, namespace: "news" });
    return {
      title: t("notFound"),
      robots: { index: false, follow: false },
    };
  }

  const copy = getNewsCopy(article, locale);
  const title = copy.metaTitle;
  const description = copy.metaDescription;
  const url = newsArticleUrl(locale, article.slug);
  const ogImage = newsOgImageUrl();
  const published = newsDateTime(article.publishedAt);

  return {
    title,
    description,
    alternates: newsArticleAlternates(locale, article.slug),
    openGraph: {
      type: "article",
      locale: openGraphLocale(locale),
      url,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: published,
      ...(article.updatedAt
        ? { modifiedTime: newsDateTime(article.updatedAt) }
        : {}),
      images: [openGraphJpeg(ogImage, title)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
  const ogImage = newsOgImageUrl();
  const published = newsDateTime(article.publishedAt);
  const org = organizationJsonLd();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tShared("breadcrumbHome"),
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbNews"),
        item: newsIndexUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: copy.title,
        item: url,
      },
    ],
  };

  const adjara = getRegionById("adjara");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: copy.title,
    description: copy.metaDescription,
    datePublished: published,
    ...(article.updatedAt
      ? { dateModified: newsDateTime(article.updatedAt) }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      contentUrl: ogImage,
    },
    author: { "@id": siteEntityId("organization") },
    publisher: org,
    isPartOf: { "@id": siteEntityId("website") },
    inLanguage: locale,
    about: [
      {
        "@type": "Place",
        name: "Batumi",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: adjara
            ? localizeRegionText(adjara.name, locale)
            : "Adjara",
        },
      },
      {
        "@type": "Place",
        name: georgiaPlaceName(locale),
      },
    ],
    mentions: {
      "@type": "Taxon",
      name: "Pernis apivorus",
      taxonRank: "Species",
    },
    citation: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
    })),
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <NewsArticlePage article={article} locale={locale} />
    </>
  );
}
