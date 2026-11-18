import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { RegionsIndex } from "@/components/RegionsIndex";
import {
  getCatalogRegionStats,
  getRegionAtlasEntries,
  localizeRegionText,
  regions,
} from "@/data/regions";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { routing } from "@/i18n/routing";
import { buildPageMetadata, type LocalePageProps } from "@/lib/pageMetadata";
import { homeChildBreadcrumbLd, webPageIds } from "@/lib/pageStructuredData";
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

  const locale = localeParam;
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

  const locale = localeParam;
  setRequestLocale(locale);

  const [t, stats, atlasRegions] = await Promise.all([
    getTranslations({ locale, namespace: "regions" }),
    getCatalogRegionStats(locale),
    getRegionAtlasEntries(locale),
  ]);
  const url = absoluteUrl(localePath(locale, "/regions"));

  const jsonLd = {
    "@context": "https://schema.org",
    ...webPageIds(url),
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    ...(await pageDateFields("/regions", locale)),
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
      <JsonLd
        data={[
          jsonLd,
          homeChildBreadcrumbLd(locale, "/regions", {
            home: t("back"),
            name: t("title"),
          }),
        ]}
      />
      <ClientMessagesProvider locale={locale} namespaces={["regions"]}>
        <RegionsIndex regions={atlasRegions} stats={stats} />
      </ClientMessagesProvider>
    </>
  );
}
