import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { PictureSource } from "@/data/optimizedImages";
import type { PhotoCredit, Species } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import type { SpeciesBreadcrumbCrumb } from "@/lib/speciesBreadcrumbs";

import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { SpeciesRiskChip } from "@/components/SpeciesDanger";
import { SpeciesVoicePlayer } from "@/components/SpeciesVoicePlayer";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { usesDangerScale } from "@/lib/speciesRisk";

type SpeciesProfileHeroProps = {
  breadcrumbs: SpeciesBreadcrumbCrumb[];
  desktopHeroSrc: null | string;
  group: AnimalGroup;
  heroCredit?: PhotoCredit;
  heroDesktopSources: PictureSource[];
  heroPrimarySources: PictureSource[];
  imageAlt: string;
  mobileHeroCredit?: PhotoCredit;
  mobileHeroSrc: null | string;
  mobileImageAlt: string;
  species: Species;
};

export async function SpeciesProfileHero({
  breadcrumbs,
  desktopHeroSrc,
  group,
  heroCredit,
  heroDesktopSources,
  heroPrimarySources,
  imageAlt,
  mobileHeroCredit,
  mobileHeroSrc,
  mobileImageAlt,
  species,
}: SpeciesProfileHeroProps) {
  const t = await getTranslations("profile");

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
            {breadcrumbs.map((crumb, index) => (
              <SpeciesProfileCrumb
                crumb={crumb}
                index={index}
                isLast={index === breadcrumbs.length - 1}
                key={crumb.href ? `${crumb.href}:${crumb.name}` : crumb.name}
              />
            ))}
          </ol>
        </nav>
        <h1 className="text-balance-tight max-w-4xl font-display text-display-hero font-semibold text-white">
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
            <SpeciesVoicePlayer audio={species.audio} speciesId={species.id} />
          ) : null}
          {usesDangerScale(group) ? (
            <SpeciesRiskChip linked species={species} variant="hero" />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SpeciesProfileCrumb({
  crumb,
  index,
  isLast,
}: {
  crumb: SpeciesBreadcrumbCrumb;
  index: number;
  isLast: boolean;
}) {
  return (
    <li className="inline-flex items-center gap-2">
      {index > 0 ? (
        <span aria-hidden="true" className="text-white/30">
          /
        </span>
      ) : null}
      {crumb.href && !isLast ? (
        <Link className="transition-colors hover:text-white" href={crumb.href}>
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
        src={optimizedImgSrc(primarySrc, 800)}
        width={primary?.width}
      />
    </picture>
  );
}
