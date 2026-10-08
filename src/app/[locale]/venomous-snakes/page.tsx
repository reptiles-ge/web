import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { LocalePageProps } from "@/lib/pageMetadata";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { VenomousSnakesPage } from "@/components/VenomousSnakesPage";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
  speciesItemListLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath } from "@/lib/site";
import { speciesOgPageMetadata } from "@/lib/speciesOgPageMetadata";
import { pageDateFields } from "@/lib/structuredDataDates";

const PATH = "/venomous-snakes";
const OG_SPECIES = "macrovipera-lebetina";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  return speciesOgPageMetadata({
    locale: localeParam as AppLocale,
    namespace: "venomousSnakes",
    ogSpeciesId: OG_SPECIES,
    pagePath: PATH,
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function VenomousSnakesRoute({ params }: LocalePageProps) {
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

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    {
      item: localePageUrl(locale, "/snakes"),
      name: tSnakes("breadcrumbCurrent"),
    },
    { item: url, name: t("breadcrumbCurrent") },
  ]);

  const dates = pageDateFields(PATH);
  const pageLd = sitePageLd({
    about: { "@type": "Place", name: georgiaPlaceName(locale) },
    dates,
    description: t("metaDescription"),
    locale,
    mainEntity: speciesItemListLd(locale, venomous),
    name: t("metaTitle"),
    type: "WebPage",
    url,
  });

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
