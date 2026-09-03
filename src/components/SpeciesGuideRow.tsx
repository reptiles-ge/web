"use client";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { getRegionsForSpecies, localizeRegionText } from "@/data/regions";
import type { Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { trackSpeciesClick, type SpeciesClickSource } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function SpeciesGuideRow({
  species,
  locale,
  index,
  source = "hub",
}: {
  species: Species;
  locale: AppLocale;
  index: number;
  source?: SpeciesClickSource;
}) {
  const tShared = useTranslations("groupHubShared");
  const tDanger = useTranslations("danger");
  const regions = getRegionsForSpecies(species.id)
    .map((region) => localizeRegionText(region.name, locale))
    .slice(0, 3);
  const extra = Math.max(
    0,
    getRegionsForSpecies(species.id).length - regions.length,
  );
  const group = getSpeciesAtlasMeta(species.id).group;
  const riskChip = getSpeciesRiskChip(species, group);
  const tone =
    riskChip?.kind === "danger" && riskChip.level === "High"
      ? { dot: "bg-destructive", text: "text-destructive" }
      : riskChip?.kind === "danger" && riskChip.level === "Moderate"
        ? { dot: "bg-gold", text: "text-gold" }
        : { dot: "bg-primary", text: "text-primary" };
  const riskLabel = riskChip ? tDanger(riskChip.level) : null;
  const turtleType =
    group === "turtle"
      ? species.id === "testudo-graeca"
        ? tShared("turtleTypeLand")
        : tShared("turtleTypeWater")
      : null;
  const turtleStatus =
    group === "turtle"
      ? species.id === "trachemys-scripta"
        ? tShared("turtleStatusIntroduced")
        : tShared("turtleStatusNative")
      : null;
  const profileCta =
    group === "turtle"
      ? tShared("openProfileNamed", { name: species.commonName })
      : tShared("openProfile");

  return (
    <Link
      href={speciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({
          species_id: species.id,
          source,
          position: index + 1,
        })
      }
      className="group grid gap-5 py-7 transition-colors sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:gap-8 sm:py-8 lg:grid-cols-[9rem_1fr_auto] lg:gap-10"
    >
      <div className="relative aspect-5/4 overflow-hidden rounded-2xl bg-ink sm:aspect-square sm:rounded-[22px]">
        <CoverImage
          src={species.mobileImage ?? species.image}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          sizes="(max-width: 640px) 100vw, 144px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          {turtleType ? (
            <span className="text-[12px] font-medium text-foreground/75">
              {turtleType}
            </span>
          ) : null}
          {turtleStatus ? (
            <span className="text-[12px] font-medium text-foreground/75">
              {turtleStatus}
            </span>
          ) : null}
          {riskLabel ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[12px] font-medium",
                tone.text,
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", tone.dot)}
                aria-hidden="true"
              />
              {riskLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
          {species.commonName}
        </h3>
        <p className="mt-1 text-[13px] tracking-wide text-muted-foreground italic">
          {species.scientificName}
        </p>
        <p className="mt-3 line-clamp-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          {species.description}
        </p>
        {regions.length > 0 ? (
          <p className="mt-3 text-[12px] text-muted-foreground">
            {`${regions.join(" · ")}${extra > 0 ? ` +${extra}` : ""}`}
          </p>
        ) : null}
      </div>

      <span className="inline-flex max-w-48 items-center gap-1.5 self-start text-[13px] font-medium text-foreground/70 transition-colors group-hover:text-primary sm:self-center sm:text-right">
        {profileCta}
        <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function SpeciesGuideList({
  species,
  locale,
  source = "hub",
}: {
  species: Species[];
  locale: AppLocale;
  source?: SpeciesClickSource;
}) {
  return (
    <div className="mt-12 divide-y divide-border border-y border-border">
      {species.map((item, index) => (
        <Reveal key={item.id} delay={Math.min(index * 40, 320)}>
          <SpeciesGuideRow
            species={item}
            locale={locale}
            index={index}
            source={source}
          />
        </Reveal>
      ))}
    </div>
  );
}
