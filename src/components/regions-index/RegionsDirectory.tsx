"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { RegionPathId } from "@/data/georgia-paths";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { regionHref } from "@/lib/regionHref";

import {
  eyebrowClass,
  focusClass,
  h2Class,
  type RegionsIndexRegion,
  RegionThumb,
  wrapClass,
} from "./shared";

const SORTS = ["map", "count", "alpha"] as const;

type SortId = (typeof SORTS)[number];

export function RegionsDirectory({
  regions,
  selectedId,
}: {
  regions: RegionsIndexRegion[];
  selectedId: RegionPathId;
}) {
  const t = useTranslations("regions");
  const locale = useLocale();
  const [sort, setSort] = useState<SortId>("map");
  const sorted = sortRegions(regions, sort, locale);

  return (
    <section className="pt-12 pb-10 lg:pt-0 lg:pb-24">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className={eyebrowClass}>{t("directoryEyebrow")}</p>
            <h2 className={h2Class}>
              {t.rich("directoryTitle", {
                more: (chunks) => (
                  <span className="hidden lg:inline">{chunks}</span>
                ),
              })}
            </h2>
          </div>
          <div
            aria-label={t("sort.label")}
            className="mt-4 flex gap-1 rounded-full bg-(--nw-card) p-1 shadow-(--rg-pill-shadow) lg:mt-0 lg:items-center"
            role="group"
          >
            {SORTS.map((id) => (
              <button
                aria-pressed={sort === id}
                className={cn(
                  "h-10 flex-1 cursor-pointer rounded-full px-2.5 text-[13px] font-medium motion-safe:transition-colors lg:h-9 lg:flex-none lg:px-3.5",
                  focusClass,
                  sort === id
                    ? "bg-(--nw-strong) text-(--nw-on-strong)"
                    : "text-(--nw-ink)",
                )}
                key={id}
                onClick={() => setSort(id)}
                type="button"
              >
                {id === "map" ? (
                  <>
                    <span className="lg:hidden">{t("sort.mapShort")}</span>
                    <span className="hidden lg:inline">{t("sort.map")}</span>
                  </>
                ) : (
                  t(`sort.${id}`)
                )}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 md:grid md:grid-cols-2 md:gap-5 lg:mt-9 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((region) => (
            <li key={region.id}>
              <RegionDirectoryItem
                region={region}
                selected={region.id === selectedId}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RegionDirectoryItem({
  region,
  selected,
}: {
  region: RegionsIndexRegion;
  selected: boolean;
}) {
  const t = useTranslations("regions");
  const venomous = t("venomousCount", { count: region.venomousCount });

  return (
    <Link
      className={cn("group block md:h-full md:rounded-[28px]", focusClass)}
      href={regionHref(region.id)}
    >
      <span className="flex min-h-[76px] items-center gap-3.5 border-t border-(--nw-line) py-2.5 md:hidden">
        <span
          className={cn(
            "flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl",
            selected ? "bg-(--rg-tile-active)" : "bg-(--nw-card)",
          )}
        >
          <RegionThumb className="h-10 w-12" id={region.id} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] leading-[1.3] font-semibold text-(--nw-ink)">
            {region.name}
          </span>
          {region.biome ? (
            <span className="mt-[3px] block text-[12.5px] text-(--nw-muted)">
              {region.biome}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-[18px] font-semibold text-(--nw-accent) tabular-nums">
            {region.speciesCount}
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-(--rg-venom)">
            <span className="size-[5px] rounded-full bg-(--rg-alert)" />
            {venomous}
          </span>
        </span>
      </span>
      <span
        className={cn(
          "hidden h-full flex-col rounded-[28px] bg-(--nw-card) px-[22px] pt-5 pb-[22px] motion-safe:transition-[translate,box-shadow] motion-safe:duration-250 motion-safe:group-hover:translate-y-[-3px] md:flex",
          selected
            ? "shadow-(--rg-ring-shadow)"
            : "shadow-(--nw-shadow) group-hover:shadow-(--rg-card-shadow-hover)",
        )}
      >
        <span className="flex items-center justify-between gap-2.5">
          <span className="text-[12px] font-semibold text-(--nw-muted) tabular-nums">
            {region.number}
          </span>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-(--rg-venom-bg) px-2.5 text-[11.5px] font-semibold text-(--nw-danger-fg)">
            <span className="size-1.5 rounded-full bg-(--rg-alert)" />
            {venomous}
          </span>
        </span>
        <RegionThumb
          className="mt-3.5 mb-1.5 h-32 w-full group-hover:fill-(--nw-accent) motion-safe:transition-[fill] motion-safe:duration-250"
          id={region.id}
        />
        {region.biome ? (
          <span className={cn(eyebrowClass, "mt-2 block")}>{region.biome}</span>
        ) : null}
        <span className="mt-1.5 block flex-1 text-[19px] leading-tight font-semibold text-(--nw-ink)">
          {region.name}
        </span>
        <span className="mt-4 flex items-center gap-2 border-t border-(--nw-line-soft) pt-3.5">
          <strong className="text-[22px] font-semibold text-(--nw-accent) tabular-nums">
            {region.speciesCount}
          </strong>
          <span className="text-[13px] text-(--nw-muted)">
            {t("speciesUnit", { count: region.speciesCount })}
          </span>
          <span className="flex-1" />
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-(--nw-wash) text-(--nw-ink) group-hover:bg-(--nw-accent) group-hover:text-(--nw-on-strong) motion-safe:transition-colors"
          >
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </span>
        </span>
      </span>
    </Link>
  );
}

function sortRegions(
  regions: RegionsIndexRegion[],
  sort: SortId,
  locale: string,
) {
  if (sort === "count") {
    return regions.toSorted((a, b) => b.speciesCount - a.speciesCount);
  }
  if (sort === "alpha") {
    return regions.toSorted((a, b) => a.name.localeCompare(b.name, locale));
  }
  return regions;
}
