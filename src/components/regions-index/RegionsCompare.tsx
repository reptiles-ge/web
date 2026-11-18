"use client";

import { useTranslations } from "next-intl";

import type { RegionPathId } from "@/data/georgia-paths";

import { REGION_ATLAS_GROUPS } from "@/data/regionAtlasGroups";
import { cn } from "@/lib/cn";

import {
  eyebrowClass,
  focusClass,
  GROUP_BG_CLASSES,
  h2Class,
  type RegionsIndexRegion,
  wrapClass,
} from "./shared";

export function RegionsCompare({
  onSelect,
  regions,
  selectedId,
}: {
  onSelect: (id: RegionPathId) => void;
  regions: RegionsIndexRegion[];
  selectedId: RegionPathId;
}) {
  const t = useTranslations("regions");
  const rows = regions.toSorted((a, b) => b.speciesCount - a.speciesCount);
  const top = Math.max(1, ...regions.map((region) => region.speciesCount));

  return (
    <section className="bg-(--nw-card) py-10 lg:py-[88px]">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className={eyebrowClass}>{t("compare.eyebrow")}</p>
            <h2 className={h2Class}>{t("compare.title")}</h2>
            <p className="mt-3.5 hidden max-w-[560px] text-[16px] leading-[1.65] text-(--nw-muted) lg:block">
              {t("compare.lead")}
            </p>
          </div>
          <ul
            aria-label={t("compare.legend")}
            className="mt-4 flex flex-wrap gap-x-3.5 gap-y-2 lg:mt-0 lg:max-w-[560px] lg:justify-end lg:gap-x-[18px] lg:pb-1.5"
          >
            {REGION_ATLAS_GROUPS.map((group, index) => (
              <li
                className="flex items-center gap-1.5 text-[12.5px] text-(--nw-soft) lg:gap-2 lg:text-[13px]"
                key={group}
              >
                <span
                  className={cn(
                    "size-[9px] shrink-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgba(14,20,17,0.08)] lg:size-2.5",
                    GROUP_BG_CLASSES[index],
                  )}
                />
                {t(`compare.groups.${group}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[18px] flex flex-col gap-1 lg:mt-9 lg:gap-0.5">
          {rows.map((region) => (
            <button
              aria-label={t("compare.rowLabel", {
                name: region.name,
                species: t("speciesCount", { count: region.speciesCount }),
              })}
              aria-pressed={region.id === selectedId}
              className={cn(
                "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-2.5 rounded-[14px] px-2.5 py-2 text-left motion-safe:transition-colors lg:min-h-11 lg:grid-cols-[250px_minmax(0,1fr)_56px] lg:items-center lg:gap-x-5 lg:px-3 lg:py-1",
                focusClass,
                region.id === selectedId
                  ? "bg-(--nw-line-soft)"
                  : "lg:hover:bg-(--nw-wash)",
              )}
              key={region.id}
              onClick={() => onSelect(region.id)}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="hidden w-[22px] shrink-0 text-[12px] text-(--nw-muted) tabular-nums lg:block">
                  {region.number}
                </span>
                <span className="min-w-0 truncate text-[13.5px] font-medium text-(--nw-ink) lg:text-[14.5px]">
                  {region.name}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="col-span-2 row-start-2 mt-1.5 flex h-2.5 gap-0.5 lg:col-span-1 lg:row-start-auto lg:mt-0 lg:h-[18px]"
              >
                {region.groupCounts.map((count, index) =>
                  count > 0 ? (
                    <span
                      className={cn(
                        "h-full rounded-[2px] lg:rounded-[3px]",
                        GROUP_BG_CLASSES[index],
                      )}
                      key={REGION_ATLAS_GROUPS[index]}
                      style={{ width: `${((count / top) * 100).toFixed(2)}%` }}
                    />
                  ) : null,
                )}
              </span>
              <span className="col-start-2 row-start-1 text-[13.5px] font-semibold text-(--nw-ink) tabular-nums lg:col-start-auto lg:row-start-auto lg:text-right lg:text-[15px]">
                {region.speciesCount}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
