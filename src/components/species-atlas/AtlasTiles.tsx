"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { CoverImage } from "@/components/CoverImage";
import { GROUP_OPTIONS } from "@/components/species-atlas/atlasOptions";
import { type AtlasFilters } from "@/data/atlasFilters";
import { type AnimalGroup } from "@/data/speciesAtlasMeta";
import { cn } from "@/lib/cn";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";

type AtlasTilesProps = {
  filters: AtlasFilters;
  groupTotals: Record<"all" | AnimalGroup, number>;
  onPickAll: () => void;
  onPickGroup: (group: AnimalGroup) => void;
  onPickRegion: () => void;
  onPickVenomous: () => void;
  regionCount: number;
  venomousCount: number;
  venomousImage: string;
};

const TILE_CLASS_NAME =
  "group relative flex h-28 w-[132px] shrink-0 flex-col justify-end overflow-hidden rounded-[20px] p-3 text-left text-white transition-[transform,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary lg:h-[132px] lg:w-auto lg:rounded-[22px] lg:px-4 lg:py-3.5 lg:hover:-translate-y-[3px] lg:hover:shadow-[0_18px_36px_rgba(14,20,17,0.22)] motion-reduce:transition-none";

export function AtlasTiles({
  filters,
  groupTotals,
  onPickAll,
  onPickGroup,
  onPickRegion,
  onPickVenomous,
  regionCount,
  venomousCount,
  venomousImage,
}: AtlasTilesProps) {
  const t = useTranslations("speciesAtlas");
  const groups = GROUP_OPTIONS.filter(
    (group): group is AnimalGroup => group !== "all" && groupTotals[group] > 0,
  );
  const allActive =
    filters.group === "all" &&
    filters.danger === "all" &&
    filters.habitat === "all" &&
    filters.region === "all" &&
    !filters.query.trim();

  return (
    <div className="no-scrollbar -mx-5 mt-5 flex gap-2.5 overflow-x-auto px-5 py-1 lg:mx-0 lg:mt-9 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:px-0 lg:pt-0">
      <button
        aria-pressed={allActive}
        className={cn(TILE_CLASS_NAME, "bg-primary max-lg:hidden")}
        onClick={onPickAll}
        type="button"
      >
        <TileImage
          opacityClassName="opacity-35"
          src={GROUP_HUB_ILLUSTRATIONS.snakes}
        />
        <TileLabel count={groupTotals.all} label={t("filters.allSpecies")} />
      </button>

      {groups.map((group) => {
        const active = filters.group === group;
        return (
          <button
            aria-pressed={active}
            className={cn(
              TILE_CLASS_NAME,
              "bg-[#151c18]",
              active && "ring-3 ring-primary",
            )}
            key={group}
            onClick={() => onPickGroup(group)}
            type="button"
          >
            <TileImage
              opacityClassName="opacity-75 lg:opacity-[0.72] lg:group-hover:opacity-85"
              src={GROUP_HUB_ILLUSTRATIONS[ANIMAL_GROUP_TO_HUB[group]]}
            />
            <TileLabel
              count={groupTotals[group]}
              label={t(`groups.${group}`)}
            />
          </button>
        );
      })}

      <button
        aria-pressed={filters.danger === "venomous"}
        className={cn(
          TILE_CLASS_NAME,
          "bg-[#7d2f25]",
          filters.danger === "venomous" && "ring-3 ring-destructive",
        )}
        onClick={onPickVenomous}
        type="button"
      >
        <TileImage opacityClassName="opacity-45" src={venomousImage} />
        <TileLabel count={venomousCount} label={t("danger.venomous")} />
      </button>

      <button
        aria-haspopup="listbox"
        className={cn(
          TILE_CLASS_NAME,
          "bg-surface text-foreground max-lg:hidden",
        )}
        onClick={onPickRegion}
        type="button"
      >
        <MapPin
          aria-hidden="true"
          className="absolute top-3.5 right-4 size-12 text-primary/25"
          strokeWidth={1.5}
        />
        <TileLabel count={regionCount} label={t("filters.region")} plain />
      </button>
    </div>
  );
}

function TileImage({
  opacityClassName,
  src,
}: {
  opacityClassName: string;
  src: string;
}) {
  return (
    <>
      <CoverImage
        alt=""
        aria-hidden
        className={cn(
          "object-cover transition-[transform,opacity] duration-500 motion-reduce:transition-none lg:group-hover:scale-[1.06]",
          opacityClassName,
        )}
        sizes="(max-width: 1023px) 132px, 220px"
        src={src}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-4/5 bg-linear-to-t from-[rgba(14,20,17,0.88)] to-transparent"
      />
    </>
  );
}

function TileLabel({
  count,
  label,
  plain = false,
}: {
  count: number;
  label: string;
  plain?: boolean;
}) {
  return (
    <span className="relative flex flex-col-reverse lg:flex-row lg:items-baseline lg:justify-between lg:gap-2">
      <span
        className={cn(
          "mt-1 block text-[13.5px] leading-[1.2] font-semibold lg:mt-0 lg:text-[16px]",
          plain && "text-foreground",
        )}
      >
        {label}
      </span>
      <span className="block text-[20px] leading-none font-semibold tabular-nums lg:text-[22px]">
        {count}
      </span>
    </span>
  );
}
