"use client";

import type {
  Control,
  LatLngBoundsExpression,
  GeoJSON as LeafletGeoJson,
  Map as LeafletMap,
  Marker,
} from "leaflet";

import * as L from "leaflet";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type {
  HalyomorphaFieldRecord,
  HalyomorphaRangeMapProps,
} from "@/components/map/HalyomorphaRangeMapTypes";
import type { RegionPathId } from "@/data/georgia-paths";
import type { HalyomorphaRegionSummary } from "@/lib/halyomorphaOccurrences";

const GEORGIA_BOUNDS = [
  [40.95, 39.85],
  [43.65, 46.75],
] satisfies LatLngBoundsExpression;
const LEAFLET_TILE_URL = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";
const PIN_FOCUS_ZOOM = 16;
const RECORD_CLUSTER_ZOOM = 9;
const RECORD_PIN_ZOOM = 16;

type RecordCluster = {
  bounds: L.LatLngBounds;
  id: string;
  lat: number;
  lng: number;
  records: HalyomorphaFieldRecord[];
};

type RegionOccurrenceResponse = {
  records: HalyomorphaFieldRecord[];
  region: HalyomorphaRegionSummary;
};

export function HalyomorphaRangeMapClient({
  copy,
  locale,
  occurrenceSummary,
  officialRange,
  regionNames,
}: HalyomorphaRangeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const regionCacheRef = useRef(
    new Map<RegionPathId, RegionOccurrenceResponse>(),
  );
  const regionRecordsRef = useRef<HalyomorphaFieldRecord[]>([]);
  const requestIdRef = useRef(0);
  const markerElementsRef = useRef(new Map<string, HTMLButtonElement>());
  const syncRecordLayersRef = useRef<(() => void) | null>(null);
  const resetMapRef = useRef<(() => void) | null>(null);
  const [mapError, setMapError] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
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
    const countMarkers: Marker[] = [];
    let resetControl: Control;
    let disposed = false;
    let selectedRegionId: null | RegionPathId = null;
    const markerElements = markerElementsRef.current;
    const summaryByRegion = new Map(
      occurrenceSummary.recordsByRegion.map((region) => [region.id, region]),
    );
    const namesByRegion = new Map(
      regionNames.map((region) => [region.id, region.name]),
    );

    try {
      map = L.map(container, {
        attributionControl: false,
        maxBounds: GEORGIA_BOUNDS,
        maxBoundsViscosity: 0.72,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      const resetToGeorgia = () => {
        regionRecordsRef.current = [];
        selectedRegionId = null;
        setSelectedRecord(null);
        setSelectedRegion(null);
        fitInitialBounds(map);
        applyRegionStyles();
        syncRecordLayersRef.current?.();
      };
      resetMapRef.current = resetToGeorgia;
      resetControl = createResetControl(
        copy.resetMapLabel,
        resetToGeorgia,
      ).addTo(map);
      L.tileLayer(LEAFLET_TILE_URL, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        detectRetina: true,
        maxZoom: 19,
        minZoom: 4,
      }).addTo(map);

      fitInitialBounds(map);

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
              layer.closeTooltip();
              selectRegion(regionId, bounds, regionSummary, regionName);
            }
          };

          layer.bindTooltip(
            tooltipHtml({
              action: copy.regionSelectActionLabel,
              count: regionCount,
              name: regionName,
              noRecords: copy.noRegionRecordsLabel,
              recordLabel: copy.regionRecordsLabel,
              sourceConfirmed: isOfficialRange
                ? copy.officialRegionLabel
                : undefined,
            }),
            {
              className: "halyomorpha-region-tooltip",
              direction: "top",
              opacity: 1,
              sticky: true,
            },
          );

          layer.on({
            click: selectCurrentRegion,
            mouseout: () => {
              layer.setStyle(
                regionStyle({
                  hovered: false,
                  isOfficialRange,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            },
            mouseover: () => {
              layer.setStyle(
                regionStyle({
                  hovered: true,
                  isOfficialRange,
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
              layer.openTooltip();
              layer.setStyle(
                regionStyle({
                  hovered: true,
                  isOfficialRange,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            });
            element.addEventListener("blur", () => {
              layer.closeTooltip();
              layer.setStyle(
                regionStyle({
                  isOfficialRange,
                  muted: Boolean(
                    selectedRegionId && selectedRegionId !== regionId,
                  ),
                  selected: selectedRegionId === regionId,
                }),
              );
            });
          });

          if (bounds && regionSummary && regionSummary.count > 0) {
            countMarkers.push(
              createCountMarker({
                count: regionSummary.count,
                label: `${regionName} — ${regionSummary.count} ${copy.regionRecordsLabel}`,
                onSelect: selectCurrentRegion,
                position: bounds.getCenter(),
                regionName,
              }),
            );
          }
        },
        style: (feature) =>
          regionStyle({
            isOfficialRange: feature?.properties?.isOfficialRange === true,
          }),
      }).addTo(map);

      const syncRecordLayers = () => {
        const zoom = map.getZoom();
        const fieldRecords = regionRecordsRef.current;
        activeRecordMarkers.forEach((marker) => marker.remove());
        activeRecordMarkers.length = 0;
        markerElements.clear();

        if (fieldRecords.length === 0) {
          setSelectedRecord(null);
          countMarkers.forEach((marker) => {
            if (selectedRegionId) {
              marker.remove();
            } else {
              if (!map.hasLayer(marker)) marker.addTo(map);
            }
          });
          return;
        }

        countMarkers.forEach((marker) => marker.remove());

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

      const selectRegion = (
        regionId: RegionPathId,
        bounds: L.LatLngBounds,
        regionSummary: HalyomorphaRegionSummary | undefined,
        regionName: string,
      ) => {
        const center = regionSummary?.center
          ? L.latLng(regionSummary.center.lat, regionSummary.center.lng)
          : undefined;
        selectedRegionId = regionId;
        closeRegionTooltips();
        setSelectedRecord(null);
        setSelectedRegion(
          regionSummary ?? {
            count: 0,
            id: regionId,
            iNaturalistRecordCount: 0,
            name: regionName,
            photoRecordCount: 0,
          },
        );
        applyRegionStyles();
        focusRegionBounds(map, bounds, center);
        if (!regionSummary || regionSummary.count === 0) {
          regionRecordsRef.current = [];
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
              isOfficialRange: feature?.properties.isOfficialRange === true,
              muted: Boolean(
                selectedRegionId && regionId && selectedRegionId !== regionId,
              ),
              selected: selectedRegionId === regionId,
            }),
          );
        });
      };

      const closeRegionTooltips = () => {
        rangeLayer.eachLayer((layer) => {
          if (layer instanceof L.Path) layer.closeTooltip();
        });
      };

      const loadRegionRecords = async (regionId: RegionPathId) => {
        const cached = regionCacheRef.current.get(regionId);
        if (cached) {
          regionRecordsRef.current = cached.records;
          setSelectedRegion(cached.region);
          setRegionLoading(false);
          syncRecordLayersRef.current?.();
          return;
        }

        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        regionRecordsRef.current = [];
        setRegionLoading(true);
        syncRecordLayersRef.current?.();

        try {
          const response = await fetch(
            `/api/species/halyomorpha-halys/occurrences?region=${regionId}&locale=${locale}`,
          );
          if (!response.ok) throw new Error("Occurrence request failed");
          const payload = (await response.json()) as RegionOccurrenceResponse;
          if (disposed || requestIdRef.current !== requestId) return;
          regionCacheRef.current.set(regionId, payload);
          regionRecordsRef.current = payload.records;
          setSelectedRegion(payload.region);
        } catch {
          if (!disposed) regionRecordsRef.current = [];
        } finally {
          if (!disposed && requestIdRef.current === requestId) {
            setRegionLoading(false);
            syncRecordLayersRef.current?.();
          }
        }
      };

      syncRecordLayersRef.current = syncRecordLayers;
      map.on("zoomend", syncRecordLayers);
      syncRecordLayers();

      const resizeFrame = window.requestAnimationFrame(() => {
        map.invalidateSize();
        rangeLayer.bringToBack();
      });

      return () => {
        disposed = true;
        window.cancelAnimationFrame(resizeFrame);
        map.off("zoomend", syncRecordLayers);
        syncRecordLayersRef.current = null;
        resetMapRef.current = null;
        markerElements.clear();
        activeRecordMarkers.forEach((marker) => marker.remove());
        countMarkers.forEach((marker) => marker.remove());
        rangeLayer.remove();
        resetControl.remove();
        map.remove();
      };
    } catch {
      window.setTimeout(() => setMapError(true), 0);
    }
  }, [
    copy,
    locale,
    occurrenceSummary.recordsByRegion,
    officialRange,
    regionNames,
  ]);

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
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
        />
      ) : selectedRegion ? (
        <SelectedRegionCard
          copy={copy}
          loading={regionLoading}
          onReset={() => resetMapRef.current?.()}
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

function createCountMarker({
  count,
  label,
  onSelect,
  position,
  regionName,
}: {
  count: number;
  label: string;
  onSelect: () => void;
  position: L.LatLng;
  regionName: string;
}) {
  const element = document.createElement("button");
  const isMobile = window.innerWidth < 640;

  element.type = "button";
  element.className = "halyomorpha-region-label";
  element.textContent = `${regionName} · ${count}`;
  element.setAttribute("aria-label", label);
  element.addEventListener("click", onSelect);
  L.DomEvent.disableClickPropagation(element);

  const marker = L.marker(position, {
    icon: L.divIcon({
      className: "halyomorpha-region-label-shell",
      html: element,
      iconAnchor: isMobile ? [18, 18] : [0, 0],
      iconSize: isMobile ? [36, 36] : [1, 1],
    }),
    keyboard: false,
    zIndexOffset: count,
  });
  marker.on("add", () => {
    const markerElement = marker.getElement();
    if (!markerElement) return;
    markerElement.addEventListener("click", onSelect);
    L.DomEvent.disableClickPropagation(markerElement);
  });
  marker.on("click", onSelect);
  return marker;
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
  focusBounds(map, L.latLngBounds(GEORGIA_BOUNDS), {
    maxZoom: 8,
    minZoomStep: 0,
    padding: window.innerWidth < 768 ? [22, 22] : [48, 48],
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

function focusRegionBounds(
  map: LeafletMap,
  bounds: L.LatLngBounds,
  center?: L.LatLng,
) {
  focusBounds(map, bounds, {
    center,
    maxZoom: 11,
    minZoom: RECORD_CLUSTER_ZOOM,
    padding: window.innerWidth < 768 ? [38, 38] : [120, 96],
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

function regionStyle({
  hovered = false,
  isOfficialRange,
  muted = false,
  selected = false,
}: {
  hovered?: boolean;
  isOfficialRange: boolean;
  muted?: boolean;
  selected?: boolean;
}) {
  return {
    color: selected
      ? "#dff7e5"
      : isOfficialRange
        ? "#9ed4ad"
        : "rgba(255,255,255,0.22)",
    cursor: "pointer",
    fillColor: "#c9d8cb",
    fillOpacity: selected ? 0.14 : hovered ? 0.095 : muted ? 0.018 : 0.045,
    opacity: muted ? 0.22 : selected || hovered ? 0.95 : 0.62,
    weight: selected ? 2.2 : hovered ? 1.6 : isOfficialRange ? 1.15 : 0.65,
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
        ) : (
          <div
            aria-label={copy.noPhotoLabel}
            className="grid size-20 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/6"
            role="img"
          >
            <span
              aria-hidden="true"
              className="size-4 rounded-full border border-primary bg-transparent shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              {record.kind === "photo"
                ? copy.photoRecordLabel
                : copy.locationRecordLabel}
            </p>
            <button
              aria-label={copy.closeLabel}
              className="ml-auto inline-flex size-7 items-center justify-center rounded-full border border-white/10 text-[18px] leading-none text-ink-muted transition-colors hover:border-white/20 hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>
          <h3 className="mt-1 truncate text-[17px] leading-tight font-semibold">
            {record.locality}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
            {[record.formattedDate, record.author].filter(Boolean).join(" · ")}
          </p>
          {record.note ? (
            <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
              {record.note}
            </p>
          ) : null}
          {record.galleryHref && record.gallerySrc ? (
            <a
              className="mt-3 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              data-species-gallery-src={record.gallerySrc}
              href={record.galleryHref}
            >
              {copy.galleryAction}
            </a>
          ) : record.url ? (
            <a
              className="mt-3 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href={record.url}
              rel="noreferrer"
              target="_blank"
            >
              {copy.sourceAction}
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
      <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-ink-muted">
        {region.photoRecordCount.toLocaleString()} {copy.photoRecordLabel} ·{" "}
        {region.iNaturalistRecordCount.toLocaleString()}{" "}
        {copy.iNaturalistRecordLabel}
      </p>
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
}: {
  action: string;
  count: number;
  name: string;
  noRecords: string;
  recordLabel: string;
  sourceConfirmed?: string;
}) {
  return [
    `<strong>${escapeHtml(name)}</strong>`,
    `<span>${count > 0 ? `${count} ${escapeHtml(recordLabel)}` : escapeHtml(noRecords)}</span>`,
    sourceConfirmed ? `<small>${escapeHtml(sourceConfirmed)}</small>` : "",
    `<em>${escapeHtml(action)} →</em>`,
  ]
    .filter(Boolean)
    .join("");
}
