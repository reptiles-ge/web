"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import type { SpeciesListItem } from "@/data/speciesListItem";
import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { HabitatIcon } from "@/components/species-atlas/HabitatIcon";
import { atlasSpeciesImage } from "@/data/atlasFilters";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { Link } from "@/i18n/navigation";
import { trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";

type AtlasSpeciesItemProps = {
  index?: number;
  locale: AppLocale;
  species: SpeciesListItem;
};

const RISK_SOLID: Record<DangerLevel, string> = {
  Harmless: "bg-primary",
  High: "bg-destructive",
  Moderate: "bg-gold",
};

const RISK_SOFT: Record<DangerLevel, string> = {
  Harmless: "bg-primary/10 text-primary",
  High: "bg-destructive/10 text-destructive",
  Moderate: "bg-gold/12 text-gold",
};

export function AtlasSpeciesCard({
  index = 0,
  locale,
  species,
}: AtlasSpeciesItemProps) {
  const t = useTranslations("speciesAtlas");
  const item = useAtlasSpecies(species, locale);
  const ids = useLabelIds();

  return (
    <Link
      aria-labelledby={labelledBy(ids, Boolean(item.risk))}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-card shadow-[0_1px_2px_rgba(14,20,17,0.04),0_8px_22px_rgba(14,20,17,0.05)] transition-[transform,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none lg:rounded-[26px] lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_32px_rgba(14,20,17,0.05)] lg:hover:translate-y-[-3px] lg:hover:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_24px_52px_rgba(14,20,17,0.12)]"
      href={item.href}
      onClick={() =>
        trackSpeciesClick({
          group: item.group,
          position: index + 1,
          source: "atlas",
          species_id: species.id,
        })
      }
      prefetch={false}
    >
      <span className="relative block aspect-4/5 overflow-hidden bg-[#151c18]">
        <CoverImage
          alt={item.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 330px"
          src={item.image}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-[45%] bg-linear-to-t from-[rgba(14,20,17,0.6)] to-transparent lg:block"
        />
        <span className="absolute top-2 left-2 inline-flex h-[22px] items-center rounded-full bg-white/95 px-2 text-[11px] font-semibold whitespace-nowrap text-[#1a211c] lg:top-3 lg:left-3 lg:h-[26px] lg:px-2.5 lg:text-[11.5px] lg:font-medium">
          {item.groupLabel}
        </span>
        {item.risk ? (
          <span
            className={cn(
              "absolute bottom-2 left-2 inline-flex h-[22px] items-center gap-[5px] rounded-full px-2 text-[11px] font-semibold whitespace-nowrap text-white lg:bottom-3 lg:left-3 lg:h-[26px] lg:gap-1.5 lg:px-2.5 lg:text-[11.5px] lg:font-medium",
              RISK_SOLID[item.risk.level],
            )}
            id={ids.risk}
          >
            <span
              aria-hidden="true"
              className="size-[5px] rounded-full bg-white lg:size-1.5"
            />
            {item.risk.label}
          </span>
        ) : null}
        {item.isIllustration ? (
          <span className="absolute top-2 right-2 inline-flex h-[22px] items-center rounded-full bg-[rgba(14,20,17,0.6)] px-2 text-[11px] font-medium whitespace-nowrap text-white/85 lg:top-auto lg:right-3 lg:bottom-3 lg:h-[26px] lg:px-2.5 lg:text-[11.5px]">
            {t("illustration")}
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col px-3 pt-2.5 pb-3 lg:px-[18px] lg:pt-4 lg:pb-[18px]">
        <span
          className="font-display text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary lg:text-[19px]"
          id={ids.name}
        >
          {species.commonName}
        </span>
        <span
          className="mt-[3px] truncate text-[12px] text-muted-foreground italic lg:mt-1 lg:text-[13px]"
          id={ids.scientific}
        >
          {species.scientificName}
        </span>
        <span className="mt-1.5 truncate text-[12px] text-muted-foreground lg:hidden">
          {item.whereShort}
        </span>
        <span className="hidden flex-1 lg:block" />
        <span className="mt-3.5 hidden items-center gap-2.5 border-t border-secondary pt-3 lg:flex">
          <span className="flex gap-1">
            {item.habitats.map((habitat) => (
              <span
                className="flex size-7 items-center justify-center rounded-full bg-background text-primary"
                key={habitat.habitat}
                title={habitat.label}
              >
                <HabitatIcon
                  className="size-3.5"
                  habitat={habitat.habitat}
                  label={habitat.label}
                />
              </span>
            ))}
          </span>
          <span className="min-w-0 flex-1 truncate text-right text-[12.5px] text-muted-foreground">
            {item.where}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function AtlasSpeciesRow({
  index = 0,
  locale,
  species,
}: AtlasSpeciesItemProps) {
  const t = useTranslations("speciesAtlas");
  const item = useAtlasSpecies(species, locale);
  const ids = useLabelIds();

  return (
    <Link
      aria-labelledby={labelledBy(ids, Boolean(item.risk))}
      className="grid min-h-[72px] grid-cols-[56px_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1fr)_120px_minmax(0,1.2fr)_24px] items-center gap-4 rounded-2xl border-t border-secondary px-4 py-2 transition-colors hover:bg-background/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      href={item.href}
      onClick={() =>
        trackSpeciesClick({
          group: item.group,
          position: index + 1,
          source: "atlas",
          species_id: species.id,
        })
      }
      prefetch={false}
    >
      <span className="relative block size-14 overflow-hidden rounded-[14px] bg-[#151c18]">
        <CoverImage alt="" aria-hidden sizes="56px" src={item.image} />
      </span>
      <span className="min-w-0">
        <span
          className="block truncate text-[15.5px] font-semibold text-foreground"
          id={ids.name}
        >
          {species.commonName}
        </span>
        <span
          className="mt-0.5 block truncate text-[12.5px] text-muted-foreground italic"
          id={ids.scientific}
        >
          {species.scientificName}
        </span>
      </span>
      <span className="text-[13.5px] text-foreground/80">
        {t(`groupSingular.${item.group}`)}
      </span>
      <span>
        {item.risk ? (
          <span
            className={cn(
              "inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium",
              RISK_SOFT[item.risk.level],
            )}
            id={ids.risk}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                RISK_SOLID[item.risk.level],
              )}
            />
            {item.risk.label}
          </span>
        ) : (
          <span className="text-[13px] text-muted-foreground/70">—</span>
        )}
      </span>
      <span className="flex gap-1">
        {item.habitats.map((habitat) => (
          <span
            className="flex size-7 items-center justify-center rounded-full bg-background text-primary"
            key={habitat.habitat}
            title={habitat.label}
          >
            <HabitatIcon
              className="size-3.5"
              habitat={habitat.habitat}
              label={habitat.label}
            />
          </span>
        ))}
      </span>
      <span className="min-w-0 truncate text-[13px] text-muted-foreground">
        {item.where}
      </span>
      <ChevronRight aria-hidden="true" className="size-4 text-border" />
    </Link>
  );
}

function labelledBy(ids: ReturnType<typeof useLabelIds>, hasRisk: boolean) {
  return [ids.name, ids.scientific, ...(hasRisk ? [ids.risk] : [])].join(" ");
}

function useAtlasSpecies(species: SpeciesListItem, locale: AppLocale) {
  const t = useTranslations("speciesAtlas");
  const tDanger = useTranslations("danger");
  const meta = getSpeciesAtlasMeta(species.id);
  const regionNames = getRegionsForSpecies(species.id).map((region) =>
    localizeRegionText(region.name, locale),
  );
  const photo = atlasSpeciesImage(species);
  const risk = getSpeciesRiskChip(species, meta.group);
  const where =
    regionNames.length > 0
      ? `${regionNames.slice(0, 2).join(", ")}${
          regionNames.length > 2 ? ` +${regionNames.length - 2}` : ""
        }`
      : t("rangePending");
  const whereShort =
    regionNames.length > 0
      ? t("whereShort", {
          count: regionNames.length,
          first: regionNames[0] ?? "",
        })
      : t("rangePending");

  return {
    alt: speciesImageAlt(
      species.commonName,
      species.scientificName,
      species.location,
    ),
    group: meta.group,
    groupLabel: t(`groupSingular.${meta.group}`),
    habitats: meta.habitats.map((habitat) => ({
      habitat,
      label: t(`habitats.${habitat}`),
    })),
    href: useSpeciesHref(species.id, locale),
    image: photo || GROUP_HUB_ILLUSTRATIONS[ANIMAL_GROUP_TO_HUB[meta.group]],
    isIllustration: !photo,
    risk: risk ? { label: tDanger(risk.level), level: risk.level } : null,
    where,
    whereShort,
  };
}

function useLabelIds() {
  const id = useId();
  return {
    name: `${id}-name`,
    risk: `${id}-risk`,
    scientific: `${id}-scientific`,
  };
}
