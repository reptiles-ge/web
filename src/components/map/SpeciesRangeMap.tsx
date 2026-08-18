"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { getRegionsForSpecies, localizeRegionText } from "@/data/regions";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { regionHref } from "@/lib/speciesRoutes";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
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

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 map-explorer-texture"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            {t("range")}
          </p>
          <AnchoredHeading
            id={SPECIES_SECTION_IDS.range}
            slugSource={t("rangeTitle", { name: speciesName })}
            className="mt-5 font-display text-balance-tight text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05] text-foreground"
            anchorLabel={t("anchorLink")}
          >
            {t("rangeTitle", { name: speciesName })}
          </AnchoredHeading>
          <p className="mx-auto mt-5 max-w-lg text-balance-tight text-[15px] leading-relaxed text-muted-foreground">
            {t("rangeSubtitle")}
          </p>
        </div>

        <div className="mt-14 lg:mt-16">
          <GeorgiaMap
            highlightedIds={highlightedIds}
            interactive={false}
          />
        </div>

        <nav
          aria-label={t("rangeRegionsLabel")}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {rangeRegions.map((region, index) => (
            <span key={region.id} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mr-1 text-muted-foreground/50" aria-hidden>
                  ·
                </span>
              ) : null}
              <Link
                href={regionHref(region.id)}
                className="text-[13px] leading-relaxed tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {localizeRegionText(region.name, locale)}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
