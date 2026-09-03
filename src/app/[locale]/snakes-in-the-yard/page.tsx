import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { SnakesInYardPage } from "@/components/SnakesInYardPage";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/snakes-in-the-yard";
const HERO_IMAGE = "/images/guides/snakes-in-the-yard-cover.jpg";
const WHY_IMAGE = "/images/guides/snakes-in-the-yard-why.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "snakesInYard" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const url = absoluteUrl(localePath(locale, PATH));
  const ogImage = absoluteUrl(HERO_IMAGE);

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 572,
          url: ogImage,
          width: 1024,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "article",
      url,
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
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SnakesInYardRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "snakesInYard" });
  const tSnakes = await getTranslations({ locale, namespace: "snakes" });
  const url = absoluteUrl(localePath(locale, PATH));

  const heroSrc = HERO_IMAGE;
  const coverSrc = WHY_IMAGE;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: t("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/snakes")),
        name: tSnakes("breadcrumbCurrent"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: url,
        name: t("breadcrumbCurrent"),
        position: 3,
      },
    ],
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    description: t("metaDescription"),
    inLanguage: locale,
    name: t("title"),
    step: ([1, 2, 3] as const).map((n) => ({
      "@type": "HowToStep",
      name: t(`action${n}Title`),
      position: n,
      text: t(`action${n}Body`),
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A`),
      },
      name: t(`faq${n}Q`),
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    about: {
      "@type": "Thing",
      name: t("title"),
    },
    author: { "@id": siteEntityId("organization") },
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <CoverImagePreload sizes="100vw" src={heroSrc} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={faqLd} />
      <SnakesInYardPage coverSrc={coverSrc} heroSrc={heroSrc} />
    </>
  );
}
