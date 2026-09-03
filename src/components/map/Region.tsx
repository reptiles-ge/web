"use client";

import type { KeyboardEvent } from "react";

import { m } from "framer-motion";
import { useLocale } from "next-intl";

import type { Region as RegionData } from "@/data/regions";

import { localizeRegionText } from "@/data/regions";
import { cn } from "@/lib/cn";

type RegionProps = {
  glowFilterId?: string;
  interactive?: boolean;
  isDimmed: boolean;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: null | string) => void;
  onSelect: (id: string) => void;
  region: RegionData;
};

export function Region({
  glowFilterId = "map-region-glow",
  interactive = true,
  isDimmed,
  isHovered,
  isSelected,
  onHover,
  onSelect,
  region,
}: RegionProps) {
  const locale = useLocale();
  const active = isHovered || isSelected;
  const label = localizeRegionText(region.name, locale);

  return (
    <m.path
      d={region.path}
      {...(interactive
        ? {
            "aria-label": label,
            "aria-pressed": isSelected,
            onBlur: () => onHover(null),
            onClick: () => onSelect(region.id),
            onFocus: () => onHover(region.id),
            onKeyDown: (event: KeyboardEvent<SVGPathElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(region.id);
              }
            },
            onMouseEnter: () => onHover(region.id),
            onMouseLeave: () => onHover(null),
            role: "button" as const,
            tabIndex: 0,
          }
        : {
            "aria-hidden": true as const,
            pointerEvents: "none" as const,
          })}
      animate={{
        fill: active
          ? "var(--map-region-active)"
          : isDimmed
            ? "var(--map-region-dim)"
            : "var(--map-region)",
        filter: active ? `url(#${glowFilterId})` : "none",
        stroke: active ? "var(--map-stroke-active)" : "var(--map-stroke)",
        strokeWidth: active ? 1.6 : 0.9,
      }}
      className={cn(
        "outline-none",
        interactive
          ? "cursor-pointer focus-visible:stroke-[2.2px]"
          : "cursor-default",
      )}
      initial={false}
      style={{
        opacity: isDimmed && !active ? 0.55 : 1,
        transformOrigin: "center",
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
