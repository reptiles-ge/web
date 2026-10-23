"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { AtlasRegionLabel, AtlasView } from "@/data/atlasFilters";
import type { AtlasCardItem } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";

import { AtlasPagination } from "@/components/species-atlas/AtlasPagination";
import {
  AtlasSpeciesCard,
  AtlasSpeciesRow,
} from "@/components/species-atlas/AtlasSpeciesCard";
import { atlasPageCount, atlasPageRange } from "@/lib/atlasPages";
import { cn } from "@/lib/cn";

type AtlasSpeciesGridProps = {
  loading: boolean;
  locale: AppLocale;
  onPageChange: (page: number) => void;
  page: number;
  regionLabels: AtlasRegionLabel[];
  species: AtlasCardItem[];
  total: number;
  view: AtlasView;
};

export function AtlasSpeciesGrid({
  loading,
  locale,
  onPageChange,
  page: requestedPage,
  regionLabels,
  species,
  total,
  view,
}: AtlasSpeciesGridProps) {
  const t = useTranslations("speciesAtlas");
  const labelById = useMemo(
    () => new Map(regionLabels.map((region) => [region.id, region.label])),
    [regionLabels],
  );
  const regionNames = (item: AtlasCardItem) =>
    item.regionIds.map((id) => labelById.get(id) ?? id);
  const { first, last, page } = atlasPageRange(requestedPage, total);

  function goToPage(next: number) {
    onPageChange(next);
    document
      .getElementById("explorer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ul
        aria-busy={loading}
        className={cn(
          "mt-3.5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-[18px] lg:grid-cols-4 lg:gap-5",
          view === "list" && "lg:hidden",
          loading && "opacity-60 transition-opacity",
        )}
      >
        {species.map((item, index) => (
          <li key={item.id}>
            <AtlasSpeciesCard
              index={first - 1 + index}
              locale={locale}
              regionNames={regionNames(item)}
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
            {species.map((item, index) => (
              <li key={item.id}>
                <AtlasSpeciesRow
                  index={first - 1 + index}
                  locale={locale}
                  regionNames={regionNames(item)}
                  species={item}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <AtlasPagination
        current={page}
        first={first}
        last={last}
        onChange={goToPage}
        pageCount={atlasPageCount(total)}
        total={total}
      />
    </>
  );
}
