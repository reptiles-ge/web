import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { MapExplorer } from "@/components/map/MapExplorer";
import { Navbar } from "@/components/Navbar";
import { SpeciesCarousel } from "@/components/SpeciesCarousel";
import { SpeciesDetail } from "@/components/SpeciesDetail";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
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
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(localePath(locale, "/"));
  const alternates = localeAlternates(locale, "/");

  return {
    title: {
      absolute: title,
    },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "site" });
  const homeUrl = absoluteUrl(localePath(locale, "/"));
  const description = t("description");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: homeUrl,
    description,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${homeUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description,
    logo: "https://cdn.reptiles.ge/logo.webp",
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[websiteJsonLd, organizationJsonLd]} />
      <Navbar />
      <main>
        <Hero />
        <SpeciesCarousel />
        <MapExplorer />
        <SpeciesDetail />
        <FinalCTA />
      </main>
    </div>
  );
}
