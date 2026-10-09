import type { ReactNode } from "react";

import { ArrowRight, ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { RangeHatchSwatch } from "@/components/map/RangeHatch";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
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
  editable?: boolean;
  habitatDetails?: string;
  locale: AppLocale;
  speciesId: string;
  speciesName: string;
  updatedAt: string;
};

const EYEBROW_CLASS =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";
const STATIC_HATCH_ID = "range-hatch-static";

export async function SpeciesRangeMap({
  editable,
  habitatDetails,
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
        editable={editable}
        eyebrow={t("range")}
        habitatDetails={habitatDetails}
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
        speciesId={speciesId}
        updatedAt={updatedAt}
      />
    );
  }

  if (highlightedIds.length === 0 && !habitatDetails) return null;

  return (
    <section className="bg-surface py-9 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-4 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-[60px]">
        <div className="contents lg:col-start-1 lg:row-start-1 lg:block lg:min-w-0">
          <RangeHeading
            anchorLabel={t("anchorLink")}
            eyebrow={t("range")}
            title={t("rangeTitle", { name: speciesName })}
          />
          {habitatDetails ? (
            <div className="order-4 mt-4 lg:mt-[18px]">
              <RangeHabitatDetails
                body={habitatDetails}
                editorField={editable ? "habitat" : undefined}
                readLess={t("readLess")}
                readMore={t("readMore")}
                speciesId={editable ? speciesId : undefined}
              />
            </div>
          ) : null}
          {rangeRegions.length > 0 ? (
            <nav
              aria-label={t("rangeRegionsLabel")}
              className="order-3 rounded-b-[30px] bg-card px-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:mt-6 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              <ul>
                {rangeRegions.map((region) => (
                  <li className="border-t border-border" key={region.id}>
                    <Link
                      className="group flex min-h-[52px] items-center gap-3 text-[15.5px] font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary lg:min-h-14 lg:text-[17px]"
                      href={regionHref(region.id)}
                    >
                      <span className="min-w-0 flex-1">
                        {localizeRegionText(region.name, locale)}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {highlightedIds.length > 0 ? (
          <figure className="order-2 mt-5 min-w-0 rounded-t-[30px] bg-card p-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:col-start-2 lg:row-start-1 lg:mt-0 lg:rounded-[40px] lg:p-9">
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
        ) : null}
      </div>
    </section>
  );
}

async function GiurzaRangeSection({
  anchorLabel,
  copy,
  extraHabitat,
  eyebrow,
  iNaturalistTaxonId,
  locale,
  map,
  rangeRegions,
  recordCounts,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  extraHabitat?: string;
  eyebrow: string;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  map: ReactNode;
  rangeRegions: ReturnType<typeof getRegionsForSpecies>;
  recordCounts: Map<string, number>;
}) {
  const [tGiurza, tProfile] = await Promise.all([
    getTranslations({ locale, namespace: "giurzaRange" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const places = [1, 2, 3, 4] as const;

  return (
    <section className="bg-surface py-9 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-4 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-[60px]">
        <div className="contents lg:col-start-1 lg:row-start-1 lg:block lg:min-w-0">
          <RangeHeading
            anchorLabel={anchorLabel}
            eyebrow={eyebrow}
            title={copy.rangeTitle}
          />
          <p className="order-5 mt-4 text-[16px] leading-[1.65] text-muted-foreground lg:mt-[18px]">
            {tGiurza("lead")}
          </p>
          {extraHabitat ? (
            <details className="group order-5 mt-1 lg:mt-4">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[14px] font-medium text-foreground underline decoration-foreground/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  {tProfile("readMore")}
                </span>
                <span className="hidden group-open:inline">
                  {tProfile("readLess")}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-4 text-[15px] leading-[1.7] whitespace-pre-line text-muted-foreground">
                <PhoneLinkedText>{extraHabitat}</PhoneLinkedText>
              </p>
            </details>
          ) : null}
          <div className="mt-[22px] hidden items-baseline justify-between gap-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase lg:flex">
            <span>{tGiurza("regionsLabel")}</span>
            <span>{copy.regionRecordsLabel}</span>
          </div>
          <nav
            aria-label={tGiurza("regionsLabel")}
            className="order-3 rounded-b-[30px] bg-card px-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:mt-2 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none"
          >
            <ul>
              {rangeRegions.map((region) => (
                <li className="border-t border-border" key={region.id}>
                  <Link
                    className="group flex min-h-[52px] items-center gap-3 text-[15.5px] font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-14 lg:text-[17px]"
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
                    <span className="min-w-6 shrink-0 text-right text-[15px] font-medium text-muted-foreground tabular-nums">
                      {recordCounts.get(region.id)?.toLocaleString(locale) ??
                        "—"}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className={`${EYEBROW_CLASS} order-4 mt-6 lg:mt-7`}>
            {tGiurza("placesLabel")}
          </p>
          <ul className="order-4 mt-2.5 flex flex-wrap gap-1.5">
            {places.map((number) => (
              <li
                className="inline-flex min-h-[34px] items-center rounded-full bg-card px-[13px] text-[13.5px] font-medium text-foreground"
                key={number}
              >
                {tGiurza(`place${number}`)}
              </li>
            ))}
          </ul>
          <p className="order-6 mt-5 text-[13px] leading-[1.6] text-muted-foreground lg:mt-6">
            {tGiurza("recordNote")}
          </p>
          <RangeMapFooter copy={copy} iNaturalistTaxonId={iNaturalistTaxonId} />
        </div>
        <div className="order-2 mt-5 min-w-0 rounded-t-[30px] bg-card p-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:col-start-2 lg:row-start-1 lg:mt-0 lg:rounded-[40px] lg:p-9">
          {map}
        </div>
      </div>
    </section>
  );
}

async function HalyomorphaRangeSection({
  anchorLabel,
  copy,
  editable,
  eyebrow,
  habitatDetails,
  iNaturalistTaxonId,
  locale,
  occurrenceSummary,
  officialRegionIds,
  speciesId,
  updatedAt,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  editable?: boolean;
  eyebrow: string;
  habitatDetails?: string;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRegionIds: string[];
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
  const featured = speciesId === "macrovipera-lebetina";
  const tProfile = await getTranslations({ locale, namespace: "profile" });
  const detailParagraphs = habitatDetails?.split(/\n+/).slice(1).join("\n\n");
  const extraHabitat = detailParagraphs || habitatDetails;
  const recordCounts = new Map(
    occurrenceSummary.recordsByRegion.map((record) => [
      record.id,
      record.count,
    ]),
  );
  const officialRegionIdSet = new Set(officialRegionIds);
  const regionsById = new Map(regions.map((region) => [region.id, region]));
  const confirmedRegions = regions
    .filter((region) => officialRegionIdSet.has(region.id))
    .sort(
      (left, right) =>
        (recordCounts.get(right.id) ?? 0) - (recordCounts.get(left.id) ?? 0),
    );
  const recordedRegions = occurrenceSummary.recordsByRegion
    .filter((record) => !officialRegionIdSet.has(record.id))
    .map((record) => regionsById.get(record.id))
    .filter((region): region is (typeof regions)[number] => Boolean(region));
  const rangeRegions = featured
    ? getRegionsForSpecies(speciesId).sort(
        (left, right) =>
          (recordCounts.get(right.id) ?? 0) - (recordCounts.get(left.id) ?? 0),
      )
    : [];
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
      showLedger={false}
      speciesId={speciesId}
      stacked
    />
  );

  if (featured) {
    return (
      <GiurzaRangeSection
        anchorLabel={anchorLabel}
        copy={copy}
        extraHabitat={extraHabitat}
        eyebrow={eyebrow}
        iNaturalistTaxonId={iNaturalistTaxonId}
        locale={locale}
        map={map}
        rangeRegions={rangeRegions}
        recordCounts={recordCounts}
      />
    );
  }

  return (
    <section className="bg-surface py-9 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-4 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-[60px]">
        <div className="contents lg:col-start-1 lg:row-start-1 lg:block lg:min-w-0">
          <RangeHeading
            anchorLabel={anchorLabel}
            eyebrow={eyebrow}
            title={copy.rangeTitle}
          />
          <div className="order-5 mt-4 lg:mt-[18px]">
            {habitatDetails ? (
              <RangeHabitatDetails
                body={habitatDetails}
                editorField={editable ? "habitat" : undefined}
                readLess={tProfile("readLess")}
                readMore={tProfile("readMore")}
                speciesId={editable ? speciesId : undefined}
              />
            ) : null}
          </div>
          {confirmedRegions.length > 0 ? (
            <div className="order-3 rounded-b-[30px] bg-card px-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:mt-6 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="hidden items-baseline justify-between gap-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase lg:flex">
                <span>{copy.confirmedStatusLabel}</span>
                <span>{copy.regionRecordsLabel}</span>
              </div>
              <nav aria-label={copy.confirmedStatusLabel}>
                <ul className="lg:mt-2">
                  {confirmedRegions.map((region) => (
                    <li className="border-t border-border" key={region.id}>
                      <Link
                        className="group flex min-h-[52px] items-center gap-3 text-[15.5px] font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary lg:min-h-14 lg:text-[17px]"
                        href={regionHref(region.id)}
                      >
                        <span className="min-w-0 flex-1">
                          {localizeRegionText(region.name, locale)}
                        </span>
                        <span className="min-w-6 shrink-0 text-right text-[15px] font-medium text-muted-foreground tabular-nums">
                          {recordCounts
                            .get(region.id)
                            ?.toLocaleString(locale) ?? "—"}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ) : null}
          {recordedRegions.length > 0 ? (
            <details className="group order-4 mt-4 lg:mt-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-medium text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                {copy.recordedOnlyStatusLabel} · {recordedRegions.length}
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 transition-transform group-open:rotate-180"
                />
              </summary>
              <ul className="mt-2">
                {recordedRegions.map((region) => (
                  <li className="border-t border-border" key={region.id}>
                    <Link
                      className="flex min-h-11 items-center gap-3 text-[14px] text-foreground hover:text-primary"
                      href={regionHref(region.id)}
                    >
                      <span className="min-w-0 flex-1">
                        {localizeRegionText(region.name, locale)}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {recordCounts.get(region.id)?.toLocaleString(locale) ??
                          "—"}
                      </span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <p className="order-6 mt-5 text-[13px] leading-[1.6] text-muted-foreground lg:mt-6">
            {copy.intro}
          </p>
          <RangeMapFooter copy={copy} iNaturalistTaxonId={iNaturalistTaxonId} />
        </div>
        <div className="order-2 mt-5 min-w-0 rounded-t-[30px] bg-card p-4 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:col-start-2 lg:row-start-1 lg:mt-0 lg:rounded-[40px] lg:p-9">
          {map}
        </div>
      </div>
    </section>
  );
}

function RangeHabitatDetails({
  body,
  editorField,
  readLess,
  readMore,
  speciesId,
}: {
  body: string;
  editorField?: string;
  readLess: string;
  readMore: string;
  speciesId?: string;
}) {
  if (body.length <= 520) {
    return (
      <p
        className="text-[16px] leading-[1.65] whitespace-pre-line text-muted-foreground"
        data-content-field={editorField}
        data-content-id={speciesId}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
    );
  }

  return (
    <details className="group">
      <summary className="cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="line-clamp-3 text-[16px] leading-[1.65] text-muted-foreground group-open:hidden">
          {body}
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground underline decoration-foreground/30 underline-offset-4 group-open:hidden">
          {readMore}
          <ChevronDown aria-hidden="true" className="size-4" />
        </span>
        <span className="hidden items-center gap-1.5 text-[14px] font-medium text-foreground underline decoration-foreground/30 underline-offset-4 group-open:inline-flex">
          {readLess}
          <ChevronDown aria-hidden="true" className="size-4 rotate-180" />
        </span>
      </summary>
      <p
        className="mt-4 text-[15px] leading-[1.7] whitespace-pre-line text-muted-foreground"
        data-content-field={editorField}
        data-content-id={speciesId}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
    </details>
  );
}

function RangeHeading({
  anchorLabel,
  eyebrow,
  title,
}: {
  anchorLabel: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="order-1">
      <p className={EYEBROW_CLASS}>{eyebrow}</p>
      <AnchoredHeading
        anchorLabel={anchorLabel}
        className="mt-4 max-w-xl font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:text-[44px] lg:leading-[1.1]"
        id={SPECIES_SECTION_IDS.range}
        slugSource={title}
      >
        {title}
      </AnchoredHeading>
    </div>
  );
}

function RangeMapFooter({
  copy,
  iNaturalistTaxonId,
}: {
  copy: HalyomorphaRangeCopy;
  iNaturalistTaxonId: number;
}) {
  return (
    <p className="order-7 mt-3 text-[12px] leading-relaxed text-muted-foreground">
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
  );
}
