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
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
  SITE_OG_IMAGE_URL,
  openGraphJpeg,
  speciesPageUrl,
  websiteJsonLd,
} from "@/lib/site";
import { HOME_DEFINED_TERMS, siteKeywords } from "@/lib/seoKeywords";
import {
  allRightsReservedLabel,
  atlasDatasetName,
  atlasVariableName,
  georgiaPlaceName,
  georgiaReptilesLabel,
  openGraphLocale,
  pickLocalized,
} from "@/i18n/localeMeta";
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
  const ogImage = SITE_OG_IMAGE_URL;

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
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      images: [openGraphJpeg(ogImage, title)],
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
  const datasetId = `${homeUrl}#atlas`;
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
        about: [{ "@id": datasetId }, { "@id": termsId }],
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
        "@id": datasetId,
        name: atlasDatasetName(locale),
        description,
        url: homeUrl,
        creator: { "@id": siteEntityId("organization") },
        publisher: { "@id": siteEntityId("organization") },
        spatialCoverage: {
          "@type": "Place",
          name: georgiaPlaceName(locale),
        },
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
        isAccessibleForFree: true,
        inLanguage: [...routing.locales],
        license: {
          "@type": "CreativeWork",
          name: allRightsReservedLabel(locale),
          url: absoluteUrl(localePath(locale, "/about")),
        },
      },
      {
        "@type": "DefinedTermSet",
        "@id": termsId,
        name: georgiaReptilesLabel(locale),
        alternateName:
          locale === "ka"
            ? georgiaReptilesLabel("en")
            : georgiaReptilesLabel("ka"),
        url: homeUrl,
        hasDefinedTerm: HOME_DEFINED_TERMS.map((term) => ({
          "@type": "DefinedTerm",
          name: pickLocalized(term, locale),
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
        <HomeGroups />
        <HomeFeatured />
        <MapExplorer />
        <HomeFresh />
        <HomeField />
        <HomeSeo />
        <FinalCTA />
      </main>
    </div>
  );
}
