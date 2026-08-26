"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyBlock } from "@/components/BiologyBlock";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { SpeciesRiskChip } from "@/components/SpeciesDanger";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesSources } from "@/components/SpeciesSources";
import {
  resolvePhotoCredit,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { usesDangerScale } from "@/lib/speciesRisk";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { formatContentDate } from "@/lib/formatDate";
import {
  filterDisplayStats,
  getSpeciesHeroSources,
  hasRealIdentification,
  isPlaceholderBody,
  isPlaceholderMedia,
} from "@/lib/speciesContent";
import { speciesImageAlt, speciesPhotoAlt } from "@/lib/speciesMeta";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import { speciesHref } from "@/lib/speciesRoutes";
import { dangerPageHref } from "@/lib/dangerLevels";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import {
  getHubIndexTitleKey,
  getSpeciesGuideLinks,
  isSnakeSpecies,
} from "@/lib/clusterGuides";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

type SpeciesProfileProps = {
  species: Species;
  related: Species[];
};

export function SpeciesProfile({
  species: rawSpecies,
  related: rawRelated,
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
      species,
      homeLabel: t("breadcrumbHome"),
      venomousLabel: t("breadcrumbVenomous"),
      groupLabel,
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
    });
  }, [species, t, tHubs]);
  const { gallery, primary, mobileHeroSrc, desktopHeroSrc } =
    getSpeciesHeroSources(species);
  const heroCredit = resolvePhotoCredit(
    species.imageCredit,
    primary?.credit,
  );
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
  const biologyBlocks = useMemo(
    () =>
      [
        {
          title: t("habitat"),
          body: species.habitat,
          id: "habitat",
        },
        { title: t("diet"), body: species.diet, id: "diet" },
        { title: t("behavior"), body: species.behavior, id: "behavior" },
        {
          title: t("conservation"),
          body: species.conservation,
          id: "conservation",
        },
      ].filter((block) => !isPlaceholderBody(block.body)),
    [
      species.behavior,
      species.conservation,
      species.diet,
      species.habitat,
      t,
    ],
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[75svh] lg:pb-16"
          style={{
            paddingTop:
              "7rem",
          }}
        >
          {desktopHeroSrc ? (
            <picture className="absolute inset-0 block h-full w-full">
              {mobileHeroSrc ? (
                <source
                  media="(min-width: 1024px)"
                  srcSet={desktopHeroSrc}
                />
              ) : null}
              <img
                src={mobileHeroSrc ?? desktopHeroSrc}
                alt={mobileHeroSrc ? mobileImageAlt : imageAlt}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover text-transparent"
              />
            </picture>
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,rgba(255,255,255,0.12),transparent_60%),linear-gradient(160deg,#1c1916_0%,#0f0e0c_55%,#171411_100%)]"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
          {heroCredit ? (
            <div
              className="pointer-events-none absolute right-6 z-[5] hidden lg:block lg:right-10"
              style={{ top: "5.75rem" }}
            >
              <PhotoCreditCaption credit={heroCredit} variant="hero" />
            </div>
          ) : null}
          {mobileHeroCredit && mobileHeroSrc ? (
            <div
              className="pointer-events-none absolute right-6 z-[5] lg:hidden"
              style={{ top: "5.25rem" }}
            >
              <PhotoCreditCaption credit={mobileHeroCredit} variant="hero" />
            </div>
          ) : null}
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <nav aria-label={t("breadcrumbAria")} className="mb-4 sm:mb-6">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/55">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={`${crumb.name}-${index}`} className="inline-flex items-center gap-2">
                      {index > 0 ? (
                        <span aria-hidden="true" className="text-white/30">
                          /
                        </span>
                      ) : null}
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-white"
                        >
                          {crumb.name}
                        </Link>
                      ) : (
                        <span
                          className={isLast ? "text-white/80" : undefined}
                          aria-current={isLast ? "page" : undefined}
                        >
                          {crumb.name}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <h1 className="max-w-4xl font-display text-balance-tight text-[clamp(1.85rem,5vw,4.5rem)] font-semibold leading-[1.08] text-white">
              {species.commonName}
            </h1>
            <p className="mt-3 font-display text-[15px] italic tracking-wide text-white/55 sm:text-[17px]">
              {species.scientificName}
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-[16px]">
              {species.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[13px] text-white/60 backdrop-blur-md">
                <MapPin className="size-3.5 text-white/45" aria-hidden="true" />
                {species.location}
              </span>
              <SpeciesRiskChip species={species} variant="hero" linked />
            </div>
          </div>
        </section>

        {displayStats.length > 0 ? (
          <section className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("atAGlance")}
              </p>
              <AnchoredHeading
                id={SPECIES_SECTION_IDS.atAGlance}
                className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
                anchorLabel={t("anchorLink")}
              >
                {t("atAGlanceTitle")}
              </AnchoredHeading>
              <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-border md:grid-cols-3">
                {displayStats.map((stat) => (
                  <div key={stat.label} className="bg-background p-6 lg:p-8">
                    <p className="text-[10px] tracking-[0.22em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 font-display text-[20px] font-medium leading-tight lg:text-[24px]">
                      {linkDangerStats &&
                      dangerValue &&
                      stat.value === dangerValue ? (
                        <Link
                          href={dangerPageHref(species.danger)}
                          className="transition-colors hover:text-primary"
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
            </div>
          </section>
        ) : null}

        <section className="bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("overview")}
            </p>
            <AnchoredHeading
              id={SPECIES_SECTION_IDS.overview}
              slugSource={`${t("whoIs")} ${species.commonName}`}
              className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
              anchorLabel={t("anchorLink")}
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
            name={species.commonName}
            scientificName={species.scientificName}
            location={species.location}
            tone="background"
          />
        ) : null}

        <SpeciesRangeMap
          speciesId={species.id}
          speciesName={species.commonName}
        />

        {showIdentification && species.identification ? (
          <SpeciesIdentification
            name={species.commonName}
            identification={species.identification}
          />
        ) : null}

        {isSnakeSpecies(species) ? (
          <QuizPracticeCta
            locale={locale}
            eyebrow={t("quizCtaEyebrow")}
            title={t("quizCtaTitle")}
            body={t("quizCtaBody", { name: species.commonName })}
            cta={t("quizCta")}
            className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          />
        ) : null}

        {biologyBlocks.length > 0 ? (
          <section
            className={`bg-surface pb-20 lg:pb-28 ${
              isSnakeSpecies(species) ? "pt-12 lg:pt-16" : "pt-20 lg:pt-28"
            }`}
          >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("biology")}
              </p>
              <AnchoredHeading
                id={SPECIES_SECTION_IDS.biology}
                className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
                anchorLabel={t("anchorLink")}
              >
                {t("biologyTitle")}
              </AnchoredHeading>
              <div
                className={`mt-14 grid gap-12 md:gap-10 ${
                  biologyBlocks.length >= 4
                    ? "md:grid-cols-2"
                    : biologyBlocks.length >= 3
                      ? "md:grid-cols-3"
                      : biologyBlocks.length === 2
                        ? "md:grid-cols-2"
                        : "md:grid-cols-1"
                }`}
              >
                {biologyBlocks.map((block) => (
                  <BiologyBlock
                    key={block.title}
                    title={block.title}
                    body={block.body}
                    headingId={block.id}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {species.faq && species.faq.length > 0 ? (
          <SpeciesFaqSection items={species.faq} name={species.commonName} />
        ) : null}

        <SpeciesSources sources={species.sources} />

        {guideLinks.length > 0 ? (
          <section className="border-t border-border bg-surface py-16 lg:py-20">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {t("guidesEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-tight">
                {t("guidesTitle")}
              </h2>
              <RelatedGuideGrid
                cards={guideLinks}
                locale={locale}
                className="mt-8 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2 lg:grid-cols-3"
              />
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="border-t border-border bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t("related")}
                  </p>
                  <AnchoredHeading
                    id={SPECIES_SECTION_IDS.related}
                    className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]"
                    anchorLabel={t("anchorLink")}
                  >
                    {t("relatedTitle")}
                  </AnchoredHeading>
                </div>
                <Link
                  href="/species"
                  className="hidden items-center gap-1.5 text-[13px] font-medium text-primary sm:inline-flex"
                >
                  {t("allSpecies")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => {
                  const cover =
                    item.mobileImage && !isPlaceholderMedia(item.mobileImage)
                      ? item.mobileImage
                      : !isPlaceholderMedia(item.image)
                        ? item.image
                        : null;
                  return (
                    <Link
                      key={item.id}
                      href={speciesHref(item.id, locale)}
                      className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-ink"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={speciesImageAlt(
                            item.commonName,
                            item.scientificName,
                            item.location,
                          )}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.1),transparent_65%),linear-gradient(165deg,#24201c,#12100e)]"
                          aria-hidden="true"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[12px] italic text-white/50">
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
