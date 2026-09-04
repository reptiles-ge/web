"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Link } from "@/i18n/navigation";

export function MapExplorer() {
  const t = useTranslations("map");

  return (
    <section className="map-explorer relative py-20 lg:py-28" id="atlas">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="text-balance-tight mt-4 font-display text-display-title font-semibold text-foreground">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            href="/regions"
          >
            {t("allRegions")}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <div className="mt-10 lg:mt-14">
          <GeorgiaMap mapContext="home" selectionMode="navigate" />
        </div>

        <p className="mt-6 text-center text-[12px] tracking-wide text-muted-foreground">
          {t("hint")}
        </p>
      </div>
    </section>
  );
}
