"use client";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { regions, localizeRegionText } from "@/data/regions";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export function MapExplorer() {
  const t = useTranslations("map");
  const locale = useLocale() as AppLocale;

  return (
    <section
      id="atlas"
      className="map-explorer relative overflow-hidden py-24 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 map-explorer-texture" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-balance-tight text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] text-foreground">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance-tight text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-14 lg:mt-20">
          <GeorgiaMap />
        </div>

        <p className="mt-8 text-center text-[12px] tracking-wide text-muted-foreground/80">
          {t("hint")}
        </p>

        <nav
          aria-label={t("allRegions")}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {regions.map((region, index) => (
            <span key={region.id} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mr-1 text-muted-foreground/40" aria-hidden>
                  ·
                </span>
              ) : null}
              <Link
                href={`/regions/${region.id}`}
                className="text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {localizeRegionText(region.name, locale)}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-6 text-center">
          <Link
            href="/regions"
            className="text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            {t("allRegions")}
          </Link>
        </div>
      </div>
    </section>
  );
}
