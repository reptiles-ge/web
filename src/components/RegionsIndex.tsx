"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { RegionAtlasEntry } from "@/data/regions";

import { RegionsCompare } from "@/components/regions-index/RegionsCompare";
import { RegionsDirectory } from "@/components/regions-index/RegionsDirectory";
import { RegionsGuide } from "@/components/regions-index/RegionsGuide";
import { RegionShapeDefs } from "@/components/regions-index/RegionShapes";
import { RegionsMapCard } from "@/components/regions-index/RegionsMapCard";
import {
  eyebrowClass,
  focusClass,
  type RegionsIndexRegion,
  wrapClass,
} from "@/components/regions-index/shared";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type RegionsIndexStats = {
  regionCount: number;
  speciesCount: number;
  venomousCount: number;
};

export function RegionsIndex({
  regions,
  stats,
}: {
  regions: RegionAtlasEntry[];
  stats: RegionsIndexStats;
}) {
  const numbered: RegionsIndexRegion[] = regions.map((region, index) => ({
    ...region,
    number: String(index + 1).padStart(2, "0"),
  }));
  const [selectedId, setSelectedId] = useState(() => richestRegionId(regions));
  if (!selectedId) return null;

  const select = (id: RegionPathId) => {
    trackEvent("map_region_select", {
      action: "panel",
      map_context: "region_page",
      region_id: id,
    });
    setSelectedId(id);
  };

  return (
    <div className="editorial-page regions-atlas min-h-screen overflow-x-clip bg-background text-(--nw-ink) antialiased">
      <RegionShapeDefs ids={regions.map((region) => region.id)} />
      <RegionsHero stats={stats} />
      <RegionsMapCard
        onSelect={select}
        regions={numbered}
        selectedId={selectedId}
      />
      <RegionsDirectory regions={numbered} selectedId={selectedId} />
      <RegionsCompare
        onSelect={select}
        regions={numbered}
        selectedId={selectedId}
      />
      <RegionsGuide />
    </div>
  );
}

function RegionsHero({ stats }: { stats: RegionsIndexStats }) {
  const t = useTranslations("regions");
  const tNav = useTranslations("nav");
  const items = [
    {
      count: stats.regionCount,
      label: t("stats.regions", { count: stats.regionCount }),
      venomous: false,
    },
    {
      count: stats.speciesCount,
      label: t("stats.species", { count: stats.speciesCount }),
      venomous: false,
    },
    {
      count: stats.venomousCount,
      label: t("stats.venomous", { count: stats.venomousCount }),
      venomous: true,
    },
  ];

  return (
    <section className="pt-[92px] lg:pt-[116px] lg:pb-9">
      <div className={wrapClass}>
        <nav aria-label={tNav("breadcrumbAria")}>
          <Link
            className={cn(
              "inline-flex h-11 items-center gap-1 rounded-full bg-(--nw-card) pr-3.5 pl-2 text-[13.5px] font-medium text-(--nw-ink) lg:h-9 lg:pr-[15px] lg:pl-[9px]",
              focusClass,
            )}
            href={{ hash: "atlas", pathname: "/" }}
          >
            <ChevronLeft
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
            {t("back")}
          </Link>
        </nav>
        <div className="mt-[22px] lg:mt-[30px] lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 lg:max-w-[760px] lg:flex-1">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-(--nw-accent)" />
              <p className={eyebrowClass}>{t("eyebrow")}</p>
            </div>
            <h1 className="mt-3 text-[38px] leading-[1.06] font-bold tracking-[-0.02em] text-(--nw-ink) lg:mt-[18px] lg:text-[72px] lg:leading-[1.02]">
              {t("title")}
            </h1>
            <p className="mt-3 text-[16.5px] leading-[1.6] text-(--nw-soft) lg:mt-5 lg:max-w-[640px] lg:text-[19px]">
              <span className="lg:hidden">{t("subtitleShort")}</span>
              <span className="hidden lg:inline">{t("subtitle")}</span>
            </p>
          </div>
          <dl className="mt-5 grid grid-cols-3 rounded-[26px] bg-(--nw-card) px-1 py-4 shadow-(--rg-card-shadow-sm) lg:mt-0 lg:w-[500px] lg:shrink-0 lg:rounded-[32px] lg:px-2 lg:py-[26px] lg:shadow-(--rg-card-shadow)">
            {items.map((item, index) => (
              <div
                className={cn(
                  "px-3.5 lg:px-[26px]",
                  index > 0 && "border-l border-(--nw-line)",
                  item.venomous && "text-(--rg-venom)",
                )}
                key={item.label}
              >
                <dt
                  className={cn(
                    "text-[11.5px] lg:text-[11px] lg:font-medium lg:tracking-[0.18em]",
                    !item.venomous && "text-(--nw-muted)",
                  )}
                >
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-[26px] leading-none font-semibold tabular-nums lg:mt-2.5 lg:text-[42px] lg:tracking-[-0.02em]">
                  {item.count}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function richestRegionId(regions: RegionAtlasEntry[]) {
  let richest = regions[0];
  for (const region of regions) {
    if (richest && region.speciesCount > richest.speciesCount) richest = region;
  }
  return richest?.id;
}
