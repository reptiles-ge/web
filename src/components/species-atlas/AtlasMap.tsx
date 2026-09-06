"use client";

import { useTranslations } from "next-intl";

import type { RegionTooltipSpecies } from "@/data/mapRegions";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Link } from "@/i18n/navigation";

export function AtlasMap({
  tooltipSpeciesByRegion,
}: {
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto max-w-350 px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
            {t("mapEyebrow")}
          </p>
          <h2 className="mt-5 font-display text-display-title font-semibold text-foreground">
            {t("mapTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {t("mapSubtitle")}
          </p>
        </div>
        <div className="mt-12 lg:mt-16">
          <GeorgiaMap
            mapContext="atlas"
            selectionMode="navigate"
            tooltipSpeciesByRegion={tooltipSpeciesByRegion}
          />
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            href="/regions"
          >
            {t("openRegionsAtlas")}
          </Link>
        </div>
      </div>
    </section>
  );
}
