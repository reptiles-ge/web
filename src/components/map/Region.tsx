"use client";

import type { Region as RegionData } from "@/data/regions";
import { localizeRegionText } from "@/data/regions";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

type RegionProps = {
  region: RegionData;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export function Region({
  region,
  isHovered,
  isSelected,
  isDimmed,
  onHover,
  onSelect,
}: RegionProps) {
  const locale = useLocale();
  const active = isHovered || isSelected;

  return (
    <motion.path
      d={region.path}
      role="button"
      tabIndex={0}
      aria-label={localizeRegionText(region.name, locale)}
      aria-pressed={isSelected}
      onMouseEnter={() => onHover(region.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(region.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(region.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(region.id);
        }
      }}
      initial={false}
      animate={{
        fill: active
          ? "var(--map-region-active)"
          : isDimmed
            ? "var(--map-region-dim)"
            : "var(--map-region)",
        stroke: active ? "var(--map-stroke-active)" : "var(--map-stroke)",
        strokeWidth: active ? 1.6 : 0.9,
        filter: active
          ? "url(#map-region-glow)"
          : "none",
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer outline-none focus-visible:stroke-[2.2px]"
      style={{
        transformOrigin: "center",
        opacity: isDimmed && !active ? 0.55 : 1,
      }}
    />
  );
}
