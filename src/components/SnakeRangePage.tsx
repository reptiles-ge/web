import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { getRegionContent } from "@/data/regionContent";
import {
  getRegionTooltipPreviews,
  getRegionsForSpecies,
  localizeRegionText,
  type Region,
  regions,
} from "@/data/regions";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  getRegionSnakeSpecies,
} from "@/lib/clusterGuides";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

export async function SnakeRangePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("snakeRange");
  const tShared = await getTranslations("groupHubShared");
  const locale = (await getLocale()) as AppLocale;
  const mappedCount = species.filter(
    (item) => getRegionsForSpecies(item.id).length > 0,
  ).length;
  const highlightedIds: string[] = [];
  for (const region of regions) {
    if (getRegionSnakeSpecies(region).length > 0) {
      highlightedIds.push(region.id);
    }
  }

  return (
    <ClusterPageFrame
      ctaHash="#regions"
      guideId={guideId}
      heroObjectClass="object-[55%_68%]"
      heroSrc={heroSrc}
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat label={t("statRegions")} value={regions.length} />
            <ClusterStat label={t("statMapped")} value={mappedCount} />
            <ClusterStat
              label={t("statPending")}
              value={species.length - mappedCount}
            />
          </div>
        </section>
      }
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <section className="map-explorer relative overflow-hidden border-t border-border py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="map-explorer-texture pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
              {t("mapEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-display-title font-semibold">
              {t("mapTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {t("mapBody")}
            </p>
          </div>
          <div className="mt-12 lg:mt-16">
            <GeorgiaMap
              highlightedIds={highlightedIds}
              mapContext="guide"
              selectionMode="navigate"
              tooltipSpeciesByRegion={getRegionTooltipPreviews(locale)}
            />
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="regions"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              eyebrow={t("listEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("listTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
          <ul className="mt-14 divide-y divide-border border-y border-border">
            {regions.map((region) => (
              <div key={region.id}>
                <RegionSnakeRow
                  locale={locale}
                  pending={tShared("rangePending")}
                  region={region}
                  snakeCountLabel={t("snakeCount", {
                    count: getRegionSnakeSpecies(region).length,
                  })}
                />
              </div>
            ))}
          </ul>
        </div>
      </section>
    </ClusterPageFrame>
  );
}

function RegionSnakeRow({
  locale,
  pending,
  region,
  snakeCountLabel,
}: {
  locale: AppLocale;
  pending: string;
  region: Region;
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
            className="group inline-flex flex-wrap items-baseline gap-x-3 gap-y-1"
            href={regionHref(region.id)}
          >
            <h3 className="font-display text-display-card font-semibold text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>
            <span className="text-[12px] tracking-wide text-muted-foreground">
              {snakeCountLabel}
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
          </Link>
          <p className="mt-2 text-[11px] font-medium tracking-[0.2em] text-primary/80 uppercase">
            {biome}
          </p>
          {snakes.length === 0 ? (
            <p className="mt-3 text-[14px] text-muted-foreground">{pending}</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {snakes.map((item) => (
                <li key={item.id}>
                  <SpeciesChip locale={locale} species={item} />
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
  locale,
  species,
}: {
  locale: AppLocale;
  species: Species;
}) {
  return (
    <Link
      className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      href={speciesHref(species.id, locale)}
    >
      {species.commonName}
    </Link>
  );
}
