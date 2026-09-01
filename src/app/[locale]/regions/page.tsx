import { JsonLd } from "@/components/JsonLd";
import { RegionsIndex } from "@/components/RegionsIndex";
import { regions, localizeRegionText } from "@/data/regions";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    isPartOf: { "@id": siteEntityId("website") },
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    hasPart: regions.map((region) => ({
      "@type": "WebPage",
      name: localizeRegionText(region.name, locale),
      url: absoluteUrl(localePath(locale, regionHref(region.id))),
    })),
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <RegionsIndex />
    </>
  );
}
