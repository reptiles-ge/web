import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { GroupHubPage } from "@/components/GroupHubPage";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { getPublishedNewsForHub } from "@/data/news";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { images } from "@/data/speciesMedia";
import { GROUP_HUB_SHARED_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { hubFaqLinks } from "@/lib/groupHubFaq";
import { HUB_HERO_IMAGE_SIZES } from "@/lib/groupHubLayout";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
  speciesItemListLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath, speciesOgImageUrl } from "@/lib/site";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { pageDateFields } from "@/lib/structuredDataDates";

type HubTranslator = Awaited<ReturnType<typeof getTranslations>>;

type Props = {
  params: Promise<{ locale: string }>;
};

const TURTLE_FAQ_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const DEFAULT_FAQ_INDICES = [1, 2, 3, 4, 5] as const;

export function createGroupHubRoute(hubId: GroupHubId) {
  const hub = GROUP_HUBS[hubId];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: hub.messageKey });
    const title = t("metaTitle");
    const metadataTitle =
      locale === "ka" && hubId === "scorpions" ? { absolute: title } : title;
    const catalog = getCatalogSpeciesByGroup(hub.group);
    const hero =
      catalog.find((item) => item.id === hub.heroSpeciesId) ?? catalog[0];

    return buildPageMetadata({
      description: t("metaDescription"),
      indexable: true,
      keywords: t("keywords"),
      locale,
      metadataTitle,
      ogImageUrl: speciesOgImageUrl(hub.heroSpeciesId, hero?.image),
      pagePath: hub.path,
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

    const t = await getTranslations({ locale, namespace: hub.messageKey });
    const tShared = await getTranslations({
      locale,
      namespace: "groupHubShared",
    });

    const url = absoluteUrl(localePath(locale, hub.path));
    const species = getCatalogSpeciesByGroup(hub.group).map((item) =>
      localizeSpecies(item, locale),
    );
    const hero =
      species.find((item) => item.id === hub.heroSpeciesId) ?? species[0];
    const heroSrc =
      hero?.image && !isPlaceholderMedia(hero.image) ? hero.image : images.hero;
    const heroMobileSrc =
      hero?.mobileImage && !isPlaceholderMedia(hero.mobileImage)
        ? hero.mobileImage
        : undefined;

    const breadcrumbLd = breadcrumbListLd([
      { item: localePageUrl(locale, "/"), name: tShared("breadcrumbHome") },
      { item: url, name: t("breadcrumbCurrent") },
    ]);

    const collectionLd = sitePageLd({
      about: { "@type": "Place", name: georgiaPlaceName(locale) },
      dates: pageDateFields(hub.path),
      description: t("metaDescription"),
      locale,
      mainEntity: speciesItemListLd(locale, species),
      name: t("metaTitle"),
      type: "CollectionPage",
      url,
    });

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: buildHubFaqMainEntity(hubId, t, species.length),
    };

    return (
      <>
        <HubCoverPreloads desktopSrc={heroSrc} mobileSrc={heroMobileSrc} />
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={collectionLd} />
        <JsonLd data={faqLd} />
        <ClientMessagesProvider
          locale={locale}
          namespaces={[
            ...GROUP_HUB_SHARED_CLIENT_MESSAGE_NAMESPACES,
            hub.messageKey,
          ]}
        >
          <GroupHubPage
            heroMobileSrc={heroMobileSrc}
            heroSrc={heroSrc}
            hubId={hubId}
            locale={locale}
            species={species}
          />
        </ClientMessagesProvider>
        <NewsRelatedBlock
          articles={getPublishedNewsForHub(hubId, locale)}
          locale={locale}
        />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}

function buildHubFaqMainEntity(
  hubId: GroupHubId,
  t: HubTranslator,
  count: number,
) {
  const mainEntity: Array<{
    "@type": "Question";
    acceptedAnswer: { "@type": "Answer"; text: string };
    name: string;
  }> = [];

  for (const n of hubFaqIndices(hubId)) {
    if (!t.has(`faq${n}Q`)) continue;
    mainEntity.push({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: hubFaqAnswer(hubId, n, t, count),
      },
      name: t(`faq${n}Q`),
    });
  }

  return mainEntity;
}

function HubCoverPreloads({
  desktopSrc,
  mobileSrc,
}: {
  desktopSrc: string;
  mobileSrc?: string;
}) {
  if (!mobileSrc) {
    return <CoverImagePreload sizes={HUB_HERO_IMAGE_SIZES} src={desktopSrc} />;
  }

  return (
    <>
      <CoverImagePreload
        media="(min-width: 640px)"
        sizes={HUB_HERO_IMAGE_SIZES}
        src={desktopSrc}
      />
      <CoverImagePreload
        media="(max-width: 639px)"
        sizes={HUB_HERO_IMAGE_SIZES}
        src={mobileSrc}
      />
    </>
  );
}

function hubFaqAnswer(
  hubId: GroupHubId,
  n: number,
  t: HubTranslator,
  count: number,
) {
  const links = hubFaqLinks(hubId, n);
  if (!links) return t(`faq${n}A` as "faq1A", { count });
  return t.markup(`faq${n}A` as "faq1A", {
    count,
    ...Object.fromEntries(
      Object.keys(links).map((tag) => [tag, (chunks: string) => chunks]),
    ),
  });
}

function hubFaqIndices(hubId: GroupHubId) {
  return hubId === "turtles" ? TURTLE_FAQ_INDICES : DEFAULT_FAQ_INDICES;
}
