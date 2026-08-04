"use client";

import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { getRegionsForSpecies, localizeRegionText } from "@/data/regions";
import type { AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

type SpeciesRangeMapProps = {
  speciesId: string;
  speciesName: string;
};

export function SpeciesRangeMap({
  speciesId,
  speciesName,
}: SpeciesRangeMapProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("profile");

  const rangeRegions = useMemo(
    () => getRegionsForSpecies(speciesId),
    [speciesId],
  );

  const highlightedIds = useMemo(
    () => rangeRegions.map((region) => region.id),
    [rangeRegions],
  );

  if (highlightedIds.length === 0) return null;

  const regionNames = rangeRegions
    .map((region) => localizeRegionText(region.name, locale))
    .join(locale === "ka" ? " · " : " · ");

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 map-explorer-texture"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            {t("range")}
          </p>
          <h2 className="mt-5 font-display text-balance-tight text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05] text-foreground">
            {t("rangeTitle", { name: speciesName })}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance-tight text-[15px] leading-relaxed text-muted-foreground">
            {t("rangeSubtitle")}
          </p>
        </Reveal>

        <div className="mt-14 lg:mt-16">
          <GeorgiaMap
            highlightedIds={highlightedIds}
            interactive={false}
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-relaxed tracking-wide text-muted-foreground/90">
          {regionNames}
        </p>
      </div>
    </section>
  );
}
