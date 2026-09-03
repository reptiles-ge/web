"use client";

import { type SearchFilter } from "@/lib/siteSearch";

import { cn } from "@/lib/cn";

const FILTERS: SearchFilter[] = ["all", "page", "species", "region"];

export type SearchFilterLabels = Record<SearchFilter, string> & {
  filter: string;
};

export function SpeciesSearchFilterBar({
  labels,
  onChange,
  value,
}: {
  labels: SearchFilterLabels;
  onChange: (value: SearchFilter) => void;
  value: SearchFilter;
}) {
  return (
    <div
      aria-label={labels.filter}
      className="flex scrollbar-none gap-1 overflow-x-auto px-3 py-2.5"
      role="radiogroup"
    >
      {FILTERS.map((item) => {
        const active = value === item;
        return (
          <button
            aria-checked={active}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-colors",
              active
                ? "bg-primary text-white dark:text-ink"
                : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            key={item}
            onClick={() => onChange(item)}
            onMouseDown={(event) => event.preventDefault()}
            role="radio"
            type="button"
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}
