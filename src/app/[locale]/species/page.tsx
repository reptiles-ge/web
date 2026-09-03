import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { SpeciesAtlas } from "@/components/species-atlas/SpeciesAtlas";
import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import {
  getAtlasStats,
  hasActiveAtlasFilters,
  parseAtlasFilters,
} from "@/data/speciesAtlas";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = "/species";
  const url = absoluteUrl(localePath(locale, path));
  const hero = getSpeciesById("vipera-kaznakovi");
  const ogImage = speciesOgImageUrl("vipera-kaznakovi", hero?.image);
  const filtered = hasActiveAtlasFilters(parseAtlasFilters(await searchParams));

  return {
    alternates: localeAlternates(locale, path),
    description,
    openGraph: {
      description,
      images: [openGraphJpeg(ogImage, title)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    robots: {
      follow: true,
      index: !filtered,
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

export default async function SpeciesIndexPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const url = absoluteUrl(localePath(locale, "/species"));
  const catalog = getCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );
  const stats = getAtlasStats();

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
        name: t("breadcrumbSpecies"),
        position: 2,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    dateModified: stats.lastUpdated ?? undefined,
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: catalog.map((item, index) => ({
        "@type": "ListItem",
        name: `${item.commonName} (${item.scientificName})`,
        position: index + 1,
        url: speciesPageUrl(locale, item.id),
      })),
      numberOfItems: catalog.length,
    },
    name: t("metaTitle"),
    url,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      <SpeciesAtlas />
    </>
  );
}
