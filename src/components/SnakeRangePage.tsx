"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { getRegionContent } from "@/data/regionContent";
import {
  getRegionsForSpecies,
  localizeRegionText,
  regions,
  type Region,
} from "@/data/regions";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  getRegionSnakeSpecies,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

export function SnakeRangePage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeRange");
  const tShared = useTranslations("groupHubShared");
  const locale = useLocale() as AppLocale;
  const mappedCount = useMemo(
    () =>
      species.filter((item) => getRegionsForSpecies(item.id).length > 0).length,
    [species],
  );
  const highlightedIds: string[] = [];
  for (const region of regions) {
    if (getRegionSnakeSpecies(region).length > 0) {
      highlightedIds.push(region.id);
    }
  }

  return (
    <ClusterPageFrame
      guideId={guideId}
      heroSrc={heroSrc}
      ctaHash="#regions"
      heroObjectClass="object-[55%_68%]"
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {regions.length}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statRegions")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {mappedCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statMapped")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {species.length - mappedCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statPending")}
              </p>
            </div>
          </div>
        </section>
      }
    >
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("guideEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("guideTitle")}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>{t("guideP2")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="map-explorer relative overflow-hidden border-t border-border py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 map-explorer-texture"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("mapEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("mapTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {t("mapBody")}
            </p>
          </Reveal>
          <div className="mt-12 lg:mt-16">
            <GeorgiaMap
              selectionMode="navigate"
              mapContext="guide"
              highlightedIds={highlightedIds}
            />
          </div>
        </div>
      </section>

      <section
        id="regions"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("listEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("listTitle")}
            </h2>
          </Reveal>
          <ul className="mt-14 divide-y divide-border border-y border-border">
            {regions.map((region, index) => (
              <Reveal key={region.id} delay={Math.min(index * 25, 200)}>
                <RegionSnakeRow
                  region={region}
                  locale={locale}
                  pending={tShared("rangePending")}
                  snakeCountLabel={t("snakeCount", {
                    count: getRegionSnakeSpecies(region).length,
                  })}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </ClusterPageFrame>
  );
}

function RegionSnakeRow({
  region,
  locale,
  pending,
  snakeCountLabel,
}: {
  region: Region;
  locale: AppLocale;
  pending: string;
  snakeCountLabel: string;
}) {
  const snakes = getRegionSnakeSpecies(region);
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const biome = localizeRegionText(content.biome, locale);

  return (
    <li className="py-8 sm:py-9">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={regionHref(region.id)}
            className="group inline-flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <h3 className="font-display text-[clamp(1.3rem,2.5vw,1.75rem)] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>
            <span className="text-[12px] tracking-wide text-muted-foreground">
              {snakeCountLabel}
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
          </Link>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary/80">
            {biome}
          </p>
          {snakes.length === 0 ? (
            <p className="mt-3 text-[14px] text-muted-foreground">{pending}</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {snakes.map((item) => (
                <li key={item.id}>
                  <SpeciesChip species={item} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function SpeciesChip({
  species,
  locale,
}: {
  species: Species;
  locale: AppLocale;
}) {
  return (
    <Link
      href={speciesHref(species.id, locale)}
      className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {species.commonName}
    </Link>
  );
}
