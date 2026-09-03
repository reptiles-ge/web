"use client";

import type { Region as RegionData } from "@/data/regions";
import { localizeRegionText } from "@/data/regions";
import { cn } from "@/lib/cn";
import { m } from "framer-motion";
import { useLocale } from "next-intl";
import type { KeyboardEvent } from "react";

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
  const label = localizeRegionText(region.name, locale);

  return (
    <m.path
      d={region.path}
      {...(interactive
        ? {
            role: "button" as const,
            tabIndex: 0,
            "aria-label": label,
            "aria-pressed": isSelected,
            onMouseEnter: () => onHover(region.id),
            onMouseLeave: () => onHover(null),
            onFocus: () => onHover(region.id),
            onBlur: () => onHover(null),
            onClick: () => onSelect(region.id),
            onKeyDown: (event: KeyboardEvent<SVGPathElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(region.id);
              }
            },
          }
        : {
            "aria-hidden": true as const,
            pointerEvents: "none" as const,
          })}
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
      className={cn(
        "outline-none",
        interactive
          ? "cursor-pointer focus-visible:stroke-[2.2px]"
          : "cursor-default",
      )}
      style={{
        transformOrigin: "center",
        opacity: isDimmed && !active ? 0.55 : 1,
      }}
    />
  );
}
