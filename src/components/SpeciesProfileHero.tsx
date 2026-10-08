import { Camera, ChevronLeft, MapPin, Maximize2, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { PictureSource } from "@/data/optimizedImages";
import type { DangerLevel, Species } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
import type { SpeciesBreadcrumbCrumb } from "@/lib/speciesBreadcrumbs";

import { SpeciesScientificNameCopy } from "@/components/SpeciesScientificNameCopy";
import { SpeciesVoicePlayer } from "@/components/SpeciesVoicePlayer";
import { getRegionsForSpecies } from "@/data/mapRegions";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { cn } from "@/lib/cn";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { dangerPageHref } from "@/lib/dangerLevels";
import { getSpeciesParentHub } from "@/lib/speciesBreadcrumbs";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileHeroProps = {
  breadcrumbs: SpeciesBreadcrumbCrumb[];
  desktopHeroSrc: null | string;
  emergency: boolean;
  galleryCount: number;
  galleryPreview: string[];
  gallerySrc: null | string;
  group: AnimalGroup;
  heroDesktopSources: PictureSource[];
  heroPrimarySources: PictureSource[];
  imageAlt: string;
  locale: AppLocale;
  mobileHeroSrc: null | string;
  mobileImageAlt: string;
  shareText: string;
  species: Species;
};

const heroChipLinkClassName =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 text-[13.5px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60";
const heroTopChipClassName =
  "inline-flex h-11 items-center gap-1.5 rounded-full bg-ink/50 text-[13.5px] font-medium text-white backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70";

const SHORT_NAME_LENGTH = 10;
const MEDIUM_NAME_LENGTH = 18;

export async function SpeciesProfileHero({
  breadcrumbs,
  desktopHeroSrc,
  emergency,
  galleryCount,
  galleryPreview,
  gallerySrc,
  group,
  heroDesktopSources,
  heroPrimarySources,
  imageAlt,
  locale,
  mobileHeroSrc,
  mobileImageAlt,
  shareText,
  species,
}: SpeciesProfileHeroProps) {
  const [t, tCard, tDanger, tNav, tSafety] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "card" }),
    getTranslations({ locale, namespace: "danger" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "home.safetyStrip" }),
  ]);
  const riskChip = getSpeciesRiskChip(species, group);
  const dangerLabel = tCard("dangerLevel");
  const dangerValue = riskChip ? tDanger(riskChip.level) : "";
  const editable = locale === "ka" && isLocalAdminEnabled();
  const regionCount = getRegionsForSpecies(species.id).length;
  const parent = getSpeciesParentHub(species);

  return (
    <section className="relative h-[440px] w-full overflow-hidden bg-ink text-white lg:h-[660px]">
      <div className="absolute inset-0 lg:left-auto lg:w-[62%]">
        <SpeciesProfileHeroMedia
          desktopHeroSrc={desktopHeroSrc}
          heroDesktopSources={heroDesktopSources}
          heroPrimarySources={heroPrimarySources}
          imageAlt={imageAlt}
          mobileHeroSrc={mobileHeroSrc}
          mobileImageAlt={mobileImageAlt}
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-ink/80 to-transparent lg:h-[190px]" />
      <div className="absolute inset-x-0 bottom-0 h-[260px] bg-linear-to-t from-ink via-ink/70 to-transparent lg:h-[240px] lg:from-ink/95 lg:via-ink/40" />
      <div className="absolute inset-y-0 left-[38%] hidden w-[30%] bg-linear-to-r from-ink via-ink/85 to-transparent lg:block" />

      <div className="absolute inset-x-6 top-[88px] z-10 flex items-center justify-between lg:hidden">
        <Link
          className={cn(heroTopChipClassName, "pr-3.5 pl-2")}
          href={parent.href}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          {tNav(parent.hubId)}
        </Link>
        {gallerySrc ? (
          <a
            aria-label={t("viewPhotos", { count: galleryCount })}
            className={cn(heroTopChipClassName, "px-3.5 tabular-nums")}
            data-species-gallery-src={gallerySrc}
            href={`#${SPECIES_SECTION_IDS.gallery}`}
          >
            <Camera aria-hidden="true" className="size-[15px]" />
            {galleryCount}
          </a>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-[38px] lg:justify-center lg:px-[60px] lg:pt-12 lg:pb-[86px]">
        <div className="lg:max-w-[600px]">
          <SpeciesBreadcrumbTrail
            ariaLabel={t("breadcrumbAria")}
            breadcrumbs={breadcrumbs}
          />
          {riskChip && dangerValue ? (
            <SpeciesHeroRiskChip
              ariaLabel={tDanger("linkAria", {
                label: dangerLabel,
                value: dangerValue,
              })}
              level={riskChip.level}
              linked={usesDangerScale(group)}
              value={dangerValue}
            />
          ) : null}
          <h1
            className={cn(
              "text-balance-tight mt-2 font-display font-bold tracking-[-0.015em] text-white lg:mt-3.5",
              titleSizeClass(species.commonName),
            )}
            {...contentEditorAttributes(
              "species",
              editable ? species.id : undefined,
              "commonName",
            )}
          >
            {species.commonName}
          </h1>
          <p className="group/sci mt-1 flex min-h-11 items-center gap-1 font-display text-[16px] text-white/85 lg:mt-2 lg:text-[20px]">
            <span className="italic">{species.scientificName}</span>
            <SpeciesScientificNameCopy
              speciesId={species.id}
              text={shareText}
            />
          </p>
          <p className="mt-3 hidden max-w-[520px] text-[17px] leading-[1.6] text-white/75 lg:block">
            {species.description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 lg:mt-6 lg:gap-2.5">
            {emergency ? (
              <a
                aria-label={tSafety("call")}
                className="hidden h-[52px] items-center gap-2.5 rounded-full bg-destructive pr-6 pl-5 text-[16px] font-bold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
                href="tel:112"
              >
                <Phone aria-hidden="true" className="size-4" strokeWidth={2} />
                112
                <span className="text-[14.5px] font-medium text-white/85">
                  {t("emergencyShort")}
                </span>
              </a>
            ) : null}
            {species.audio ? (
              <SpeciesVoicePlayer
                audio={species.audio}
                speciesId={species.id}
              />
            ) : null}
            {regionCount > 0 ? (
              <a
                className={cn(heroChipLinkClassName, "hidden lg:inline-flex")}
                href={`#${SPECIES_SECTION_IDS.range}`}
              >
                <MapPin aria-hidden="true" className="size-3.5 text-white/55" />
                {t("regionCount", { count: regionCount })}
              </a>
            ) : null}
            <SpeciesHeroGalleryButton
              gallerySrc={gallerySrc}
              label={t("viewPhotos", { count: galleryCount })}
              preview={galleryPreview}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SpeciesBreadcrumbTrail({
  ariaLabel,
  breadcrumbs,
}: {
  ariaLabel: string;
  breadcrumbs: SpeciesBreadcrumbCrumb[];
}) {
  return (
    <nav aria-label={ariaLabel} className="sr-only lg:not-sr-only lg:mb-7">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-white/60">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              className="inline-flex items-center gap-2.5"
              key={crumb.href ? `${crumb.href}:${crumb.name}` : crumb.name}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-white/35">
                  /
                </span>
              ) : null}
              {crumb.href && !isLast ? (
                <Link
                  className="text-white/80 transition-colors hover:text-white"
                  href={crumb.href}
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-white" : undefined}
                >
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SpeciesHeroGalleryButton({
  gallerySrc,
  label,
  preview,
}: {
  gallerySrc: null | string;
  label: string;
  preview: string[];
}) {
  if (!gallerySrc) return null;

  return (
    <a
      className="group/gallery hidden min-h-11 items-center gap-3 rounded-full border border-white/25 bg-white/12 py-1.5 pr-4 pl-1.5 text-[13.5px] font-medium text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 lg:inline-flex"
      data-species-gallery-src={gallerySrc}
      href={`#${SPECIES_SECTION_IDS.gallery}`}
    >
      <span aria-hidden="true" className="flex items-center">
        {preview.map((src, index) => (
          <span
            className={cn(
              "relative size-8 overflow-hidden rounded-full bg-ink ring-2 ring-white/80 transition-[margin] duration-300 ease-out",
              index > 0 && "-ml-3 group-hover/gallery:-ml-1.5",
            )}
            key={src}
          >
            <picture>
              {pictureSources(src, { sizes: "32px" }).map((source) => (
                <source key={source.key} {...source.props} />
              ))}
              <img
                alt=""
                className="size-full object-cover"
                decoding="async"
                fetchPriority="low"
                loading="lazy"
                sizes="32px"
                src={optimizedImgSrc(src, 400)}
              />
            </picture>
          </span>
        ))}
      </span>
      <span>{label}</span>
      <Maximize2 aria-hidden="true" className="size-3.5 text-white/70" />
    </a>
  );
}

function SpeciesHeroRiskChip({
  ariaLabel,
  level,
  linked,
  value,
}: {
  ariaLabel: string;
  level: DangerLevel;
  linked: boolean;
  value: string;
}) {
  const chip = (
    <span
      className={cn(
        "inline-flex h-[30px] items-center gap-2 rounded-full pr-[13px] pl-[11px] text-[12.5px] font-semibold text-white lg:h-8 lg:text-[13px]",
        level === "High"
          ? "bg-destructive"
          : level === "Moderate"
            ? "bg-gold"
            : "bg-primary dark:text-ink",
      )}
    >
      <span aria-hidden="true" className="size-[7px] rounded-full bg-current" />
      {value}
    </span>
  );

  if (!linked) {
    return chip;
  }

  return (
    <Link
      aria-label={ariaLabel}
      className="inline-flex rounded-full outline-offset-4 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-white/60"
      href={dangerPageHref(level)}
    >
      {chip}
    </Link>
  );
}

function SpeciesProfileHeroMedia({
  desktopHeroSrc,
  heroDesktopSources,
  heroPrimarySources,
  imageAlt,
  mobileHeroSrc,
  mobileImageAlt,
}: {
  desktopHeroSrc: null | string;
  heroDesktopSources: PictureSource[];
  heroPrimarySources: PictureSource[];
  imageAlt: string;
  mobileHeroSrc: null | string;
  mobileImageAlt: string;
}) {
  if (!desktopHeroSrc) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,rgba(255,255,255,0.12),transparent_60%),linear-gradient(160deg,#1c1916_0%,#0f0e0c_55%,#171411_100%)]"
      />
    );
  }

  const primarySrc = mobileHeroSrc ?? desktopHeroSrc;
  const primary = optimizedEntry(primarySrc);

  return (
    <picture className="absolute inset-0 block size-full bg-ink">
      {mobileHeroSrc ? (
        <>
          {heroDesktopSources.map((source) => (
            <source key={source.key} {...source.props} />
          ))}
          <source
            media="(min-width: 1024px)"
            srcSet={optimizedImgSrc(desktopHeroSrc, 1200)}
          />
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
        height={primary?.height}
        loading="eager"
        sizes="(max-width: 1023px) 100vw, 62vw"
        src={optimizedImgSrc(primarySrc, 800)}
        width={primary?.width}
      />
    </picture>
  );
}

function titleSizeClass(name: string) {
  if (name.length <= SHORT_NAME_LENGTH) {
    return "text-[50px] leading-[1.04] lg:text-[92px] lg:leading-none";
  }
  if (name.length <= MEDIUM_NAME_LENGTH) {
    return "text-[38px] leading-[1.08] lg:text-[68px] lg:leading-[1.02]";
  }
  return "text-[30px] leading-[1.12] lg:text-[52px] lg:leading-[1.06]";
}
