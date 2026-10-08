import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { RangeHatchSwatch } from "@/components/map/RangeHatch";
import {
  getRegionsForSpecies,
  localizeRegionText,
  regions,
} from "@/data/mapRegions";
import {
  type HalyomorphaRangeCopy,
  INTERACTIVE_RANGE_MAPS,
} from "@/data/speciesRangeMaps";
import { Link } from "@/i18n/navigation";
import { getOccurrenceSummary } from "@/lib/occurrenceSummaries";
import { regionHref } from "@/lib/regionHref";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesRangeMapProps = {
  locale: AppLocale;
  speciesId: string;
  speciesName: string;
  updatedAt: string;
};

const EYEBROW_CLASS =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";
const HEADING_CLASS =
  "mt-5 max-w-4xl font-display text-display-title leading-[1.14] font-bold text-foreground";
const STATIC_HATCH_ID = "range-hatch-static";

export async function SpeciesRangeMap({
  locale,
  speciesId,
  speciesName,
  updatedAt,
}: SpeciesRangeMapProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const rangeRegions = getRegionsForSpecies(speciesId);
  const highlightedIds = rangeRegions.map((region) => region.id);
  const interactiveRangeConfig = INTERACTIVE_RANGE_MAPS[speciesId];
  const interactiveRangeCopy = interactiveRangeConfig?.copy[locale];
  const interactiveRangeSummary = interactiveRangeCopy
    ? getOccurrenceSummary(speciesId, locale)
    : null;

  if (
    interactiveRangeConfig &&
    interactiveRangeCopy &&
    interactiveRangeSummary
  ) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={interactiveRangeCopy}
        eyebrow={t("range")}
        iNaturalistTaxonId={interactiveRangeConfig.iNaturalistTaxonId}
        locale={locale}
        occurrenceSummary={interactiveRangeSummary}
        officialRegionIds={
          interactiveRangeConfig.rangeSource === "record-summary"
            ? interactiveRangeSummary.recordsByRegion.reduce<string[]>(
                (ids, region) => {
                  if (region.status === "confirmed") ids.push(region.id);
                  return ids;
                },
                [],
              )
            : highlightedIds
        }
        regionMetric={interactiveRangeConfig.regionMetric}
        speciesId={speciesId}
        updatedAt={updatedAt}
      />
    );
  }

  if (highlightedIds.length === 0) return null;

  return (
    <section className="bg-background py-11 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className={EYEBROW_CLASS}>{t("range")}</p>
        <AnchoredHeading
          anchorLabel={t("anchorLink")}
          className={HEADING_CLASS}
          id={SPECIES_SECTION_IDS.range}
          slugSource={t("rangeTitle", { name: speciesName })}
        >
          {t("rangeTitle", { name: speciesName })}
        </AnchoredHeading>

        <div className="mt-10 grid gap-x-12 gap-y-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-x-16">
          <figure>
            <GeorgiaMapStatic
              hatchId={STATIC_HATCH_ID}
              highlightedIds={highlightedIds}
            />
            <figcaption className="mt-4 flex items-baseline gap-2 text-[12px] leading-snug text-muted-foreground">
              <span className="translate-y-px">
                <RangeHatchSwatch id={STATIC_HATCH_ID} />
              </span>
              {t("rangeSubtitle")}
            </figcaption>
          </figure>

          <nav aria-label={t("rangeRegionsLabel")}>
            <ol className="-mx-2.5 text-[14px] leading-snug">
              {rangeRegions.map((region, index) => (
                <li key={region.id}>
                  <Link
                    className="group flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-1 text-foreground transition-colors hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                    href={regionHref(region.id)}
                  >
                    <span aria-hidden="true" data-range-mark="key">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      {localizeRegionText(region.name, locale)}
                    </span>
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}

function formatYearRange(summary: HalyomorphaOccurrenceSummary) {
  if (!summary.firstYear || !summary.lastYear) return "";
  if (summary.firstYear === summary.lastYear) return String(summary.firstYear);
  return `${summary.firstYear}–${summary.lastYear}`;
}

async function HalyomorphaRangeSection({
  anchorLabel,
  copy,
  eyebrow,
  iNaturalistTaxonId,
  locale,
  occurrenceSummary,
  officialRegionIds,
  regionMetric,
  speciesId,
  updatedAt,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  eyebrow: string;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRegionIds: string[];
  regionMetric?: "confirmed";
  speciesId: string;
  updatedAt: string;
}) {
  const mapCopy = {
    closeLabel: copy.closeLabel,
    clusterLabel: copy.clusterLabel,
    confirmedStatusLabel: copy.confirmedStatusLabel,
    galleryAction: copy.galleryAction,
    latestRecordsLabel: copy.latestRecordsLabel,
    loadingLabel: copy.loadingLabel,
    locationRecordLabel: copy.locationRecordLabel,
    mapAria: copy.mapAria,
    mapError: copy.mapError,
    noRegionRecordsLabel: copy.noRegionRecordsLabel,
    officialRegionLabel: copy.officialRegionLabel,
    photoRecordLabel: copy.photoRecordLabel,
    recordedOnlyStatusLabel: copy.recordedOnlyStatusLabel,
    regionRecordsLabel: copy.regionRecordsLabel,
    regionsMetricLabel: copy.regionsMetricLabel,
    regionSummaryTitle: copy.regionSummaryTitle,
    resetToGeorgiaLabel: copy.resetToGeorgiaLabel,
    sourceAction: copy.sourceAction,
    zoomInLabel: copy.zoomInLabel,
    zoomOutLabel: copy.zoomOutLabel,
  };
  const facts = [
    {
      label: copy.regionRecordsLabel,
      value: occurrenceSummary.totalRecords.toLocaleString(locale),
    },
    { label: "", value: formatYearRange(occurrenceSummary) },
    {
      label: copy.regionsMetricLabel,
      value: (regionMetric === "confirmed"
        ? officialRegionIds.length
        : occurrenceSummary.regionsWithRecords
      ).toLocaleString(locale),
    },
  ].filter((fact) => fact.value);
  const featured = speciesId === "macrovipera-lebetina";
  const tGiurza = featured
    ? await getTranslations({ locale, namespace: "giurzaRange" })
    : null;
  const rangeRegions = featured ? getRegionsForSpecies(speciesId) : [];
  const map = (
    <HalyomorphaRangeMap
      copy={mapCopy}
      dataRevision={updatedAt}
      locale={locale}
      occurrenceSummary={occurrenceSummary}
      officialRegionIds={officialRegionIds}
      regionNames={regions.map((region) => {
        const name = localizeRegionText(region.name, locale);
        return {
          id: region.id,
          name,
          pageLabel: copy.regionPageLabel(name),
        };
      })}
      speciesId={speciesId}
      stacked={featured}
    >
      <p className="max-w-[72ch] text-[13px] leading-relaxed text-muted-foreground">
        {copy.intro}
      </p>
      <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        {copy.footerDataLabel}: {copy.footerReptilesLabel} +{" "}
        <a
          className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
          href={`https://www.inaturalist.org/observations?place_id=8857&taxon_id=${iNaturalistTaxonId}`}
          rel="noreferrer"
          target="_blank"
        >
          {copy.footerINaturalistLabel}
        </a>{" "}
        ·{" "}
        <Link
          className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
          href={{ hash: "methodology", pathname: "/about" }}
        >
          {copy.footerMethodologyLabel}
        </Link>
      </p>
    </HalyomorphaRangeMap>
  );

  if (featured && tGiurza) {
    const places = [1, 2, 3, 4] as const;

    return (
      <section className="bg-surface py-11 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-[60px]">
          <div className="min-w-0">
            <p className={EYEBROW_CLASS}>{eyebrow}</p>
            <AnchoredHeading
              anchorLabel={anchorLabel}
              className="mt-4 max-w-xl font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:text-[44px] lg:leading-[1.1]"
              id={SPECIES_SECTION_IDS.range}
              slugSource={copy.rangeTitle}
            >
              {copy.rangeTitle}
            </AnchoredHeading>
            <p className="mt-[18px] text-[16px] leading-[1.65] text-muted-foreground">
              {tGiurza("lead")}
            </p>
            <nav aria-label={tGiurza("regionsLabel")} className="mt-[22px]">
              <ul>
                {rangeRegions.map((region) => (
                  <li
                    className="border-t border-border last:border-b"
                    key={region.id}
                  >
                    <Link
                      className="group flex min-h-14 items-center gap-3 text-[17px] font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      href={regionHref(region.id)}
                    >
                      <span className="min-w-0 flex-1">
                        {localizeRegionText(region.name, locale)}
                      </span>
                      {region.id === "tbilisi" ? (
                        <span className="rounded-full bg-[#f3ecd9] px-2.5 py-1 text-[12px] font-medium text-[#4f3f17]">
                          {tGiurza("rare")}
                        </span>
                      ) : null}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className={`${EYEBROW_CLASS} mt-7`}>{tGiurza("placesLabel")}</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {places.map((number) => (
                <li
                  className="inline-flex min-h-[34px] items-center rounded-full bg-card px-[13px] text-[13.5px] font-medium text-foreground"
                  key={number}
                >
                  {tGiurza(`place${number}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-[30px] bg-card p-4 shadow-[0_16px_40px_rgba(14,20,17,0.06)] sm:p-7 lg:rounded-[40px] lg:p-9">
            {map}
            <p className="mt-5 text-right text-[13.5px] font-medium text-foreground">
              {tGiurza("regionCount", {
                count: officialRegionIds.length,
                total: regions.length,
              })}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-11 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className={EYEBROW_CLASS}>{eyebrow}</p>
        <AnchoredHeading
          anchorLabel={anchorLabel}
          className={HEADING_CLASS}
          id={SPECIES_SECTION_IDS.range}
          slugSource={copy.rangeTitle}
        >
          {copy.rangeTitle}
        </AnchoredHeading>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[15px] leading-relaxed text-muted-foreground">
          {facts.map((fact) => (
            <span key={fact.label}>
              <span className="font-semibold text-foreground tabular-nums">
                {fact.value}
              </span>
              {fact.label ? ` ${fact.label}` : null}
            </span>
          ))}
        </p>

        <div className="mt-10 lg:mt-12">{map}</div>
      </div>
    </section>
  );
}
