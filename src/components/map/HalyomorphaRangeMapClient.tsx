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
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  HalyomorphaFieldRecord,
  HalyomorphaRangeMapProps,
} from "@/components/map/HalyomorphaRangeMapTypes";

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

export function HalyomorphaRangeMapClient({
  copy,
  fieldRecords,
  officialRange,
}: HalyomorphaRangeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerElementsRef = useRef(new Map<string, HTMLButtonElement>());
  const [mapError, setMapError] = useState(false);
  const [selectedId, setSelectedId] = useState<null | string>(null);

  const selectedRecord = useMemo(
    () => fieldRecords.find((record) => record.id === selectedId) ?? null,
    [fieldRecords, selectedId],
  );

  useEffect(() => {
    markerElementsRef.current.forEach((element, id) => {
      const selected = id === selectedId;
      element.dataset.selected = selected ? "true" : "false";
      element.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }, [selectedId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: LeafletMap;
    let rangeLayer: LeafletGeoJson;
    const activeRecordMarkers: Marker[] = [];
    const countMarkers: Marker[] = [];
    let resetControl: Control;
    const markerElements = markerElementsRef.current;
    const recordsByRegion = groupRecordsByRegion(officialRange, fieldRecords);

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
      resetControl = createResetControl(copy.resetMapLabel, () => {
        setSelectedId(null);
        fitInitialBounds(map);
      }).addTo(map);
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
          const bounds = getLayerBounds(layer);
          const regionRecords = recordsByRegion.get(feature.properties.id);

          layer.on({
            click: () => {
              setSelectedId(null);
              if (bounds) focusRegionBounds(map, bounds);
            },
            mouseout: () => {
              layer.setStyle(regionStyle(isOfficialRange));
            },
            mouseover: () => {
              layer.setStyle(regionStyle(isOfficialRange, true));
            },
          });

          if (bounds && regionRecords && regionRecords.length > 0) {
            const recordBounds = getRecordBounds(regionRecords);
            const recordCenter = getRecordCenter(regionRecords);
            countMarkers.push(
              createCountMarker({
                count: regionRecords.length,
                focusBounds: recordBounds ?? bounds,
                focusCenter: recordCenter,
                label: `${feature.properties.shapeName}: ${regionRecords.length} ${copy.fieldRecordLabel}`,
                map,
                position: bounds.getCenter(),
              }),
            );
          }
        },
        style: (feature) =>
          regionStyle(feature?.properties?.isOfficialRange === true),
      }).addTo(map);

      const syncRecordLayers = () => {
        const zoom = map.getZoom();
        activeRecordMarkers.forEach((marker) => marker.remove());
        activeRecordMarkers.length = 0;
        markerElements.clear();

        if (zoom < RECORD_CLUSTER_ZOOM) {
          setSelectedId(null);
          countMarkers.forEach((marker) => {
            if (!map.hasLayer(marker)) marker.addTo(map);
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
              setSelectedId,
            ),
          );
        } else {
          setSelectedId(null);
          activeRecordMarkers.push(
            ...clusterFieldRecords(fieldRecords, map, zoom).map((cluster) =>
              createRecordClusterMarker(cluster, copy.fieldRecordLabel, map),
            ),
          );
        }

        activeRecordMarkers.forEach((marker) => marker.addTo(map));
      };

      map.on("zoomend", syncRecordLayers);
      syncRecordLayers();

      const resizeFrame = window.requestAnimationFrame(() => {
        map.invalidateSize();
        rangeLayer.bringToBack();
      });

      return () => {
        window.cancelAnimationFrame(resizeFrame);
        map.off("zoomend", syncRecordLayers);
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
  }, [copy.fieldRecordLabel, copy.resetMapLabel, fieldRecords, officialRange]);

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
          onClose={() => setSelectedId(null)}
          record={selectedRecord}
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
  focusBounds,
  focusCenter,
  label,
  map,
  position,
}: {
  count: number;
  focusBounds: L.LatLngBounds;
  focusCenter: L.LatLng;
  label: string;
  map: LeafletMap;
  position: L.LatLng;
}) {
  const element = document.createElement("button");
  const focusCount = () => {
    focusRecordBounds(map, focusBounds, focusCenter);
  };

  element.type = "button";
  element.className = "halyomorpha-count-marker";
  element.textContent = String(count);
  element.setAttribute("aria-label", label);
  element.addEventListener("click", focusCount);
  L.DomEvent.disableClickPropagation(element);

  const marker = L.marker(position, {
    icon: L.divIcon({
      className: "halyomorpha-count-shell",
      html: element,
      iconAnchor: [24, 24],
      iconSize: [48, 48],
    }),
    keyboard: false,
  });
  marker.on("click", focusCount);
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
      iconAnchor: [24, 24],
      iconSize: [48, 48],
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
  setSelectedId: (id: string) => void,
) {
  return fieldRecords.map((record) => {
    const element = document.createElement("button");
    const focusRecord = () => {
      setSelectedId(record.id);
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

function focusRecordBounds(
  map: LeafletMap,
  bounds: L.LatLngBounds,
  center: L.LatLng,
) {
  focusBounds(map, bounds, {
    center,
    maxZoom: 13,
    minZoom: RECORD_CLUSTER_ZOOM,
    padding: window.innerWidth < 768 ? [42, 42] : [96, 88],
  });
}

function focusRegionBounds(map: LeafletMap, bounds: L.LatLngBounds) {
  focusBounds(map, bounds, {
    maxZoom: 11,
    minZoom: RECORD_CLUSTER_ZOOM,
    padding: window.innerWidth < 768 ? [38, 38] : [120, 96],
  });
}

function getLayerBounds(layer: L.Path) {
  if (layer instanceof L.Polyline) return layer.getBounds();
  return null;
}

function getRecordBounds(records: HalyomorphaFieldRecord[]) {
  if (records.length === 0) return null;
  return L.latLngBounds(records.map((record) => [record.lat, record.lng]));
}

function getRecordCenter(records: HalyomorphaFieldRecord[]) {
  const total = records.reduce(
    (sum, record) => ({
      lat: sum.lat + record.lat,
      lng: sum.lng + record.lng,
    }),
    { lat: 0, lng: 0 },
  );
  return L.latLng(total.lat / records.length, total.lng / records.length);
}

function groupRecordsByRegion(
  officialRange: HalyomorphaRangeMapProps["officialRange"],
  fieldRecords: HalyomorphaFieldRecord[],
) {
  const recordsByRegion = new Map<string, HalyomorphaFieldRecord[]>();
  for (const record of fieldRecords) {
    const region = officialRange.features.find((feature) =>
      pointInFeature(record.lng, record.lat, feature.geometry.coordinates),
    );
    if (!region) continue;
    recordsByRegion.set(region.properties.id, [
      ...(recordsByRegion.get(region.properties.id) ?? []),
      record,
    ]);
  }
  return recordsByRegion;
}

function MapLegend({ copy }: { copy: HalyomorphaRangeMapProps["copy"] }) {
  return (
    <div className="pointer-events-none absolute top-4 left-4 z-900 flex max-w-[calc(100%-2rem)] flex-wrap gap-2 rounded-full border border-white/18 bg-ink/92 px-3 py-2 text-[11px] leading-none font-semibold text-ink-foreground shadow-2xl backdrop-blur-md sm:text-[12px]">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_22%,transparent)]"
        />
        {copy.photoRecordLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full border border-white/70 bg-transparent shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_16%,transparent)]"
        />
        {copy.locationRecordLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2.5 w-4 rounded-[3px] border border-[#a7d8b3]/70 bg-[#6fad88]/25"
        />
        {copy.officialRegionLabel}
      </span>
    </div>
  );
}

function pointInFeature(lng: number, lat: number, rings: [number, number][][]) {
  const [outerRing, ...holes] = rings;
  if (!outerRing || !pointInRing(lng, lat, outerRing)) return false;
  return !holes.some((ring) => pointInRing(lng, lat, ring));
}

function pointInRing(lng: number, lat: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [lngI, latI] = ring[i];
    const [lngJ, latJ] = ring[j];
    const intersects =
      latI > lat !== latJ > lat &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;
    if (intersects) inside = !inside;
  }
  return inside;
}

function regionStyle(isOfficialRange: boolean, hovered = false) {
  return {
    color: isOfficialRange
      ? hovered
        ? "#dff7e5"
        : "#9ed4ad"
      : "rgba(255,255,255,0.18)",
    cursor: "pointer",
    fillColor: isOfficialRange ? "#6fad88" : "#c9d8cb",
    fillOpacity: isOfficialRange ? (hovered ? 0.34 : 0.22) : 0.045,
    opacity: isOfficialRange ? (hovered ? 0.96 : 0.78) : 0.3,
    weight: isOfficialRange ? (hovered ? 2 : 1.35) : 0.7,
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
