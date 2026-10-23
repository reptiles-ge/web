import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { OptimizedImageScope } from "@/components/OptimizedImageScope";
import { AtlasAbout } from "@/components/species-atlas/AtlasAbout";
import { AtlasHero } from "@/components/species-atlas/AtlasHero";
import { AtlasSeo } from "@/components/species-atlas/AtlasSeo";
import {
  SpeciesAtlas,
  SpeciesAtlasFallback,
} from "@/components/species-atlas/SpeciesAtlas";
import { getRegionLabels, getRegionTooltipPreviews } from "@/data/regions";
import { getAtlasStats } from "@/data/speciesAtlas";
import { images } from "@/data/speciesMedia";
import { ATLAS_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { getAtlasPage, getAtlasRecentItems } from "@/lib/atlasList";
import { defaultAtlasQuery } from "@/lib/atlasQuery";
import { GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
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
import { getSpeciesProfile } from "@/lib/speciesProfileApi";
import { atlasDateFields } from "@/lib/structuredDataDates";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const [t, ogSpecies] = await Promise.all([
    getTranslations({ locale, namespace: "speciesAtlas" }),
    getSpeciesProfile("vipera-kaznakovi", locale),
  ]);
  const title = t("metaTitle");

  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: speciesOgImageUrl("vipera-kaznakovi", ogSpecies?.species.image),
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

  const [t, initial, recent, tooltipSpeciesByRegion, stats] = await Promise.all(
    [
      getTranslations({ locale, namespace: "speciesAtlas" }),
      getAtlasPage(locale, defaultAtlasQuery),
      getAtlasRecentItems(locale),
      getRegionTooltipPreviews(locale),
      getAtlasStats(locale),
    ],
  );
  const dates = atlasDateFields(locale, stats.lastUpdated);
  const url = absoluteUrl(localePath(locale, "/species"));
  const regionLabels = getRegionLabels(locale);

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
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: speciesItemListLd(locale, initial.items),
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
        <OptimizedImageScope srcs={Object.values(GROUP_HUB_ILLUSTRATIONS)}>
          <Suspense
            fallback={
              <SpeciesAtlasFallback
                initial={initial}
                recent={recent}
                regionCount={stats.regions}
                regionLabels={regionLabels}
                tooltipSpeciesByRegion={tooltipSpeciesByRegion}
                venomousCount={stats.venomous}
                venomousImage={images.hero}
              />
            }
          >
            <SpeciesAtlas
              initial={initial}
              recent={recent}
              regionCount={stats.regions}
              regionLabels={regionLabels}
              tooltipSpeciesByRegion={tooltipSpeciesByRegion}
              venomousCount={stats.venomous}
              venomousImage={images.hero}
            />
          </Suspense>
        </OptimizedImageScope>
        <AtlasSeo locale={locale} />
        <AtlasAbout locale={locale} stats={stats} />
      </ClientMessagesProvider>
    </div>
  );
}
