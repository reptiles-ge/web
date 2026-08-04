"use client";

import { Region } from "@/components/map/Region";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { RegionTooltip } from "@/components/map/RegionTooltip";
import { GEORGIA_MAP_VIEWBOX } from "@/data/georgia-paths";
import { regions, type Region as RegionData } from "@/data/regions";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

type GeorgiaMapProps = {
  className?: string;
};

export function GeorgiaMap({ className }: GeorgiaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === selectedId) ?? null,
    [selectedId],
  );

  const hoveredRegion = useMemo(
    () => regions.find((region) => region.id === hoveredId) ?? null,
    [hoveredId],
  );

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
    if (!id) setTooltipPos(null);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  function updateTooltipFromEvent(event: MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container || !hoveredId) return;
    const rect = container.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`relative mx-auto w-full max-w-[920px] ${className ?? ""}`}
        onMouseMove={updateTooltipFromEvent}
      >
        <svg
          viewBox={GEORGIA_MAP_VIEWBOX}
          role="img"
          aria-label="Georgia"
          className="h-auto w-full select-none drop-shadow-[0_28px_50px_-36px_rgba(47,107,79,0.45)]"
        >
          <defs>
            <filter
              id="map-region-glow"
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
            <linearGradient id="map-sea" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--map-sea-from)" />
              <stop offset="100%" stopColor="var(--map-sea-to)" />
            </linearGradient>
          </defs>

          <rect
            x="0"
            y="0"
            width="1000"
            height="510"
            fill="url(#map-sea)"
            rx="28"
            opacity="0.35"
          />

          <g>
            {regions.map((region: RegionData) => (
              <Region
                key={region.id}
                region={region}
                isHovered={hoveredId === region.id}
                isSelected={selectedId === region.id}
                isDimmed={
                  Boolean(hoveredId || selectedId) &&
                  hoveredId !== region.id &&
                  selectedId !== region.id
                }
                onHover={handleHover}
                onSelect={handleSelect}
              />
            ))}
          </g>
        </svg>

        <RegionTooltip region={hoveredRegion} position={tooltipPos} />
      </div>

      <RegionDetailsPanel region={selectedRegion} onClose={handleClose} />
    </>
  );
}
