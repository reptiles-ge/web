import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { VenomousSnakesPage } from "@/components/VenomousSnakesPage";
import { getSpeciesById } from "@/data/species";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/venomous-snakes";
const OG_SPECIES = "macrovipera-lebetina";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "venomousSnakes" });
  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    keywords: t("keywords"),
    locale,
    ogImageUrl: speciesOgImageUrl(
      OG_SPECIES,
      getSpeciesById(OG_SPECIES)?.image,
    ),
    pagePath: PATH,
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
        item: absoluteUrl(localePath(locale, "/")),
        name: t("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/snakes")),
        name: tSnakes("breadcrumbCurrent"),
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

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    about: {
      "@type": "Place",
      name: georgiaPlaceName(locale),
    },
    author: { "@id": siteEntityId("organization") },
    ...pageDateFields(PATH),
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: venomous.map((item, index) => ({
        "@type": "ListItem",
        name: `${item.commonName} (${item.scientificName})`,
        position: index + 1,
        url: speciesPageUrl(locale, item.id),
      })),
      numberOfItems: venomous.length,
    },
    name: t("metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };
  const dates = pageDateFields(PATH);

  return (
    <>
      {heroSrc ? <CoverImagePreload sizes="100vw" src={heroSrc} /> : null}
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <ClientMessagesProvider
        locale={locale}
        namespaces={[
          "card",
          "danger",
          "groupHubShared",
          "profile",
          "quizzes",
          "snakeQuiz",
          "snakes",
          "venomousSnakes",
        ]}
      >
        <VenomousSnakesPage
          heroSrc={heroSrc}
          locale={locale}
          publishedAt={dates.datePublished}
          species={venomous}
          updatedAt={dates.dateModified}
        />
      </ClientMessagesProvider>
    </>
  );
}
