"use client";

import { Region } from "@/components/map/Region";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { RegionTooltip } from "@/components/map/RegionTooltip";
import { GEORGIA_MAP_VIEWBOX } from "@/data/georgia-paths";
import { regions, type Region as RegionData } from "@/data/regions";
import { trackEvent, type MapContext } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { regionHref } from "@/lib/speciesRoutes";
import { useRouter } from "@/i18n/navigation";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { MotionLazy } from "@/components/MotionLazy";

type GeorgiaMapProps = {
  className?: string;
  highlightedIds?: string[];
  interactive?: boolean;
  selectionMode?: "panel" | "navigate";
  mapContext?: MapContext;
};

const EMPTY_HIGHLIGHTED_IDS: string[] = [];

export function GeorgiaMap({
  className,
  highlightedIds = EMPTY_HIGHLIGHTED_IDS,
  interactive = true,
  selectionMode = "panel",
  mapContext = "home",
}: GeorgiaMapProps) {
  const router = useRouter();
  const reactId = useId();
  const glowFilterId = `map-region-glow-${reactId.replace(/:/g, "")}`;
  const seaGradientId = `map-sea-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
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
    (id: string | null) => {
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
        region_id: id,
        map_context: mapContext,
        action: selectionMode === "navigate" ? "navigate" : "panel",
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
          ref={containerRef}
          role="group"
          aria-label="Georgia"
          className={cn("relative mx-auto w-full max-w-[920px]", className)}
          onMouseMove={interactive ? updateTooltipFromEvent : undefined}
        >
          <svg
            viewBox={GEORGIA_MAP_VIEWBOX}
            className="h-auto w-full drop-shadow-[0_28px_50px_-36px_rgba(47,107,79,0.45)] select-none"
          >
            <defs>
              <filter
                id={glowFilterId}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.18
                        0 0 0 0 0.42
                        0 0 0 0 0.28
                        0 0 0 0.55 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id={seaGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--map-sea-from)" />
                <stop offset="100%" stopColor="var(--map-sea-to)" />
              </linearGradient>
            </defs>

            <rect
              x="0"
              y="0"
              width="1000"
              height="510"
              fill={`url(#${seaGradientId})`}
              rx="28"
              opacity="0.35"
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
                    key={region.id}
                    region={region}
                    isHovered={hoveredId === region.id}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    interactive={interactive}
                    glowFilterId={glowFilterId}
                    onHover={handleHover}
                    onSelect={handleSelect}
                  />
                );
              })}
            </g>
          </svg>

          {interactive ? (
            <RegionTooltip region={hoveredRegion} position={tooltipPos} />
          ) : null}
        </div>

        {usePanel ? (
          <RegionDetailsPanel region={selectedRegion} onClose={handleClose} />
        ) : null}
      </>
    </MotionLazy>
  );
}
