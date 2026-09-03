"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyBlock } from "@/components/BiologyBlock";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { SpeciesRiskChip } from "@/components/SpeciesDanger";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesSources } from "@/components/SpeciesSources";
import { SpeciesVoicePlayer } from "@/components/SpeciesVoicePlayer";
import { pictureSources } from "@/data/optimizedImages";
import { getRegionsForSpecies } from "@/data/regions";
import { resolvePhotoCredit, type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import {
  getHubIndexTitleKey,
  getSpeciesGuideLinks,
  isSnakeSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { formatContentDate } from "@/lib/formatDate";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import {
  filterDisplayStats,
  getSpeciesHeroSources,
  hasRealIdentification,
  isPlaceholderBody,
  isPlaceholderMedia,
} from "@/lib/speciesContent";
import { speciesImageAlt, speciesPhotoAlt } from "@/lib/speciesMeta";
import { usesDangerScale } from "@/lib/speciesRisk";
import { speciesHref } from "@/lib/speciesRoutes";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileProps = {
  related: Species[];
  species: Species;
};

export function SpeciesProfile({
  related: rawRelated,
  species: rawSpecies,
}: SpeciesProfileProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("profile");
  const tHubs = useTranslations("groupHubShared");
  const tDanger = useTranslations("danger");
  const species = useMemo(
    () => localizeSpecies(rawSpecies, locale),
    [rawSpecies, locale],
  );
  const related = useMemo(
    () => rawRelated.map((item) => localizeSpecies(item, locale)),
    [rawRelated, locale],
  );
  const guideLinks = getSpeciesGuideLinks(species.id);
  const breadcrumbs = useMemo(() => {
    const parent = getSpeciesParentHub(species);
    const groupLabel = tHubs(`hubs.${parent.hubId}`);
    return buildSpeciesBreadcrumbs({
      groupLabel,
      homeLabel: t("breadcrumbHome"),
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
      species,
      venomousLabel: t("breadcrumbVenomous"),
    });
  }, [species, t, tHubs]);
  const { desktopHeroSrc, gallery, mobileHeroSrc, primary } =
    getSpeciesHeroSources(species);
  const heroDesktopSources = pictureSources(desktopHeroSrc, {
    media: "(min-width: 1024px)",
    sizes: "100vw",
  });
  const heroPrimarySources = pictureSources(mobileHeroSrc ?? desktopHeroSrc, {
    sizes: "100vw",
  });
  const heroCredit = resolvePhotoCredit(species.imageCredit, primary?.credit);
  const mobileHeroCredit = resolvePhotoCredit(
    species.mobileImageCredit,
    species.imageCredit,
    primary?.credit,
  );
  const imageAlt = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    species.location,
    heroCredit,
  );
  const mobileImageAlt = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    species.location,
    mobileHeroCredit,
  );
  const group = getSpeciesAtlasMeta(species.id).group;
  const displayStats = filterDisplayStats(species.stats, group);
  const dangerValue = species.danger ? tDanger(species.danger) : null;
  const linkDangerStats = usesDangerScale(group) && Boolean(species.danger);
  const showIdentification = hasRealIdentification(species.identification);

  useEffect(() => {
    trackEvent("species_view", {
      group,
      has_gallery: gallery.length > 0,
      has_identification: showIdentification,
      has_range: getRegionsForSpecies(species.id).length > 0,
      page_type: "species",
      scientific_name: species.scientificName,
      species_id: species.id,
    });
  }, [
    species.id,
    species.scientificName,
    group,
    gallery.length,
    showIdentification,
  ]);
  const biologyBlocks = useMemo(
    () =>
      [
        {
          body: species.habitat,
          id: "habitat",
          title: t("habitat"),
        },
        { body: species.diet, id: "diet", title: t("diet") },
        { body: species.behavior, id: "behavior", title: t("behavior") },
        {
          body: species.conservation,
          id: "conservation",
          title: t("conservation"),
        },
      ].filter((block) => !isPlaceholderBody(block.body)),
    [species.behavior, species.conservation, species.diet, species.habitat, t],
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[75svh] lg:pb-16"
          style={{
            paddingTop: "7rem",
          }}
        >
          {desktopHeroSrc ? (
            <picture className="media-placeholder absolute inset-0 block size-full">
              {mobileHeroSrc ? (
                <>
                  {heroDesktopSources.map((source) => (
                    <source key={source.key} {...source.props} />
                  ))}
                  <source media="(min-width: 1024px)" srcSet={desktopHeroSrc} />
                </>
              ) : null}
              {heroPrimarySources.map((source) => (
                <source key={source.key} {...source.props} />
              ))}
              <img
                alt={mobileHeroSrc ? mobileImageAlt : imageAlt}
                className="size-full object-cover text-transparent"
                decoding="async"
                fetchPriority="high"
                src={mobileHeroSrc ?? desktopHeroSrc}
              />
            </picture>
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,rgba(255,255,255,0.12),transparent_60%),linear-gradient(160deg,#1c1916_0%,#0f0e0c_55%,#171411_100%)]"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/25 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
          {heroCredit ? (
            <div
              className="pointer-events-none absolute right-6 z-5 hidden lg:right-10 lg:block"
              style={{ top: "5.75rem" }}
            >
              <PhotoCreditCaption
                credit={heroCredit}
                speciesId={species.id}
                variant="hero"
              />
            </div>
          ) : null}
          {mobileHeroCredit && mobileHeroSrc ? (
            <div
              className="pointer-events-none absolute right-6 z-5 lg:hidden"
              style={{ top: "5.25rem" }}
            >
              <PhotoCreditCaption
                credit={mobileHeroCredit}
                speciesId={species.id}
                variant="hero"
              />
            </div>
          ) : null}
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <nav aria-label={t("breadcrumbAria")} className="mb-4 sm:mb-6">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/55">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li
                      className="inline-flex items-center gap-2"
                      key={
                        crumb.href ? `${crumb.href}:${crumb.name}` : crumb.name
                      }
                    >
                      {index > 0 ? (
                        <span aria-hidden="true" className="text-white/30">
                          /
                        </span>
                      ) : null}
                      {crumb.href && !isLast ? (
                        <Link
                          className="transition-colors hover:text-white"
                          href={crumb.href}
                        >
                          {crumb.name}
                        </Link>
                      ) : (
                        <span
                          aria-current={isLast ? "page" : undefined}
                          className={isLast ? "text-white/80" : undefined}
                        >
                          {crumb.name}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <h1 className="text-balance-tight max-w-4xl font-display text-[clamp(1.85rem,5vw,4.5rem)] leading-[1.08] font-semibold text-white">
              {species.commonName}
            </h1>
            <p className="mt-3 font-display text-[15px] tracking-wide text-white/55 italic sm:text-[17px]">
              {species.scientificName}
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-[16px]">
              {species.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[13px] text-white/60 backdrop-blur-md">
                <MapPin aria-hidden="true" className="size-3.5 text-white/45" />
                {species.location}
              </span>
              {species.audio ? (
                <SpeciesVoicePlayer
                  audio={species.audio}
                  speciesId={species.id}
                />
              ) : null}
              {usesDangerScale(group) ? (
                <SpeciesRiskChip linked species={species} variant="hero" />
              ) : null}
            </div>
          </div>
        </section>

        {displayStats.length > 0 ? (
          <section className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("atAGlance")}
              </p>
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
                id={SPECIES_SECTION_IDS.atAGlance}
              >
                {t("atAGlanceTitle")}
              </AnchoredHeading>
              <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-border md:grid-cols-3">
                {displayStats.map((stat) => (
                  <div className="bg-background p-6 lg:p-8" key={stat.label}>
                    <p className="text-[10px] tracking-[0.22em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 font-display text-[20px] leading-tight font-medium lg:text-[24px]">
                      {linkDangerStats &&
                      dangerValue &&
                      stat.value === dangerValue ? (
                        <Link
                          className="transition-colors hover:text-primary"
                          href={dangerPageHref(species.danger)}
                        >
                          {stat.value}
                        </Link>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
              {species.interaction &&
              !isPlaceholderBody(species.interaction) ? (
                <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-foreground/80 sm:text-[16px]">
                  <span className="font-medium text-foreground">
                    {t("interaction")}
                  </span>
                  {": "}
                  {species.interaction}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("overview")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
              id={SPECIES_SECTION_IDS.overview}
              slugSource={`${t("whoIs")} ${species.commonName}`}
            >
              {t("whoIs")} {species.commonName}
            </AnchoredHeading>
            <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]">
              {species.overview}
            </p>
            <p className="mt-6 text-[12px] tracking-wide text-muted-foreground">
              {t("lastUpdated")}{" "}
              <time dateTime={species.updatedAt}>
                {formatContentDate(species.updatedAt, locale)}
              </time>
            </p>
          </div>
        </section>

        {gallery.length > 0 ? (
          <SpeciesGallery
            images={gallery}
            location={species.location}
            name={species.commonName}
            scientificName={species.scientificName}
            speciesId={species.id}
            tone="background"
          />
        ) : null}

        <SpeciesRangeMap
          speciesId={species.id}
          speciesName={species.commonName}
        />

        {showIdentification && species.identification ? (
          <SpeciesIdentification
            identification={species.identification}
            name={species.commonName}
          />
        ) : null}

        {isSnakeSpecies(species) ? (
          <QuizPracticeCta
            body={t("quizCtaBody", { name: species.commonName })}
            className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
            cta={t("quizCta")}
            eyebrow={t("quizCtaEyebrow")}
            locale={locale}
            source="species"
            speciesId={species.id}
            title={t("quizCtaTitle")}
          />
        ) : null}

        {biologyBlocks.length > 0 ? (
          <section
            className={cn(
              "bg-surface pb-20 lg:pb-28",
              isSnakeSpecies(species) ? "pt-12 lg:pt-16" : "pt-20 lg:pt-28",
            )}
          >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("biology")}
              </p>
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
                id={SPECIES_SECTION_IDS.biology}
              >
                {t("biologyTitle")}
              </AnchoredHeading>
              <div
                className={cn(
                  "mt-14 grid gap-12 md:gap-10",
                  biologyBlocks.length >= 4
                    ? "md:grid-cols-2"
                    : biologyBlocks.length >= 3
                      ? "md:grid-cols-3"
                      : biologyBlocks.length === 2
                        ? "md:grid-cols-2"
                        : "md:grid-cols-1",
                )}
              >
                {biologyBlocks.map((block) => (
                  <BiologyBlock
                    body={block.body}
                    headingId={block.id}
                    key={block.title}
                    title={block.title}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {species.faq && species.faq.length > 0 ? (
          <SpeciesFaqSection
            entityId={species.id}
            items={species.faq}
            name={species.commonName}
            pageType="species"
          />
        ) : null}

        <ContentAttribution
          sourcesHref={
            species.sources.length > 0
              ? `#${SPECIES_SECTION_IDS.sources}`
              : undefined
          }
        />

        <SpeciesSources sources={species.sources} speciesId={species.id} />

        {guideLinks.length > 0 ? (
          <section className="border-t border-border bg-surface py-16 lg:py-20">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                {t("guidesEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-tight font-semibold">
                {t("guidesTitle")}
              </h2>
              <RelatedGuideGrid
                cards={guideLinks}
                className="mt-8"
                locale={locale}
              />
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="border-t border-border bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                    {t("related")}
                  </p>
                  <AnchoredHeading
                    anchorLabel={t("anchorLink")}
                    className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]"
                    id={SPECIES_SECTION_IDS.related}
                  >
                    {t("relatedTitle")}
                  </AnchoredHeading>
                </div>
                <Link
                  className="hidden items-center gap-1.5 text-[13px] font-medium text-primary sm:inline-flex"
                  href="/species"
                >
                  {t("allSpecies")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, relatedIndex) => {
                  const cover =
                    item.mobileImage && !isPlaceholderMedia(item.mobileImage)
                      ? item.mobileImage
                      : !isPlaceholderMedia(item.image)
                        ? item.image
                        : null;
                  return (
                    <Link
                      className="group relative block aspect-4/5 overflow-hidden rounded-[28px] bg-ink"
                      href={speciesHref(item.id, locale)}
                      key={item.id}
                      onClick={() =>
                        trackSpeciesClick({
                          position: relatedIndex + 1,
                          source: "related",
                          species_id: item.id,
                        })
                      }
                    >
                      {cover ? (
                        <CoverImage
                          alt={speciesImageAlt(
                            item.commonName,
                            item.scientificName,
                            item.location,
                          )}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          src={cover}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.1),transparent_65%),linear-gradient(165deg,#24201c,#12100e)]"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[12px] text-white/50 italic">
                          {item.scientificName}
                        </p>
                        <h3 className="mt-1 font-display text-[22px] font-semibold text-white">
                          {item.commonName}
                        </h3>
                        <p className="mt-2 text-[12px] text-white/50">
                          {item.location}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
