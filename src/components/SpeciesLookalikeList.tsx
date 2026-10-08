"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

type SpeciesLookalikeListProps = {
  items: Array<{ id: string; node: ReactNode }>;
  labelledBy: string;
  moreLabel: string;
  speciesId: string;
  visibleCount: number;
};

export function SpeciesLookalikeList({
  items,
  labelledBy,
  moreLabel,
  speciesId,
  visibleCount,
}: SpeciesLookalikeListProps) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const hiddenCount = items.length - visibleCount;

  useEffect(() => {
    if (!expanded) return;
    listRef.current
      ?.querySelectorAll<HTMLAnchorElement>("a")
      [visibleCount]?.focus({ preventScroll: true });
  }, [expanded, visibleCount]);

  return (
    <ul
      aria-labelledby={labelledBy}
      className="no-scrollbar -mx-6 mt-3.5 flex snap-x snap-mandatory scroll-px-6 gap-2.5 overflow-x-auto overscroll-x-contain px-6 pb-3 lg:mx-0 lg:mt-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
      ref={listRef}
    >
      {items.map((item, index) => (
        <li
          className="w-[264px] shrink-0 snap-start transition-[opacity,translate] duration-300 ease-out lg:w-auto starting:translate-y-1 starting:opacity-0"
          hidden={!expanded && index >= visibleCount}
          key={item.id}
        >
          {item.node}
        </li>
      ))}
      {hiddenCount > 0 && !expanded ? (
        <li className="flex shrink-0 snap-start items-center">
          <button
            aria-expanded={false}
            aria-label={moreLabel}
            className="inline-flex h-11.5 items-center rounded-full border border-dashed border-foreground/25 px-4 text-[14px] font-medium text-muted-foreground transition-colors hover:border-foreground/45 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              setExpanded(true);
              trackEvent("lookalikes_expand", {
                count: hiddenCount,
                species_id: speciesId,
              });
            }}
            type="button"
          >
            +{hiddenCount}
          </button>
        </li>
      ) : null}
    </ul>
  );
}
