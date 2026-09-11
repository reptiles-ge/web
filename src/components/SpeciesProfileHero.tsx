import { MapPin, Shield } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { PictureSource } from "@/data/optimizedImages";
import type { DangerLevel, Species } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

import { SpeciesScientificNameCopy } from "@/components/SpeciesScientificNameCopy";
import { SpeciesVoicePlayer } from "@/components/SpeciesVoicePlayer";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";
import {
  speciesShareStatusKind,
  speciesShareText,
  speciesShareUrl,
} from "@/lib/speciesShareText";

type SpeciesProfileHeroProps = {
  desktopHeroSrc: null | string;
  group: AnimalGroup;
  heroDesktopSources: PictureSource[];
  heroPrimarySources: PictureSource[];
  imageAlt: string;
  mobileHeroSrc: null | string;
  mobileImageAlt: string;
  species: Species;
};

export async function SpeciesProfileHero({
  desktopHeroSrc,
  group,
  heroDesktopSources,
  heroPrimarySources,
  imageAlt,
  mobileHeroSrc,
  mobileImageAlt,
  species,
}: SpeciesProfileHeroProps) {
  const [locale, t, tCard, tDanger] = await Promise.all([
    getLocale() as Promise<AppLocale>,
    getTranslations("profile"),
    getTranslations("card"),
    getTranslations("danger"),
  ]);
  const riskChip = getSpeciesRiskChip(species, group);
  const shareStatusKind = speciesShareStatusKind(
    species.id,
    group,
    species.danger,
  );
  const shareStatus =
    shareStatusKind === "venomous"
      ? t("copyShareVenomous")
      : shareStatusKind === "harmless"
        ? t("copyShareHarmless")
        : shareStatusKind === "rearFanged"
          ? t("copyShareRearFanged")
          : null;
  const shareText = speciesShareText({
    commonName: species.commonName,
    detailsLabel: t("copyShareDetails"),
    scientificName: species.scientificName,
    status: shareStatus,
    url: speciesShareUrl(locale, species.id),
  });
  const dangerLabel = tCard("dangerLevel");
  const dangerValue = riskChip ? tDanger(riskChip.level) : "";
  const dangerAria =
    riskChip && dangerValue
      ? tDanger("linkAria", { label: dangerLabel, value: dangerValue })
      : "";

  return (
    <section
      className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[75svh] lg:pb-16"
      style={{
        paddingTop: "7rem",
      }}
    >
      <SpeciesProfileHeroMedia
        desktopHeroSrc={desktopHeroSrc}
        heroDesktopSources={heroDesktopSources}
        heroPrimarySources={heroPrimarySources}
        imageAlt={imageAlt}
        mobileHeroSrc={mobileHeroSrc}
        mobileImageAlt={mobileImageAlt}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/25 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <h1 className="text-balance-tight max-w-4xl font-display text-display-hero font-semibold text-white">
          {species.commonName}
        </h1>
        <p className="group/sci mt-3 flex items-center gap-0.5 font-display text-[15px] tracking-wide text-white/55 sm:text-[17px]">
          <span className="italic">{species.scientificName}</span>
          <SpeciesScientificNameCopy
            speciesId={species.id}
            text={shareText}
          />
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-[13px] text-white/60 backdrop-blur-md sm:px-3.5">
            <MapPin aria-hidden="true" className="size-3.5 text-white/45" />
            {species.location}
          </span>
          {species.audio ? (
            <SpeciesVoicePlayer audio={species.audio} speciesId={species.id} />
          ) : null}
          {riskChip && dangerValue ? (
            <SpeciesHeroRiskChip
              ariaLabel={dangerAria}
              label={dangerLabel}
              level={riskChip.level}
              linked={usesDangerScale(group)}
              value={dangerValue}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SpeciesHeroRiskChip({
  ariaLabel,
  label,
  level,
  linked,
  value,
}: {
  ariaLabel: string;
  label: string;
  level: DangerLevel;
  linked: boolean;
  value: string;
}) {
  const tone =
    level === "High"
      ? { dot: "bg-destructive", valueHero: "text-[#f0a399]" }
      : level === "Moderate"
        ? { dot: "bg-gold", valueHero: "text-[#e0c078]" }
        : { dot: "bg-primary", valueHero: "text-[#8fceae]" };

  const chip = (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-2 backdrop-blur-md sm:gap-2.5 sm:px-3.5">
      <Shield aria-hidden="true" className="size-3.5 text-white/45" />
      <span className="hidden text-[11px] tracking-[0.14em] text-white/45 sm:inline">
        {label}
      </span>
      <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide",
          tone.valueHero,
        )}
      >
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", tone.dot)}
        />
        {value}
      </span>
    </span>
  );

  if (!linked) {
    return chip;
  }

  return (
    <Link
      aria-label={ariaLabel}
      className="inline-flex rounded-full outline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white/50"
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
    <picture className="media-placeholder absolute inset-0 block size-full">
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
        sizes="100vw"
        src={optimizedImgSrc(primarySrc, 800)}
        width={primary?.width}
      />
    </picture>
  );
}
