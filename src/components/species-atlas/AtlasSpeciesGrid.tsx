"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { AtlasView } from "@/data/atlasFilters";
import type { SpeciesListItem } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";

import {
  AtlasSpeciesCard,
  AtlasSpeciesRow,
} from "@/components/species-atlas/AtlasSpeciesCard";
import {
  initialAtlasVisibleCount,
  nextAtlasVisibleCount,
} from "@/lib/atlasInfiniteScroll";
import { cn } from "@/lib/cn";

type AtlasSpeciesGridProps = {
  locale: AppLocale;
  species: SpeciesListItem[];
  view: AtlasView;
};

export function AtlasSpeciesGrid({
  locale,
  species,
  view,
}: AtlasSpeciesGridProps) {
  const t = useTranslations("speciesAtlas");
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
  const progress = species.length
    ? Math.round((visible.length / species.length) * 100)
    : 0;

  return (
    <>
      <ul
        className={cn(
          "mt-3.5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-[18px] lg:grid-cols-4 lg:gap-5",
          view === "list" && "lg:hidden",
        )}
      >
        {visible.map((item, index) => (
          <li key={item.id}>
            <AtlasSpeciesCard
              eager={index < 4}
              index={index}
              locale={locale}
              species={item}
            />
          </li>
        ))}
      </ul>

      {view === "list" ? (
        <div className="mt-[18px] hidden overflow-hidden rounded-[28px] bg-card px-2 py-1.5 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)] lg:block">
          <div
            aria-hidden="true"
            className="grid min-h-11 grid-cols-[56px_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1fr)_120px_minmax(0,1.2fr)_24px] items-center gap-4 px-4 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
          >
            <span />
            <span>{t("columnSpecies")}</span>
            <span>{t("filters.type")}</span>
            <span>{t("filters.danger")}</span>
            <span>{t("filters.habitat")}</span>
            <span>{t("foundIn")}</span>
            <span />
          </div>
          <ul>
            {visible.map((item, index) => (
              <li key={item.id}>
                <AtlasSpeciesRow index={index} locale={locale} species={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasMore ? (
        <div className="mt-[22px] flex flex-col items-center gap-2.5 lg:mt-8 lg:gap-3">
          <div
            aria-hidden="true"
            className="h-1 w-[180px] overflow-hidden rounded-full bg-secondary lg:w-[220px]"
          >
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[12.5px] text-muted-foreground lg:text-[13px]">
            {t("showingCount", {
              shown: visible.length,
              total: species.length,
            })}
          </p>
          <button
            className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-border bg-card px-7 text-[15px] font-medium text-foreground transition-transform hover:-translate-y-0.5 motion-reduce:transition-none sm:w-auto lg:h-[54px]"
            onClick={() =>
              setVisibleCount((loaded) =>
                nextAtlasVisibleCount(loaded, species.length),
              )
            }
            type="button"
          >
            {t("showMore")}
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
    </>
  );
}
