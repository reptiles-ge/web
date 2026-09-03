"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AtlasSpeciesCard } from "@/components/species-atlas/AtlasSpeciesCard";
import {
  initialAtlasVisibleCount,
  nextAtlasVisibleCount,
} from "@/lib/atlasInfiniteScroll";

type AtlasSpeciesGridProps = {
  locale: AppLocale;
  species: Species[];
};

export function AtlasSpeciesGrid({ locale, species }: AtlasSpeciesGridProps) {
  const t = useTranslations("speciesAtlas");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    initialAtlasVisibleCount(species.length),
  );
  const [seenSpecies, setSeenSpecies] = useState(species);

  if (species !== seenSpecies) {
    setSeenSpecies(species);
    setVisibleCount(initialAtlasVisibleCount(species.length));
  }

  const visible = species.slice(0, visibleCount);
  const hasMore = visibleCount < species.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((loaded) =>
          nextAtlasVisibleCount(loaded, species.length),
        );
      },
      { rootMargin: "640px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, species.length, visibleCount]);

  return (
    <div className="mt-12">
      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
        {visible.map((item, index) => (
          <li key={item.id}>
            <AtlasSpeciesCard
              eager={index < 3}
              index={index}
              locale={locale}
              species={item}
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div aria-hidden="true" className="h-px w-full" ref={sentinelRef} />
      ) : null}

      <p aria-live="polite" className="sr-only">
        {t("showingCount", {
          shown: visible.length,
          total: species.length,
        })}
      </p>
    </div>
  );
}
