import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactPage } from "@/components/ContactPage";
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

export default async function Contact({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const url = absoluteUrl(localePath(locale, "/contact"));

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    ...pageDateFields("/contact"),
    description: t("metaDescription"),
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: organizationJsonLd({
      description: t("metaDescription"),
    }),
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    url,
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactPage locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "contact" });
  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/contact",
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
