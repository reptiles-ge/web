import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeProof } from "@/components/HomeProof";
import { HomeRegions } from "@/components/HomeRegions";
import { HomeSeo } from "@/components/HomeSeo";
import { JsonLd } from "@/components/JsonLd";
import { MapExplorer } from "@/components/map/MapExplorer";
import { SpeciesCarousel } from "@/components/SpeciesCarousel";
import { SpeciesDetail } from "@/components/SpeciesDetail";
import { getAtlasStats } from "@/data/speciesAtlas";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
  speciesPageUrl,
  websiteJsonLd,
} from "@/lib/site";
import { HOME_DEFINED_TERMS, siteKeywords } from "@/lib/seoKeywords";
import { routing, type AppLocale } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(localePath(locale, "/"));
  const alternates = localeAlternates(locale, "/");
  const ogImage = "https://cdn.reptiles.ge/og-landing.jpg";

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: siteKeywords(locale),
    alternates,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 541,
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
  };
}

export default async function Home({ params }: Props): Promise<ReactElement> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "site" });
  const homeUrl = absoluteUrl(localePath(locale, "/"));
  const speciesSearchUrl = absoluteUrl(localePath(locale, "/species"));
  const description = t("description");
  const stats = getAtlasStats();
  const org = organizationJsonLd({ description });
  const termsId = `${homeUrl}#atlas-terms`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      org,
      websiteJsonLd({ description }),
      {
        "@type": "WebPage",
        "@id": homeUrl,
        url: homeUrl,
        name: t("title"),
        description,
        inLanguage: locale,
        isPartOf: { "@id": siteEntityId("website") },
        about: { "@id": termsId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${speciesSearchUrl}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Dataset",
        name:
          locale === "en"
            ? "Atlas of reptiles of Georgia"
            : "საქართველოს ქვეწარმავლების ატლასი",
        description,
        url: homeUrl,
        creator: { "@id": siteEntityId("organization") },
        publisher: { "@id": siteEntityId("organization") },
        spatialCoverage: {
          "@type": "Place",
          name: locale === "en" ? "Georgia" : "საქართველო",
        },
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: locale === "en" ? "Species profiles" : "სახეობების პროფილები",
            value: stats.total,
          },
          {
            "@type": "PropertyValue",
            name: locale === "en" ? "Regions" : "რეგიონები",
            value: stats.regions,
          },
          {
            "@type": "PropertyValue",
            name: locale === "en" ? "Venomous species" : "შხამიანი სახეობები",
            value: stats.venomous,
          },
        ],
        isAccessibleForFree: true,
        inLanguage: ["ka", "en"],
      },
      {
        "@type": "DefinedTermSet",
        "@id": termsId,
        name:
          locale === "en"
            ? "Georgia reptiles"
            : "საქართველოს ქვეწარმავლები",
        alternateName:
          locale === "en"
            ? "საქართველოს ქვეწარმავლები"
            : "Georgia reptiles",
        url: homeUrl,
        hasDefinedTerm: HOME_DEFINED_TERMS.map((term) => ({
          "@type": "DefinedTerm",
          name: locale === "en" ? term.en : term.ka,
          url: speciesPageUrl(locale as AppLocale, term.speciesId),
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={graph} />
      <main>
        <Hero />
        <HomeProof />
        <SpeciesCarousel />
        <MapExplorer />
        <HomeRegions />
        <HomeKnowledge />
        <SpeciesDetail />
        <HomeSeo />
        <FinalCTA />
      </main>
    </div>
  );
}
