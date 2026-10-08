"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { RegionTooltipSpecies } from "@/data/mapRegions";
import type { AppLocale } from "@/i18n/routing";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { regions } from "@/data/mapRegions";
import { pickLocalized } from "@/i18n/localeMeta";
import { Link } from "@/i18n/navigation";
import { regionHref } from "@/lib/regionHref";

export function MapExplorer({
  tooltipSpeciesByRegion,
}: {
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
}) {
  const t = useTranslations("map");
  const locale = useLocale() as AppLocale;
  const [activeId, setActiveId] = useState<null | string>(null);
  const highlightedIds = useMemo(
    () => (activeId ? [activeId] : []),
    [activeId],
  );

  return (
    <section className="bg-surface py-11 lg:py-20" id="atlas">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <div className="grid gap-5 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div className="lg:pb-7">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-[440px] font-display text-[30px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-4 lg:text-[44px] lg:leading-[1.1]">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-[440px] text-[15px] leading-[1.6] text-muted-foreground lg:mt-5 lg:text-[16px] lg:leading-[1.65]">
              {t("subtitle")}
            </p>
            <Link
              className="mt-7 hidden min-h-[52px] items-center gap-2 rounded-full bg-[#2f6b4f] px-6 text-[15px] font-medium text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:inline-flex"
              href="/regions"
            >
              {t("allRegions")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="relative -mx-6 mt-1 lg:mx-0 lg:mt-0">
            <GeorgiaMap
              className="max-w-none drop-shadow-[0_26px_34px_rgba(14,20,17,0.14)]"
              highlightedIds={highlightedIds}
              mapContext="home"
              selectionMode="navigate"
              showBackground={false}
              tooltipSpeciesByRegion={tooltipSpeciesByRegion}
            />
            <p className="mt-2 hidden text-right text-[12px] text-muted-foreground lg:block">
              {t("hint")}
            </p>
          </div>
        </div>

        <div className="mt-5 lg:mt-12">
          <div className="hidden items-baseline justify-between px-1 pb-3 lg:flex">
            <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("regionLabel")}
            </span>
            <span className="text-[12px] text-muted-foreground">
              {t("listNote")}
            </span>
          </div>
          <div
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto overscroll-x-contain px-6 pb-1 lg:mx-0 lg:grid lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-4 lg:gap-x-4 lg:gap-y-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
            onBlur={() => setActiveId(null)}
            onMouseLeave={() => setActiveId(null)}
          >
            {regions.map((region, index) => (
              <Link
                className="group flex h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 text-[13px] text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:h-[46px] lg:gap-3.5 lg:rounded-2xl lg:bg-background lg:px-[18px] lg:text-[14px] dark:hover:text-ink"
                href={regionHref(region.id)}
                key={region.id}
                onFocus={() => setActiveId(region.id)}
                onMouseEnter={() => setActiveId(region.id)}
              >
                <span className="hidden w-5 shrink-0 text-[12px] text-muted-foreground tabular-nums group-hover:text-white/80 lg:block dark:group-hover:text-ink/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {pickLocalized(region.name, locale)}
                </span>
                <span className="shrink-0 text-[12px] text-muted-foreground group-hover:text-white/80 lg:text-[13px] dark:group-hover:text-ink/70">
                  {t("speciesCount", { count: region.speciesIds.length })}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          href="/regions"
        >
          <span className="border-b border-foreground/30 pb-0.5">
            {t("allRegions")}
          </span>
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
