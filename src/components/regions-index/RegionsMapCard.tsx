"use client";

import { ArrowRight, Pointer } from "lucide-react";
import { useTranslations } from "next-intl";
import { type PointerEvent, useState } from "react";

import type { RegionPathId } from "@/data/georgia-paths";

import {
  GEORGIA_MAP_VIEWBOX,
  georgiaRegionLabelPoints,
} from "@/data/georgia-paths";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { regionHref } from "@/lib/regionHref";

import {
  eyebrowClass,
  focusClass,
  regionShapeId,
  type RegionsIndexRegion,
} from "./shared";

const RAMP_FILL_CLASSES = [
  "fill-(--rg-ramp-0)",
  "fill-(--rg-ramp-1)",
  "fill-(--rg-ramp-2)",
  "fill-(--rg-ramp-3)",
  "fill-(--rg-ramp-4)",
];

const RAMP_BG_CLASSES = [
  "bg-(--rg-ramp-0)",
  "bg-(--rg-ramp-1)",
  "bg-(--rg-ramp-2)",
  "bg-(--rg-ramp-3)",
  "bg-(--rg-ramp-4)",
];

const LABEL_POINT_OVERRIDES: Partial<Record<RegionPathId, [number, number]>> = {
  kakheti: [824, 337.6],
};

const [, , MAP_WIDTH = 1, MAP_HEIGHT = 1] =
  GEORGIA_MAP_VIEWBOX.split(" ").map(Number);

export function RegionsMapCard({
  onSelect,
  regions,
  selectedId,
}: {
  onSelect: (id: RegionPathId) => void;
  regions: RegionsIndexRegion[];
  selectedId: null | RegionPathId;
}) {
  const t = useTranslations("regions");
  const [hoveredId, setHoveredId] = useState<null | RegionPathId>(null);
  const activeId = hoveredId ?? selectedId;
  const active = regions.find((region) => region.id === activeId);

  const counts = regions.map((region) => region.speciesCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const hoverProps = (id: RegionPathId) => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHoveredId(id);
    },
    onPointerLeave: () => setHoveredId(null),
  });
  const select = (id: RegionPathId) => {
    setHoveredId(null);
    onSelect(id);
  };

  return (
    <section aria-label={t("mapEyebrow")} className="mt-7 lg:mt-0 lg:pb-[88px]">
      <div className="mx-auto box-content max-w-[1320px] lg:px-[60px]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-9 lg:rounded-[32px] lg:bg-(--nw-card) lg:px-7 lg:pt-[30px] lg:pb-7 lg:shadow-(--rg-card-shadow)">
          <div className="min-w-0 lg:flex lg:flex-col">
            <div className="mx-3 rounded-[26px] bg-(--nw-card) px-2.5 pt-[18px] pb-3.5 shadow-(--rg-card-shadow-sm) lg:mx-0 lg:flex lg:flex-1 lg:flex-col lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="relative aspect-1000/510 w-full lg:mt-[18px]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full overflow-visible"
                  viewBox={GEORGIA_MAP_VIEWBOX}
                >
                  {regions.map((region) => (
                    <use
                      className={cn(
                        "cursor-pointer stroke-(--rg-stroke) stroke-[1.4] [stroke-linejoin:round] motion-safe:transition-[fill] motion-safe:duration-350 lg:stroke-[1.6]",
                        RAMP_FILL_CLASSES[
                          rampStep(region.speciesCount, min, max)
                        ],
                      )}
                      href={`#${regionShapeId(region.id)}`}
                      key={region.id}
                      onClick={() => select(region.id)}
                      {...hoverProps(region.id)}
                    />
                  ))}
                  {active ? (
                    <use
                      className="pointer-events-none fill-none stroke-(--nw-strong) stroke-[3.2] drop-shadow-[0_6px_8px_rgba(14,20,17,0.22)] [stroke-linejoin:round] lg:stroke-[2.6] lg:drop-shadow-[0_10px_14px_rgba(14,20,17,0.22)]"
                      href={`#${regionShapeId(active.id)}`}
                    />
                  ) : null}
                </svg>
                {regions.map((region) => {
                  const [x, y] =
                    LABEL_POINT_OVERRIDES[region.id] ??
                    georgiaRegionLabelPoints[region.id];
                  const isActive = region.id === active?.id;
                  const species = t("speciesCount", {
                    count: region.speciesCount,
                  });
                  return (
                    <button
                      aria-label={t("regionLabel", {
                        name: region.name,
                        species,
                      })}
                      aria-pressed={region.id === selectedId}
                      className={cn(
                        "absolute inline-flex -translate-1/2 cursor-pointer items-center justify-center rounded-full font-bold whitespace-nowrap tabular-nums",
                        focusClass,
                        isActive
                          ? "z-3 size-7 bg-(--nw-strong) text-[11px] text-(--nw-on-strong) shadow-[0_0_0_3px_var(--nw-card),0_6px_14px_rgba(14,20,17,0.3)] lg:h-9 lg:w-auto lg:gap-[7px] lg:pr-3.5 lg:pl-1.5 lg:shadow-[0_10px_24px_rgba(14,20,17,0.28)]"
                          : "z-2 size-[22px] bg-(--nw-card)/94 text-[9.5px] text-(--nw-ink) shadow-[0_1px_5px_rgba(14,20,17,0.18)] motion-safe:transition-[scale] motion-safe:duration-200 lg:size-7 lg:text-[11px] lg:shadow-[0_2px_8px_rgba(14,20,17,0.16)] lg:hover:scale-[1.08]",
                      )}
                      key={region.id}
                      onClick={() => select(region.id)}
                      style={{
                        left: `${(x / MAP_WIDTH) * 100}%`,
                        top: `${(y / MAP_HEIGHT) * 100}%`,
                      }}
                      type="button"
                      {...hoverProps(region.id)}
                    >
                      {isActive ? (
                        <>
                          <span className="lg:flex lg:size-6 lg:items-center lg:justify-center lg:rounded-full lg:bg-(--nw-on-strong) lg:text-(--nw-strong)">
                            {region.number}
                          </span>
                          <span className="hidden text-[13px] font-semibold lg:inline">
                            {region.name}
                          </span>
                          <span className="hidden text-[12px] font-normal opacity-70 lg:inline">
                            {species}
                          </span>
                        </>
                      ) : (
                        region.number
                      )}
                    </button>
                  );
                })}
                <p className="absolute top-[-18px] right-0 hidden items-center gap-2 text-[12.5px] text-(--nw-muted) lg:flex">
                  <Pointer
                    aria-hidden="true"
                    className="size-[15px]"
                    strokeWidth={1.75}
                  />
                  {t("mapHint")}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2.5 px-1.5 lg:mt-auto lg:items-end lg:gap-6 lg:border-t lg:border-(--nw-line-soft) lg:px-0 lg:pt-[22px]">
                <div className="contents lg:block">
                  <p className="text-[12px] font-semibold text-(--nw-ink) lg:text-[12.5px]">
                    <span className="lg:hidden">{t("legendTitleShort")}</span>
                    <span className="hidden lg:inline">{t("legendTitle")}</span>
                  </p>
                  <div className="flex items-center gap-1.5 lg:mt-2 lg:gap-2.5">
                    <span className="text-[11px] text-(--nw-muted) tabular-nums lg:text-[12px]">
                      {min}
                    </span>
                    <div
                      aria-hidden="true"
                      className="flex gap-0.5 lg:gap-[3px]"
                    >
                      {RAMP_BG_CLASSES.map((rampClass) => (
                        <span
                          className={cn(
                            "h-2 w-4 rounded-[2px] lg:h-2.5 lg:w-[34px] lg:rounded-[3px]",
                            rampClass,
                          )}
                          key={rampClass}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-(--nw-muted) tabular-nums lg:text-[12px]">
                      {max}
                    </span>
                  </div>
                </div>
                <p className="hidden max-w-[360px] text-right text-[12px] leading-[1.55] text-(--nw-muted) lg:block">
                  {t("mapNote")}
                </p>
              </div>
            </div>
            <p className="mt-2.5 px-6 text-[12px] leading-[1.55] text-(--nw-muted) lg:hidden">
              {t("mapNoteShort")}
            </p>
          </div>

          <aside
            aria-label={t("selectedRegion")}
            aria-live="polite"
            className="mx-3 mt-4 rounded-[28px] bg-(--nw-card) px-5 pt-[22px] pb-5 shadow-(--rg-card-shadow-sm) lg:m-0 lg:flex lg:min-w-0 lg:flex-col lg:justify-center lg:rounded-none lg:border-l lg:border-(--nw-line-soft) lg:bg-transparent lg:p-0 lg:pl-9 lg:shadow-none"
          >
            {active ? <RegionPanel region={active} /> : <EmptyPanel />}
          </aside>
        </div>
      </div>
    </section>
  );
}

function EmptyPanel() {
  const t = useTranslations("regions");

  return (
    <>
      <span className="flex size-10 items-center justify-center rounded-full bg-(--nw-line-soft) text-(--nw-muted) lg:size-11">
        <Pointer aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-3 text-[22px] leading-[1.2] font-bold tracking-[-0.012em] text-(--nw-ink) lg:mt-4 lg:text-[26px]">
        {t("emptyPanel.title")}
      </h2>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-(--nw-muted) lg:mt-2.5">
        {t("emptyPanel.body")}
      </p>
    </>
  );
}

function rampStep(value: number, min: number, max: number) {
  return max === min ? 2 : Math.round(((value - min) / (max - min)) * 4);
}

function RegionPanel({ region: active }: { region: RegionsIndexRegion }) {
  const t = useTranslations("regions");

  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-(--nw-strong) px-1.5 text-[11.5px] font-bold text-(--nw-on-strong) tabular-nums lg:h-[30px] lg:min-w-[30px] lg:text-[12px]">
          {active.number}
        </span>
        {active.biome ? (
          <span className={eyebrowClass}>{active.biome}</span>
        ) : null}
      </div>
      <h2 className="mt-3 text-[26px] leading-[1.15] font-bold tracking-[-0.012em] text-(--nw-ink) lg:mt-3.5 lg:text-[32px] lg:leading-[1.12] lg:tracking-[-0.015em]">
        {active.name}
      </h2>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-(--nw-muted) lg:mt-2.5">
        {active.description}
      </p>
      <dl className="mt-4 grid grid-cols-2 border-y border-(--nw-line-soft) py-3.5 lg:mt-[22px] lg:py-[18px]">
        <div>
          <dt className="text-[11.5px] text-(--nw-muted) lg:text-[12px]">
            {t("stats.species", { count: active.speciesCount })}
          </dt>
          <dd className="mt-[5px] text-[28px] leading-none font-semibold tabular-nums lg:mt-1.5 lg:text-[34px]">
            {active.speciesCount}
          </dd>
        </div>
        <div className="border-l border-(--nw-line-soft) pl-4 lg:pl-5">
          <dt className="text-[11.5px] text-(--rg-venom) lg:text-[12px]">
            {t("stats.venomous", { count: active.venomousCount })}
          </dt>
          <dd className="mt-[5px] text-[28px] leading-none font-semibold text-(--rg-venom) tabular-nums lg:mt-1.5 lg:text-[34px]">
            {active.venomousCount}
          </dd>
        </div>
      </dl>
      <Link
        className={cn(
          "mt-[18px] flex min-h-[54px] items-center justify-between gap-2.5 rounded-full bg-(--nw-accent) pr-[7px] pl-5 text-[14.5px] font-medium text-(--nw-on-strong) lg:mt-6 lg:gap-3 lg:pr-2 lg:pl-[22px] lg:text-[15px]",
          focusClass,
        )}
        href={regionHref(active.id)}
      >
        <span className="min-w-0 truncate">
          {t("viewSpecies", { count: active.speciesCount })}
        </span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/16">
          <ArrowRight
            aria-hidden="true"
            className="size-4"
            strokeWidth={1.75}
          />
        </span>
      </Link>
    </>
  );
}
