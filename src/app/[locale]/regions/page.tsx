import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { RegionsIndex } from "@/components/RegionsIndex";
import {
  getCatalogRegionStats,
  getRegionTooltipPreviews,
  localizeRegionText,
  regions,
} from "@/data/regions";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { buildPageMetadata, type LocalePageProps } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  SITE_OG_IMAGE_URL,
  siteEntityId,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";
import { pageDateFields } from "@/lib/structuredDataDates";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "regions" });
  const title = t("metaTitle");

  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    locale,
    metadataTitle: locale === "ka" ? { absolute: title } : title,
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/regions",
    title,
  });
}

export default async function RegionsPage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "regions" });
  const url = absoluteUrl(localePath(locale, "/regions"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    ...pageDateFields("/regions"),
    description: t("metaDescription"),
    hasPart: regions.map((region) => ({
      "@type": "WebPage",
      name: localizeRegionText(region.name, locale),
      url: absoluteUrl(localePath(locale, regionHref(region.id))),
    })),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    url,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientMessagesProvider locale={locale} namespaces={["map", "regions"]}>
        <RegionsIndex
          stats={getCatalogRegionStats()}
          tooltipSpeciesByRegion={getRegionTooltipPreviews(locale)}
        />
      </ClientMessagesProvider>
    </>
  );
}
