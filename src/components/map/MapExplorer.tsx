"use client";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function MapExplorer() {
  const t = useTranslations("map");

  return (
    <section id="atlas" className="map-explorer relative py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 map-explorer-texture"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.5rem)] font-semibold leading-[1.12] text-foreground">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/regions"
            className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            {t("allRegions")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 lg:mt-14">
          <GeorgiaMap selectionMode="navigate" mapContext="home" />
        </div>

        <p className="mt-6 text-center text-[12px] tracking-wide text-muted-foreground">
          {t("hint")}
        </p>
      </div>
    </section>
  );
}
