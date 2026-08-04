import { ContactPage } from "@/components/ContactPage";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
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

  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = "/contact";
  const url = absoluteUrl(localePath(locale, path));
  const alternates = localeAlternates(locale, path);

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
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    description: t("metaDescription"),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    mainEntity: organizationJsonLd({
      description: t("metaDescription"),
    }),
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactPage />
    </>
  );
}
