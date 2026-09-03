"use client";

import {
  type MouseEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Region } from "@/components/map/Region";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { RegionTooltip } from "@/components/map/RegionTooltip";
import { MotionLazy } from "@/components/MotionLazy";
import { GEORGIA_MAP_VIEWBOX } from "@/data/georgia-paths";
import { type Region as RegionData, regions } from "@/data/regions";
import { useRouter } from "@/i18n/navigation";
import { type MapContext, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { regionHref } from "@/lib/speciesRoutes";

type GeorgiaMapProps = {
  className?: string;
  highlightedIds?: string[];
  interactive?: boolean;
  mapContext?: MapContext;
  selectionMode?: "navigate" | "panel";
};

const EMPTY_HIGHLIGHTED_IDS: string[] = [];

export function GeorgiaMap({
  className,
  highlightedIds = EMPTY_HIGHLIGHTED_IDS,
  interactive = true,
  mapContext = "home",
  selectionMode = "panel",
}: GeorgiaMapProps) {
  const router = useRouter();
  const reactId = useId();
  const glowFilterId = `map-region-glow-${reactId.replace(/:/g, "")}`;
  const seaGradientId = `map-sea-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<null | string>(null);
  const [selectedId, setSelectedId] = useState<null | string>(null);
  const [tooltipPos, setTooltipPos] = useState<null | { x: number; y: number }>(
    null,
  );

  const highlightedSet = useMemo(
    () => new Set(highlightedIds),
    [highlightedIds],
  );
  const hasHighlights = highlightedSet.size > 0;
  const usePanel = interactive && selectionMode === "panel";

  const selectedRegion = useMemo(
    () =>
      usePanel
        ? (regions.find((region) => region.id === selectedId) ?? null)
        : null,
    [usePanel, selectedId],
  );

  const hoveredRegion = useMemo(
    () => regions.find((region) => region.id === hoveredId) ?? null,
    [hoveredId],
  );

  const handleHover = useCallback(
    (id: null | string) => {
      if (!interactive) return;
      setHoveredId(id);
      if (!id) setTooltipPos(null);
    },
    [interactive],
  );

  const handleSelect = useCallback(
    (id: string) => {
      if (!interactive) return;
      trackEvent("map_region_select", {
        action: selectionMode === "navigate" ? "navigate" : "panel",
        map_context: mapContext,
        region_id: id,
      });
      if (selectionMode === "navigate") {
        router.push(regionHref(id));
        return;
      }
      setSelectedId(id);
    },
    [interactive, selectionMode, router, mapContext],
  );

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  function updateTooltipFromEvent(event: MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const container = containerRef.current;
    if (!container || !hoveredId) return;
    const rect = container.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <MotionLazy>
      <>
        <div
          aria-label="Georgia"
          className={cn("relative mx-auto w-full max-w-[920px]", className)}
          onMouseMove={interactive ? updateTooltipFromEvent : undefined}
          ref={containerRef}
          role="group"
        >
          <svg
            className="h-auto w-full drop-shadow-[0_28px_50px_-36px_rgba(47,107,79,0.45)] select-none"
            viewBox={GEORGIA_MAP_VIEWBOX}
          >
            <defs>
              <filter
                height="140%"
                id={glowFilterId}
                width="140%"
                x="-20%"
                y="-20%"
              >
                <feGaussianBlur result="blur" stdDeviation="3.5" />
                <feColorMatrix
                  in="blur"
                  result="glow"
                  type="matrix"
                  values="0 0 0 0 0.18
                        0 0 0 0 0.42
                        0 0 0 0 0.28
                        0 0 0 0.55 0"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id={seaGradientId}
                x1="0%"
                x2="100%"
                y1="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--map-sea-from)" />
                <stop offset="100%" stopColor="var(--map-sea-to)" />
              </linearGradient>
            </defs>

            <rect
              fill={`url(#${seaGradientId})`}
              height="510"
              opacity="0.35"
              rx="28"
              width="1000"
              x="0"
              y="0"
            />

            <g>
              {regions.map((region: RegionData) => {
                const isHighlighted = highlightedSet.has(region.id);
                const isSelected =
                  isHighlighted || (usePanel && selectedId === region.id);
                const isDimmed =
                  (hasHighlights ||
                    Boolean(hoveredId) ||
                    (usePanel && Boolean(selectedId))) &&
                  !isSelected &&
                  hoveredId !== region.id;

                return (
                  <Region
                    glowFilterId={glowFilterId}
                    interactive={interactive}
                    isDimmed={isDimmed}
                    isHovered={hoveredId === region.id}
                    isSelected={isSelected}
                    key={region.id}
                    onHover={handleHover}
                    onSelect={handleSelect}
                    region={region}
                  />
                );
              })}
            </g>
          </svg>

          {interactive ? (
            <RegionTooltip position={tooltipPos} region={hoveredRegion} />
          ) : null}
        </div>

        {usePanel ? (
          <RegionDetailsPanel onClose={handleClose} region={selectedRegion} />
        ) : null}
      </>
    </MotionLazy>
  );
}
