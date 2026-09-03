import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { RiskToHumansPage } from "@/components/RiskToHumansPage";
import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { getCatalogByDanger } from "@/data/speciesAtlas";
import { openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { orderSpeciesByIds } from "@/lib/clusterGuides";
import { HARMLESS_EXAMPLE_IDS } from "@/lib/dangerLevels";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/risk-to-humans";
const OG_SPECIES = "macrovipera-lebetina";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "riskToHumans" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const url = absoluteUrl(localePath(locale, PATH));
  const hero = getSpeciesById(OG_SPECIES);
  const ogImage = speciesOgImageUrl(OG_SPECIES, hero?.image);

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    openGraph: {
      description,
      images: [openGraphJpeg(ogImage, title)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "article",
      url,
    },
    robots: {
      follow: true,
      index: true,
    },
    title,
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

export default async function RiskToHumansRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "riskToHumans" });
  const url = absoluteUrl(localePath(locale, PATH));
  const catalog = getCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );
  const byDanger = getCatalogByDanger(catalog);
  const harmlessExamples = orderSpeciesByIds(
    byDanger.Harmless,
    HARMLESS_EXAMPLE_IDS,
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: t("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/species")),
        name: t("breadcrumbSpecies"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: url,
        name: t("breadcrumbCurrent"),
        position: 3,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ([1, 2, 3, 4, 5] as const).map((n) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A`),
      },
      name: t(`faq${n}Q`),
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    about: {
      "@type": "Thing",
      name: t("title"),
    },
    author: { "@id": siteEntityId("organization") },
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <RiskToHumansPage
        harmlessCount={byDanger.Harmless.length}
        harmlessExamples={harmlessExamples}
        high={byDanger.High}
        moderate={byDanger.Moderate}
      />
    </>
  );
}
