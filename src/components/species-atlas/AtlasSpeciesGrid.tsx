"use client";

import { AtlasSpeciesCard } from "@/components/species-atlas/AtlasSpeciesCard";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import {
  initialAtlasVisibleCount,
  nextAtlasVisibleCount,
} from "@/lib/atlasInfiniteScroll";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type AtlasSpeciesGridProps = {
  species: Species[];
  locale: AppLocale;
};

export function AtlasSpeciesGrid({ species, locale }: AtlasSpeciesGridProps) {
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
              species={item}
              locale={locale}
              index={index}
              eager={index < 3}
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {t("showingCount", {
          shown: visible.length,
          total: species.length,
        })}
      </p>
    </div>
  );
}
