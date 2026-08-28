import { JsonLd } from "@/components/JsonLd";
import { RoadmapPage } from "@/components/RoadmapPage";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
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

  const t = await getTranslations({ locale, namespace: "roadmap" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const pagePath = "/roadmap";
  const url = absoluteUrl(localePath(locale, pagePath));
  const alternates = localeAlternates(locale, pagePath);

  return {
    title,
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

export default async function Roadmap({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "roadmap" });
  const url = absoluteUrl(localePath(locale, "/roadmap"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    description: t("metaDescription"),
    url,
    isPartOf: { "@id": siteEntityId("website") },
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <RoadmapPage />
    </>
  );
}
