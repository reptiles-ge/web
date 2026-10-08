import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { LocalePageProps } from "@/lib/pageMetadata";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { RiskToHumansPage } from "@/components/RiskToHumansPage";
import { getCatalogSpecies } from "@/data/species";
import { getCatalogByDanger } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { orderSpeciesByIds } from "@/lib/clusterGuides";
import { HARMLESS_EXAMPLE_IDS } from "@/lib/dangerLevels";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath } from "@/lib/site";
import { speciesOgPageMetadata } from "@/lib/speciesOgPageMetadata";
import { pageDateFields } from "@/lib/structuredDataDates";

const PATH = "/risk-to-humans";
const OG_SPECIES = "macrovipera-lebetina";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  return speciesOgPageMetadata({
    locale: localeParam as AppLocale,
    namespace: "riskToHumans",
    ogSpeciesId: OG_SPECIES,
    pagePath: PATH,
    type: "article",
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RiskToHumansRoute({ params }: LocalePageProps) {
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

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    { item: localePageUrl(locale, "/species"), name: t("breadcrumbSpecies") },
    { item: url, name: t("breadcrumbCurrent") },
  ]);

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

  const dates = pageDateFields(PATH);
  const pageLd = sitePageLd({
    about: { "@type": "Thing", name: t("title") },
    dates,
    description: t("metaDescription"),
    locale,
    name: t("metaTitle"),
    type: "WebPage",
    url,
  });

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <ClientMessagesProvider
        locale={locale}
        namespaces={["card", "danger", "groupHubShared", "riskToHumans"]}
      >
        <RiskToHumansPage
          harmlessCount={byDanger.Harmless.length}
          harmlessExamples={harmlessExamples}
          high={byDanger.High}
          locale={locale}
          moderate={byDanger.Moderate}
          publishedAt={dates.datePublished}
          updatedAt={dates.dateModified}
        />
      </ClientMessagesProvider>
    </>
  );
}
