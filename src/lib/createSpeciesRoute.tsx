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
import { SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { getHubIndexTitleKey } from "@/lib/clusterGuides";
import { faqPageJsonLd } from "@/lib/faqJsonLd";
import { photoRights } from "@/lib/imageRights";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { galleryImageObjects } from "@/lib/photoMeta";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import {
  speciesAlternateNames,
  speciesJsonLdKeywords,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import {
  absoluteUrl,
  localePath,
  openGraphJpeg,
  organizationRef,
  siteConfig,
  speciesAlternates,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import {
  getSpeciesHeroSources,
  isPlaceholderBody,
  SPECIES_HERO_DESKTOP_SIZES,
  SPECIES_HERO_SIZES,
} from "@/lib/speciesContent";
import {
  speciesFallbackDescriptionKey,
  speciesMetaDescription,
  speciesMetaDescriptionOverride,
  speciesPageMetaTitle,
  speciesTitleIntentKey,
} from "@/lib/speciesMeta";
import { getSpeciesProfile } from "@/lib/speciesProfileApi";
import {
  getLookalikeSpecies,
  getProfileRelatedSpecies,
} from "@/lib/speciesRelated";
import { getSpeciesPublicSlug, speciesHref } from "@/lib/speciesRoutes";
import { resolveSpeciesIdInHub } from "@/lib/speciesSlugTable";
import { speciesArticleSpatialCoverage } from "@/lib/speciesSpatialCoverage";
import { speciesStaticParams } from "@/lib/speciesStaticParams";
import { taxonIdentifierUrls } from "@/lib/taxonIdentifiers";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const HALYOMORPHA_TAXON_SAME_AS = [
  "https://gd.eppo.int/taxon/HALYHA",
  "https://biodiversity.iliauni.edu.ge/ka/species/14072",
];

const IUCN_ASSESSMENT_URL =
  /^https:\/\/www\.iucnredlist\.org\/species\/(\d+)\/(\d+)/;

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
  /^https:\/\/www\.iucnredlist\.org\/species\//,
  /^https:\/\/www\.mammaldiversity\.org\/explore\.html#species-id=/,
  /^https:\/\/www\.mammaldiversity\.org\/taxon\//,
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
        robots: null,
        title: "Species not found",
      };
    }

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: "speciesMeta" });
    const id = resolveSpeciesIdInHub(hubId, slug);
    const loaded = id ? await loadSpeciesPage(id, locale) : null;

    if (!loaded) {
      return {
        robots: null,
        title: t("notFound"),
      };
    }

    const { group, item, raw } = loaded;
    const title = speciesPageMetaTitle(
      raw.id,
      locale,
      item.commonName,
      item.scientificName,
      t(speciesTitleIntentKey(group, raw.danger)),
      t("titleShort"),
    );
    const fallbackDescription =
      speciesMetaDescriptionOverride(raw.id, locale) ??
      (isPlaceholderBody(item.overview)
        ? t(speciesFallbackDescriptionKey(group, raw.danger), {
            name: item.commonName,
            scientific: item.scientificName,
          })
        : speciesMetaDescription(item, locale));
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
    const ogImageTag = openGraphJpeg(
      ogImage,
      `${item.commonName} (${item.scientificName})`,
    );

    return {
      alternates: speciesAlternates(locale, item.id),
      description,
      keywords,
      openGraph: {
        description,
        images: [ogImageTag],
        locale: openGraphLocale(locale),
        modifiedTime: item.updatedAt,
        publishedTime: raw.publishedAt,
        siteName: siteConfig.name,
        title,
        type: "article",
        url,
      },
      robots: INDEXABLE_ROBOTS,
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

    const id = resolveSpeciesIdInHub(hubId, slug);
    if (!id) {
      notFound();
    }

    const expectedSlug = getSpeciesPublicSlug(id, locale);
    if (slug !== expectedSlug) {
      permanentRedirect(getPathname({ href: speciesHref(id, locale), locale }));
    }

    const loaded = await loadSpeciesPage(id, locale);
    if (!loaded) {
      notFound();
    }
    const { item, raw } = loaded;
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
    const { desktopHeroSrc, mobileSlideSrc } = getSpeciesHeroSources(raw);

    return (
      <>
        <SpeciesHeroPreloads
          desktopHeroSrc={desktopHeroSrc}
          mobileHeroSrc={mobileSlideSrc}
        />
        <JsonLd data={structuredData} />
        <ClientMessagesProvider
          locale={locale}
          namespaces={SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES}
        >
          <SpeciesProfile
            locale={locale}
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

function epithetStem(epithet: string) {
  return epithet.replace(/-+$/, "").replace(/(?:us|um|is|a|e)$/, "");
}

function isTaxonSameAsUrl(url: string) {
  return TAXON_SAME_AS_URL_PATTERNS.some((pattern) => pattern.test(url));
}

async function loadSpeciesPage(id: string, locale: AppLocale) {
  const [base, localized] = await Promise.all([
    getSpeciesProfile(id, "ka"),
    getSpeciesProfile(id, locale),
  ]);
  if (!base || !localized) return null;
  return { group: localized.group, item: localized.species, raw: base.species };
}

function localizedSpeciesRelations(raw: Species, locale: AppLocale) {
  return {
    lookalikes: getLookalikeSpecies(raw.id).map((entry) =>
      localizeSpecies(entry, locale),
    ),
    related: getProfileRelatedSpecies(raw.id).map((entry) =>
      localizeSpecies(entry, locale),
    ),
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

function sourceNamesOtherSpecies(sourceName: string, raw: Species) {
  const [genus, ...epithets] = raw.scientificName.split(" ");
  if (!genus || epithets.length === 0) return false;
  const ownStems = new Set(epithets.map(epithetStem));
  const binomial = new RegExp(String.raw`\b${genus}\s+([a-z-]+)`, "g");
  const named = Array.from(sourceName.matchAll(binomial), (match) =>
    epithetStem(match[1]),
  );
  return named.length > 0 && !named.some((stem) => ownStems.has(stem));
}

function sourceSameAs(raw: Species) {
  if (raw.id === "halyomorpha-halys") return HALYOMORPHA_TAXON_SAME_AS;

  const urls: string[] = [];
  for (const source of raw.sources) {
    if (
      source.url &&
      isTaxonSameAsUrl(source.url) &&
      !sourceNamesOtherSpecies(source.name, raw)
    ) {
      urls.push(source.url);
    }
  }
  return withoutSupersededIucnAssessments(urls);
}

function SpeciesHeroPreloads({
  desktopHeroSrc,
  mobileHeroSrc,
}: {
  desktopHeroSrc?: null | string;
  mobileHeroSrc?: null | string;
}) {
  if (!desktopHeroSrc) return null;

  if (!mobileHeroSrc || mobileHeroSrc === desktopHeroSrc) {
    return (
      <CoverImagePreload sizes={SPECIES_HERO_SIZES} src={desktopHeroSrc} />
    );
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
        sizes={SPECIES_HERO_DESKTOP_SIZES}
        src={desktopHeroSrc}
      />
    </>
  );
}

function speciesSameAs(raw: Species) {
  return [...new Set([...sourceSameAs(raw), ...taxonIdentifierUrls(raw.id)])];
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
  const photoObjects = galleryImageObjects(
    getSpeciesHeroSources(item).gallery,
    item,
    locale,
  ).map((photo, index) => ({
    "@id": `${pageUrl}#photo-${index + 1}`,
    ...photo,
  }));
  const taxonId = `${pageUrl}#taxon`;
  const galleryId = `${pageUrl}#${SPECIES_SECTION_IDS.gallery}`;
  const taxon = {
    "@id": taxonId,
    ...speciesTaxonJsonLd(raw, item, locale),
  };
  const ogImageObject = {
    "@type": "ImageObject",
    contentUrl: ogImage,
    name: `${item.commonName} (${item.scientificName})`,
    url: ogImage,
    ...(ogImage === speciesOgImageUrl(item.id)
      ? photoRights(ogImage, undefined, locale)
      : photoRights(item.image, item.imageCredit, locale)),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@id": `${pageUrl}#article`,
    "@type": "Article",
    about: taxon,
    author: organizationRef(),
    citation: raw.sources.map(sourceCreativeWork),
    dateModified: item.updatedAt,
    datePublished: raw.publishedAt,
    description: item.description,
    ...(photoObjects.length > 0
      ? {
          associatedMedia: photoObjects.map((photo) => ({
            "@id": photo["@id"],
          })),
          hasPart: { "@id": galleryId },
        }
      : {}),
    headline: `${item.commonName} (${item.scientificName})`,
    image: [ogImageObject, ...photoObjects.map((photo) => photo.contentUrl)],
    inLanguage: locale,
    keywords: speciesJsonLdKeywords(item, locale),
    mainEntityOfPage: {
      "@id": pageUrl,
      "@type": "WebPage",
    },
    publisher: organizationRef(),
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
          "@id": galleryId,
          "@type": "ImageGallery",
          about: { "@id": taxonId },
          associatedMedia: photoObjects,
          inLanguage: locale,
          name: `${item.commonName} ${galleryTitle}`,
          url: galleryId,
        }
      : null;
  const faqJsonLd =
    raw.id !== "halyomorpha-halys" && item.faq ? faqPageJsonLd(item.faq) : null;

  return [jsonLd, breadcrumbLd, galleryLd, faqJsonLd].filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry),
  );
}

function speciesTaxonJsonLd(raw: Species, item: Species, locale: AppLocale) {
  const georgianAliases =
    raw.id === "blatta-orientalis" ? ["შავი ტარაკანა", "შავი ტარაკანი"] : [];
  const alternateName: string[] = [];
  const seenAlternateNames = new Set([item.scientificName.toLocaleLowerCase()]);
  for (const name of [
    item.commonName,
    ...speciesAlternateNames(item.id, locale),
    ...georgianAliases,
  ]) {
    const key = name.trim().toLocaleLowerCase();
    if (!key || seenAlternateNames.has(key)) continue;
    seenAlternateNames.add(key);
    alternateName.push(name.trim());
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
      ...(item.family
        ? {
            parentTaxon: {
              "@type": "Taxon",
              name: item.family,
              taxonRank: "Family",
            },
          }
        : {}),
      taxonRank: "Genus",
    },
    taxonRank: "Species",
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(subjectOf.length > 0 ? { subjectOf } : {}),
  };
}

function withoutSupersededIucnAssessments(urls: string[]) {
  const latest = new Map<string, number>();
  for (const url of urls) {
    const match = IUCN_ASSESSMENT_URL.exec(url);
    if (!match) continue;
    latest.set(match[1], Math.max(latest.get(match[1]) ?? 0, Number(match[2])));
  }
  return urls.filter((url) => {
    const match = IUCN_ASSESSMENT_URL.exec(url);
    return !match || Number(match[2]) === latest.get(match[1]);
  });
}

export { speciesSameAs, speciesStructuredData };
