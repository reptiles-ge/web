import type { Metadata } from "next";
import type { ReactElement } from "react";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { HomeContributors } from "@/components/home/HomeContributors";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeField } from "@/components/home/HomeField";
import { HomeFresh } from "@/components/home/HomeFresh";
import { HomeGroups } from "@/components/home/HomeGroups";
import { HomeGuides } from "@/components/home/HomeGuides";
import { HomeSafetyStrip } from "@/components/home/HomeSafetyStrip";
import { HomeSeo } from "@/components/HomeSeo";
import { JsonLd } from "@/components/JsonLd";
import { MapExplorer } from "@/components/map/MapExplorer";
import { getRegionTooltipPreviews } from "@/data/regions";
import { openGraphLocale } from "@/i18n/localeMeta";
import { routing } from "@/i18n/routing";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { siteKeywords } from "@/lib/seoKeywords";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const path = localePath(locale, "/");
  const description = kaMetaDescriptionOverride(locale, path, t("description"));
  const url = absoluteUrl(path);
  const alternates = localeAlternates(locale, "/");
  const ogImage = SITE_OG_IMAGE_URL;

  return {
    alternates,
    description,
    keywords: siteKeywords(locale),
    openGraph: {
      description,
      images: [openGraphJpeg(ogImage, title)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    title: {
      absolute: title,
    },
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

export default async function Home({ params }: Props): Promise<ReactElement> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "site" });
  const homePath = localePath(locale, "/");
  const homeUrl = absoluteUrl(homePath);
  const description = kaMetaDescriptionOverride(
    locale,
    homePath,
    t("description"),
  );
  const pageLd = {
    "@context": "https://schema.org",
    "@id": homeUrl,
    "@type": "WebPage",
    ...pageDateFields("/"),
    description,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("title"),
    url: homeUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={pageLd} />
      <div>
        <Hero locale={locale} />
        <HomeSafetyStrip locale={locale} />
        <HomeGroups locale={locale} />
        <ClientMessagesProvider locale={locale} namespaces={["map"]}>
          <MapExplorer
            tooltipSpeciesByRegion={getRegionTooltipPreviews(locale)}
          />
        </ClientMessagesProvider>
        <HomeFeatured locale={locale} />
        <HomeField locale={locale} />
        <HomeGuides locale={locale} />
        <HomeFresh locale={locale} />
        <HomeContributors locale={locale} />
        <HomeSeo locale={locale} />
        <FinalCTA locale={locale} />
      </div>
    </div>
  );
}
