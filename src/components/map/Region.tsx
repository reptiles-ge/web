"use client";

import type { Region as RegionData } from "@/data/regions";
import { localizeRegionText } from "@/data/regions";
import { m } from "@/components/MotionLazy";
import { useLocale } from "next-intl";

type RegionProps = {
  region: RegionData;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  interactive?: boolean;
  glowFilterId?: string;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export function Region({
  region,
  isHovered,
  isSelected,
  isDimmed,
  interactive = true,
  glowFilterId = "map-region-glow",
  onHover,
  onSelect,
}: RegionProps) {
  const locale = useLocale();
  const active = isHovered || isSelected;

  return (
    <m.path
      d={region.path}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={localizeRegionText(region.name, locale)}
      aria-pressed={interactive ? isSelected : undefined}
      onMouseEnter={interactive ? () => onHover(region.id) : undefined}
      onMouseLeave={interactive ? () => onHover(null) : undefined}
      onFocus={interactive ? () => onHover(region.id) : undefined}
      onBlur={interactive ? () => onHover(null) : undefined}
      onClick={interactive ? () => onSelect(region.id) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(region.id);
              }
            }
          : undefined
      }
      pointerEvents={interactive ? undefined : "none"}
      initial={false}
      animate={{
        fill: active
          ? "var(--map-region-active)"
          : isDimmed
            ? "var(--map-region-dim)"
            : "var(--map-region)",
        stroke: active ? "var(--map-stroke-active)" : "var(--map-stroke)",
        strokeWidth: active ? 1.6 : 0.9,
        filter: active ? `url(#${glowFilterId})` : "none",
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`outline-none ${interactive ? "cursor-pointer focus-visible:stroke-[2.2px]" : "cursor-default"}`}
      style={{
        transformOrigin: "center",
        opacity: isDimmed && !active ? 0.55 : 1,
      }}
    />
  );
}
