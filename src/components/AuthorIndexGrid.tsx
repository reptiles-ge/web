"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/cn";

export type AuthorIndexFilter = {
  count: number;
  id: string;
  label: string;
};

export function AuthorIndexGrid({
  countLabels,
  filterLabel,
  filters,
  items,
  sortedLabel,
}: {
  countLabels: Record<string, string>;
  filterLabel: string;
  filters: AuthorIndexFilter[];
  items: Array<{ id: string; node: ReactNode; role: string }>;
  sortedLabel: string;
}) {
  const [role, setRole] = useState("all");
  const [filtered, setFiltered] = useState(false);
  const visibleIds = items
    .filter((item) => role === "all" || item.role === role)
    .map((item) => item.id);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pb-7">
        <div
          aria-label={filterLabel}
          className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
          role="group"
        >
          {filters.map((filter) => {
            const active = filter.id === role;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-[18px] text-[14px] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "bg-card text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] hover:text-primary",
                )}
                key={filter.id}
                onClick={() => {
                  setRole(filter.id);
                  setFiltered(true);
                }}
                type="button"
              >
                {filter.label}
                <span className="text-[12px] tabular-nums opacity-70">
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
        <p
          aria-live="polite"
          className="text-[13px] text-muted-foreground lg:text-[14px]"
        >
          {countLabels[role]} · {sortedLabel}
        </p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:mt-9 lg:grid-cols-3 lg:gap-6">
        {items.map((item) => (
          <li
            className={cn(
              "flex",
              filtered &&
                "animate-[rating-in_420ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
            )}
            hidden={!visibleIds.includes(item.id)}
            key={filtered ? `${role}-${item.id}` : item.id}
            style={
              filtered
                ? {
                    animationDelay: `${Math.min(visibleIds.indexOf(item.id), 8) * 40}ms`,
                  }
                : undefined
            }
          >
            {item.node}
          </li>
        ))}
      </ul>
    </>
  );
}
