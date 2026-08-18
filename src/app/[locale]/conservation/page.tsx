import { ConservationHubPage } from "@/components/ConservationHubPage";
import { JsonLd } from "@/components/JsonLd";
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

  const t = await getTranslations({ locale, namespace: "conservationHub" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const pagePath = "/conservation";
  const url = absoluteUrl(localePath(locale, pagePath));
  const alternates = localeAlternates(locale, pagePath);

  return {
    title,
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
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

export default async function ConservationHub({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "conservationHub" });
  const url = absoluteUrl(localePath(locale, "/conservation"));

  const jsonLd = {
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
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ConservationHubPage />
    </>
  );
}
