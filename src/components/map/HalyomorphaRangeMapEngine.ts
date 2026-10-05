import * as L from "leaflet";

import type {
  HalyomorphaFieldRecord,
  HalyomorphaRangeMapCopy,
  HalyomorphaRangeRegionLabel,
} from "@/components/map/HalyomorphaRangeMapTypes";
import type { RegionPathId } from "@/data/georgia-paths";
import type {
  HalyomorphaRangeRegionFeature,
  HalyomorphaRangeRegionFeatureCollection,
} from "@/data/halyomorphaRangeRegions";

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
const CLUSTER_RADIUS = 28;
const CLUSTER_MAX_ZOOM = MAX_ZOOM - 1;
const CLUSTER_MARK_RADIUS = { l: 14, m: 12, s: 10 };
const PHOTO_MARK_RADIUS = 7.5;

export type HalyomorphaRangeMapEngine = {
  destroy: () => void;
  focusRecord: (record: HalyomorphaFieldRecord | null, reveal: boolean) => void;
  hoverRegion: (regionId: null | RegionPathId) => void;
  reset: () => void;
  selectRegion: (regionId: null | RegionPathId, animate: boolean) => void;
};

type HalyomorphaRangeMapEngineOptions = {
  container: HTMLDivElement;
  hatchId: string;
  labels: Pick<
    HalyomorphaRangeMapCopy,
    | "noRegionRecordsLabel"
    | "regionRecordsLabel"
    | "zoomInLabel"
    | "zoomOutLabel"
  >;
  onHoverRegion: (regionId: null | RegionPathId) => void;
  onOverviewChange: (atOverview: boolean) => void;
  onSelectRecord: (recordId: null | string) => void;
  onSelectRegion: (regionId: RegionPathId) => void;
  popupNode: HTMLElement;
  range: HalyomorphaRangeRegionFeatureCollection;
  records: HalyomorphaFieldRecord[];
  regions: HalyomorphaRangeRegionLabel[];
};

type RecordGroup = {
  center: L.Point;
  records: HalyomorphaFieldRecord[];
};

type RecordPoint = {
  point: L.Point;
  radius: number;
  record: HalyomorphaFieldRecord;
};

export function createHalyomorphaRangeMap({
  container,
  hatchId,
  labels,
  onHoverRegion,
  onOverviewChange,
  onSelectRecord,
  onSelectRegion,
  popupNode,
  range,
  records,
  regions,
}: HalyomorphaRangeMapEngineOptions): HalyomorphaRangeMapEngine {
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
  const markers = new Map<string, L.Layer>();
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

  L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
  L.control
    .zoom({
      position: "topright",
      zoomInTitle: labels.zoomInLabel,
      zoomOutTitle: labels.zoomOutLabel,
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
    const base = records.length > 300 ? 3.25 : records.length > 60 ? 3.75 : 4.5;
    return base + Math.min(3, Math.max(0, map.getZoom() - overviewZoom) * 0.7);
  };
  const nearestRecord = (point: L.Point) => {
    let nearest: HalyomorphaFieldRecord | null = null;
    let nearestDistance = TOUCH_TOLERANCE;
    for (const record of records) {
      if (!shown.has(record.id)) continue;
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
          onSelectRecord(record.id);
          return;
        }
      }
      onSelectRecord(null);
      if (id !== selectedId) onSelectRegion(id);
    });
    if (!coarse) {
      const label = regionNames.get(id);
      const content = tooltipContent(
        label?.name ?? feature.properties.shapeName,
        label && label.count > 0
          ? `${label.count} ${labels.regionRecordsLabel}`
          : labels.noRegionRecordsLabel,
      );
      layer.on("mouseover", () => onHoverRegion(id));
      layer.on("mousemove", (event) => showTooltip(content, event.latlng));
      layer.on("mouseout", () => {
        hoverTooltip.remove();
        onHoverRegion(null);
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
      button.addEventListener("click", () => onSelectRecord(record.id));
      L.DomEvent.disableClickPropagation(button);
      photoButtons.set(record.id, button);
      const marker = L.marker([record.lat, record.lng], {
        icon: L.divIcon({
          className: "range-photo-shell",
          html: button,
          iconAnchor: [20, 20],
          iconSize: [40, 40],
        }),
        keyboard: false,
        zIndexOffset: 1000,
      });
      markers.set(record.id, marker);
      continue;
    }
    const dot = L.circleMarker([record.lat, record.lng], {
      className: "range-dot",
      radius,
      renderer,
    });
    dot.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      onSelectRecord(record.id);
    });
    if (!coarse) {
      dot.on("mouseover", () => {
        showTooltip(
          tooltipContent(record.locality, record.formattedDate),
          dot.getLatLng(),
        );
        onHoverRegion(record.regionId ?? null);
      });
      dot.on("mouseout", () => {
        hoverTooltip.remove();
        onHoverRegion(null);
      });
    }
    dots.set(record.id, dot);
    markers.set(record.id, dot);
  }

  const shown = new Set<string>();
  const clusterMarks: {
    element: HTMLElement;
    marker: L.Marker;
    records: HalyomorphaFieldRecord[];
  }[] = [];

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
    for (const mark of clusterMarks) {
      mark.element.dataset.dim =
        selectedId &&
        !mark.records.some((record) => record.regionId === selectedId)
          ? "true"
          : "";
    }
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

  const openCluster = (members: HalyomorphaFieldRecord[]) => {
    const bounds = L.latLngBounds(
      members.map((record) => [record.lat, record.lng]),
    );
    const zoom = Math.min(
      MAX_ZOOM,
      Math.max(map.getZoom() + 1.5, map.getBoundsZoom(bounds.pad(0.4))),
    );
    onSelectRecord(null);
    if (reducedMotion()) {
      map.setView(bounds.getCenter(), zoom, { animate: false });
      return;
    }
    map.flyTo(bounds.getCenter(), zoom, { duration: FLY_SECONDS });
  };
  const addClusterMark = (group: RecordGroup) => {
    const count = group.records.length;
    const latlng = map.containerPointToLatLng(group.center);
    const element = document.createElement("div");
    element.className = "range-cluster";
    element.dataset.size = clusterSize(count);
    element.setAttribute("aria-hidden", "true");
    element.textContent = String(count);
    element.addEventListener("click", () => openCluster(group.records));
    L.DomEvent.disableClickPropagation(element);
    if (!coarse) {
      const content = tooltipContent(`${count} ${labels.regionRecordsLabel}`);
      element.addEventListener("mouseenter", () =>
        showTooltip(content, latlng),
      );
      element.addEventListener("mouseleave", () => hoverTooltip.remove());
    }
    clusterMarks.push({
      element,
      marker: L.marker(latlng, {
        icon: L.divIcon({
          className: "range-cluster-shell",
          html: element,
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map),
      records: group.records,
    });
  };
  const syncClusters = () => {
    for (const mark of clusterMarks) mark.marker.remove();
    clusterMarks.length = 0;
    hoverTooltip.remove();
    const clustered = new Set<string>();
    if (map.getZoom() < CLUSTER_MAX_ZOOM) {
      const items: RecordPoint[] = [];
      const radius = dotRadius();
      for (const record of records) {
        if (record.id === activeRecordId) continue;
        items.push({
          point: map.latLngToContainerPoint([record.lat, record.lng]),
          radius: record.kind === "photo" ? PHOTO_MARK_RADIUS : radius,
          record,
        });
      }
      for (const group of groupRecords(items)) {
        for (const record of group.records) clustered.add(record.id);
        addClusterMark(group);
      }
    }
    markers.forEach((marker, id) => {
      if (clustered.has(id)) {
        if (shown.delete(id)) marker.remove();
        return;
      }
      if (shown.has(id)) return;
      shown.add(id);
      marker.addTo(map);
    });
    applyStates();
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
    onSelectRecord(null);
  });

  const syncZoomState = () => {
    const nextRadius = dotRadius();
    dots.forEach((dot) => dot.setRadius(nextRadius));
    container.style.setProperty(
      "--range-hatch-opacity",
      String(
        Math.max(0.3, 1 - Math.max(0, map.getZoom() - overviewZoom - 1) * 0.3),
      ),
    );
    if (coarse) {
      if (map.getZoom() > overviewZoom + 0.2) map.dragging.enable();
      else map.dragging.disable();
    }
    syncClusters();
  };
  const syncOverview = () => {
    const next = atOverview();
    if (next === wasAtOverview) return;
    wasAtOverview = next;
    onOverviewChange(next);
  };
  map.on("zoomend", syncZoomState);
  map.on("moveend", syncOverview);
  syncClusters();

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

  return {
    destroy: () => {
      disposed = true;
      resizeObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      tileLayer.off("tileerror", handleTileError);
      map.off();
      map.remove();
    },
    focusRecord: (record, reveal) => {
      focusToken += 1;
      const token = focusToken;
      activeRecordId = record?.id ?? null;
      syncClusters();
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
}

function clusterSize(count: number) {
  if (count < 10) return "s";
  return count < 100 ? "m" : "l";
}

function collidingGroups(groups: RecordGroup[]) {
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = i + 1; j < groups.length; j += 1) {
      const reach = (markRadius(groups[i]) + markRadius(groups[j])) * 0.9;
      if (groups[i].center.distanceTo(groups[j].center) < reach) {
        return [groups[i], groups[j]] as const;
      }
    }
  }
  return null;
}

function groupRecords(items: RecordPoint[]): RecordGroup[] {
  const crowding = new Map<RecordPoint, number>();
  for (const item of items) {
    let count = 0;
    for (const other of items) {
      if (item.point.distanceTo(other.point) < CLUSTER_RADIUS) count += 1;
    }
    crowding.set(item, count);
  }
  const seeds = [...items].sort(
    (a, b) => (crowding.get(b) ?? 0) - (crowding.get(a) ?? 0),
  );

  const taken = new Set<RecordPoint>();
  const groups: RecordGroup[] = [];
  for (const seed of seeds) {
    if (taken.has(seed)) continue;
    const members: RecordPoint[] = [];
    for (const item of items) {
      if (
        !taken.has(item) &&
        seed.point.distanceTo(item.point) < CLUSTER_RADIUS
      ) {
        members.push(item);
      }
    }
    if (!hasOverlap(members)) continue;
    let x = 0;
    let y = 0;
    for (const member of members) {
      taken.add(member);
      x += member.point.x;
      y += member.point.y;
    }
    groups.push({
      center: L.point(x / members.length, y / members.length),
      records: members.map((member) => member.record),
    });
  }

  for (const item of items) {
    if (taken.has(item)) continue;
    const group = groups.find(
      (candidate) =>
        candidate.center.distanceTo(item.point) < markRadius(candidate),
    );
    if (group) group.records.push(item.record);
  }

  let collision = collidingGroups(groups);
  while (collision) {
    const [keep, drop] = collision;
    const total = keep.records.length + drop.records.length;
    keep.center = keep.center
      .multiplyBy(keep.records.length / total)
      .add(drop.center.multiplyBy(drop.records.length / total));
    keep.records.push(...drop.records);
    groups.splice(groups.indexOf(drop), 1);
    collision = collidingGroups(groups);
  }
  return groups;
}

function hasOverlap(members: RecordPoint[]) {
  for (let i = 0; i < members.length; i += 1) {
    for (let j = i + 1; j < members.length; j += 1) {
      const reach = members[i].radius + members[j].radius;
      if (members[i].point.distanceTo(members[j].point) < reach) return true;
    }
  }
  return false;
}

function markRadius(group: RecordGroup) {
  return CLUSTER_MARK_RADIUS[clusterSize(group.records.length)];
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
