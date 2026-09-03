import { CoverImagePreload } from "@/components/CoverImagePreload";
import { AmphibianSpeciesIndexPage } from "@/components/AmphibianSpeciesIndexPage";
import { ClusterGuidePage } from "@/components/ClusterGuidePage";
import { FrogSpeciesIndexPage } from "@/components/FrogSpeciesIndexPage";
import { LizardComparePage } from "@/components/LizardComparePage";
import { LizardIdentifyPage } from "@/components/LizardIdentifyPage";
import { LizardSpeciesIndexPage } from "@/components/LizardSpeciesIndexPage";
import { SnakeBitePage } from "@/components/SnakeBitePage";
import { SnakeIdentifyPage } from "@/components/SnakeIdentifyPage";
import { SnakeLargestPage } from "@/components/SnakeLargestPage";
import { SnakeRangePage } from "@/components/SnakeRangePage";
import { SnakeSpeciesIndexPage } from "@/components/SnakeSpeciesIndexPage";
import { TurtleIdentifyPage } from "@/components/TurtleIdentifyPage";
import { TurtleSpeciesIndexPage } from "@/components/TurtleSpeciesIndexPage";
import { JsonLd } from "@/components/JsonLd";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
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
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
  openGraphJpeg,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const CLUSTER_PAGES: Record<
  ClusterGuideId,
  ComponentType<ClusterGuideViewProps>
> = {
  "amphibian-frogs": ClusterGuidePage,
  "snake-index": SnakeSpeciesIndexPage,
  "snake-identify": SnakeIdentifyPage,
  "snake-bite": SnakeBitePage,
  "snake-range": SnakeRangePage,
  "snake-largest": SnakeLargestPage,
  "lizard-index": LizardSpeciesIndexPage,
  "lizard-identify": LizardIdentifyPage,
  "lizard-glass": LizardComparePage,
  "turtle-index": TurtleSpeciesIndexPage,
  "turtle-land": ClusterGuidePage,
  "turtle-water": ClusterGuidePage,
  "turtle-identify": TurtleIdentifyPage,
  "amphibian-index": AmphibianSpeciesIndexPage,
  "amphibian-frogs-index": FrogSpeciesIndexPage,
  "amphibian-newts": ClusterGuidePage,
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
          url: ogImage,
          width: 1200,
          height: 630,
          alt: t("heroImageAlt"),
        }
      : openGraphJpeg(ogImage, title);

    return {
      title,
      description,
      keywords: t("keywords")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      alternates: localeAlternates(locale, guide.pathname),
      openGraph: {
        title,
        description,
        url,
        type: "website",
        locale: openGraphLocale(locale),
        siteName: siteConfig.name,
        images: [ogImageTag],
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
          position: 1,
          name: tShared("breadcrumbHome"),
          item: absoluteUrl(localePath(locale, "/")),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: tParent("breadcrumbCurrent"),
          item: absoluteUrl(localePath(locale, parent.path)),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: t("breadcrumbCurrent"),
          item: url,
        },
      ],
    };

    const pageLd =
      guide.schema === "collection"
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("metaTitle"),
            description: t("metaDescription"),
            url,
            isPartOf: { "@id": siteEntityId("website") },
            author: { "@id": siteEntityId("organization") },
            publisher: { "@id": siteEntityId("organization") },
            about: {
              "@type": "Place",
              name: georgiaPlaceName(locale),
            },
            inLanguage: locale,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: species.length,
              itemListElement: species.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: speciesPageUrl(locale, item.id),
                name: `${item.commonName} (${item.scientificName})`,
              })),
            },
          }
        : {
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
              name: georgiaPlaceName(locale),
            },
            inLanguage: locale,
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
        name: t(`faq${n}Q` as Parameters<typeof t>[0]),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`faq${n}A` as Parameters<typeof t>[0]),
        },
      })),
    };

    return (
      <>
        {heroSrc ? <CoverImagePreload src={heroSrc} sizes="100vw" /> : null}
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={pageLd} />
        <JsonLd data={faqLd} />
        <PageView guideId={guideId} species={species} heroSrc={heroSrc} />
      </>
    );
  }

  return {
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    generateMetadata,
    Page,
  };
}
