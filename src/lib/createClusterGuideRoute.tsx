import type { Metadata } from "next";
import type { ComponentType } from "react";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AmphibianSpeciesIndexPage } from "@/components/AmphibianSpeciesIndexPage";
import { CatalogSpeciesIndexPage } from "@/components/CatalogSpeciesIndexPage";
import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { ClusterGuidePage } from "@/components/ClusterGuidePage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { DarevskiaGuidePage } from "@/components/DarevskiaGuidePage";
import { FrogSpeciesIndexPage } from "@/components/FrogSpeciesIndexPage";
import { JsonLd } from "@/components/JsonLd";
import { LizardComparePage } from "@/components/LizardComparePage";
import { LizardHousePage } from "@/components/LizardHousePage";
import { LizardIdentifyPage } from "@/components/LizardIdentifyPage";
import { LizardSpeciesIndexPage } from "@/components/LizardSpeciesIndexPage";
import { MammalBearPage } from "@/components/MammalBearPage";
import { MammalJackalYardPage } from "@/components/MammalJackalYardPage";
import { SnakeIdentifyPage } from "@/components/SnakeIdentifyPage";
import { SnakeLargestPage } from "@/components/SnakeLargestPage";
import { SnakeRangePage } from "@/components/SnakeRangePage";
import { SnakeSpeciesIndexPage } from "@/components/SnakeSpeciesIndexPage";
import { SpiderBitePage } from "@/components/SpiderBitePage";
import { SpiderVenomousPage } from "@/components/SpiderVenomousPage";
import { TurtleIdentifyPage } from "@/components/TurtleIdentifyPage";
import {
  type ClientMessagePath,
  CLUSTER_GUIDE_CLIENT_MESSAGES,
} from "@/i18n/clientMessages";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  CLUSTER_GUIDES,
  type ClusterGuideId,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
  speciesItemListLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath, speciesOgImageUrl } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const CLUSTER_PAGES: Record<
  ClusterGuideId,
  ComponentType<ClusterGuideViewProps>
> = {
  "amphibian-frogs": ClusterGuidePage,
  "amphibian-frogs-index": FrogSpeciesIndexPage,
  "amphibian-index": AmphibianSpeciesIndexPage,
  "amphibian-newts": ClusterGuidePage,
  "bird-index": CatalogSpeciesIndexPage,
  "insect-index": CatalogSpeciesIndexPage,
  "lizard-darevskia": DarevskiaGuidePage,
  "lizard-glass": LizardComparePage,
  "lizard-house": LizardHousePage,
  "lizard-identify": LizardIdentifyPage,
  "lizard-index": LizardSpeciesIndexPage,
  "mammal-bear": MammalBearPage,
  "mammal-index": CatalogSpeciesIndexPage,
  "mammal-jackal-yard": MammalJackalYardPage,
  "snake-identify": SnakeIdentifyPage,
  "snake-index": SnakeSpeciesIndexPage,
  "snake-largest": SnakeLargestPage,
  "snake-range": SnakeRangePage,
  "spider-bite": SpiderBitePage,
  "spider-index": CatalogSpeciesIndexPage,
  "spider-venomous": SpiderVenomousPage,
  "turtle-identify": TurtleIdentifyPage,
  "turtle-index": CatalogSpeciesIndexPage,
  "turtle-land": ClusterGuidePage,
  "turtle-water": ClusterGuidePage,
};

const CLIENT_COPY_GUIDES: ReadonlySet<ClusterGuideId> = new Set([
  "turtle-identify",
]);

export function createClusterGuideRoute(guideId: ClusterGuideId) {
  const guide = CLUSTER_GUIDES[guideId];
  const parent = GROUP_HUBS[guide.parentHub];
  const PageView = CLUSTER_PAGES[guideId];
  const clientMessageNamespaces: ClientMessagePath[] = [
    ...CLUSTER_GUIDE_CLIENT_MESSAGES,
    ...(CLIENT_COPY_GUIDES.has(guideId) ? [guide.messageKey] : []),
  ];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: guide.messageKey });
    const title = t("metaTitle");
    const catalog = await getSpeciesCatalog(locale);
    const matched = catalog.filter(guide.matches);
    const hero =
      catalog.find((item) => item.id === guide.heroSpeciesId) ?? matched[0];
    const ogImageUrl = guide.heroImage
      ? absoluteUrl(guide.heroImage)
      : speciesOgImageUrl(guide.heroSpeciesId, hero?.image);

    return buildPageMetadata({
      description: t("metaDescription"),
      indexable: true,
      keywords: t("keywords"),
      locale,
      metadataTitle: { absolute: title },
      ogImageUrl,
      openGraphImage: guide.heroImage
        ? { alt: t("heroImageAlt"), height: 630, url: ogImageUrl, width: 1200 }
        : undefined,
      pagePath: guide.pathname,
      title,
    });
  }

  async function Page({ params }: Props) {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      notFound();
    }

    const locale = localeParam as AppLocale;
    setRequestLocale(locale);

    const [t, tShared, tParent] = await Promise.all([
      getTranslations({ locale, namespace: guide.messageKey }),
      getTranslations({
        locale,
        namespace: "groupHubShared",
      }),
      getTranslations({
        locale,
        namespace: parent.messageKey,
      }),
    ]);

    const url = absoluteUrl(localePath(locale, guide.pathname));
    const catalog = await getSpeciesCatalog(locale);
    const species = catalog.filter(guide.matches);
    const heroRaw =
      catalog.find((item) => item.id === guide.heroSpeciesId) ??
      catalog.find(guide.matches);
    const heroSrc = guide.heroImage ?? heroRaw?.image ?? "";
    const breadcrumbLd = breadcrumbListLd([
      { item: localePageUrl(locale, "/"), name: tShared("breadcrumbHome") },
      {
        item: localePageUrl(locale, parent.path),
        name: tParent("breadcrumbCurrent"),
      },
      { item: url, name: t("breadcrumbCurrent") },
    ]);

    const pageLd = sitePageLd({
      about: { "@type": "Place", name: georgiaPlaceName(locale) },
      dates: await pageDateFields(guide.pathname, locale),
      description: t("metaDescription"),
      locale,
      ...(guide.schema === "collection"
        ? { mainEntity: speciesItemListLd(locale, species) }
        : {}),
      name: t("metaTitle"),
      type: guide.schema === "collection" ? "CollectionPage" : "WebPage",
      url,
    });

    return (
      <>
        {heroSrc ? <CoverImagePreload sizes="100vw" src={heroSrc} /> : null}
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={pageLd} />
        <ClientMessagesProvider
          locale={locale}
          namespaces={clientMessageNamespaces}
        >
          <PageView
            guideId={guideId}
            heroSrc={heroSrc}
            locale={locale}
            species={species}
          />
        </ClientMessagesProvider>
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}
