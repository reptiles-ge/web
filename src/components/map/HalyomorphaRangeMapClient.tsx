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
    let markers: Marker[] = [];
    let resetControl: Control;
    const markerElements = markerElementsRef.current;

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

          layer.on({
            mouseout: () => {
              layer.setStyle(regionStyle(isOfficialRange));
            },
            mouseover: () => {
              layer.setStyle(regionStyle(isOfficialRange, true));
            },
          });
        },
        style: (feature) =>
          regionStyle(feature?.properties?.isOfficialRange === true),
      }).addTo(map);

      markers = fieldRecords.map((record) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "halyomorpha-field-marker";
        element.setAttribute("aria-label", record.accessibleLabel);
        element.setAttribute("aria-pressed", "false");
        element.dataset.selected = "false";
        element.addEventListener("click", () => setSelectedId(record.id));
        element.addEventListener("focus", () => setSelectedId(record.id));
        markerElements.set(record.id, element);

        return L.marker([record.lat, record.lng], {
          icon: L.divIcon({
            className: "halyomorpha-marker-shell",
            html: element,
            iconAnchor: [22, 22],
            iconSize: [44, 44],
          }),
          keyboard: false,
        }).addTo(map);
      });

      const resizeFrame = window.requestAnimationFrame(() => {
        map.invalidateSize();
        rangeLayer.bringToBack();
      });

      return () => {
        window.cancelAnimationFrame(resizeFrame);
        markerElements.clear();
        markers.forEach((marker) => marker.remove());
        rangeLayer.remove();
        resetControl.remove();
        map.remove();
      };
    } catch {
      window.setTimeout(() => setMapError(true), 0);
    }
  }, [copy.resetMapLabel, fieldRecords, officialRange]);

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
  map.fitBounds(GEORGIA_BOUNDS, {
    animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    padding: window.innerWidth < 768 ? [22, 22] : [48, 48],
  });
}

function MapLegend({ copy }: { copy: HalyomorphaRangeMapProps["copy"] }) {
  return (
    <div className="pointer-events-none absolute top-4 left-4 z-900 flex max-w-[calc(100%-2rem)] flex-wrap gap-2 rounded-full border border-white/18 bg-ink/92 px-3 py-2 text-[11px] leading-none font-semibold text-ink-foreground shadow-2xl backdrop-blur-md sm:text-[12px]">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_22%,transparent)]"
        />
        {copy.fieldRecordLabel}
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

function regionStyle(isOfficialRange: boolean, hovered = false) {
  return {
    color: isOfficialRange
      ? hovered
        ? "#dff7e5"
        : "#9ed4ad"
      : "rgba(255,255,255,0.18)",
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
        <Image
          alt={record.imageAlt}
          className="size-20 shrink-0 rounded-2xl object-cover"
          height={160}
          loading="lazy"
          src={record.thumbSrc}
          width={160}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              {copy.fieldRecordLabel}
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
          <a
            className="mt-3 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href={record.galleryHref}
          >
            {copy.galleryAction}
          </a>
        </div>
      </div>
    </article>
  );
}
