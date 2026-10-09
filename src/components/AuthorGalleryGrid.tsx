"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import { cn } from "@/lib/cn";

export type AuthorGalleryFilter = {
  count: number;
  countLabel: string;
  id: string;
  label: string;
  showAllLabel: string;
};

const INITIAL = 9;

export function AuthorGalleryGrid({
  filterLabel,
  filters,
  heading,
  items,
}: {
  filterLabel: string;
  filters: AuthorGalleryFilter[];
  heading: ReactNode;
  items: Array<{ group: string; id: string; node: ReactNode }>;
}) {
  const [group, setGroup] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const current = filters.find((filter) => filter.id === group) ?? filters[0];
  const visible = items.filter(
    (item) => group === "all" || item.group === group,
  );
  const shown = new Set(
    (expanded ? visible : visible.slice(0, INITIAL)).map((item) => item.id),
  );
  const first = visible[0]?.id;

  return (
    <>
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
        {heading}
        <p
          aria-live="polite"
          className="mt-3 text-[13px] text-muted-foreground lg:mt-0 lg:pb-1.5 lg:text-[14px]"
        >
          {current.countLabel}
        </p>
      </div>
      {filters.length > 2 ? (
        <div
          aria-label={filterLabel}
          className="no-scrollbar -mx-6 mt-5 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:mt-7 lg:flex-wrap lg:overflow-visible lg:px-0"
          role="group"
        >
          {filters.map((filter) => {
            const active = filter.id === group;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-[18px] text-[14px] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground hover:text-primary",
                )}
                key={filter.id}
                onClick={() => {
                  setGroup(filter.id);
                  setExpanded(false);
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
      ) : null}
      <ul className="mt-5 grid grid-cols-2 gap-2.5 lg:mt-8 lg:grid-cols-4 lg:gap-4">
        {items.map((item) => (
          <li
            className={cn(item.id === first && "col-span-2 row-span-2")}
            hidden={!shown.has(item.id)}
            key={item.id}
          >
            {item.node}
          </li>
        ))}
      </ul>
      {!expanded && visible.length > INITIAL ? (
        <div className="mt-6 flex justify-center lg:mt-7">
          <button
            aria-expanded={false}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-[26px] text-[15px] font-medium text-foreground transition-transform hover:-translate-y-0.5 lg:inline-flex lg:w-auto"
            onClick={() => setExpanded(true)}
            type="button"
          >
            {current.showAllLabel}
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
    </>
  );
}
