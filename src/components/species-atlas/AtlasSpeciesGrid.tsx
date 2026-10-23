"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { AtlasRegionLabel, AtlasView } from "@/data/atlasFilters";
import type { AtlasIndexItem } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";

import { AtlasPagination } from "@/components/species-atlas/AtlasPagination";
import { useAtlasPhotoLoader } from "@/components/species-atlas/AtlasPhotos";
import {
  AtlasSpeciesCard,
  AtlasSpeciesRow,
} from "@/components/species-atlas/AtlasSpeciesCard";
import { atlasPageCount, atlasPageRange } from "@/lib/atlasPages";
import { cn } from "@/lib/cn";

type AtlasSpeciesGridProps = {
  locale: AppLocale;
  regionLabels: AtlasRegionLabel[];
  species: AtlasIndexItem[];
  view: AtlasView;
};

export function AtlasSpeciesGrid({
  locale,
  regionLabels,
  species,
  view,
}: AtlasSpeciesGridProps) {
  const t = useTranslations("speciesAtlas");
  const labelById = useMemo(
    () => new Map(regionLabels.map((region) => [region.id, region.label])),
    [regionLabels],
  );
  const regionNames = (item: AtlasIndexItem) =>
    item.regionIds.map((id) => labelById.get(id) ?? id);
  const [requestedPage, setRequestedPage] = useState(1);
  const [seenSpecies, setSeenSpecies] = useState(species);

  if (species !== seenSpecies) {
    setSeenSpecies(species);
    setRequestedPage(1);
  }

  const { first, last, page } = atlasPageRange(requestedPage, species.length);
  const visible = species.slice(first - 1, last);
  useAtlasPhotoLoader(visible);

  function goToPage(next: number) {
    setRequestedPage(next);
    document
      .getElementById("explorer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            {visible.map((item, index) => (
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
        pageCount={atlasPageCount(species.length)}
        total={species.length}
      />
    </>
  );
}
