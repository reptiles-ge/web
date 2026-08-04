import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeProof } from "@/components/HomeProof";
import { HomeRegions } from "@/components/HomeRegions";
import { HomeSeo } from "@/components/HomeSeo";
import { JsonLd } from "@/components/JsonLd";
import { MapExplorer } from "@/components/map/MapExplorer";
import { Navbar } from "@/components/Navbar";
import { SpeciesCarousel } from "@/components/SpeciesCarousel";
import { SpeciesDetail } from "@/components/SpeciesDetail";
import { getAtlasStats } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
} from "@/lib/site";
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

  return {
    title: {
      absolute: title,
    },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const description = t("description");
  const stats = getAtlasStats();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: homeUrl,
    description,
    inLanguage: locale,
    publisher: organizationJsonLd({ description }),
    potentialAction: {
      "@type": "SearchAction",
      target: `${homeUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLdData = {
    "@context": "https://schema.org",
    ...organizationJsonLd({ description }),
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name:
      locale === "en"
        ? "Atlas of reptiles of Georgia"
        : "საქართველოს ქვეწარმავლების ატლასი",
    description,
    url: homeUrl,
    creator: organizationJsonLd({ description }),
    publisher: organizationJsonLd({ description }),
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
    inLanguage: [locale === "en" ? "en" : "ka", locale === "en" ? "ka" : "en"],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[websiteJsonLd, organizationJsonLdData, datasetJsonLd]} />
      <Navbar />
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
