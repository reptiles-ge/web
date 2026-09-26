import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";

import type { Species } from "@/data/species";
import type { GroupHubId } from "@/lib/groupHubs";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { SpeciesProfile } from "@/components/SpeciesProfile";
import { getPublishedNewsForSpecies } from "@/data/news";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { getHubIndexTitleKey } from "@/lib/clusterGuides";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { galleryImageObjects } from "@/lib/photoMeta";
import {
  speciesAliasKeywords,
  speciesJsonLdKeywords,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import {
  absoluteUrl,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  siteConfig,
  speciesAlternates,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import { getSpeciesHeroSources, isPlaceholderBody } from "@/lib/speciesContent";
import {
  speciesFallbackDescriptionKey,
  speciesMetaDescription,
  speciesMetaDescriptionOverride,
  speciesPageMetaTitle,
  speciesTitleIntentKey,
} from "@/lib/speciesMeta";
import { getLookalikeSpecies, getRelatedSpecies } from "@/lib/speciesRelated";
import {
  getSpeciesPublicSlug,
  resolveSpeciesInHub,
  speciesHref,
  speciesStaticParams,
} from "@/lib/speciesRoutes";
import { speciesArticleSpatialCoverage } from "@/lib/speciesSpatialCoverage";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const HALYOMORPHA_TAXON_SAME_AS = [
  "https://gd.eppo.int/taxon/HALYHA",
  "https://www.gbif.org/species/4485843",
  "https://biodiversity.iliauni.edu.ge/ka/species/14072",
  "https://www.wikidata.org/wiki/Q3270185",
];

const TAXON_SAME_AS_URL_PATTERNS = [
  /^https:\/\/amphibiaweb\.org\/cgi\/amphib_query\?/,
  /^https:\/\/amphibiansoftheworld\.amnh\.org\/Amphibia\//,
  /^https:\/\/arages\.de\/arachnologie-vernetzt\/spinne-des-jahres\//,
  /^https:\/\/araneae\.nmbe\.ch\/data\//,
  /^https:\/\/aves\.biodiversity-georgia\.iliauni\.edu\.ge\//,
  /^https:\/\/avibase\.bsc-eoc\.org\/species\.jsp\?/,
  /^https:\/\/biodiversity\.iliauni\.edu\.ge\/(?:[a-z]{2}\/)?species\//,
  /^https:\/\/birdsoftheworld\.org\/bow\/species\//,
  /^https:\/\/caucasus-spiders\.info\/checklist\/species-datasheet\//,
  /^https:\/\/gd\.eppo\.int\/taxon\//,
  /^https:\/\/reptile-database\.reptarium\.cz\/species\?/,
  /^https:\/\/wsc\.nmbe\.ch\/spec-data\//,
  /^https:\/\/www\.gbif\.org\/species\//,
  /^https:\/\/www\.iucnredlist\.org\/species\//,
  /^https:\/\/www\.mammaldiversity\.org\/explore\.html#species-id=/,
  /^https:\/\/www\.wikidata\.org\/wiki\//,
];

type SpeciesSource = {
  name: string;
  url?: string;
};

export function createSpeciesHubRoute(hubId: GroupHubId) {
  function generateStaticParams() {
    return speciesStaticParams(hubId);
  }

  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale: localeParam, slug } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      return {
        robots: { follow: false, index: false },
        title: "Species not found",
      };
    }

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: "speciesMeta" });
    const raw = resolveSpeciesInHub(hubId, slug);

    if (!raw) {
      return {
        robots: { follow: false, index: false },
        title: t("notFound"),
      };
    }

    const item = localizeSpecies(raw, locale);
    const group = getSpeciesAtlasMeta(raw.id).group;
    const title = speciesPageMetaTitle(
      raw.id,
      locale,
      item.commonName,
      item.scientificName,
      t(speciesTitleIntentKey(group, raw.danger)),
    );
    const fallbackDescription =
      speciesMetaDescriptionOverride(raw.id, locale) ??
      (isPlaceholderBody(item.overview)
        ? t(speciesFallbackDescriptionKey(group, raw.danger), {
            name: item.commonName,
            scientific: item.scientificName,
          })
        : speciesMetaDescription(item.overview));
    const url = speciesPageUrl(locale, item.id);
    const description = kaMetaDescriptionOverride(
      locale,
      new URL(url).pathname,
      fallbackDescription,
    );
    const keywords =
      raw.id === "halyomorpha-halys"
        ? undefined
        : speciesSeoKeywords(item, locale);

    const ogImage = speciesOgImageUrl(item.id, item.image);
    const ogImageTag = openGraphJpeg(ogImage, title);

    return {
      alternates: speciesAlternates(locale, item.id),
      description,
      keywords,
      openGraph: {
        description,
        images: [ogImageTag],
        locale: openGraphLocale(locale),
        modifiedTime: raw.updatedAt,
        publishedTime: raw.publishedAt,
        siteName: siteConfig.name,
        title,
        type: "article",
        url,
      },
      robots: {
        follow: true,
        index: true,
      },
      title: {
        absolute: title,
      },
      twitter: {
        card: "summary_large_image",
        description,
        images: [ogImage],
        title,
      },
    };
  }

  async function Page({ params }: PageProps) {
    const { locale: localeParam, slug } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      notFound();
    }

    const locale = localeParam as AppLocale;
    setRequestLocale(locale);

    const raw = resolveSpeciesInHub(hubId, slug);
    if (!raw) {
      notFound();
    }

    const expectedSlug = getSpeciesPublicSlug(raw.id, locale);
    if (slug !== expectedSlug) {
      permanentRedirect(
        getPathname({ href: speciesHref(raw.id, locale), locale }),
      );
    }

    const item = localizeSpecies(raw, locale);
    const { lookalikes, related } = localizedSpeciesRelations(raw, locale);
    const tProfile = await getTranslations({ locale, namespace: "profile" });
    const tHubs = await getTranslations({
      locale,
      namespace: "groupHubShared",
    });
    const parent = getSpeciesParentHub(item);
    const groupLabel = parent.hubId
      ? tHubs(`hubs.${parent.hubId}`)
      : tHubs("hubs.snakes");
    const breadcrumbCrumbs = buildSpeciesBreadcrumbs({
      groupLabel,
      homeLabel: tProfile("breadcrumbHome"),
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
      species: item,
      venomousLabel: tProfile("breadcrumbVenomous"),
    });

    const pageUrl = speciesPageUrl(locale, item.id);
    const ogImage = speciesOgImageUrl(item.id, item.image);
    const structuredData = speciesStructuredData({
      breadcrumbCrumbs,
      galleryTitle: tProfile("galleryTitle"),
      item,
      locale,
      ogImage,
      pageUrl,
      raw,
    });
    const { desktopHeroSrc, mobileHeroSrc } = getSpeciesHeroSources(raw);

    return (
      <>
        <SpeciesHeroPreloads
          desktopHeroSrc={desktopHeroSrc}
          mobileHeroSrc={mobileHeroSrc}
        />
        <JsonLd data={structuredData} />
        <ClientMessagesProvider
          namespaces={SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES}
        >
          <SpeciesProfile
            lookalikes={lookalikes}
            related={related}
            species={item}
          />
        </ClientMessagesProvider>
        <NewsRelatedBlock
          articles={getPublishedNewsForSpecies(raw.id, locale)}
          locale={locale}
        />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams,
    Page,
  };
}

function isTaxonSameAsUrl(url: string) {
  return TAXON_SAME_AS_URL_PATTERNS.some((pattern) => pattern.test(url));
}

function localizedSpeciesRelations(raw: Species, locale: AppLocale) {
  const lookalikeSpecies = getLookalikeSpecies(raw.id);
  const lookalikeIds = new Set(lookalikeSpecies.map((entry) => entry.id));
  const related: Species[] = [];

  for (const entry of raw.id === "alectoris-chukar"
    ? []
    : getRelatedSpecies(raw.id, 8)) {
    if (lookalikeIds.has(entry.id)) continue;
    related.push(localizeSpecies(entry, locale));
    if (related.length === 4) break;
  }

  return {
    lookalikes: lookalikeSpecies.map((entry) => localizeSpecies(entry, locale)),
    related,
  };
}

function sourceCreativeWork(source: SpeciesSource) {
  return source.url
    ? {
        "@type": "CreativeWork",
        name: source.name,
        url: source.url,
      }
    : {
        "@type": "CreativeWork",
        name: source.name,
      };
}

function SpeciesHeroPreloads({
  desktopHeroSrc,
  mobileHeroSrc,
}: {
  desktopHeroSrc?: null | string;
  mobileHeroSrc?: null | string;
}) {
  if (!desktopHeroSrc) return null;

  if (!mobileHeroSrc) {
    return <CoverImagePreload sizes="100vw" src={desktopHeroSrc} />;
  }

  return (
    <>
      <CoverImagePreload
        media="(max-width: 1023px)"
        sizes="100vw"
        src={mobileHeroSrc}
      />
      <CoverImagePreload
        media="(min-width: 1024px)"
        sizes="100vw"
        src={desktopHeroSrc}
      />
    </>
  );
}

function speciesSameAs(raw: Species) {
  if (raw.id === "halyomorpha-halys") return HALYOMORPHA_TAXON_SAME_AS;

  const urls: string[] = [];
  for (const source of raw.sources) {
    if (source.url && isTaxonSameAsUrl(source.url)) urls.push(source.url);
  }
  return urls;
}

function speciesStructuredData({
  breadcrumbCrumbs,
  galleryTitle,
  item,
  locale,
  ogImage,
  pageUrl,
  raw,
}: {
  breadcrumbCrumbs: ReturnType<typeof buildSpeciesBreadcrumbs>;
  galleryTitle: string;
  item: Species;
  locale: AppLocale;
  ogImage: string;
  pageUrl: string;
  raw: Species;
}) {
  const photoObjects = galleryImageObjects(item.gallery, item, locale);
  const taxon = speciesTaxonJsonLd(raw, item, locale);
  const org = organizationJsonLd();
  const ogImageObject = {
    "@type": "ImageObject",
    contentUrl: ogImage,
    name: `${item.commonName} (${item.scientificName})`,
    url: ogImage,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    about: taxon,
    associatedMedia: photoObjects,
    author: org,
    citation: raw.sources.map(sourceCreativeWork),
    dateModified: raw.updatedAt,
    datePublished: raw.publishedAt,
    description: item.description,
    headline: `${item.commonName} (${item.scientificName})`,
    image: [ogImageObject, ...photoObjects],
    inLanguage: locale,
    keywords: speciesJsonLdKeywords(item, locale),
    mainEntity: taxon,
    mainEntityOfPage: {
      "@id": pageUrl,
      "@type": "WebPage",
    },
    publisher: org,
    spatialCoverage: speciesArticleSpatialCoverage(item.id, locale),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbCrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      item: crumb.href ? absoluteUrl(localePath(locale, crumb.href)) : pageUrl,
      name: crumb.name,
      position: index + 1,
    })),
  };
  const galleryLd =
    photoObjects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          about: taxon,
          associatedMedia: photoObjects,
          inLanguage: locale,
          name: `${item.commonName} ${galleryTitle}`,
          url: `${pageUrl}#${SPECIES_SECTION_IDS.gallery}`,
        }
      : null;
  const faqJsonLd =
    raw.id !== "halyomorpha-halys" && item.faq && item.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faq.map((entry) => ({
            "@type": "Question",
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.answer,
            },
            name: entry.question,
          })),
        }
      : null;

  return [jsonLd, breadcrumbLd, galleryLd, faqJsonLd].filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry),
  );
}

function speciesTaxonJsonLd(raw: Species, item: Species, locale: AppLocale) {
  const aliases = speciesAliasKeywords(item.id, locale);
  const alternateName: string[] = [];
  const seenAlternateNames = new Set<string>();
  const georgianAliases =
    raw.id === "blatta-orientalis" ? ["შავი ტარაკანა", "შავი ტარაკანი"] : [];
  for (const name of [item.commonName, ...aliases, ...georgianAliases]) {
    if (seenAlternateNames.has(name)) continue;
    seenAlternateNames.add(name);
    alternateName.push(name);
  }

  const sameAs = speciesSameAs(raw);
  const sameAsUrls = new Set(sameAs);
  const subjectOf = [];
  if (raw.id === "halyomorpha-halys") {
    for (const source of raw.sources) {
      if (!source.url || sameAsUrls.has(source.url)) continue;
      subjectOf.push(sourceCreativeWork(source));
    }
  }

  return {
    "@type": "Taxon",
    alternateName,
    name: item.scientificName,
    parentTaxon: {
      "@type": "Taxon",
      name: item.genus,
      taxonRank: "Genus",
    },
    taxonRank: "Species",
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(subjectOf.length > 0 ? { subjectOf } : {}),
  };
}

export { speciesSameAs, speciesStructuredData };
