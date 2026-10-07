import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/AboutPage";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  organizationJsonLd,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const url = absoluteUrl(localePath(locale, "/about"));

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    ...pageDateFields("/about"),
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: organizationJsonLd({
      description: t("metaDescription"),
    }),
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    url,
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutPage locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "about" });
  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/about",
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
