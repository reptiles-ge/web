"use client";

import * as L from "leaflet";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { RegionPathId } from "@/data/georgia-paths";
import type { HalyomorphaRangeRegionFeature } from "@/data/halyomorphaRangeRegions";

import {
  type HalyomorphaFieldRecord,
  type HalyomorphaRangeMapClientProps,
  type HalyomorphaRangeMapCopy,
} from "@/components/map/HalyomorphaRangeMapTypes";

const TILE_URL = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";
const FALLBACK_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ERROR_TILE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23e9eee6'/%3E%3C/svg%3E";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const VEIL_RING: L.LatLngTuple[] = [
  [20, 10],
  [20, 80],
  [62, 80],
  [62, 10],
];
const MAX_ZOOM = 14;
const REGION_MAX_ZOOM = 10.5;
const REVEAL_ZOOM_STEP = 3.5;
const FLY_SECONDS = 0.65;
const TOUCH_TOLERANCE = 22;
const CROWD_RADIUS = 24;

type MapApi = {
  focusRecord: (record: HalyomorphaFieldRecord | null, reveal: boolean) => void;
  hoverRegion: (regionId: null | RegionPathId) => void;
  reset: () => void;
  selectRegion: (regionId: null | RegionPathId, animate: boolean) => void;
};

export function HalyomorphaRangeMapClient({
  copy,
  hatchId,
  hoveredRegionId,
  onHoverRegion,
  onOverviewChange,
  onSelectRecord,
  onSelectRegion,
  range,
  records,
  regions,
  resetSignal,
  selectedRecord,
  selectedRegionId,
}: HalyomorphaRangeMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<MapApi | null>(null);
  const regionSyncedRef = useRef(false);
  const resetSignalRef = useRef(resetSignal);
  const [popupNode] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );
  const activeRecord = useMemo(
    () =>
      selectedRecord
        ? (records.find((record) => record.id === selectedRecord.id) ?? null)
        : null,
    [records, selectedRecord],
  );

  const emitHoverRegion = useEffectEvent(onHoverRegion);
  const emitOverviewChange = useEffectEvent(onOverviewChange);
  const emitSelectRecord = useEffectEvent(onSelectRecord);
  const emitSelectRegion = useEffectEvent(onSelectRegion);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !popupNode) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animated = !reducedMotion();
    const map = L.map(container, {
      attributionControl: false,
      bounceAtZoomLimits: false,
      dragging: !coarse,
      fadeAnimation: animated,
      markerZoomAnimation: animated,
      maxBoundsViscosity: 1,
      maxZoom: MAX_ZOOM,
      scrollWheelZoom: false,
      zoomAnimation: animated,
      zoomControl: false,
      zoomSnap: 0.1,
    });
    const renderer = L.svg({ padding: 0.75 });
    const rings = outlineRings(range.features);
    const countryBounds = L.latLngBounds(rings.flat());
    const regionLayers = new Map<RegionPathId, L.Polygon>();
    const dots = new Map<string, L.CircleMarker>();
    const photoButtons = new Map<string, HTMLButtonElement>();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    let selectedId: null | RegionPathId = null;
    let hoveredId: null | RegionPathId = null;
    let activeRecordId: null | string = null;
    let overviewZoom = 0;
    let overviewCenter = countryBounds.getCenter();
    let wasAtOverview = true;
    let focusToken = 0;
    let wheelDelta = 0;
    let popupOpener: HTMLElement | null = null;
    let disposed = false;

    L.control
      .attribution({ position: "bottomright", prefix: false })
      .addTo(map);
    L.control
      .zoom({
        position: "topright",
        zoomInTitle: copy.zoomInLabel,
        zoomOutTitle: copy.zoomOutLabel,
      })
      .addTo(map);

    const tileLayer = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      keepBuffer: 4,
      maxNativeZoom: 19,
      minZoom: 4,
      updateWhenIdle: true,
      updateWhenZooming: false,
    }).addTo(map);
    const handleTileError = (event: L.TileEvent) => {
      const tile = event.tile as HTMLImageElement;
      if (tile.dataset.fallback === "true") {
        tile.onerror = null;
        tile.src = ERROR_TILE_URL;
        return;
      }
      tile.dataset.fallback = "true";
      tile.onerror = () => {
        tile.onerror = null;
        tile.src = ERROR_TILE_URL;
      };
      tile.src = L.Util.template(FALLBACK_TILE_URL, {
        x: event.coords.x,
        y: event.coords.y,
        z: event.coords.z,
      });
    };
    tileLayer.on("tileerror", handleTileError);

    const overviewPadding = () =>
      L.point(container.clientWidth < 640 ? [10, 10] : [28, 28]);
    const atOverview = () =>
      Math.abs(map.getZoom() - overviewZoom) < 0.05 &&
      map
        .latLngToContainerPoint(overviewCenter)
        .distanceTo(map.getSize().divideBy(2)) < 24;
    const fitOverview = (animate: boolean) => {
      if (animate && !reducedMotion()) {
        map.flyToBounds(countryBounds, {
          duration: FLY_SECONDS,
          padding: overviewPadding(),
        });
        return;
      }
      map.fitBounds(countryBounds, {
        animate: false,
        padding: overviewPadding(),
      });
    };
    const measureOverview = () => {
      overviewZoom = map.getBoundsZoom(
        countryBounds,
        false,
        overviewPadding().multiplyBy(2),
      );
      overviewCenter = map.unproject(
        map
          .project(countryBounds.getSouthWest(), overviewZoom)
          .add(map.project(countryBounds.getNorthEast(), overviewZoom))
          .divideBy(2),
        overviewZoom,
      );
      map.setMinZoom(overviewZoom - 0.2);
    };

    measureOverview();
    fitOverview(false);
    map.setMaxBounds(countryBounds.pad(0.6));

    L.polygon([VEIL_RING, ...rings], {
      className: "range-veil",
      interactive: false,
      renderer,
      stroke: false,
    }).addTo(map);

    const dotRadius = () => {
      const base =
        records.length > 300 ? 3.25 : records.length > 60 ? 3.75 : 4.5;
      return (
        base + Math.min(3, Math.max(0, map.getZoom() - overviewZoom) * 0.7)
      );
    };
    const isCrowded = (record: HalyomorphaFieldRecord) => {
      const point = map.latLngToContainerPoint([record.lat, record.lng]);
      return records.some(
        (other) =>
          other.id !== record.id &&
          map.latLngToContainerPoint([other.lat, other.lng]).distanceTo(point) <
            CROWD_RADIUS,
      );
    };
    const nearestRecord = (point: L.Point) => {
      let nearest: HalyomorphaFieldRecord | null = null;
      let nearestDistance = TOUCH_TOLERANCE;
      for (const record of records) {
        const distance = map
          .latLngToContainerPoint([record.lat, record.lng])
          .distanceTo(point);
        if (distance < nearestDistance) {
          nearest = record;
          nearestDistance = distance;
        }
      }
      return nearest;
    };
    const tapRecord = (record: HalyomorphaFieldRecord) => {
      if (
        coarse &&
        record.regionId &&
        !selectedId &&
        atOverview() &&
        isCrowded(record)
      ) {
        emitSelectRegion(record.regionId);
        return;
      }
      emitSelectRecord(record.id);
    };

    const hoverTooltip = L.tooltip({
      className: "range-tooltip",
      direction: "top",
      offset: [0, -6],
      opacity: 1,
    });
    let tooltipNode: HTMLElement | null = null;
    const showTooltip = (content: HTMLElement, latlng: L.LatLng) => {
      if (tooltipNode !== content) {
        tooltipNode = content;
        hoverTooltip.setContent(content);
      }
      hoverTooltip.setLatLng(latlng);
      if (!map.hasLayer(hoverTooltip)) hoverTooltip.addTo(map);
    };

    const regionNames = new Map(regions.map((region) => [region.id, region]));
    for (const feature of range.features) {
      const { id, isOfficialRange } = feature.properties;
      const layer = L.polygon(
        L.GeoJSON.coordsToLatLngs(
          feature.geometry.coordinates,
          1,
        ) as L.LatLng[][],
        {
          className: isOfficialRange
            ? "range-region range-region--confirmed"
            : "range-region",
          fillColor: isOfficialRange ? `url(#${hatchId})` : undefined,
          renderer,
        },
      );
      layer.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        if (coarse && (selectedId || !atOverview())) {
          const record = nearestRecord(event.containerPoint);
          if (record) {
            emitSelectRecord(record.id);
            return;
          }
        }
        emitSelectRecord(null);
        if (id !== selectedId) emitSelectRegion(id);
      });
      if (!coarse) {
        const label = regionNames.get(id);
        const content = tooltipContent(
          label?.name ?? feature.properties.shapeName,
          label && label.count > 0
            ? `${label.count} ${copy.regionRecordsLabel}`
            : copy.noRegionRecordsLabel,
        );
        layer.on("mouseover", () => emitHoverRegion(id));
        layer.on("mousemove", (event) => showTooltip(content, event.latlng));
        layer.on("mouseout", () => {
          hoverTooltip.remove();
          emitHoverRegion(null);
        });
      }
      layer.addTo(map);
      regionLayers.set(id, layer);
    }

    L.polyline(
      rings.map((ring) => [...ring, ring[0]]),
      { className: "range-outline", interactive: false, renderer },
    ).addTo(map);
    const hoverOutline = L.polyline([], {
      className: "range-highlight",
      interactive: false,
      renderer,
    }).addTo(map);
    const selectedOutline = L.polyline([], {
      className: "range-highlight range-highlight--selected",
      interactive: false,
      renderer,
    }).addTo(map);
    const ringOf = (regionId: null | RegionPathId) => {
      const layer = regionId ? regionLayers.get(regionId) : undefined;
      if (!layer) return [];
      const [ring] = layer.getLatLngs() as L.LatLng[][];
      return [...ring, ring[0]];
    };

    const radius = dotRadius();
    for (const record of [...records].reverse()) {
      if (record.kind === "photo") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "range-photo-marker";
        button.setAttribute("aria-label", record.accessibleLabel);
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => tapRecord(record));
        L.DomEvent.disableClickPropagation(button);
        photoButtons.set(record.id, button);
        L.marker([record.lat, record.lng], {
          icon: L.divIcon({
            className: "range-photo-shell",
            html: button,
            iconAnchor: [20, 20],
            iconSize: [40, 40],
          }),
          keyboard: false,
        }).addTo(map);
        continue;
      }
      const dot = L.circleMarker([record.lat, record.lng], {
        className: "range-dot",
        radius,
        renderer,
      });
      dot.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        tapRecord(record);
      });
      if (!coarse) {
        dot.on("mouseover", () => {
          showTooltip(
            tooltipContent(record.locality, record.formattedDate),
            dot.getLatLng(),
          );
          emitHoverRegion(record.regionId ?? null);
        });
        dot.on("mouseout", () => {
          hoverTooltip.remove();
          emitHoverRegion(null);
        });
      }
      dot.addTo(map);
      dots.set(record.id, dot);
    }

    const applyStates = () => {
      regionLayers.forEach((layer, id) => {
        const element = layer.getElement() as SVGElement | undefined;
        if (element) {
          element.dataset.muted = selectedId && id !== selectedId ? "true" : "";
        }
      });
      dots.forEach((dot, id) => {
        const element = dot.getElement();
        if (!element) return;
        element.classList.toggle(
          "is-dim",
          Boolean(selectedId && recordsById.get(id)?.regionId !== selectedId),
        );
        element.classList.toggle("is-selected", id === activeRecordId);
      });
      photoButtons.forEach((button, id) => {
        const selected = id === activeRecordId;
        button.dataset.dim =
          selectedId && recordsById.get(id)?.regionId !== selectedId
            ? "true"
            : "";
        button.dataset.selected = selected ? "true" : "";
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    };

    const popup = L.popup({
      autoPanPaddingBottomRight: [64, 16],
      autoPanPaddingTopLeft: [12, 64],
      className: "range-popup",
      closeButton: false,
      maxWidth: 320,
      minWidth: 0,
      offset: [0, -2],
    }).setContent(popupNode);
    popup.on("remove", () => {
      const opener = popupOpener;
      popupOpener = null;
      if (disposed) return;
      const active = document.activeElement;
      if (
        opener?.isConnected &&
        (!active || active === document.body || popupNode.contains(active))
      ) {
        opener.focus();
      }
      emitSelectRecord(null);
    });

    const syncZoomState = () => {
      const nextRadius = dotRadius();
      dots.forEach((dot) => dot.setRadius(nextRadius));
      container.style.setProperty(
        "--range-hatch-opacity",
        String(
          Math.max(
            0.3,
            1 - Math.max(0, map.getZoom() - overviewZoom - 1) * 0.3,
          ),
        ),
      );
      if (coarse) {
        if (map.getZoom() > overviewZoom + 0.2) map.dragging.enable();
        else map.dragging.disable();
      }
    };
    const syncOverview = () => {
      const next = atOverview();
      if (next === wasAtOverview) return;
      wasAtOverview = next;
      emitOverviewChange(next);
    };
    map.on("zoomend", syncZoomState);
    map.on("moveend", syncOverview);

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      wheelDelta -= event.deltaY * (event.deltaMode === 1 ? 0.08 : 0.01);
      if (Math.abs(wheelDelta) < 0.25) return;
      const step = Math.trunc(wheelDelta / 0.25) * 0.25;
      wheelDelta -= step;
      map.setZoomAround(
        map.mouseEventToContainerPoint(event),
        map.getZoom() + step,
        { animate: false },
      );
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    let plateWidth = container.clientWidth;
    let plateHeight = container.clientHeight;
    const resizeObserver = new ResizeObserver(() => {
      if (
        container.clientWidth === plateWidth &&
        container.clientHeight === plateHeight
      ) {
        return;
      }
      plateWidth = container.clientWidth;
      plateHeight = container.clientHeight;
      const keepOverview = wasAtOverview && !selectedId;
      map.invalidateSize({ animate: false });
      measureOverview();
      if (keepOverview) fitOverview(false);
    });
    resizeObserver.observe(container);
    regionSyncedRef.current = false;

    apiRef.current = {
      focusRecord: (record, reveal) => {
        focusToken += 1;
        const token = focusToken;
        activeRecordId = record?.id ?? null;
        applyStates();
        if (!record) {
          if (map.hasLayer(popup)) map.closePopup(popup);
          return;
        }
        const latlng = L.latLng(record.lat, record.lng);
        const open = () => {
          if (disposed || token !== focusToken) return;
          dots.get(record.id)?.bringToFront();
          popup.setLatLng(latlng);
          if (map.hasLayer(popup)) popup.update();
          else popup.openOn(map);
          const active = document.activeElement;
          if (
            active instanceof HTMLButtonElement &&
            !popupNode.contains(active) &&
            active.matches(":focus-visible")
          ) {
            popupOpener = active;
            popupNode.querySelector("button")?.focus();
          }
        };
        if (!reveal) {
          open();
          return;
        }
        const zoom = Math.max(
          map.getZoom(),
          Math.min(MAX_ZOOM, overviewZoom + REVEAL_ZOOM_STEP),
        );
        if (reducedMotion()) {
          map.setView(latlng, zoom, { animate: false });
          open();
          return;
        }
        map.flyTo(latlng, zoom, { duration: FLY_SECONDS });
        map.once("moveend", open);
      },
      hoverRegion: (regionId) => {
        hoveredId = regionId;
        hoverOutline.setLatLngs(
          hoveredId && hoveredId !== selectedId ? ringOf(hoveredId) : [],
        );
      },
      reset: () => fitOverview(true),
      selectRegion: (regionId, animate) => {
        selectedId = regionId;
        selectedOutline.setLatLngs(ringOf(regionId));
        if (hoveredId === regionId) hoverOutline.setLatLngs([]);
        applyStates();
        const layer = regionId ? regionLayers.get(regionId) : undefined;
        if (!layer) return;
        const compact = container.clientWidth < 640;
        const options = {
          maxZoom: REGION_MAX_ZOOM,
          paddingBottomRight: L.point(compact ? [20, 24] : [72, 40]),
          paddingTopLeft: L.point(compact ? [20, 60] : [40, 64]),
        };
        if (animate && !reducedMotion()) {
          map.flyToBounds(layer.getBounds(), {
            ...options,
            duration: FLY_SECONDS,
          });
          return;
        }
        map.fitBounds(layer.getBounds(), { ...options, animate: false });
      },
    };

    return () => {
      disposed = true;
      apiRef.current = null;
      resizeObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      tileLayer.off("tileerror", handleTileError);
      map.remove();
    };
  }, [
    copy.noRegionRecordsLabel,
    copy.regionRecordsLabel,
    copy.zoomInLabel,
    copy.zoomOutLabel,
    hatchId,
    popupNode,
    range,
    records,
    regions,
  ]);

  useEffect(() => {
    apiRef.current?.selectRegion(selectedRegionId, regionSyncedRef.current);
    regionSyncedRef.current = true;
  }, [selectedRegionId]);

  useEffect(() => {
    apiRef.current?.hoverRegion(hoveredRegionId);
  }, [hoveredRegionId]);

  useEffect(() => {
    apiRef.current?.focusRecord(activeRecord, selectedRecord?.reveal ?? false);
  }, [activeRecord, selectedRecord]);

  useEffect(() => {
    if (resetSignalRef.current === resetSignal) return;
    resetSignalRef.current = resetSignal;
    apiRef.current?.reset();
  }, [resetSignal]);

  return (
    <>
      <div
        aria-label={copy.mapAria}
        className="absolute inset-0"
        ref={containerRef}
        role="group"
      />
      {popupNode && activeRecord
        ? createPortal(
            <RecordPopup
              copy={copy}
              onClose={() => onSelectRecord(null)}
              record={activeRecord}
            />,
            popupNode,
          )
        : null}
    </>
  );
}

function outlineRings(features: HalyomorphaRangeRegionFeature[]) {
  type Point = [number, number];
  const key = ([lng, lat]: Point) => `${lng},${lat}`;
  const edges = new Map<string, [Point, Point] | null>();
  for (const feature of features) {
    for (const ring of feature.geometry.coordinates) {
      for (let index = 0; index < ring.length - 1; index += 1) {
        const from = ring[index];
        const to = ring[index + 1];
        const [a, b] = [key(from), key(to)].sort();
        const id = `${a}|${b}`;
        edges.set(id, edges.has(id) ? null : [from, to]);
      }
    }
  }

  const neighbours = new Map<string, Point[]>();
  edges.forEach((edge) => {
    if (!edge) return;
    const [from, to] = edge;
    neighbours.set(key(from), [...(neighbours.get(key(from)) ?? []), to]);
    neighbours.set(key(to), [...(neighbours.get(key(to)) ?? []), from]);
  });

  const visited = new Set<string>();
  const rings: L.LatLngTuple[][] = [];
  edges.forEach((edge) => {
    if (!edge || visited.has(key(edge[0]))) return;
    const ring: L.LatLngTuple[] = [];
    let current: Point | undefined = edge[0];
    while (current && !visited.has(key(current))) {
      visited.add(key(current));
      ring.push([current[1], current[0]]);
      current = neighbours
        .get(key(current))
        ?.find((point) => !visited.has(key(point)));
    }
    if (ring.length > 2) rings.push(ring);
  });
  return rings;
}

function RecordPopup({
  copy,
  onClose,
  record,
}: {
  copy: HalyomorphaRangeMapCopy;
  onClose: () => void;
  record: HalyomorphaFieldRecord;
}) {
  const meta = [record.formattedDate, record.author]
    .filter(Boolean)
    .join(" · ");
  const sourceUrl =
    record.url && /^https?:\/\//.test(record.url) ? record.url : null;

  return (
    <div
      aria-label={record.accessibleLabel}
      className="relative flex w-64 max-w-[calc(100vw-5rem)] gap-3 p-3 text-foreground"
      role="dialog"
    >
      {record.thumbSrc ? (
        <Image
          alt={record.imageAlt}
          className="size-16 shrink-0 rounded-md object-cover"
          height={128}
          loading="lazy"
          src={record.thumbSrc}
          width={128}
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="pr-6 text-[11px] leading-tight font-medium tracking-[0.06em] text-muted-foreground uppercase">
          {record.kind === "photo"
            ? copy.photoRecordLabel
            : copy.locationRecordLabel}
        </div>
        <div className="mt-1 text-[15px] leading-snug font-semibold wrap-break-word">
          {record.locality}
        </div>
        {meta ? (
          <div className="mt-0.5 text-[13px] leading-snug wrap-break-word text-muted-foreground">
            {meta}
          </div>
        ) : null}
        {sourceUrl || (record.galleryHref && record.gallerySrc) ? (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] leading-snug font-medium">
            {record.galleryHref && record.gallerySrc ? (
              <a
                className="underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                data-species-gallery-src={record.gallerySrc}
                href={record.galleryHref}
              >
                {copy.galleryAction}
              </a>
            ) : null}
            {sourceUrl ? (
              <a
                className="underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                href={sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {copy.sourceAction}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        aria-label={copy.closeLabel}
        className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        onClick={onClose}
        type="button"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function tooltipContent(title: string, detail?: string) {
  const element = document.createElement("span");
  const heading = document.createElement("strong");
  heading.textContent = title;
  element.append(heading);
  if (detail) {
    const line = document.createElement("span");
    line.textContent = detail;
    element.append(line);
  }
  return element;
}
