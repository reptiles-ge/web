/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AtlasSpeciesCard } from "@/components/species-atlas/AtlasSpeciesCard";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { startTransition, useEffect, useRef, useState } from "react";

const BATCH_SIZE = 9;

type AtlasSpeciesGridProps = {
  species: Species[];
  locale: AppLocale;
};

export function AtlasSpeciesGrid({ species, locale }: AtlasSpeciesGridProps) {
  const t = useTranslations("speciesAtlas");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [species]);

  const visible = species.slice(0, visibleCount);
  const hasMore = visibleCount < species.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        startTransition(() => {
          setVisibleCount((count) =>
            Math.min(count + BATCH_SIZE, species.length),
          );
        });
      },
      {
        root: null,
        rootMargin: "480px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
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
        <div
          ref={sentinelRef}
          className="flex flex-col items-center gap-3 py-10"
          aria-hidden="true"
        >
          <div className="flex gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
          </div>
          <p className="text-[12px] text-muted-foreground">
            {t("showingCount", {
              shown: visible.length,
              total: species.length,
            })}
          </p>
        </div>
      ) : species.length > BATCH_SIZE ? (
        <p className="mt-8 text-center text-[12px] text-muted-foreground">
          {t("showingCount", {
            shown: visible.length,
            total: species.length,
          })}
        </p>
      ) : null}
    </div>
  );
}
