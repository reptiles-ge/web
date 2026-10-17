"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { RegionTooltipSpecies } from "@/data/mapRegions";

import { Link } from "@/i18n/navigation";

const GeorgiaMap = dynamic(
  () => import("@/components/map/GeorgiaMap").then((mod) => mod.GeorgiaMap),
  { loading: MapPlaceholder, ssr: false },
);

export function AtlasMap({
  tooltipSpeciesByRegion,
}: {
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <section className="bg-background pb-10 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
        <div className="rounded-[26px] bg-card px-5 py-[22px] shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_30px_rgba(14,20,17,0.06)] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:rounded-[32px] lg:px-12 lg:py-10 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("mapEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-[21px] leading-tight font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[34px] lg:leading-[1.1]">
              {t("mapTitle")}
            </h2>
            <p className="mt-3.5 hidden text-[16px] leading-[1.65] text-muted-foreground lg:block">
              {t("mapSubtitle")}
            </p>
            <Link
              className="mt-6 hidden h-[52px] items-center gap-2.5 rounded-full bg-primary px-6 text-[15px] font-medium text-white transition-colors hover:bg-primary/90 lg:inline-flex dark:text-ink"
              href="/regions"
            >
              {t("openRegionsAtlas")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-3.5 lg:mt-0">
            <DeferredAtlasMap tooltipSpeciesByRegion={tooltipSpeciesByRegion} />
          </div>
          <Link
            className="mt-3.5 flex h-[50px] items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-white lg:hidden dark:text-ink"
            href="/regions"
          >
            {t("openRegionsAtlas")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DeferredAtlasMap({
  tooltipSpeciesByRegion,
}: {
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (near || !element || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near]);

  if (near) {
    return (
      <GeorgiaMap
        mapContext="atlas"
        selectionMode="navigate"
        showBackground={false}
        tooltipSpeciesByRegion={tooltipSpeciesByRegion}
      />
    );
  }

  return (
    <div ref={ref}>
      <MapPlaceholder />
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto aspect-1000/510 w-full max-w-[920px]"
    />
  );
}
