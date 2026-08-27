import { JsonLd } from "@/components/JsonLd";
import { SnakesInYardPage } from "@/components/SnakesInYardPage";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/snakes-in-the-yard";
const HERO_IMAGE = "/images/guides/snakes-in-the-yard-cover.jpg";
const WHY_IMAGE = "/images/guides/snakes-in-the-yard-why.jpg";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    title,
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    alternates: localeAlternates(locale, PATH),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 572,
          alt: title,
        },
      ],
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
        position: 1,
        name: t("breadcrumbHome"),
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tSnakes("breadcrumbCurrent"),
        item: absoluteUrl(localePath(locale, "/snakes")),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumbCurrent"),
        item: url,
      },
    ],
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("title"),
    description: t("metaDescription"),
    inLanguage: locale,
    step: ([1, 2, 3] as const).map((n) => ({
      "@type": "HowToStep",
      position: n,
      name: t(`action${n}Title`),
      text: t(`action${n}Body`),
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
      "@type": "Question",
      name: t(`faq${n}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A`),
      },
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    isPartOf: { "@id": siteEntityId("website") },
    author: { "@id": siteEntityId("organization") },
    publisher: { "@id": siteEntityId("organization") },
    about: {
      "@type": "Thing",
      name: locale === "en" ? "Snakes in residential yards" : "გველი ეზოში",
    },
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={faqLd} />
      <SnakesInYardPage
        heroSrc={heroSrc}
        coverSrc={coverSrc}
      />
    </>
  );
}
