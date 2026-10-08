"use client";

import { ArrowLeft } from "lucide-react";
import {
  lazy,
  type RefObject,
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
import type { AppLocale } from "@/i18n/routing";

import { HalyomorphaRangeLedger } from "@/components/map/HalyomorphaRangeLedger";
import {
  HALYOMORPHA_REGION_QUERY_PARAM,
  type HalyomorphaFieldRecord,
  type HalyomorphaLazyMapProps,
  type HalyomorphaRangeMapCopy,
  type HalyomorphaRangeRegionLabel,
  type HalyomorphaRangeRegionName,
  type HalyomorphaSelectedRecord,
} from "@/components/map/HalyomorphaRangeMapTypes";
import {
  RangeHatchPattern,
  RangeHatchSwatch,
} from "@/components/map/RangeHatch";
import { cn } from "@/lib/cn";
import { loadHalyomorphaOccurrences } from "@/lib/halyomorphaOccurrenceApi";

const HalyomorphaRangeMapClient = lazy(() =>
  import("@/components/map/HalyomorphaRangeMapClient").then((mod) => ({
    default: mod.HalyomorphaRangeMapClient,
  })),
);

const NO_RECORDS: HalyomorphaFieldRecord[] = [];

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
  stacked = false,
}: HalyomorphaLazyMapProps & { stacked?: boolean }) {
  const hatchId = `range-hatch-${useId().replace(/:/g, "")}`;
  const plateRef = useRef<HTMLDivElement>(null);
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
  const { photoRecordCount, recordsByRegion, totalRecords } = occurrenceSummary;
  const hasLedger = recordsByRegion.length + officialRegionIds.length > 0;

  const [shouldLoad, activate] = useRangeMapActivation(
    plateRef,
    regionNames,
    setSelectedRegionId,
  );
  const { loadError, mapData } = useRangeMapData({
    dataRevision,
    enabled: shouldLoad,
    hasRecords: totalRecords > 0,
    locale,
    officialRegionIds,
    speciesId,
  });
  const mapRegions = useMemo(
    () => regionLabels(regionNames, recordsByRegion),
    [recordsByRegion, regionNames],
  );
  const selectedRegion = mapRegions.find(
    (region) => region.id === selectedRegionId,
  );

  const selectRegion = useCallback(
    (regionId: RegionPathId) => {
      setSelectedRegionId(regionId);
      setSelectedRecord(null);
      activate();
      updateRegionUrl(regionId);
    },
    [activate],
  );
  const reset = useCallback(() => {
    setSelectedRegionId(null);
    setSelectedRecord(null);
    setResetSignal((signal) => signal + 1);
    updateRegionUrl(null);
  }, []);
  const selectRecord = useCallback((recordId: null | string) => {
    setSelectedRecord(recordId ? { id: recordId, reveal: false } : null);
  }, []);
  const toggleRegion = (regionId: RegionPathId) => {
    if (selectedRegionId === regionId) {
      reset();
      return;
    }
    selectRegion(regionId);
    revealPlate(plateRef.current);
  };
  const revealRecord = (recordId: string) => {
    setSelectedRecord({ id: recordId, reveal: true });
    revealPlate(plateRef.current);
  };

  return (
    <div
      className={cn(
        "grid gap-x-12 xl:gap-x-16",
        hasLedger &&
          !stacked &&
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
        className="relative isolate z-0 -mx-6 aspect-6/5 overflow-hidden border-y border-border bg-surface sm:mx-0 sm:aspect-3/2 sm:rounded-card sm:border lg:col-start-1 lg:row-start-1 lg:aspect-5/3 lg:max-h-[600px]"
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
          <PlateStatus copy={copy} failed={loadError} />
        )}
        <RangeMapStrip
          atOverview={atOverview}
          copy={copy}
          locale={locale}
          onReset={reset}
          ready={mapData !== null}
          region={selectedRegion}
        />
      </div>

      <RangeMapLegend
        copy={copy}
        hatchId={hatchId}
        officialRegions={officialRegionIds.length}
        photoRecords={photoRecordCount}
        records={totalRecords}
      />

      <HalyomorphaRangeLedger
        copy={copy}
        hatchId={hatchId}
        hoveredRegionId={hoveredRegionId}
        locale={locale}
        officialRegionIds={officialRegionIds}
        onHoverRegion={setHoveredRegionId}
        onRevealRecord={revealRecord}
        onToggleRegion={toggleRegion}
        records={mapData?.records ?? NO_RECORDS}
        recordsByRegion={recordsByRegion}
        regionNames={regionNames}
        selectedRecordId={selectedRecord?.id}
        selectedRegionId={selectedRegionId}
        stacked={stacked}
      />

      {children ? (
        <div
          className={
            stacked ? "mt-6" : "mt-8 lg:col-start-1 lg:row-start-3 lg:mt-6"
          }
        >
          {children}
        </div>
      ) : null}
    </div>
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

function PlateStatus({
  copy,
  failed,
}: {
  copy: HalyomorphaRangeMapCopy;
  failed: boolean;
}) {
  return (
    <PlateMessage status={!failed}>
      {failed ? copy.mapError : copy.loadingLabel}
    </PlateMessage>
  );
}

function RangeMapLegend({
  copy,
  hatchId,
  officialRegions,
  photoRecords,
  records,
}: {
  copy: HalyomorphaRangeMapCopy;
  hatchId: string;
  officialRegions: number;
  photoRecords: number;
  records: number;
}) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] leading-snug text-muted-foreground lg:col-start-1 lg:row-start-2">
      {records > 0 ? (
        <li className="inline-flex items-center gap-2">
          <span aria-hidden="true" data-range-mark="dot" />
          {copy.locationRecordLabel}
        </li>
      ) : null}
      {records > 1 ? (
        <li className="inline-flex items-center gap-2">
          <span aria-hidden="true" data-range-mark="cluster">
            5
          </span>
          {copy.clusterLabel}
        </li>
      ) : null}
      {photoRecords > 0 ? (
        <li className="inline-flex items-center gap-2">
          <span aria-hidden="true" data-range-mark="photo" />
          {copy.photoRecordLabel}
        </li>
      ) : null}
      {officialRegions > 0 ? (
        <li className="inline-flex items-center gap-2">
          <RangeHatchSwatch id={hatchId} />
          {copy.officialRegionLabel}
        </li>
      ) : null}
    </ul>
  );
}

function RangeMapStrip({
  atOverview,
  copy,
  locale,
  onReset,
  ready,
  region,
}: {
  atOverview: boolean;
  copy: HalyomorphaRangeMapCopy;
  locale: AppLocale;
  onReset: () => void;
  ready: boolean;
  region?: HalyomorphaRangeRegionLabel;
}) {
  if (!ready) return null;
  if (!region && atOverview) return null;

  return (
    <div className="absolute top-3 left-3 z-800 flex max-w-[calc(100%-4.75rem)] items-stretch overflow-hidden rounded-full border border-border bg-card text-[13px] leading-none text-foreground">
      <button
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 pr-2.5 pl-3.5 font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-10"
        onClick={onReset}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        {copy.resetToGeorgiaLabel}
      </button>
      {region ? (
        <p
          aria-live="polite"
          className="flex min-w-0 items-center border-l border-border pr-4 pl-2.5 text-muted-foreground"
        >
          <span className="truncate">
            <span className="font-medium text-foreground">{region.name}</span>
            <span className="hidden sm:inline">
              {" · "}
              {region.count > 0
                ? `${region.count.toLocaleString(locale)} ${copy.regionRecordsLabel}`
                : copy.noRegionRecordsLabel}
            </span>
          </span>
        </p>
      ) : null}
    </div>
  );
}

function regionLabels(
  regionNames: HalyomorphaRangeRegionName[],
  recordsByRegion: HalyomorphaLazyMapProps["occurrenceSummary"]["recordsByRegion"],
): HalyomorphaRangeRegionLabel[] {
  const counts = new Map(
    recordsByRegion.map((region) => [region.id, region.count]),
  );
  return regionNames.map((region) => ({
    count: counts.get(region.id) ?? 0,
    id: region.id,
    name: region.name,
  }));
}

function revealPlate(plate: HTMLElement | null) {
  if (!plate) return;
  const { bottom, top } = plate.getBoundingClientRect();
  if (top >= 96 && bottom <= window.innerHeight) return;
  plate.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
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

function useRangeMapActivation(
  plateRef: RefObject<HTMLDivElement | null>,
  regionNames: HalyomorphaRangeRegionName[],
  onDeepLink: (regionId: RegionPathId) => void,
) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const activate = useCallback(() => setShouldLoad(true), []);

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
        onDeepLink(initialRegion.id);
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
  }, [onDeepLink, plateRef, regionNames, shouldLoad]);

  return [shouldLoad, activate] as const;
}

function useRangeMapData({
  dataRevision,
  enabled,
  hasRecords,
  locale,
  officialRegionIds,
  speciesId,
}: {
  dataRevision: string;
  enabled: boolean;
  hasRecords: boolean;
  locale: AppLocale;
  officialRegionIds: string[];
  speciesId: string;
}) {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
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
        : NO_RECORDS,
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
  }, [dataRevision, enabled, hasRecords, locale, officialRegionIds, speciesId]);

  return { loadError, mapData };
}
