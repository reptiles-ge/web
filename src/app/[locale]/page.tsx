import type { Metadata } from "next";
import type { ReactElement } from "react";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeField } from "@/components/home/HomeField";
import { HomeFresh } from "@/components/home/HomeFresh";
import { HomeGroups } from "@/components/home/HomeGroups";
import { HomeSeo } from "@/components/HomeSeo";
import { JsonLd } from "@/components/JsonLd";
import { MapExplorer } from "@/components/map/MapExplorer";
import { getAtlasStats } from "@/data/speciesAtlas";
import {
  allRightsReservedLabel,
  atlasDatasetName,
  atlasVariableName,
  georgiaPlaceName,
  georgiaReptilesLabel,
  openGraphLocale,
  pickLocalized,
} from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { HOME_DEFINED_TERMS, siteKeywords } from "@/lib/seoKeywords";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
  speciesPageUrl,
  websiteJsonLd,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(localePath(locale, "/"));
  const alternates = localeAlternates(locale, "/");
  const ogImage = SITE_OG_IMAGE_URL;

  return {
    alternates,
    description,
    keywords: siteKeywords(locale),
    openGraph: {
      description,
      images: [openGraphJpeg(ogImage, title)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    title: {
      absolute: title,
    },
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
  const datasetId = `${homeUrl}#atlas`;
  const termsId = `${homeUrl}#atlas-terms`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      org,
      websiteJsonLd({ description }),
      {
        "@id": homeUrl,
        "@type": "WebPage",
        about: [{ "@id": datasetId }, { "@id": termsId }],
        description,
        inLanguage: locale,
        isPartOf: { "@id": siteEntityId("website") },
        name: t("title"),
        potentialAction: {
          "@type": "SearchAction",
          "query-input": "required name=search_term_string",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${speciesSearchUrl}?q={search_term_string}`,
          },
        },
        url: homeUrl,
      },
      {
        "@id": datasetId,
        "@type": "Dataset",
        creator: { "@id": siteEntityId("organization") },
        description,
        inLanguage: [...routing.locales],
        isAccessibleForFree: true,
        license: {
          "@type": "CreativeWork",
          name: allRightsReservedLabel(locale),
          url: absoluteUrl(localePath(locale, "/about")),
        },
        name: atlasDatasetName(locale),
        publisher: { "@id": siteEntityId("organization") },
        spatialCoverage: {
          "@type": "Place",
          name: georgiaPlaceName(locale),
        },
        url: homeUrl,
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: atlasVariableName("speciesProfiles", locale),
            value: stats.total,
          },
          {
            "@type": "PropertyValue",
            name: atlasVariableName("regions", locale),
            value: stats.regions,
          },
          {
            "@type": "PropertyValue",
            name: atlasVariableName("venomousSpecies", locale),
            value: stats.venomous,
          },
        ],
      },
      {
        "@id": termsId,
        "@type": "DefinedTermSet",
        alternateName:
          locale === "ka"
            ? georgiaReptilesLabel("en")
            : georgiaReptilesLabel("ka"),
        hasDefinedTerm: HOME_DEFINED_TERMS.map((term) => ({
          "@type": "DefinedTerm",
          name: pickLocalized(term, locale),
          url: speciesPageUrl(locale as AppLocale, term.speciesId),
        })),
        name: georgiaReptilesLabel(locale),
        url: homeUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={graph} />
      <div>
        <Hero />
        <HomeGroups />
        <HomeFeatured />
        <MapExplorer />
        <HomeFresh />
        <HomeField />
        <HomeSeo />
        <FinalCTA />
      </div>
    </div>
  );
}
