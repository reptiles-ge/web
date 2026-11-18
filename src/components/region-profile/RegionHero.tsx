"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  focusClass,
  regionShapeId,
  wrapClass,
} from "@/components/regions-index/shared";
import {
  GEORGIA_MAP_VIEWBOX,
  georgiaRegionLabelPoints,
  georgiaRegionPaths,
  georgiaRegionViewBoxes,
  type RegionPathId,
} from "@/data/georgia-paths";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { REGION_SECTION_IDS } from "@/lib/toc";

type RegionHeroStat = {
  count: number;
  label: string;
  venomous?: boolean;
};

const MAP_REGION_IDS = Object.keys(georgiaRegionPaths) as RegionPathId[];

const [, , MAP_WIDTH = 1, MAP_HEIGHT = 1] =
  GEORGIA_MAP_VIEWBOX.split(" ").map(Number);

export function RegionHero({
  biome,
  name,
  overview,
  regionId,
  stats,
  subtitle,
  venomousCount,
}: {
  biome: null | string;
  name: string;
  overview: null | string;
  regionId: RegionPathId;
  stats: RegionHeroStat[];
  subtitle: string;
  venomousCount: number;
}) {
  const t = useTranslations("regions");
  const tNav = useTranslations("nav");
  const speciesCount = stats[0]?.count ?? 0;

  return (
    <section className="pt-[92px] lg:pt-[116px]">
      <div className={wrapClass}>
        <nav aria-label={tNav("breadcrumbAria")} className="sr-only">
          <Link href="/">{t("breadcrumbHome")}</Link>
          <Link href="/regions">{tNav("regions")}</Link>
          <span aria-current="page">{name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_640px]">
          <div className="lg:pt-3">
            <div className="flex flex-wrap items-center gap-2 lg:gap-2.5">
              <span className="inline-flex h-[26px] items-center rounded-full bg-(--nw-surface) px-[11px] text-[12px] font-semibold text-(--nw-accent) lg:h-7 lg:px-3 lg:text-[12.5px]">
                {t("regionEyebrow")}
              </span>
              {biome ? (
                <span className="text-[13px] text-(--nw-muted) lg:text-[13.5px]">
                  {biome}
                </span>
              ) : null}
            </div>
            <h1
              className={cn(
                "mt-3.5 font-semibold wrap-break-word text-(--nw-ink) lg:mt-[22px]",
                titleSizeClass(name),
              )}
            >
              {name}
            </h1>
            <p className="mt-3 text-[17px] font-medium text-(--nw-soft) lg:mt-[18px] lg:text-[22px] lg:leading-[1.3] lg:tracking-[-0.01em]">
              {subtitle}
            </p>
          </div>

          <RegionHeroMap name={name} regionId={regionId} />

          <div className="lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:pb-2">
            {overview ? (
              <p className="mt-5 text-[15.5px] leading-[1.7] text-(--nw-soft) lg:mt-[18px] lg:max-w-[540px] lg:text-[16px] lg:text-(--nw-muted)">
                {overview}
              </p>
            ) : null}
            <div className="hidden min-h-8 flex-1 lg:block" />
            <dl className="mt-5 grid grid-cols-4 gap-1.5 lg:mt-0 lg:flex lg:gap-0">
              {stats.map((stat, index) => (
                <div
                  className={cn(
                    "flex min-w-0 flex-col-reverse justify-end rounded-2xl bg-(--nw-card) px-2.5 py-3 lg:gap-1 lg:rounded-none lg:bg-transparent lg:px-4 lg:py-0 xl:px-7",
                    index === 0
                      ? "lg:pl-0"
                      : "lg:border-l lg:border-(--nw-rule)",
                  )}
                  key={stat.label}
                >
                  <dt className="mt-[5px] text-[11.5px] wrap-break-word hyphens-auto text-(--nw-muted) lg:mt-0 lg:text-[13px] lg:whitespace-nowrap">
                    {stat.label}
                  </dt>
                  <dd
                    className={cn(
                      "text-[24px] leading-none font-semibold tabular-nums lg:text-[34px] lg:tracking-[-0.02em]",
                      stat.venomous && "text-(--rg-venom)",
                    )}
                  >
                    {stat.count}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 hidden flex-wrap gap-2.5 lg:flex">
              <a
                className={cn(
                  "inline-flex h-[52px] items-center gap-2.5 rounded-full bg-(--nw-strong) px-6 text-[15px] font-medium text-(--nw-on-strong)",
                  focusClass,
                )}
                href={`#${REGION_SECTION_IDS.species}`}
              >
                {t("viewSpecies", { count: speciesCount })}
                <ArrowDown
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </a>
              {venomousCount > 0 ? (
                <a
                  className={cn(
                    "inline-flex h-[52px] items-center gap-2.5 rounded-full border border-(--nw-line) bg-(--nw-card) px-[22px] text-[15px] font-medium text-(--nw-ink)",
                    focusClass,
                  )}
                  href={`#${REGION_SECTION_IDS.venomous}`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-(--rg-alert)"
                  />
                  {tNav("venomousSnakes")}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RegionHeroMap({
  name,
  regionId,
}: {
  name: string;
  regionId: RegionPathId;
}) {
  const t = useTranslations("regions");
  const [x, y] = georgiaRegionLabelPoints[regionId];
  const others = MAP_REGION_IDS.filter((id) => id !== regionId);

  return (
    <figure
      aria-label={t("rangeTitle", { name })}
      className="relative mt-[22px] h-[260px] overflow-hidden rounded-[28px] bg-[radial-gradient(120%_90%_at_20%_70%,#1d2a23_0%,#0e1411_70%)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-[560px] lg:rounded-[36px] dark:inset-ring dark:inset-ring-white/8"
    >
      <div className="absolute inset-x-4 top-7 lg:inset-x-7 lg:top-14">
        <div className="relative">
          <svg
            aria-hidden="true"
            className="block h-auto w-full stroke-[#0e1411] stroke-2 [stroke-linejoin:round] lg:stroke-[1.6]"
            viewBox={GEORGIA_MAP_VIEWBOX}
          >
            {others.map((id) => (
              <use
                className="fill-[#26332c]"
                href={`#${regionShapeId(id)}`}
                key={id}
              />
            ))}
            <use
              className="fill-[#7fc29b]"
              href={`#${regionShapeId(regionId)}`}
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute size-3 -translate-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgba(127,194,155,0.35),0_0_0_11px_rgba(127,194,155,0.14)] lg:size-3.5 lg:shadow-[0_0_0_6px_rgba(127,194,155,0.35),0_0_0_14px_rgba(127,194,155,0.14)]"
            style={{
              left: `${(x / MAP_WIDTH) * 100}%`,
              top: `${(y / MAP_HEIGHT) * 100}%`,
            }}
          />
          <span className="absolute top-[76%] left-[2%] hidden text-[13px] tracking-[0.08em] text-[rgba(127,194,155,0.55)] italic lg:block">
            {t("blackSea")}
          </span>
        </div>
      </div>
      <span className="absolute bottom-4 left-4 inline-flex h-8 max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/92 px-3 text-[12.5px] font-semibold text-[#1a211c] lg:hidden">
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-[#2f6b4f]"
        />
        <span className="truncate">{name}</span>
      </span>
      <div className="absolute bottom-6 left-6 hidden max-w-[calc(100%-3rem)] items-end gap-4 lg:flex">
        <div className="h-[132px] w-[200px] shrink-0 rounded-[22px] border border-white/10 bg-white/6 p-2.5 backdrop-blur-sm">
          <svg
            aria-hidden="true"
            className="block size-full stroke-[#0e1411] stroke-[0.9] [stroke-linejoin:round]"
            viewBox={georgiaRegionViewBoxes[regionId]}
          >
            {others.map((id) => (
              <use
                className="fill-[#26332c]"
                href={`#${regionShapeId(id)}`}
                key={id}
              />
            ))}
            <use
              className="fill-[#7fc29b]"
              href={`#${regionShapeId(regionId)}`}
            />
          </svg>
        </div>
        <p className="min-w-0 pb-1.5 text-[20px] leading-tight font-semibold text-white">
          {name}
        </p>
      </div>
      <Link
        className={cn(
          "absolute top-6 right-6 hidden h-10 items-center gap-2 rounded-full bg-white/92 px-4 text-[13px] font-semibold text-[#1a211c] lg:inline-flex",
          focusClass,
        )}
        href="/regions"
      >
        {t("allRegions")}
        <ArrowRight
          aria-hidden="true"
          className="size-3.5"
          strokeWidth={1.75}
        />
      </Link>
    </figure>
  );
}

function titleSizeClass(name: string) {
  if (name.length <= 9) {
    return "text-[68px] leading-[0.95] tracking-[-0.035em] lg:text-[72px] lg:leading-[0.92] lg:tracking-[-0.04em] xl:text-[88px] min-[1400px]:text-[112px]";
  }
  if (name.length <= 18) {
    return "text-[44px] leading-none tracking-[-0.03em] lg:text-[52px] xl:text-[64px] min-[1400px]:text-[76px]";
  }
  return "text-[34px] leading-[1.04] tracking-[-0.025em] lg:text-[40px] xl:text-[48px] min-[1400px]:text-[56px]";
}
