"use client";

import { useTranslations } from "next-intl";

import type { AtlasFilters } from "@/data/atlasFilters";

import { DANGER_OPTIONS } from "@/components/species-atlas/atlasOptions";
import { cn } from "@/lib/cn";

export function RiskSegment({
  compact = false,
  label,
  onChange,
  value,
}: {
  compact?: boolean;
  label: string;
  onChange: (value: AtlasFilters["danger"]) => void;
  value: AtlasFilters["danger"];
}) {
  const t = useTranslations("speciesAtlas");
  return (
    <div
      aria-label={label}
      className={cn(
        "flex rounded-full bg-background",
        compact ? "gap-0.5 p-[3px]" : "gap-1 p-1",
      )}
      role="radiogroup"
    >
      {DANGER_OPTIONS.map((danger) => {
        const active = value === danger;
        return (
          <button
            aria-checked={active}
            className={cn(
              "tap-target rounded-full font-medium whitespace-nowrap transition-colors",
              compact ? "h-9 px-3.5 text-[13px]" : "h-11 flex-1 text-[14px]",
              active && danger === "venomous"
                ? "bg-destructive text-white shadow-[0_1px_3px_rgba(14,20,17,0.12)]"
                : active
                  ? "bg-card text-foreground shadow-[0_1px_3px_rgba(14,20,17,0.12)]"
                  : "text-foreground hover:bg-card/60",
            )}
            key={danger}
            onClick={() => onChange(danger)}
            role="radio"
            type="button"
          >
            {t(`danger.${danger}`)}
          </button>
        );
      })}
    </div>
  );
}
