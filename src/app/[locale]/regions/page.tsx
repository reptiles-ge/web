import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { RegionsIndex } from "@/components/RegionsIndex";
import { localizeRegionText, regions } from "@/data/regions";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "regions" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = "/regions";
  const url = absoluteUrl(localePath(locale, path));

  return {
    alternates: localeAlternates(locale, path),
    description,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
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
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RegionsPage({ params }: Props) {
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
      <RegionsIndex />
    </>
  );
}
