"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { CoverImage } from "@/components/CoverImage";
import { GROUP_OPTIONS } from "@/components/species-atlas/atlasOptions";
import { type AtlasFilters } from "@/data/atlasFilters";
import { type AnimalGroup } from "@/data/speciesAtlasMeta";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import {
  ANIMAL_GROUP_TO_HUB,
  GROUP_HUB_ILLUSTRATIONS,
  GROUP_HUBS,
} from "@/lib/groupHubs";

type AtlasTilesProps = {
  filters: AtlasFilters;
  groupTotals: Record<"all" | AnimalGroup, number>;
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
  const venomousTile = (className: string) => (
    <button
      aria-pressed={filters.danger === "venomous"}
      className={cn(
        TILE_CLASS_NAME,
        "bg-[#7d2f25]",
        filters.danger === "venomous" && "ring-3 ring-destructive",
        className,
      )}
      onClick={onPickVenomous}
      type="button"
    >
      <TileImage src={venomousImage} tintClassName="bg-[#7d2f25]/55" />
      <TileLabel count={venomousCount} label={t("danger.venomous")} />
    </button>
  );

  return (
    <>
      <div className="no-scrollbar -mx-5 mt-5 flex gap-2.5 overflow-x-auto px-5 py-1 lg:mx-0 lg:mt-9 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:px-0 lg:pt-0">
        {groups.map((group, index) => (
          <Fragment key={group}>
            <Link
              className={cn(TILE_CLASS_NAME, "bg-[#151c18]")}
              href={GROUP_HUBS[ANIMAL_GROUP_TO_HUB[group]].path}
            >
              <TileImage
                src={GROUP_HUB_ILLUSTRATIONS[ANIMAL_GROUP_TO_HUB[group]]}
                tintClassName="bg-[#151c18]/25 lg:bg-[#151c18]/28 lg:group-hover:bg-[#151c18]/15"
              />
              <TileLabel
                count={groupTotals[group]}
                label={t(`groups.${group}`)}
              />
            </Link>
            {index === 0 ? venomousTile("lg:hidden") : null}
          </Fragment>
        ))}

        {venomousTile("max-lg:hidden")}

        <button
          className={cn(
            TILE_CLASS_NAME,
            "bg-surface text-foreground lg:col-span-2",
          )}
          onClick={onPickRegion}
          type="button"
        >
          <MapPin
            aria-hidden="true"
            className="absolute top-3 right-3 size-9 text-primary/25 lg:top-3.5 lg:right-4 lg:size-12"
            strokeWidth={1.5}
          />
          <TileLabel count={regionCount} label={t("filters.region")} plain />
        </button>
      </div>

      <nav
        aria-label={t("hubLinksLabel")}
        className="mt-3 flex items-center gap-x-4 lg:mt-4"
      >
        <span className="hidden shrink-0 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase lg:inline">
          {t("hubLinksLabel")}
        </span>
        <ul className="no-scrollbar -mx-5 flex min-w-0 flex-1 gap-x-4 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:gap-x-5 lg:overflow-visible lg:px-0">
          {groups.map((group) => (
            <li className="shrink-0" key={group}>
              <Link
                className="group/hub inline-flex min-h-11 items-center gap-1 text-[14px] font-medium whitespace-nowrap text-foreground/80 transition-colors hover:text-primary"
                href={GROUP_HUBS[ANIMAL_GROUP_TO_HUB[group]].path}
              >
                <span className="border-b border-foreground/25 pb-px transition-colors group-hover/hub:border-primary">
                  {t(`groups.${group}`)}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 opacity-60"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

function TileImage({
  src,
  tintClassName,
}: {
  src: string;
  tintClassName: string;
}) {
  return (
    <>
      <CoverImage
        alt=""
        aria-hidden
        className={cn(
          "object-cover transition-transform duration-500 motion-reduce:transition-none lg:group-hover:scale-[1.06]",
        )}
        sizes="(max-width: 1023px) 132px, 220px"
        src={src}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-colors duration-300 motion-reduce:transition-none",
          tintClassName,
        )}
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
