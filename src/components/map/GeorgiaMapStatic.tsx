import { useId } from "react";

import { GEORGIA_MAP_VIEWBOX } from "@/data/georgia-paths";
import { regions } from "@/data/mapRegions";
import { cn } from "@/lib/cn";

type GeorgiaMapStaticProps = {
  className?: string;
  highlightedIds: string[];
};

export function GeorgiaMapStatic({
  className,
  highlightedIds,
}: GeorgiaMapStaticProps) {
  const reactId = useId().replace(/:/g, "");
  const seaGradientId = `map-sea-${reactId}`;
  const highlightedSet = new Set(highlightedIds);
  const hasHighlights = highlightedSet.size > 0;

  return (
    <div
      aria-label="Georgia"
      className={cn("relative mx-auto w-full max-w-[920px]", className)}
      role="group"
    >
      <svg
        className="h-auto w-full drop-shadow-[0_28px_50px_-36px_rgba(47,107,79,0.45)] select-none"
        viewBox={GEORGIA_MAP_VIEWBOX}
      >
        <defs>
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
          {regions.map((region) => {
            const isHighlighted = highlightedSet.has(region.id);
            const isDimmed = hasHighlights && !isHighlighted;

            return (
              <path
                aria-hidden="true"
                d={region.path}
                fill={
                  isHighlighted
                    ? "var(--map-region-active)"
                    : isDimmed
                      ? "var(--map-region-dim)"
                      : "var(--map-region)"
                }
                key={region.id}
                stroke="var(--map-stroke)"
                strokeWidth={0.9}
                style={{
                  opacity: isDimmed ? 0.55 : 1,
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
