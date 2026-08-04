import { AboutPage } from "@/components/AboutPage";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import { editorPortraitExists } from "@/lib/editorPortrait";
import {
  absoluteUrl,
  editorPersonJsonLd,
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

  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const pagePath = siteConfig.editor.path;
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

export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const url = absoluteUrl(localePath(locale, siteConfig.editor.path));
  const hasPortrait = editorPortraitExists();
  const person = editorPersonJsonLd(locale, t("editorRole"), {
    includeImage: hasPortrait,
  });

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    description: t("metaDescription"),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    mainEntity: person,
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutPage hasPortrait={hasPortrait} />
    </>
  );
}
