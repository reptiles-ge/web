import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/AboutPage";
import { JsonLd } from "@/components/JsonLd";
import { openGraphLocale } from "@/i18n/localeMeta";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

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
      <AboutPage />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const pagePath = "/about";
  const url = absoluteUrl(localePath(locale, pagePath));
  const alternates = localeAlternates(locale, pagePath);
  const ogImage = openGraphJpeg(SITE_OG_IMAGE_URL, title);

  return {
    alternates,
    description,
    openGraph: {
      description,
      images: [ogImage],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [SITE_OG_IMAGE_URL],
      title,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
