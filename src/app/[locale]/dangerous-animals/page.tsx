import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { DangerousAnimalsPage } from "@/components/DangerousAnimalsPage";
import { JsonLd } from "@/components/JsonLd";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  siteEntityId,
  speciesOgImageUrl,
} from "@/lib/site";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/dangerous-animals";
const OG_SPECIES = "macrovipera-lebetina";

export default async function DangerousAnimalsRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const species = getSpeciesById(OG_SPECIES);
  const karakurt = getSpeciesById("latrodectus-tredecimguttatus");
  if (!species || !karakurt) notFound();

  const t = await getTranslations({ locale, namespace: "dangerousAnimals" });
  const hero = localizeSpecies(species, locale);
  const widow = localizeSpecies(karakurt, locale);
  const url = absoluteUrl(localePath(locale, PATH));
  const dates = pageDateFields(PATH);

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
        item: url,
        name: t("breadcrumbCurrent"),
        position: 2,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    author: { "@id": siteEntityId("organization") },
    ...dates,
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <CoverImagePreload sizes="100vw" src={hero.image} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <ClientMessagesProvider locale={locale} namespaces={["dangerousAnimals"]}>
        <DangerousAnimalsPage
          heroAlt={speciesImageAlt(
            hero.commonName,
            hero.scientificName,
            hero.location,
          )}
          heroSrc={hero.image}
          karakurtName={widow.commonName}
          locale={locale}
          publishedAt={dates.datePublished}
          updatedAt={dates.dateModified}
        />
      </ClientMessagesProvider>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "dangerousAnimals" });
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
