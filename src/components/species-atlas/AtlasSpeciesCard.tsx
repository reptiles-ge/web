"use client";

import { SpeciesDanger } from "@/components/SpeciesDanger";
import {
  getSpeciesAtlasMeta,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import {
  getRegionsForSpecies,
  localizeRegionText,
} from "@/data/regions";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type AtlasSpeciesCardProps = {
  species: Species;
  locale: AppLocale;
  index?: number;
  eager?: boolean;
};

export function AtlasSpeciesCard({
  species,
  locale,
  index = 0,
  eager = false,
}: AtlasSpeciesCardProps) {
  const t = useTranslations("speciesAtlas");
  const meta = getSpeciesAtlasMeta(species.id);
  const regionNames = getRegionsForSpecies(species.id)
    .map((region) => localizeRegionText(region.name, locale))
    .slice(0, 3);
  const extraRegions = Math.max(
    0,
    getRegionsForSpecies(species.id).length - regionNames.length,
  );
  const imageSrc =
    species.mobileImage && !species.mobileImage.includes("species-placeholder")
      ? species.mobileImage
      : species.image && !species.image.includes("species-placeholder")
        ? species.image
        : "";

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-card ring-1 ring-border/70 transition-shadow duration-500 hover:shadow-[0_28px_60px_-40px_rgba(14,20,17,0.55)]"
      style={{
        animationDelay: `${Math.min(index, 12) * 40}ms`,
      }}
    >
      <Link
        href={`/species/${species.id}`}
        className="absolute inset-0 z-10"
        aria-label={t("exploreSpeciesNamed", { name: species.commonName })}
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-ink sm:aspect-[5/6]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={speciesImageAlt(
              species.commonName,
              species.scientificName,
              species.location,
            )}
            fill
            priority={eager}
            loading={eager ? "eager" : "lazy"}
            quality={78}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.1),transparent_65%),linear-gradient(165deg,#24201c,#12100e)]"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
        <div className="absolute left-4 top-4 z-[1] flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
            {t(`groups.${meta.group as AnimalGroup}`)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-[1]">
          <SpeciesDanger level={species.danger} variant="hero" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        <h3 className="font-display text-[1.35rem] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-[1.5rem]">
          {species.commonName}
        </h3>
        <p className="mt-1.5 text-[13px] italic tracking-wide text-muted-foreground">
          {species.scientificName}
        </p>
        <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
          {species.description}
        </p>

        {regionNames.length > 0 ? (
          <div className="mt-4 border-t border-border/70 pt-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("foundIn")}
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-foreground/80">
              {`${regionNames.join(", ")}${
                extraRegions > 0 ? ` +${extraRegions}` : ""
              }`}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
            {t("exploreSpecies")}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
