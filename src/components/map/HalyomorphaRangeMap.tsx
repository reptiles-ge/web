"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";
import type { HalyomorphaRegionSummary } from "@/lib/halyomorphaOccurrences";

import {
  HALYOMORPHA_REGION_QUERY_PARAM,
  type HalyomorphaFieldRecord,
  type HalyomorphaLazyMapProps,
  type HalyomorphaRangeMapCopy,
  type HalyomorphaRangeRegionName,
  type HalyomorphaSelectedRecord,
} from "@/components/map/HalyomorphaRangeMapTypes";
import {
  RangeHatchPattern,
  RangeHatchSwatch,
} from "@/components/map/RangeHatch";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { loadHalyomorphaOccurrences } from "@/lib/halyomorphaOccurrenceApi";
import { regionHref } from "@/lib/regionHref";

const HalyomorphaRangeMapClient = lazy(() =>
  import("@/components/map/HalyomorphaRangeMapClient").then((mod) => ({
    default: mod.HalyomorphaRangeMapClient,
  })),
);

const LATEST_RECORDS = 4;

type LedgerGroup = {
  id: string;
  label: string;
  rows: LedgerRow[];
};

type LedgerRow = {
  count: number;
  id: RegionPathId;
  name: string;
  official: boolean;
  pageLabel: string;
  years: string;
};

type MapData = {
  range: HalyomorphaRangeRegionFeatureCollection;
  records: HalyomorphaFieldRecord[];
};

export function HalyomorphaRangeMap({
  children,
  copy,
  dataRevision,
  locale,
  occurrenceSummary,
  officialRegionIds,
  regionNames,
  speciesId,
}: HalyomorphaLazyMapProps) {
  const hatchId = `range-hatch-${useId().replace(/:/g, "")}`;
  const plateRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<null | RegionPathId>(
    null,
  );
  const [hoveredRegionId, setHoveredRegionId] = useState<null | RegionPathId>(
    null,
  );
  const [selectedRecord, setSelectedRecord] =
    useState<HalyomorphaSelectedRecord | null>(null);
  const [atOverview, setAtOverview] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const hasRecords = occurrenceSummary.totalRecords > 0;

  const groups = useMemo(
    () =>
      ledgerGroups(
        copy,
        occurrenceSummary.recordsByRegion,
        officialRegionIds,
        regionNames,
      ),
    [copy, occurrenceSummary.recordsByRegion, officialRegionIds, regionNames],
  );
  const mapRegions = useMemo(() => {
    const counts = new Map(
      occurrenceSummary.recordsByRegion.map((region) => [
        region.id,
        region.count,
      ]),
    );
    return regionNames.map((region) => ({
      count: counts.get(region.id) ?? 0,
      id: region.id,
      name: region.name,
    }));
  }, [occurrenceSummary.recordsByRegion, regionNames]);
  const selectedRegion = selectedRegionId
    ? mapRegions.find((region) => region.id === selectedRegionId)
    : undefined;
  const latestRecords = useMemo(
    () =>
      selectedRegionId && mapData
        ? mapData.records
            .filter((record) => record.regionId === selectedRegionId)
            .slice(0, LATEST_RECORDS)
        : [],
    [mapData, selectedRegionId],
  );

  useEffect(() => {
    const plate = plateRef.current;
    if (!plate || shouldLoad) return;
    const initialRegionId = new URLSearchParams(window.location.search).get(
      HALYOMORPHA_REGION_QUERY_PARAM,
    );
    const initialRegion = regionNames.find(
      (region) => region.id === initialRegionId,
    );
    if (initialRegion) {
      const frame = window.requestAnimationFrame(() => {
        setSelectedRegionId(initialRegion.id);
        setShouldLoad(true);
        plate.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "420px" },
    );
    observer.observe(plate);
    return () => observer.disconnect();
  }, [regionNames, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const controller = new AbortController();
    Promise.all([
      fetch("/geodata/georgia-regions-v1.json", {
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("Georgia regions request failed");
        return response.json() as Promise<HalyomorphaRangeRegionFeatureCollection>;
      }),
      hasRecords
        ? loadHalyomorphaOccurrences(speciesId, locale, dataRevision)
        : [],
    ])
      .then(([georgiaRegions, records]) => {
        if (controller.signal.aborted) return;
        const officialIds = new Set(officialRegionIds);
        setMapData({
          range: {
            ...georgiaRegions,
            features: georgiaRegions.features.map((feature) => ({
              ...feature,
              properties: {
                ...feature.properties,
                isOfficialRange: officialIds.has(feature.properties.id),
              },
            })),
          },
          records,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [
    dataRevision,
    hasRecords,
    locale,
    officialRegionIds,
    shouldLoad,
    speciesId,
  ]);

  const selectRegion = useCallback((regionId: RegionPathId) => {
    setSelectedRegionId(regionId);
    setSelectedRecord(null);
    setShouldLoad(true);
    updateRegionUrl(regionId);
  }, []);
  const reset = useCallback(() => {
    setSelectedRegionId(null);
    setSelectedRecord(null);
    setResetSignal((signal) => signal + 1);
    updateRegionUrl(null);
  }, []);
  const selectRecord = useCallback((recordId: null | string) => {
    setSelectedRecord(recordId ? { id: recordId, reveal: false } : null);
  }, []);
  const revealPlate = () => {
    const plate = plateRef.current;
    if (!plate) return;
    const { bottom, top } = plate.getBoundingClientRect();
    if (top >= 96 && bottom <= window.innerHeight) return;
    plate.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  };

  return (
    <div
      className={cn(
        "grid gap-x-12 xl:gap-x-16",
        groups.length > 0 &&
          "lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_21rem]",
      )}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute size-0"
        focusable="false"
      >
        <defs>
          <RangeHatchPattern id={hatchId} />
        </defs>
      </svg>

      <div
        className="relative isolate z-0 -mx-6 aspect-6/5 overflow-hidden border-y border-border bg-surface sm:mx-0 sm:aspect-3/2 sm:rounded-lg sm:border lg:col-start-1 lg:row-start-1 lg:aspect-5/3 lg:max-h-[600px]"
        data-range-map=""
        ref={plateRef}
      >
        {mapData ? (
          <Suspense fallback={<PlateMessage>{copy.loadingLabel}</PlateMessage>}>
            <HalyomorphaRangeMapClient
              copy={copy}
              hatchId={hatchId}
              hoveredRegionId={hoveredRegionId}
              onHoverRegion={setHoveredRegionId}
              onOverviewChange={setAtOverview}
              onSelectRecord={selectRecord}
              onSelectRegion={selectRegion}
              range={mapData.range}
              records={mapData.records}
              regions={mapRegions}
              resetSignal={resetSignal}
              selectedRecord={selectedRecord}
              selectedRegionId={selectedRegionId}
            />
          </Suspense>
        ) : (
          <PlateMessage status={!loadError}>
            {loadError ? copy.mapError : copy.loadingLabel}
          </PlateMessage>
        )}

        {mapData && (selectedRegion || !atOverview) ? (
          <div className="absolute top-3 left-3 z-800 flex max-w-[calc(100%-4.75rem)] items-stretch overflow-hidden rounded-md border border-border bg-card text-[13px] leading-none text-foreground">
            <button
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 px-2.5 font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-10"
              onClick={reset}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              {copy.resetToGeorgiaLabel}
            </button>
            {selectedRegion ? (
              <p
                aria-live="polite"
                className="flex min-w-0 items-center border-l border-border px-2.5 text-muted-foreground"
              >
                <span className="truncate">
                  <span className="font-medium text-foreground">
                    {selectedRegion.name}
                  </span>
                  <span className="hidden sm:inline">
                    {" · "}
                    {selectedRegion.count > 0
                      ? `${selectedRegion.count.toLocaleString(locale)} ${copy.regionRecordsLabel}`
                      : copy.noRegionRecordsLabel}
                  </span>
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] leading-snug text-muted-foreground lg:col-start-1 lg:row-start-2">
        {hasRecords ? (
          <li className="inline-flex items-center gap-2">
            <span aria-hidden="true" data-range-mark="dot" />
            {copy.locationRecordLabel}
          </li>
        ) : null}
        {occurrenceSummary.photoRecordCount > 0 ? (
          <li className="inline-flex items-center gap-2">
            <span aria-hidden="true" data-range-mark="photo" />
            {copy.photoRecordLabel}
          </li>
        ) : null}
        {officialRegionIds.length > 0 ? (
          <li className="inline-flex items-center gap-2">
            <RangeHatchSwatch id={hatchId} />
            {copy.officialRegionLabel}
          </li>
        ) : null}
      </ul>

      {groups.length > 0 ? (
        <div className="mt-10 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0">
          <table className="w-full border-collapse text-[14px] leading-snug">
            <caption className="pb-1 text-left font-display text-[1.125rem] leading-tight font-semibold text-foreground">
              {copy.regionSummaryTitle}
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{copy.regionsMetricLabel}</th>
                <th scope="col">{copy.regionRecordsLabel}</th>
                <td />
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.id}>
                <tr>
                  <th
                    className="pt-5 pb-2 text-left text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
                    colSpan={3}
                    scope="rowgroup"
                  >
                    {group.label}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <LedgerRegion
                    copy={copy}
                    hatchId={hatchId}
                    hovered={hoveredRegionId === row.id}
                    key={row.id}
                    latestRecords={latestRecords}
                    locale={locale}
                    onHover={setHoveredRegionId}
                    onRevealRecord={(recordId) => {
                      setSelectedRecord({ id: recordId, reveal: true });
                      revealPlate();
                    }}
                    onToggle={() => {
                      if (selectedRegionId === row.id) {
                        reset();
                        return;
                      }
                      selectRegion(row.id);
                      revealPlate();
                    }}
                    row={row}
                    selected={selectedRegionId === row.id}
                    selectedRecordId={selectedRecord?.id}
                  />
                ))}
              </tbody>
            ))}
          </table>
        </div>
      ) : null}

      {children ? (
        <div className="mt-8 lg:col-start-1 lg:row-start-3 lg:mt-6">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function formatYearRange(region: HalyomorphaRegionSummary) {
  if (!region.firstYear || !region.lastYear) return "";
  if (region.firstYear === region.lastYear) return String(region.firstYear);
  return `${region.firstYear}–${region.lastYear}`;
}

function ledgerGroups(
  copy: HalyomorphaRangeMapCopy,
  recordsByRegion: HalyomorphaRegionSummary[],
  officialRegionIds: string[],
  regionNames: HalyomorphaRangeRegionName[],
): LedgerGroup[] {
  const officialIds = new Set(officialRegionIds);
  const names = new Map(regionNames.map((region) => [region.id, region]));
  const recorded = new Set(recordsByRegion.map((region) => region.id));
  const toRow = (region: HalyomorphaRegionSummary): LedgerRow => ({
    count: region.count,
    id: region.id,
    name: names.get(region.id)?.name ?? region.name,
    official: officialIds.has(region.id),
    pageLabel: names.get(region.id)?.pageLabel ?? region.name,
    years: formatYearRange(region),
  });

  return [
    {
      id: "confirmed",
      label: copy.confirmedStatusLabel,
      rows: recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map(toRow),
    },
    {
      id: "recorded-only",
      label: copy.recordedOnlyStatusLabel,
      rows: recordsByRegion
        .filter((region) => region.status !== "confirmed")
        .map(toRow),
    },
    {
      id: "official",
      label: copy.officialRegionLabel,
      rows: regionNames
        .filter(
          (region) => officialIds.has(region.id) && !recorded.has(region.id),
        )
        .map((region) => ({
          count: 0,
          id: region.id,
          name: region.name,
          official: true,
          pageLabel: region.pageLabel,
          years: "",
        })),
    },
  ].filter((group) => group.rows.length > 0);
}

function LedgerRegion({
  copy,
  hatchId,
  hovered,
  latestRecords,
  locale,
  onHover,
  onRevealRecord,
  onToggle,
  row,
  selected,
  selectedRecordId,
}: {
  copy: HalyomorphaRangeMapCopy;
  hatchId: string;
  hovered: boolean;
  latestRecords: HalyomorphaFieldRecord[];
  locale: HalyomorphaLazyMapProps["locale"];
  onHover: (regionId: null | RegionPathId) => void;
  onRevealRecord: (recordId: string) => void;
  onToggle: () => void;
  row: LedgerRow;
  selected: boolean;
  selectedRecordId?: string;
}) {
  return (
    <>
      <tr
        className={cn(
          "border-t border-border/70 transition-colors",
          (hovered || selected) && "bg-surface",
        )}
        onMouseEnter={() => onHover(row.id)}
        onMouseLeave={() => onHover(null)}
      >
        <th className="p-0 text-left font-normal" scope="row">
          <span className="flex items-center gap-2.5 pl-2">
            {row.official ? (
              <>
                <RangeHatchSwatch id={hatchId} />
                <span className="sr-only">{copy.officialRegionLabel}</span>
              </>
            ) : (
              <span aria-hidden="true" data-range-mark="swatch" />
            )}
            <button
              aria-expanded={selected}
              className={cn(
                "min-h-11 min-w-0 flex-1 py-2 text-left transition-colors hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                selected ? "font-semibold text-foreground" : "text-foreground",
              )}
              onBlur={() => onHover(null)}
              onClick={onToggle}
              onFocus={() => onHover(row.id)}
              type="button"
            >
              {row.name}
            </button>
          </span>
        </th>
        <td className="px-2 text-right text-foreground tabular-nums">
          {row.count > 0 ? row.count.toLocaleString(locale) : "—"}
        </td>
        <td className="w-10 p-0 text-right">
          <Link
            aria-label={row.pageLabel}
            className="inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            href={regionHref(row.id)}
            title={row.pageLabel}
          >
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </td>
      </tr>
      {selected ? (
        <tr className="bg-surface">
          <td className="pt-0 pr-2 pb-4 pl-7.5" colSpan={3}>
            {row.count === 0 || row.years ? (
              <p className="text-[13px] text-muted-foreground">
                {row.count > 0 ? row.years : copy.noRegionRecordsLabel}
              </p>
            ) : null}
            {latestRecords.length > 0 ? (
              <>
                <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {copy.latestRecordsLabel}
                </p>
                <ul className="mt-1">
                  {latestRecords.map((record) => (
                    <li key={record.id}>
                      <button
                        aria-pressed={selectedRecordId === record.id}
                        className={cn(
                          "flex min-h-9 w-full items-baseline gap-2 py-1.5 text-left text-[13px] transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary pointer-coarse:min-h-11",
                          selectedRecordId === record.id
                            ? "font-semibold text-primary"
                            : "text-foreground",
                        )}
                        onClick={() => onRevealRecord(record.id)}
                        type="button"
                      >
                        <span aria-hidden="true" data-range-mark="dot" />
                        <span className="min-w-0">
                          {record.locality}
                          {record.formattedDate ? (
                            <span className="font-normal text-muted-foreground">
                              {" · "}
                              {record.formattedDate}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}

function PlateMessage({
  children,
  status = true,
}: {
  children: string;
  status?: boolean;
}) {
  return (
    <p
      className="absolute inset-0 flex items-center justify-center px-8 text-center text-[13px] leading-relaxed text-muted-foreground"
      role={status ? "status" : "alert"}
    >
      {children}
    </p>
  );
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
}

function updateRegionUrl(regionId: null | RegionPathId) {
  const url = new URL(window.location.href);
  if (regionId) {
    url.searchParams.set(HALYOMORPHA_REGION_QUERY_PARAM, regionId);
  } else {
    url.searchParams.delete(HALYOMORPHA_REGION_QUERY_PARAM);
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}
