import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { LocalePageProps } from "@/lib/pageMetadata";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { SnakesInYardPage } from "@/components/SnakesInYardPage";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { speciesOgPageMetadata } from "@/lib/speciesOgPageMetadata";
import { pageDateFields } from "@/lib/structuredDataDates";

const PATH = "/snakes-in-the-yard";
const HERO_SPECIES = "natrix-natrix";
const WHY_IMAGE = "/images/guides/snakes-in-the-yard-why.jpg";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  return speciesOgPageMetadata({
    locale: localeParam as AppLocale,
    namespace: "snakesInYard",
    ogSpeciesId: HERO_SPECIES,
    pagePath: PATH,
    type: "article",
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SnakesInYardRoute({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const [t, tSnakes, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "snakesInYard" }),
    getTranslations({ locale, namespace: "snakes" }),
    getSpeciesCatalog(locale),
  ]);
  const url = absoluteUrl(localePath(locale, PATH));

  const heroSpecies = catalog.find((item) => item.id === HERO_SPECIES);
  const heroSrc = heroSpecies?.image ?? WHY_IMAGE;
  const coverSrc = WHY_IMAGE;

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    {
      item: localePageUrl(locale, "/snakes"),
      name: tSnakes("breadcrumbCurrent"),
    },
    { item: url, name: t("breadcrumbCurrent") },
  ]);

  const dates = await pageDateFields(PATH, locale);
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
      <CoverImagePreload sizes="100vw" src={heroSrc} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <SnakesInYardPage
        coverSrc={coverSrc}
        heroSpecies={heroSpecies}
        heroSrc={heroSrc}
        locale={locale}
        publishedAt={dates.datePublished}
        updatedAt={dates.dateModified}
      />
    </>
  );
}
