import { JsonLd } from "@/components/JsonLd";
import { SpeciesAtlas } from "@/components/species-atlas/SpeciesAtlas";
import {
  getAtlasStats,
  parseAtlasFilters,
} from "@/data/speciesAtlas";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  cdnOgImageUrl,
  localeAlternates,
  localePath,
  siteConfig,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = "/species";
  const url = absoluteUrl(localePath(locale, path));
  const ogImage = cdnOgImageUrl("vipera-kaznakovi");

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
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
          width: 1200,
          height: 630,
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SpeciesIndexPage({
  params,
  searchParams,
}: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const sp = await searchParams;
  const initialFilters = parseAtlasFilters(sp);

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
        position: 1,
        name: t("breadcrumbHome"),
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbSpecies"),
        item: url,
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("title"),
    numberOfItems: catalog.length,
    itemListElement: catalog.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(localePath(locale, `/species/${item.id}`)),
      name: `${item.commonName} (${item.scientificName})`,
    })),
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Place",
      name: locale === "en" ? "Georgia" : "საქართველო",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catalog.length,
      itemListElement: catalog.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(localePath(locale, `/species/${item.id}`)),
        name: item.commonName,
      })),
    },
    hasPart: catalog.map((item) => ({
      "@type": "WebPage",
      name: `${item.commonName} (${item.scientificName})`,
      url: absoluteUrl(localePath(locale, `/species/${item.id}`)),
    })),
    inLanguage: locale,
    dateModified: stats.lastUpdated ?? undefined,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      <JsonLd data={itemListLd} />
      <SpeciesAtlas initialFilters={initialFilters} />
    </>
  );
}
