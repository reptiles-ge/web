import { JsonLd } from "@/components/JsonLd";
import { RiskToHumansPage } from "@/components/RiskToHumansPage";
import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { getCatalogByDanger } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { openGraphLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
import { HARMLESS_EXAMPLE_IDS } from "@/lib/dangerLevels";
import { orderSpeciesByIds } from "@/lib/clusterGuides";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/risk-to-humans";
const OG_SPECIES = "macrovipera-lebetina";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    title,
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    alternates: localeAlternates(locale, PATH),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      images: [openGraphJpeg(ogImage, title)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
        position: 1,
        name: t("breadcrumbHome"),
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbSpecies"),
        item: absoluteUrl(localePath(locale, "/species")),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumbCurrent"),
        item: url,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ([1, 2, 3, 4, 5] as const).map((n) => ({
      "@type": "Question",
      name: t(`faq${n}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A`),
      },
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    isPartOf: { "@id": siteEntityId("website") },
    author: { "@id": siteEntityId("organization") },
    publisher: { "@id": siteEntityId("organization") },
    about: {
      "@type": "Thing",
      name: t("title"),
    },
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <RiskToHumansPage
        high={byDanger.High}
        moderate={byDanger.Moderate}
        harmlessExamples={harmlessExamples}
        harmlessCount={byDanger.Harmless.length}
      />
    </>
  );
}
