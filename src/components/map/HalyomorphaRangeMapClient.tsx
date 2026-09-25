"use client";

import type {
  Control,
  LatLngBoundsExpression,
  GeoJSON as LeafletGeoJson,
  Map as LeafletMap,
  Marker,
} from "leaflet";

import * as L from "leaflet";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { HalyomorphaRegionSummary } from "@/lib/halyomorphaOccurrences";

import {
  HALYOMORPHA_REGION_QUERY_PARAM,
  HALYOMORPHA_REGION_SELECT_EVENT,
  type HalyomorphaFieldRecord,
  type HalyomorphaRangeMapProps,
} from "@/components/map/HalyomorphaRangeMapTypes";
import {
  type HalyomorphaRegionOccurrenceResponse,
  loadHalyomorphaRegionOccurrences,
} from "@/lib/halyomorphaOccurrenceApi";

const GEORGIA_BOUNDS = [
  [40.95, 39.85],
  [43.65, 46.75],
] satisfies LatLngBoundsExpression;
const MAP_PAN_BOUNDS = [
  [39.35, 35.4],
  [45.1, 50.95],
] satisfies LatLngBoundsExpression;
const LEAFLET_TILE_URL = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";
const LEAFLET_FALLBACK_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const LEAFLET_ERROR_TILE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23d9e7dd'/%3E%3Cpath d='M0 128h256M128 0v256' stroke='%23bfd3c6' stroke-width='1' opacity='.45'/%3E%3C/svg%3E";
const LEAFLET_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const PIN_FOCUS_ZOOM = 16;
const RECORD_CLUSTER_ZOOM = 9;
const RECORD_PIN_ZOOM = 16;
const REGION_COUNT_ZOOM = 8;

type RecordCluster = {
  bounds: L.LatLngBounds;
  id: string;
  lat: number;
  lng: number;
  records: HalyomorphaFieldRecord[];
};

export function HalyomorphaRangeMapClient(props: HalyomorphaRangeMapProps) {
  const { copy } = props;
  const {
    closeSelectedRecord,
    containerRef,
    mapError,
    regionLoading,
    resetMap,
    selectedRecord,
    selectedRegion,
  } = useHalyomorphaRangeMap(props);

  return (
    <>
      <div
        aria-label={copy.mapAria}
        data-halyomorpha-map-canvas=""
        ref={containerRef}
      />

      <MapLegend copy={copy} />

      {mapError ? (
        <div className="absolute inset-x-4 top-4 z-920 rounded-card border border-white/10 bg-ink/90 p-4 text-[13px] leading-relaxed text-ink-foreground shadow-2xl backdrop-blur">
          {copy.mapError}
        </div>
      ) : null}

      {selectedRecord ? (
        <SelectedRecordCard
          copy={copy}
          onClose={closeSelectedRecord}
          record={selectedRecord}
        />
      ) : selectedRegion ? (
        <SelectedRegionCard
          copy={copy}
          loading={regionLoading}
          onReset={resetMap}
          region={selectedRegion}
        />
      ) : null}
    </>
  );
}

function clusterCellSize(zoom: number) {
  if (zoom < 10) return 150;
  if (zoom < 12) return 132;
  if (zoom < 14) return 116;
  return 104;
}

function clusterFieldRecords(
  fieldRecords: HalyomorphaFieldRecord[],
  map: LeafletMap,
  zoom: number,
) {
  const clusters = new Map<string, HalyomorphaFieldRecord[]>();
  const cellSize = clusterCellSize(zoom);

  for (const record of fieldRecords) {
    const point = map.project([record.lat, record.lng], zoom);
    const key = `${Math.floor(point.x / cellSize)}:${Math.floor(
      point.y / cellSize,
    )}`;
    clusters.set(key, [...(clusters.get(key) ?? []), record]);
  }

  return Array.from(clusters, ([id, records]): RecordCluster => {
    const bounds = L.latLngBounds(
      records.map((record) => [record.lat, record.lng]),
    );
    const center = bounds.getCenter();
    return {
      bounds,
      id,
      lat: center.lat,
      lng: center.lng,
      records,
    };
  });
}

function createRecordClusterMarker(
  cluster: RecordCluster,
  fieldRecordLabel: string,
  map: LeafletMap,
) {
  const element = document.createElement("button");
  const focusCluster = () => {
    focusBounds(map, cluster.bounds, {
      maxZoom: RECORD_PIN_ZOOM,
      minZoomStep: 2,
      padding: window.innerWidth < 768 ? [42, 42] : [88, 88],
    });
  };

  element.type = "button";
  element.className = "halyomorpha-count-marker";
  element.textContent = String(cluster.records.length);
  element.setAttribute(
    "aria-label",
    `${cluster.records.length} ${fieldRecordLabel}`,
  );
  element.addEventListener("click", focusCluster);
  L.DomEvent.disableClickPropagation(element);

  const marker = L.marker([cluster.lat, cluster.lng], {
    icon: L.divIcon({
      className: "halyomorpha-count-shell",
      html: element,
      iconAnchor: [16, 16],
      iconSize: [32, 32],
    }),
    keyboard: false,
  });
  marker.on("click", focusCluster);
  return marker;
}

function createRecordMarkers(
  fieldRecords: HalyomorphaFieldRecord[],
  map: LeafletMap,
  markerElements: Map<string, HTMLButtonElement>,
  setSelectedRecord: (record: HalyomorphaFieldRecord) => void,
) {
  return fieldRecords.map((record) => {
    const element = document.createElement("button");
    const focusRecord = () => {
      setSelectedRecord(record);
      map.setView(
        [record.lat, record.lng],
        Math.max(map.getZoom(), PIN_FOCUS_ZOOM),
        {
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches,
        },
      );
    };

    element.type = "button";
    element.className = "halyomorpha-field-marker";
    element.setAttribute("aria-label", record.accessibleLabel);
    element.setAttribute("aria-pressed", "false");
    element.dataset.kind = record.kind;
    element.dataset.selected = "false";
    element.addEventListener("click", focusRecord);
    element.addEventListener("focus", focusRecord);
    L.DomEvent.disableClickPropagation(element);
    markerElements.set(record.id, element);

    return L.marker([record.lat, record.lng], {
      icon: L.divIcon({
        className: "halyomorpha-marker-shell",
        html: element,
        iconAnchor: [22, 22],
        iconSize: [44, 44],
      }),
      keyboard: false,
    });
  });
}

function createRegionCountMarker({
  count,
  label,
  lat,
  lng,
  onSelect,
  recordLabel,
}: {
  count: number;
  label: string;
  lat: number;
  lng: number;
  onSelect: () => void;
  recordLabel: string;
}) {
  const element = document.createElement("button");

  element.type = "button";
  element.className = "halyomorpha-region-count-marker";
  element.textContent = count.toLocaleString();
  element.setAttribute("aria-label", `${label} — ${count} ${recordLabel}`);
  element.addEventListener("click", onSelect);
  L.DomEvent.disableClickPropagation(element);

  const marker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: "halyomorpha-region-count-shell",
      html: element,
      iconAnchor: [18, 13],
      iconSize: [36, 26],
    }),
    keyboard: false,
  });
  marker.on("click", onSelect);
  return marker;
}

function createResetControl(label: string, onReset: () => void) {
  return new (L.Control.extend({
    onAdd: () => {
      const wrapper = L.DomUtil.create(
        "div",
        "leaflet-bar halyomorpha-reset-control",
      );
      const button = L.DomUtil.create("button", "", wrapper);

      button.type = "button";
      button.title = label;
      button.setAttribute("aria-label", label);
      button.textContent = "↺";

      L.DomEvent.disableClickPropagation(wrapper);
      L.DomEvent.on(button, "click", (event) => {
        L.DomEvent.preventDefault(event);
        onReset();
      });

      return wrapper;
    },
    options: { position: "topright" },
  }))();
}

function createTotalCountMarker({
  count,
  label,
  map,
  recordLabel,
  regionCountZoom,
}: {
  count: string;
  label: string;
  map: LeafletMap;
  recordLabel: string;
  regionCountZoom: number;
}) {
  const element = document.createElement("button");
  const bounds = L.latLngBounds(GEORGIA_BOUNDS);
  const center = bounds.getCenter();
  const focusRegions = () => {
    focusBounds(map, bounds, {
      maxZoom: regionCountZoom,
      minZoom: regionCountZoom,
      padding: window.innerWidth < 768 ? [32, 32] : [64, 64],
    });
  };

  element.type = "button";
  element.className = "halyomorpha-total-count-marker";
  element.textContent = count;
  element.setAttribute("aria-label", `${label} — ${count} ${recordLabel}`);
  element.addEventListener("click", focusRegions);
  L.DomEvent.disableClickPropagation(element);

  const marker = L.marker(center, {
    icon: L.divIcon({
      className: "halyomorpha-count-shell",
      html: element,
      iconAnchor: [28, 28],
      iconSize: [56, 56],
    }),
    keyboard: false,
  });
  marker.on("click", focusRegions);
  return marker;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '"':
        return "&quot;";
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return "&#39;";
    }
  });
}

function fitInitialBounds(map: LeafletMap) {
  const bounds = L.latLngBounds(GEORGIA_BOUNDS);

  map.fitBounds(bounds, {
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    maxZoom: window.innerWidth < 768 ? 7 : 8,
    padding: L.point(window.innerWidth < 768 ? [24, 24] : [48, 48]),
  });
}

function focusBounds(
  map: LeafletMap,
  bounds: L.LatLngBounds,
  options: {
    center?: L.LatLng;
    maxZoom?: number;
    minZoom?: number;
    minZoomStep?: number;
    padding: [number, number];
  },
) {
  const padding = L.point(options.padding);
  const boundsZoom = map.getBoundsZoom(bounds, false, padding);
  const currentZoom = Number.isFinite(map.getZoom())
    ? map.getZoom()
    : boundsZoom;
  const targetZoom = Math.min(
    options.maxZoom ?? map.getMaxZoom(),
    Math.max(
      boundsZoom,
      options.minZoom ?? boundsZoom,
      currentZoom + (options.minZoomStep ?? 1),
    ),
  );

  map.setView(options.center ?? bounds.getCenter(), targetZoom, {
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

function focusRegionBounds(map: LeafletMap, bounds: L.LatLngBounds) {
  const compact = window.innerWidth < 768;

  map.fitBounds(bounds.pad(compact ? 0.18 : 0.12), {
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    maxZoom: compact ? 10 : 9,
    padding: L.point(compact ? [42, 42] : [120, 96]),
  });
}

function formatTileUrl(template: string, coords: L.Coords) {
  return L.Util.template(template, {
    x: coords.x,
    y: coords.y,
    z: coords.z,
  });
}

function formatYearRange(region: HalyomorphaRegionSummary) {
  if (!region.firstYear || !region.lastYear) return "";
  if (region.firstYear === region.lastYear) return String(region.firstYear);
  return `${region.firstYear}–${region.lastYear}`;
}

function getLayerBounds(layer: L.Path) {
  if (layer instanceof L.Polyline) return layer.getBounds();
  return null;
}

function getUrlRegionId() {
  return new URLSearchParams(window.location.search).get(
    HALYOMORPHA_REGION_QUERY_PARAM,
  );
}

function MapLegend({ copy }: { copy: HalyomorphaRangeMapProps["copy"] }) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-900 hidden max-w-[calc(100%-2rem)] gap-1 rounded-xl bg-ink/58 px-2.5 py-2 text-[10px] leading-none font-medium text-ink-foreground/82 backdrop-blur-md sm:grid sm:text-[11px]">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-primary/90"
        />
        {copy.photoRecordLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2 rounded-full border border-white/70 bg-transparent"
        />
        {copy.locationRecordLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-4 border-t border-[#a7d8b3]/80"
        />
        {copy.officialRegionLabel}
      </span>
    </div>
  );
}

function regionStatusLabel(
  status: HalyomorphaRegionSummary["status"],
  copy: HalyomorphaRangeMapProps["copy"],
) {
  return status === "confirmed"
    ? copy.confirmedStatusLabel
    : copy.recordedOnlyStatusLabel;
}

function regionStyle({
  compact = false,
  confirmed,
  hovered = false,
  isDark = false,
  muted = false,
  selected = false,
}: {
  compact?: boolean;
  confirmed: boolean;
  hovered?: boolean;
  isDark?: boolean;
  muted?: boolean;
  selected?: boolean;
}) {
  if (!confirmed) {
    return {
      color: isDark ? "#94a3b8" : "#64748b",
      cursor: "pointer",
      fillColor: isDark ? "#94a3b8" : "#64748b",
      fillOpacity: selected ? 0.18 : hovered ? 0.12 : muted ? 0.02 : 0.05,
      opacity: muted ? 0.3 : selected || hovered ? 0.9 : 0.5,
      weight: selected ? 2.3 : hovered ? 1.5 : 1,
    };
  }
  const style = compact
    ? isDark
      ? {
          color: "#c7f4cf",
          fillColor: "#8ee6a1",
          fillOpacity: 0.36,
          hoverFillOpacity: 0.46,
          hoverWeight: 1.95,
          mutedFillOpacity: 0.16,
          mutedOpacity: 0.52,
          opacity: 0.9,
          selectedFillColor: "#74d789",
          selectedFillOpacity: 0.56,
          selectedWeight: 2.65,
          weight: 1.55,
        }
      : {
          color: "#2f7f47",
          fillColor: "#3f9a59",
          fillOpacity: 0.42,
          hoverFillOpacity: 0.5,
          hoverWeight: 2.15,
          mutedFillOpacity: 0.2,
          mutedOpacity: 0.58,
          opacity: 0.95,
          selectedFillColor: "#4bae67",
          selectedFillOpacity: 0.56,
          selectedWeight: 2.65,
          weight: 1.8,
        }
    : isDark
      ? {
          color: "#a9f0b8",
          fillColor: "#75d28b",
          fillOpacity: 0.22,
          hoverFillOpacity: 0.32,
          hoverWeight: 1.9,
          mutedFillOpacity: 0.075,
          mutedOpacity: 0.42,
          opacity: 0.92,
          selectedFillColor: "#66cf7f",
          selectedFillOpacity: 0.42,
          selectedWeight: 2.6,
          weight: 1.55,
        }
      : {
          color: "#2c7c43",
          fillColor: "#3f9658",
          fillOpacity: 0.3,
          hoverFillOpacity: 0.38,
          hoverWeight: 2.1,
          mutedFillOpacity: 0.12,
          mutedOpacity: 0.5,
          opacity: 0.96,
          selectedFillColor: "#4da965",
          selectedFillOpacity: 0.46,
          selectedWeight: 2.6,
          weight: 1.8,
        };
  return {
    color: selected ? "#effff1" : style.color,
    cursor: "pointer",
    fillColor: selected ? style.selectedFillColor : style.fillColor,
    fillOpacity: selected
      ? style.selectedFillOpacity
      : hovered
        ? style.hoverFillOpacity
        : muted
          ? style.mutedFillOpacity
          : style.fillOpacity,
    opacity: muted
      ? style.mutedOpacity
      : selected || hovered
        ? 1
        : style.opacity,
    weight: selected
      ? style.selectedWeight
      : hovered
        ? style.hoverWeight
        : style.weight,
  };
}

function SelectedRecordCard({
  copy,
  onClose,
  record,
}: {
  copy: HalyomorphaRangeMapProps["copy"];
  onClose: () => void;
  record: HalyomorphaFieldRecord;
}) {
  return (
    <article className="absolute inset-x-3 bottom-3 z-940 rounded-card border border-white/12 bg-ink/92 p-3 text-ink-foreground shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-4 md:bottom-4 md:w-[330px]">
      <div className="flex gap-3">
        {record.thumbSrc ? (
          <Image
            alt={record.imageAlt}
            className="size-20 shrink-0 rounded-2xl object-cover"
            height={160}
            loading="lazy"
            src={record.thumbSrc}
            width={160}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              {record.kind === "photo"
                ? copy.photoRecordLabel
                : copy.locationRecordLabel}
            </p>
            <button
              aria-label={copy.closeLabel}
              className="ml-auto inline-flex size-7 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-white/20 hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <h3 className="mt-1 truncate text-[17px] leading-tight font-semibold">
            {record.locality}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
            {[record.formattedDate, record.author].filter(Boolean).join(" · ")}
          </p>
          {record.galleryHref && record.gallerySrc ? (
            <a
              className="mt-3 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              data-species-gallery-src={record.gallerySrc}
              href={record.galleryHref}
            >
              {copy.galleryAction}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SelectedRegionCard({
  copy,
  loading,
  onReset,
  region,
}: {
  copy: HalyomorphaRangeMapProps["copy"];
  loading: boolean;
  onReset: () => void;
  region: HalyomorphaRegionSummary;
}) {
  const years = formatYearRange(region);

  return (
    <article className="absolute inset-x-3 bottom-3 z-930 rounded-2xl border border-white/10 bg-ink/84 p-3.5 text-ink-foreground shadow-[0_22px_52px_-34px_rgba(0,0,0,0.95)] backdrop-blur-xl md:inset-x-auto md:right-4 md:bottom-4 md:w-[292px]">
      <h3 className="text-[17px] leading-tight font-semibold">{region.name}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
        {region.count.toLocaleString()} {copy.regionRecordsLabel}
        {years ? ` · ${years}` : ""}
      </p>
      {region.count > 0 ? (
        <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
          {regionStatusLabel(region.status, copy)}
        </p>
      ) : null}
      {loading ? (
        <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
          {copy.regionLoadingLabel}
        </p>
      ) : null}
      <button
        className="mt-3 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={onReset}
        type="button"
      >
        ← {copy.resetToGeorgiaLabel}
      </button>
    </article>
  );
}

function tooltipHtml({
  action,
  count,
  name,
  noRecords,
  recordLabel,
  sourceConfirmed,
  statusLabel,
}: {
  action: string;
  count: number;
  name: string;
  noRecords: string;
  recordLabel: string;
  sourceConfirmed?: string;
  statusLabel?: string;
}) {
  return [
    `<strong>${escapeHtml(name)}</strong>`,
    `<span>${count > 0 ? `${count} ${escapeHtml(recordLabel)}` : escapeHtml(noRecords)}</span>`,
    statusLabel ? `<small>${escapeHtml(statusLabel)}</small>` : "",
    sourceConfirmed ? `<small>${escapeHtml(sourceConfirmed)}</small>` : "",
    `<em>${escapeHtml(action)} →</em>`,
  ]
    .filter(Boolean)
    .join("");
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

function useHalyomorphaRangeMap({
  copy,
  locale,
  occurrenceSummary,
  officialRange,
  regionNames,
  speciesId,
}: HalyomorphaRangeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const regionCacheRef = useRef(
    new Map<RegionPathId, HalyomorphaRegionOccurrenceResponse>(),
  );
  const regionRecordsRef = useRef<HalyomorphaFieldRecord[]>([]);
  const requestIdRef = useRef(0);
  const markerElementsRef = useRef(new Map<string, HTMLButtonElement>());
  const syncRecordLayersRef = useRef<(() => void) | null>(null);
  const resetMapRef = useRef<(() => void) | null>(null);
  const [mapError, setMapError] = useState(false);
  const [loadingRegionId, setLoadingRegionId] = useState<null | RegionPathId>(
    null,
  );
  const [selectedRecord, setSelectedRecord] =
    useState<HalyomorphaFieldRecord | null>(null);
  const [selectedRegion, setSelectedRegion] =
    useState<HalyomorphaRegionSummary | null>(null);

  useEffect(() => {
    markerElementsRef.current.forEach((element, id) => {
      const selected = id === selectedRecord?.id;
      element.dataset.selected = selected ? "true" : "false";
      element.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }, [selectedRecord?.id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: LeafletMap;
    let rangeLayer: LeafletGeoJson;
    const activeRecordMarkers: Marker[] = [];
    const regionCountMarkers: Marker[] = [];
    let totalCountMarker: Marker | null = null;
    let resetControl: Control;
    let disposed = false;
    let activeRegionTooltip: L.Tooltip | null = null;
    let selectedRegionId: null | RegionPathId = null;
    const markerElements = markerElementsRef.current;
    const summaryByRegion = new Map(
      occurrenceSummary.recordsByRegion.map((region) => [region.id, region]),
    );
    const namesByRegion = new Map(
      regionNames.map((region) => [region.id, region.name]),
    );
    const isCompactViewport = window.innerWidth < 640;
    const isDarkMode = document.documentElement.classList.contains("dark");

    try {
      map = L.map(container, {
        attributionControl: false,
        maxBounds: MAP_PAN_BOUNDS,
        maxBoundsViscosity: 0.42,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      const resetToGeorgia = () => {
        requestIdRef.current += 1;
        regionRecordsRef.current = [];
        selectedRegionId = null;
        updateRegionUrl(null);
        setLoadingRegionId(null);
        setSelectedRecord(null);
        setSelectedRegion(null);
        fitInitialBounds(map);
        applyRegionStyles();
        syncRegionCountMarkers();
        syncRecordLayersRef.current?.();
      };
      resetMapRef.current = resetToGeorgia;
      resetControl = createResetControl(
        copy.resetMapLabel,
        resetToGeorgia,
      ).addTo(map);
      const tileLayer = L.tileLayer(LEAFLET_TILE_URL, {
        attribution: LEAFLET_TILE_ATTRIBUTION,
        detectRetina: false,
        keepBuffer: 8,
        maxNativeZoom: 19,
        maxZoom: 19,
        minZoom: 4,
        updateInterval: 160,
        updateWhenIdle: true,
        updateWhenZooming: false,
      }).addTo(map);
      const handleTileError = (event: L.TileEvent) => {
        const tile = event.tile as HTMLImageElement;
        if (tile.dataset.fallback === "true") {
          tile.onerror = null;
          tile.src = LEAFLET_ERROR_TILE_URL;
          return;
        }

        tile.dataset.fallback = "true";
        tile.onerror = () => {
          tile.onerror = null;
          tile.src = LEAFLET_ERROR_TILE_URL;
        };
        tile.src = formatTileUrl(LEAFLET_FALLBACK_TILE_URL, event.coords);
      };
      tileLayer.on("tileerror", handleTileError);

      fitInitialBounds(map);
      const regionCountZoom = isCompactViewport
        ? map.getZoom() + 1
        : REGION_COUNT_ZOOM;
      totalCountMarker =
        occurrenceSummary.totalRecords > 0
          ? createTotalCountMarker({
              count: occurrenceSummary.totalRecords.toLocaleString(locale),
              label: copy.mapAria,
              map,
              recordLabel: copy.regionRecordsLabel,
              regionCountZoom,
            })
          : null;

      const closeActiveRegionTooltip = () => {
        activeRegionTooltip?.remove();
        activeRegionTooltip = null;
      };

      rangeLayer = L.geoJSON(officialRange, {
        onEachFeature: (feature, layer) => {
          const isOfficialRange = feature.properties?.isOfficialRange === true;
          if (!(layer instanceof L.Path)) return;
          const regionId = feature.properties.id;
          const bounds = getLayerBounds(layer);
          const regionSummary = summaryByRegion.get(regionId);
          const regionName =
            namesByRegion.get(regionId) ?? feature.properties.shapeName;
          const regionCount = regionSummary?.count ?? 0;
          const selectCurrentRegion = () => {
            if (bounds) {
              closeActiveRegionTooltip();
              selectRegion(regionId, bounds, regionSummary, regionName);
            }
          };
          const openCurrentTooltip = (latlng?: L.LatLng) => {
            if (isCompactViewport || selectedRegionId) return;
            closeActiveRegionTooltip();
            activeRegionTooltip = L.tooltip({
              className: "halyomorpha-region-tooltip",
              direction: "top",
              opacity: 1,
            })
              .setContent(
                tooltipHtml({
                  action: copy.regionSelectActionLabel,
                  count: regionCount,
                  name: regionName,
                  noRecords: copy.noRegionRecordsLabel,
                  recordLabel: copy.regionRecordsLabel,
                  sourceConfirmed: isOfficialRange
                    ? copy.officialRegionLabel
                    : undefined,
                  statusLabel:
                    regionSummary && regionCount > 0
                      ? regionStatusLabel(regionSummary.status, copy)
                      : undefined,
                }),
              )
              .setLatLng(latlng ?? bounds?.getCenter() ?? map.getCenter())
              .addTo(map);
          };

          if (regionCount > 0 && bounds) {
            const center = bounds.getCenter();
            regionCountMarkers.push(
              createRegionCountMarker({
                count: regionCount,
                label: regionName,
                lat: center.lat,
                lng: center.lng,
                onSelect: selectCurrentRegion,
                recordLabel: copy.regionRecordsLabel,
              }),
            );
          }

          layer.on({
            click: selectCurrentRegion,
            mouseout: () => {
              closeActiveRegionTooltip();
              layer.setStyle(
                regionStyle({
                  compact: isCompactViewport,
                  confirmed: isOfficialRange,
                  hovered: false,
                  isDark: isDarkMode,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            },
            mouseover: (event) => {
              openCurrentTooltip(event.latlng);
              layer.setStyle(
                regionStyle({
                  compact: isCompactViewport,
                  confirmed: isOfficialRange,
                  hovered: true,
                  isDark: isDarkMode,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            },
          });
          layer.once("add", () => {
            const element = layer.getElement();
            if (!element) return;
            element.setAttribute("tabindex", "0");
            element.setAttribute("role", "button");
            element.setAttribute(
              "aria-label",
              `${regionName} — ${
                regionCount > 0
                  ? `${regionCount} ${copy.regionRecordsLabel}`
                  : copy.noRegionRecordsLabel
              }`,
            );
            element.addEventListener("keydown", (event) => {
              const keyboardEvent = event as KeyboardEvent;
              if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") {
                return;
              }
              keyboardEvent.preventDefault();
              selectCurrentRegion();
            });
            element.addEventListener("focus", () => {
              openCurrentTooltip();
              layer.setStyle(
                regionStyle({
                  compact: isCompactViewport,
                  confirmed: isOfficialRange,
                  hovered: true,
                  isDark: isDarkMode,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            });
            element.addEventListener("blur", () => {
              closeActiveRegionTooltip();
              layer.setStyle(
                regionStyle({
                  compact: isCompactViewport,
                  confirmed: isOfficialRange,
                  isDark: isDarkMode,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            });
          });
        },
        style: (feature) =>
          regionStyle({
            compact: isCompactViewport,
            confirmed: feature?.properties.isOfficialRange === true,
            isDark: isDarkMode,
          }),
      }).addTo(map);

      const syncRegionCountMarkers = () => {
        const zoom = map.getZoom();
        const totalVisible = !selectedRegionId && zoom < regionCountZoom;
        if (totalCountMarker) {
          if (totalVisible) {
            if (!map.hasLayer(totalCountMarker)) totalCountMarker.addTo(map);
          } else {
            totalCountMarker.remove();
          }
        }

        const regionVisible =
          !selectedRegionId &&
          zoom >= regionCountZoom &&
          zoom < RECORD_CLUSTER_ZOOM;
        regionCountMarkers.forEach((marker) => {
          if (regionVisible) {
            if (!map.hasLayer(marker)) marker.addTo(map);
            return;
          }
          marker.remove();
        });
      };

      const syncRecordLayers = () => {
        const zoom = map.getZoom();
        const fieldRecords = regionRecordsRef.current;
        activeRecordMarkers.forEach((marker) => marker.remove());
        activeRecordMarkers.length = 0;
        markerElements.clear();

        if (fieldRecords.length === 0) {
          setSelectedRecord(null);
          return;
        }

        if (zoom >= RECORD_PIN_ZOOM) {
          activeRecordMarkers.push(
            ...createRecordMarkers(
              fieldRecords,
              map,
              markerElements,
              setSelectedRecord,
            ),
          );
        } else {
          setSelectedRecord(null);
          activeRecordMarkers.push(
            ...clusterFieldRecords(fieldRecords, map, zoom).map((cluster) =>
              createRecordClusterMarker(cluster, copy.fieldRecordLabel, map),
            ),
          );
        }

        activeRecordMarkers.forEach((marker) => marker.addTo(map));
      };
      const syncMapZoomLayers = () => {
        syncRecordLayers();
        syncRegionCountMarkers();
      };

      const selectRegion = (
        regionId: RegionPathId,
        bounds: L.LatLngBounds,
        regionSummary: HalyomorphaRegionSummary | undefined,
        regionName: string,
      ) => {
        selectedRegionId = regionId;
        updateRegionUrl(regionId);
        closeRegionTooltips();
        setSelectedRecord(null);
        setSelectedRegion(
          regionSummary ?? {
            count: 0,
            id: regionId,
            iNaturalistRecordCount: 0,
            name: regionName,
            photoRecordCount: 0,
            status: "recorded-only",
          },
        );
        applyRegionStyles();
        syncRegionCountMarkers();
        focusRegionBounds(map, bounds);
        if (!regionSummary || regionSummary.count === 0) {
          requestIdRef.current += 1;
          regionRecordsRef.current = [];
          setLoadingRegionId(null);
          syncRecordLayersRef.current?.();
          return;
        }
        void loadRegionRecords(regionId);
      };

      const applyRegionStyles = () => {
        rangeLayer.eachLayer((layer) => {
          if (!(layer instanceof L.Path)) return;
          const feature = (
            layer as L.Path & {
              feature?: HalyomorphaRangeMapProps["officialRange"]["features"][number];
            }
          ).feature;
          const regionId = feature?.properties.id;
          layer.setStyle(
            regionStyle({
              compact: isCompactViewport,
              confirmed: feature?.properties.isOfficialRange === true,
              isDark: isDarkMode,
              muted: Boolean(
                selectedRegionId && regionId && selectedRegionId !== regionId,
              ),
              selected: selectedRegionId === regionId,
            }),
          );
        });
      };

      const selectRegionById = (targetRegionId: string) => {
        let matched = false;
        rangeLayer.eachLayer((layer) => {
          if (matched || !(layer instanceof L.Path)) return;
          const feature = (
            layer as L.Path & {
              feature?: HalyomorphaRangeMapProps["officialRange"]["features"][number];
            }
          ).feature;
          if (feature?.properties.id !== targetRegionId) return;

          const bounds = getLayerBounds(layer);
          if (!bounds) return;

          const regionId = feature.properties.id;
          matched = true;
          selectRegion(
            regionId,
            bounds,
            summaryByRegion.get(regionId),
            namesByRegion.get(regionId) ?? feature.properties.shapeName,
          );
        });
      };

      const selectRegionFromEvent = (event: Event) => {
        const regionId = (event as CustomEvent<{ regionId?: RegionPathId }>)
          .detail?.regionId;
        if (regionId) selectRegionById(regionId);
      };

      const closeRegionTooltips = () => {
        closeActiveRegionTooltip();
      };

      const loadRegionRecords = async (regionId: RegionPathId) => {
        const cached = regionCacheRef.current.get(regionId);
        if (cached) {
          regionRecordsRef.current = cached.records;
          setSelectedRegion(cached.region);
          setLoadingRegionId(null);
          syncRecordLayersRef.current?.();
          return;
        }

        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        regionRecordsRef.current = [];
        setLoadingRegionId(regionId);
        syncRecordLayersRef.current?.();

        try {
          const payload = await loadHalyomorphaRegionOccurrences(
            speciesId,
            regionId,
            locale,
          );
          if (disposed || requestIdRef.current !== requestId) return;
          regionCacheRef.current.set(regionId, payload);
          regionRecordsRef.current = payload.records;
          setSelectedRegion(payload.region);
        } catch {
          if (!disposed) regionRecordsRef.current = [];
        } finally {
          if (!disposed && requestIdRef.current === requestId) {
            setLoadingRegionId(null);
            syncRecordLayersRef.current?.();
          }
        }
      };

      syncRecordLayersRef.current = syncRecordLayers;
      window.addEventListener(
        HALYOMORPHA_REGION_SELECT_EVENT,
        selectRegionFromEvent,
      );
      map.on("zoomend", syncMapZoomLayers);
      syncRegionCountMarkers();
      syncRecordLayers();
      const initialRegionId = getUrlRegionId();

      const resizeFrame = window.requestAnimationFrame(() => {
        map.invalidateSize();
        rangeLayer.bringToBack();
        if (initialRegionId) selectRegionById(initialRegionId);
      });

      return () => {
        disposed = true;
        window.cancelAnimationFrame(resizeFrame);
        window.removeEventListener(
          HALYOMORPHA_REGION_SELECT_EVENT,
          selectRegionFromEvent,
        );
        map.off("zoomend", syncMapZoomLayers);
        syncRecordLayersRef.current = null;
        resetMapRef.current = null;
        markerElements.clear();
        closeActiveRegionTooltip();
        activeRecordMarkers.forEach((marker) => marker.remove());
        totalCountMarker?.remove();
        regionCountMarkers.forEach((marker) => marker.remove());
        rangeLayer.eachLayer((layer) => layer.off());
        rangeLayer.remove();
        resetControl.remove();
        tileLayer.off("tileerror", handleTileError);
        tileLayer.remove();
        map.remove();
      };
    } catch {
      const mapErrorTimer = window.setTimeout(() => setMapError(true), 0);
      return () => window.clearTimeout(mapErrorTimer);
    }
  }, [
    copy,
    locale,
    occurrenceSummary.recordsByRegion,
    occurrenceSummary.totalRecords,
    officialRange,
    regionNames,
    speciesId,
  ]);

  const closeSelectedRecord = useCallback(() => setSelectedRecord(null), []);
  const resetMap = useCallback(() => resetMapRef.current?.(), []);

  return {
    closeSelectedRecord,
    containerRef,
    mapError,
    regionLoading: loadingRegionId !== null,
    resetMap,
    selectedRecord,
    selectedRegion,
  };
}
