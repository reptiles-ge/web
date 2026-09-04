import type { Metadata } from "next";
import type { ComponentType } from "react";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AmphibianSpeciesIndexPage } from "@/components/AmphibianSpeciesIndexPage";
import { CatalogSpeciesIndexPage } from "@/components/CatalogSpeciesIndexPage";
import { ClusterGuidePage } from "@/components/ClusterGuidePage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { DarevskiaGuidePage } from "@/components/DarevskiaGuidePage";
import { FrogSpeciesIndexPage } from "@/components/FrogSpeciesIndexPage";
import { JsonLd } from "@/components/JsonLd";
import { LizardComparePage } from "@/components/LizardComparePage";
import { LizardIdentifyPage } from "@/components/LizardIdentifyPage";
import { LizardSpeciesIndexPage } from "@/components/LizardSpeciesIndexPage";
import { SnakeBitePage } from "@/components/SnakeBitePage";
import { SnakeIdentifyPage } from "@/components/SnakeIdentifyPage";
import { SnakeLargestPage } from "@/components/SnakeLargestPage";
import { SnakeRangePage } from "@/components/SnakeRangePage";
import { SnakeSpeciesIndexPage } from "@/components/SnakeSpeciesIndexPage";
import { TurtleIdentifyPage } from "@/components/TurtleIdentifyPage";
import { getCatalogSpecies } from "@/data/species";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  CLUSTER_GUIDES,
  type ClusterGuideId,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";
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
  "lizard-darevskia": DarevskiaGuidePage,
  "lizard-glass": LizardComparePage,
  "lizard-identify": LizardIdentifyPage,
  "lizard-index": LizardSpeciesIndexPage,
  "mammal-index": CatalogSpeciesIndexPage,
  "snake-bite": SnakeBitePage,
  "snake-identify": SnakeIdentifyPage,
  "snake-index": SnakeSpeciesIndexPage,
  "snake-largest": SnakeLargestPage,
  "snake-range": SnakeRangePage,
  "turtle-identify": TurtleIdentifyPage,
  "turtle-index": CatalogSpeciesIndexPage,
  "turtle-land": ClusterGuidePage,
  "turtle-water": ClusterGuidePage,
};

export function createClusterGuideRoute(guideId: ClusterGuideId) {
  const guide = CLUSTER_GUIDES[guideId];
  const parent = GROUP_HUBS[guide.parentHub];
  const PageView = CLUSTER_PAGES[guideId];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: guide.messageKey });
    const title = t("metaTitle");
    const description = t("metaDescription");
    const url = absoluteUrl(localePath(locale, guide.pathname));
    const catalog = getCatalogSpecies();
    const matched = catalog.filter(guide.matches);
    const hero =
      catalog.find((item) => item.id === guide.heroSpeciesId) ?? matched[0];
    const ogImage = guide.heroImage
      ? absoluteUrl(guide.heroImage)
      : speciesOgImageUrl(guide.heroSpeciesId, hero?.image);
    const ogImageTag = guide.heroImage
      ? {
          alt: t("heroImageAlt"),
          height: 630,
          url: ogImage,
          width: 1200,
        }
      : openGraphJpeg(ogImage, title);

    return {
      alternates: localeAlternates(locale, guide.pathname),
      description,
      keywords: t("keywords")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      openGraph: {
        description,
        images: [ogImageTag],
        locale: openGraphLocale(locale),
        siteName: siteConfig.name,
        title,
        type: "website",
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
    const catalog = getCatalogSpecies();
    const species: ReturnType<typeof localizeSpecies>[] = [];
    for (const item of catalog) {
      if (!guide.matches(item)) continue;
      species.push(localizeSpecies(item, locale));
    }
    const heroRaw =
      catalog.find((item) => item.id === guide.heroSpeciesId) ??
      catalog.find(guide.matches);
    const heroSrc = guide.heroImage ?? heroRaw?.image ?? "";

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: absoluteUrl(localePath(locale, "/")),
          name: tShared("breadcrumbHome"),
          position: 1,
        },
        {
          "@type": "ListItem",
          item: absoluteUrl(localePath(locale, parent.path)),
          name: tParent("breadcrumbCurrent"),
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

    const pageLd =
      guide.schema === "collection"
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            about: {
              "@type": "Place",
              name: georgiaPlaceName(locale),
            },
            author: { "@id": siteEntityId("organization") },
            description: t("metaDescription"),
            inLanguage: locale,
            isPartOf: { "@id": siteEntityId("website") },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: species.map((item, index) => ({
                "@type": "ListItem",
                name: `${item.commonName} (${item.scientificName})`,
                position: index + 1,
                url: speciesPageUrl(locale, item.id),
              })),
              numberOfItems: species.length,
            },
            name: t("metaTitle"),
            publisher: { "@id": siteEntityId("organization") },
            url,
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            about: {
              "@type": "Place",
              name: georgiaPlaceName(locale),
            },
            author: { "@id": siteEntityId("organization") },
            description: t("metaDescription"),
            inLanguage: locale,
            isPartOf: { "@id": siteEntityId("website") },
            name: t("metaTitle"),
            publisher: { "@id": siteEntityId("organization") },
            url,
          };

    const faqNumbers = Array.from(
      { length: guide.faqCount },
      (_, index) => index + 1,
    );
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqNumbers.map((n) => ({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`faq${n}A` as Parameters<typeof t>[0]),
        },
        name: t(`faq${n}Q` as Parameters<typeof t>[0]),
      })),
    };

    return (
      <>
        {heroSrc ? <CoverImagePreload sizes="100vw" src={heroSrc} /> : null}
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={pageLd} />
        <JsonLd data={faqLd} />
        <PageView guideId={guideId} heroSrc={heroSrc} species={species} />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}
