import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { LocalePageProps } from "@/lib/pageMetadata";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { DangerousAnimalsPage } from "@/components/DangerousAnimalsPage";
import { JsonLd } from "@/components/JsonLd";
import { type AppLocale, routing } from "@/i18n/routing";
import { dangerousAnimalRows } from "@/lib/dangerousAnimals";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesOgPageMetadata } from "@/lib/speciesOgPageMetadata";
import { pageDateFields } from "@/lib/structuredDataDates";

const PATH = "/dangerous-animals";
const OG_SPECIES = "macrovipera-lebetina";

export default async function DangerousAnimalsRoute({
  params,
}: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const [t, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "dangerousAnimals" }),
    getSpeciesCatalog(locale),
  ]);
  const hero = catalog.find((item) => item.id === OG_SPECIES);
  const widow = catalog.find(
    (item) => item.id === "latrodectus-tredecimguttatus",
  );
  if (!hero || !widow) notFound();
  const url = absoluteUrl(localePath(locale, PATH));
  const dates = await pageDateFields(PATH, locale);

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    { item: url, name: t("breadcrumbCurrent") },
  ]);

  const pageLd = sitePageLd({
    dates,
    description: t("metaDescription"),
    locale,
    name: t("metaTitle"),
    type: "WebPage",
    url,
  });

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
          rows={dangerousAnimalRows(catalog)}
          updatedAt={dates.dateModified}
        />
      </ClientMessagesProvider>
    </>
  );
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  return speciesOgPageMetadata({
    locale: localeParam as AppLocale,
    namespace: "dangerousAnimals",
    ogSpeciesId: OG_SPECIES,
    pagePath: PATH,
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
