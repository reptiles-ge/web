import { JsonLd } from "@/components/JsonLd";
import { VenomousSnakesPage } from "@/components/VenomousSnakesPage";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/venomous-snakes";
const OG_SPECIES = "macrovipera-lebetina";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "venomousSnakes" });
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
      type: "website",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
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

export default async function VenomousSnakesRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "venomousSnakes" });
  const tSnakes = await getTranslations({ locale, namespace: "snakes" });

  const url = absoluteUrl(localePath(locale, PATH));
  const venomous = getVenomousCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );
  const heroSrc =
    venomous.find((item) => item.id === OG_SPECIES)?.image ??
    venomous[0]?.image ??
    "";

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
        name: tSnakes("breadcrumbCurrent"),
        item: absoluteUrl(localePath(locale, "/snakes")),
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
      "@type": "Place",
      name: locale === "en" ? "Georgia" : "საქართველო",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: venomous.length,
      itemListElement: venomous.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: speciesPageUrl(locale, item.id),
        name: `${item.commonName} (${item.scientificName})`,
      })),
    },
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <VenomousSnakesPage species={venomous} heroSrc={heroSrc} />
    </>
  );
}
