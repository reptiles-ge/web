import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { DangerousAnimalsPage } from "@/components/DangerousAnimalsPage";
import { JsonLd } from "@/components/JsonLd";
import { dangerousAnimalsFeature } from "@/content/features/dangerousAnimals";
import { getCatalogSpecies } from "@/data/species";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/dangerous-animals";
const HERO_ILLUSTRATION = dangerousAnimalsFeature.illustrations.hero;

export default async function DangerousAnimalsRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const species = getCatalogSpecies();

  const t = await getTranslations({ locale, namespace: "dangerousAnimals" });
  const copy = dangerousAnimalsFeature.copy[locale];
  const url = absoluteUrl(localePath(locale, PATH));
  const dates = pageDateFields(PATH);

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
        item: url,
        name: t("breadcrumbCurrent"),
        position: 2,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    author: { "@id": siteEntityId("organization") },
    ...dates,
    description: copy.metaDescription,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: copy.metaTitle,
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <CoverImagePreload sizes="100vw" src={HERO_ILLUSTRATION.src} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <DangerousAnimalsPage
        locale={locale}
        publishedAt={dates.datePublished}
        species={species}
        updatedAt={dates.dateModified}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const copy = dangerousAnimalsFeature.copy[locale];
  const title = copy.metaTitle;
  const path = localePath(locale, PATH);
  const description = kaMetaDescriptionOverride(
    locale,
    path,
    copy.metaDescription,
  );
  const url = absoluteUrl(path);
  const ogImage = HERO_ILLUSTRATION.src;

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    keywords: copy.keywords,
    openGraph: {
      description,
      images: [
        {
          alt: HERO_ILLUSTRATION.alt[locale],
          height: 887,
          type: "image/jpeg",
          url: ogImage,
          width: 1774,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
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
