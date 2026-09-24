import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { GuideArticlePath } from "@/data/guideArticlePaths";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { GuideArticlePage } from "@/components/GuideArticlePage";
import { JsonLd } from "@/components/JsonLd";
import {
  getGuideArticleByPath,
  getGuideArticles,
  type GuideArticle,
  type GuideArticleImage,
} from "@/data/guideArticles";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteImageUrl,
  absoluteUrl,
  localeAlternates,
  localePath,
  OG_IMAGE_WIDTH,
  openGraphJpeg,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = { params: Promise<{ locale: string }> };

const HERO_SIZES = "(max-width: 1023px) 100vw, 1400px";
const RELATED_LIMIT = 5;

export function createGuideArticleRoute(pathname: GuideArticlePath) {
  const article = getGuideArticleByPath(pathname);
  const parent = GROUP_HUBS[article.parentHub];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: value } = await params;
    if (!hasLocale(routing.locales, value)) return {};
    const locale = value as AppLocale;
    const copy = article.copy[locale];
    const url = absoluteUrl(localePath(locale, pathname));
    const description = kaMetaDescriptionOverride(
      locale,
      new URL(url).pathname,
      copy.description,
    );
    const image = guideShareImage(article, locale);

    return {
      alternates: localeAlternates(locale, pathname),
      description,
      openGraph: {
        description,
        images: [image],
        locale: openGraphLocale(locale),
        siteName: siteConfig.name,
        title: copy.metaTitle,
        type: "article",
        url,
      },
      title: { absolute: copy.metaTitle },
      twitter: {
        card: "summary_large_image",
        description,
        images: [image.url],
        title: copy.metaTitle,
      },
    };
  }

  async function Page({ params }: Props) {
    const { locale: value } = await params;
    if (!hasLocale(routing.locales, value)) notFound();
    const locale = value as AppLocale;
    setRequestLocale(locale);

    const [tShared, tParent] = await Promise.all([
      getTranslations({ locale, namespace: "groupHubShared" }),
      getTranslations({ locale, namespace: parent.messageKey }),
    ]);
    const copy = article.copy[locale];
    const url = absoluteUrl(localePath(locale, pathname));
    const dates = pageDateFields(pathname);
    const shareImage = guideShareImage(article, locale);
    const heroImage = guideImageObject(article.hero, locale);
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
          item: absoluteUrl(localePath(locale, parent.path)),
          name: tParent("breadcrumbCurrent"),
          position: 2,
        },
        { "@type": "ListItem", item: url, name: copy.title, position: 3 },
      ],
    };
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      articleSection: tParent("breadcrumbCurrent"),
      author: { "@id": siteEntityId("organization") },
      citation: article.sources.map((source) => ({
        "@type": "CreativeWork",
        name: source.name,
        url: source.url,
      })),
      dateModified: dates.dateModified,
      datePublished: dates.datePublished,
      description: copy.description,
      headline: copy.title,
      image: [
        {
          "@type": "ImageObject",
          caption: shareImage.alt,
          contentUrl: shareImage.url,
          height: shareImage.height,
          url: shareImage.url,
          width: shareImage.width,
        },
        heroImage,
      ],
      inLanguage: locale,
      isPartOf: { "@id": siteEntityId("website") },
      mainEntityOfPage: { "@id": url, "@type": "WebPage" },
      publisher: organizationJsonLd(),
      url,
    };

    return (
      <>
        <CoverImagePreload sizes={HERO_SIZES} src={article.hero.src} />
        <JsonLd data={[articleLd, breadcrumbLd]} />
        <GuideArticlePage
          article={article}
          dates={dates}
          locale={locale}
          related={relatedGuideArticles(article)}
        />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}

function guideImageObject(image: GuideArticleImage, locale: AppLocale) {
  const { height, url, width } = renderedImage(image);
  return {
    "@type": "ImageObject",
    caption: image.alt[locale],
    contentUrl: url,
    height,
    url,
    width,
  };
}

function guideShareImage(article: GuideArticle, locale: AppLocale) {
  return openGraphJpeg(
    absoluteImageUrl(article.ogImage),
    article.hero.alt[locale],
  );
}

function relatedGuideArticles(article: GuideArticle) {
  const others = getGuideArticles().filter((item) => item.id !== article.id);
  return [
    ...others.filter((item) => item.parentHub === article.parentHub),
    ...others.filter((item) => item.parentHub !== article.parentHub),
  ].slice(0, RELATED_LIMIT);
}

function renderedImage(image: GuideArticleImage) {
  const src = optimizedImgSrc(image.src, OG_IMAGE_WIDTH);
  const entry = optimizedEntry(image.src);
  const width =
    entry?.widths.find((item) => item >= OG_IMAGE_WIDTH) ??
    entry?.widths.at(-1) ??
    image.width;
  return {
    height: Math.round((width * image.height) / image.width),
    url: absoluteImageUrl(src),
    width,
  };
}
