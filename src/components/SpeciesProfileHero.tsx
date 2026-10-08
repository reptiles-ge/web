import { ChevronLeft, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { PictureSource } from "@/data/optimizedImages";
import type { DangerLevel, GalleryImage, Species } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
import type { SpeciesBreadcrumbCrumb } from "@/lib/speciesBreadcrumbs";

import { SpeciesHeroActions } from "@/components/SpeciesHeroActions";
import {
  type MobileHeroSlide,
  SpeciesMobileHeroCarousel,
} from "@/components/SpeciesMobileHeroCarousel";
import { SpeciesScientificNameCopy } from "@/components/SpeciesScientificNameCopy";
import { SpeciesVoicePlayer } from "@/components/SpeciesVoicePlayer";
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
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileHeroProps = {
  breadcrumbs: SpeciesBreadcrumbCrumb[];
  desktopHeroSrc: null | string;
  emergency: boolean;
  galleryCount: number;
  galleryPreview: string[];
  group: AnimalGroup;
  heroDesktopSources: PictureSource[];
  heroPrimarySources: PictureSource[];
  imageAlt: string;
  locale: AppLocale;
  mobileGallery: GalleryImage[];
  mobileHeroSrc: null | string;
  mobileImageAlt: string;
  shareText: string;
  species: Species;
};

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
  group,
  heroDesktopSources,
  heroPrimarySources,
  imageAlt,
  locale,
  mobileGallery,
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
  const parent = getSpeciesParentHub(species);
  const mobileSlides: MobileHeroSlide[] = mobileGallery.map((photo, index) => ({
    alt:
      index === 0
        ? mobileImageAlt
        : speciesPhotoAlt(
            species.commonName,
            species.scientificName,
            species.location,
            photo.credit,
          ),
    displaySrc: index === 0 ? (mobileHeroSrc ?? photo.src) : photo.src,
    gallerySrc: optimizedImgSrc(photo.src, 1200),
  }));

  return (
    <section className="relative h-[440px] w-full overflow-hidden bg-ink text-white lg:h-[660px]">
      <div
        className={cn(
          "absolute inset-0 lg:left-auto lg:w-[62%]",
          mobileSlides.length > 0 && "hidden lg:block",
        )}
      >
        <SpeciesProfileHeroMedia
          desktopHeroSrc={desktopHeroSrc}
          heroDesktopSources={heroDesktopSources}
          heroPrimarySources={heroPrimarySources}
          imageAlt={imageAlt}
          mobileHeroSrc={mobileHeroSrc}
          mobileImageAlt={mobileImageAlt}
        />
      </div>
      {mobileSlides.length > 0 ? (
        <SpeciesMobileHeroCarousel
          label={t("gallery")}
          slides={mobileSlides}
          speciesId={species.id}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-ink/80 to-transparent lg:h-[190px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] bg-linear-to-t from-ink via-ink/70 to-transparent lg:h-[240px] lg:from-ink/95 lg:via-ink/40" />
      <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-[30%] bg-linear-to-r from-ink via-ink/85 to-transparent lg:block" />

      <div className="absolute inset-x-6 top-[88px] z-10 flex items-center justify-between lg:hidden">
        <Link
          className={cn(heroTopChipClassName, "pr-3.5 pl-2")}
          href={parent.href}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          {tNav(parent.hubId)}
        </Link>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-[38px] lg:pointer-events-auto lg:justify-center lg:px-[60px] lg:pt-12 lg:pb-[86px]">
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
              editable && "pointer-events-auto",
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
            <span className="pointer-events-auto">
              <SpeciesScientificNameCopy
                speciesId={species.id}
                text={shareText}
              />
            </span>
          </p>
          <p className="mt-3 hidden max-w-[520px] text-[17px] leading-[1.6] text-white/75 lg:block">
            {species.description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 lg:mt-6 lg:gap-2.5">
            {emergency ? (
              <a
                aria-label={tSafety("call")}
                className="hidden h-[52px] items-center gap-2.5 rounded-full bg-destructive pr-6 pl-5 text-[16px] font-bold text-white transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
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
            <div className="hidden items-center gap-2.5 lg:flex">
              <SpeciesHeroActions
                name={species.commonName}
                speciesId={species.id}
              />
            </div>
          </div>
        </div>
      </div>
      {galleryPreview.length > 0 ? (
        <div className="absolute inset-x-0 bottom-[118px] z-10 hidden lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-2 px-[60px]">
            {species.imageCredit?.photographer ? (
              <span className="mr-1 hidden rounded-full bg-ink/65 px-3 py-1.5 text-xs text-white/85 backdrop-blur-sm xl:inline-flex">
                {t("photoCredit")} {species.imageCredit.photographer}
              </span>
            ) : null}
            {galleryPreview.map((src, index) => (
              <a
                aria-label={t("galleryOpenPhoto", {
                  index: index + 1,
                  total: galleryCount,
                })}
                className={cn(
                  "relative block h-14 w-[76px] overflow-hidden rounded-[14px] bg-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  index === 0 && "ring-2 ring-white",
                )}
                data-species-gallery-src={optimizedImgSrc(src, 1200)}
                href={`#${SPECIES_SECTION_IDS.gallery}`}
                key={src}
              >
                <picture>
                  {pictureSources(src, { sizes: "76px" }).map((source) => (
                    <source key={source.key} {...source.props} />
                  ))}
                  <img
                    alt=""
                    className="size-full object-cover"
                    decoding="async"
                    loading="lazy"
                    sizes="76px"
                    src={optimizedImgSrc(src, 200)}
                  />
                </picture>
                {index === galleryPreview.length - 1 &&
                galleryCount > galleryPreview.length ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-white">
                    +{galleryCount - galleryPreview.length}
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      ) : null}
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
    <nav aria-label={ariaLabel} className="sr-only">
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
      className="pointer-events-auto inline-flex rounded-full outline-offset-4 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-white/60"
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
