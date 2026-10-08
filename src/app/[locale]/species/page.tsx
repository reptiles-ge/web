import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { AtlasAbout } from "@/components/species-atlas/AtlasAbout";
import { AtlasHero } from "@/components/species-atlas/AtlasHero";
import { AtlasSeo } from "@/components/species-atlas/AtlasSeo";
import {
  SpeciesAtlas,
  SpeciesAtlasFallback,
} from "@/components/species-atlas/SpeciesAtlas";
import { getRegionTooltipPreviews } from "@/data/regions";
import { getSpeciesById } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { ATLAS_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { getAtlasListItems, getAtlasRecentItems } from "@/lib/atlasList";
import { buildPageMetadata, type LocalePageProps } from "@/lib/pageMetadata";
import {
  breadcrumbListLd,
  localePageUrl,
  speciesItemListLd,
} from "@/lib/pageStructuredData";
import {
  absoluteUrl,
  localePath,
  siteEntityId,
  speciesOgImageUrl,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const title = t("metaTitle");

  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: speciesOgImageUrl(
      "vipera-kaznakovi",
      getSpeciesById("vipera-kaznakovi")?.image,
    ),
    pagePath: "/species",
    title,
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SpeciesIndexPage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const url = absoluteUrl(localePath(locale, "/species"));
  const catalog = getAtlasListItems(locale);
  const recent = getAtlasRecentItems(locale);
  const tooltipSpeciesByRegion = getRegionTooltipPreviews(locale);
  const stats = getAtlasStats();
  const dates = pageDateFields("/species");

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    { item: url, name: t("breadcrumbSpecies") },
  ]);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    ...dates,
    dateModified: stats.lastUpdated ?? dates.dateModified,
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: speciesItemListLd(locale, catalog),
    name: t("metaTitle"),
    url,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      <ClientMessagesProvider
        locale={locale}
        namespaces={ATLAS_CLIENT_MESSAGE_NAMESPACES}
      >
        <AtlasHero locale={locale} stats={stats} />
        <Suspense
          fallback={
            <SpeciesAtlasFallback
              catalog={catalog}
              recent={recent}
              tooltipSpeciesByRegion={tooltipSpeciesByRegion}
            />
          }
        >
          <SpeciesAtlas
            catalog={catalog}
            recent={recent}
            tooltipSpeciesByRegion={tooltipSpeciesByRegion}
          />
        </Suspense>
        <AtlasSeo locale={locale} />
        <AtlasAbout locale={locale} stats={stats} />
      </ClientMessagesProvider>
    </div>
  );
}
