import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { RegionProfile } from "@/components/RegionProfile";
import { getPublishedNewsForRegion } from "@/data/news";
import { getRegionContent } from "@/data/regionContent";
import { getRegionHeroImage } from "@/data/regionImages";
import {
  getRegionById,
  getRegionSpecies,
  localizeRegionText,
  regions,
} from "@/data/regions";
import {
  georgiaPlaceName,
  georgiaReptilesLabel,
  openGraphLocale,
  pickLocalized,
} from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
  speciesPageUrl,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      robots: { follow: false, index: false },
      title: "Region not found",
    };
  }

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "regions" });
  const region = getRegionById(id);

  if (!region) {
    return {
      robots: { follow: false, index: false },
      title: t("notFound"),
    };
  }

  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const content = getRegionContent(region.id);
  const title = t("regionMetaTitle", { name, nameIn });
  const description = t("regionMetaDescription", {
    count: region.speciesIds.length,
    name,
    nameIn,
  });
  const path = regionHref(region.id);

  return {
    alternates: localeAlternates(locale, path),
    description,
    keywords: [
      name,
      nameIn,
      georgiaReptilesLabel(locale),
      pickLocalized(
        {
          en: "regions of Georgia",
          ka: "საქართველოს რეგიონები",
          ru: "регионы Грузии",
          tr: "Gürcistan bölgeleri",
        },
        locale,
      ),
      localizeRegionText(content.biome, locale),
    ],
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "article",
      url: absoluteUrl(localePath(locale, path)),
    },
    robots: {
      follow: true,
      index: true,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    regions.map((region) => ({ id: region.id, locale })),
  );
}

export default async function RegionPage({ params }: PageProps) {
  const { id, locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const region = getRegionById(id);
  if (!region) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "regions" });
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const overview = localizeRegionText(content.overview, locale);
  const pageUrl = absoluteUrl(localePath(locale, regionHref(region.id)));
  const species = getRegionSpecies(region).map((item) =>
    localizeSpecies(item, locale),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      containedInPlace: {
        "@type": "Country",
        name: georgiaPlaceName(locale),
      },
      description: overview,
      name,
    },
    author: { "@id": siteEntityId("organization") },
    description: overview,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: species.map((item, index) => ({
        "@type": "ListItem",
        name: `${item.commonName} (${item.scientificName})`,
        position: index + 1,
        url: speciesPageUrl(locale, item.id),
      })),
      numberOfItems: species.length,
    },
    name: t("regionMetaTitle", { name, nameIn }),
    publisher: { "@id": siteEntityId("organization") },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: siteConfig.name,
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/regions")),
        name: t("metaTitle"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: pageUrl,
        name,
        position: 3,
      },
    ],
  };

  const faqJsonLd =
    content.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.map((entry) => ({
            "@type": "Question",
            acceptedAnswer: {
              "@type": "Answer",
              text: localizeRegionText(entry.answer, locale),
            },
            name: localizeRegionText(entry.question, locale),
          })),
        }
      : null;

  return (
    <>
      <CoverImagePreload sizes="100vw" src={getRegionHeroImage(region.id)} />
      <JsonLd
        data={
          faqJsonLd
            ? [jsonLd, breadcrumbJsonLd, faqJsonLd]
            : [jsonLd, breadcrumbJsonLd]
        }
      />
      <RegionProfile attribution={<ContentAttribution />} region={region} />
      <NewsRelatedBlock
        articles={getPublishedNewsForRegion(region.id)}
        locale={locale}
      />
    </>
  );
}
