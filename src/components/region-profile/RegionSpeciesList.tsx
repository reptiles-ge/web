"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { RegionSpeciesCardItem } from "@/data/regions";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { RegionSpeciesGroup } from "@/lib/regionSpeciesGroups";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ClientCoverImage } from "@/components/ClientCoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import {
  eyebrowClass,
  focusClass,
  wrapClass,
} from "@/components/regions-index/shared";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { REGION_SECTION_IDS } from "@/lib/toc";

import { regionH2Class, scrollerClass } from "./classes";
import { RegionSpeciesTag } from "./parts";

type RegionSpeciesFilter = "all" | AnimalGroup;

export function RegionSpeciesList({
  groups,
  name,
  nameIn,
  total,
}: {
  groups: RegionSpeciesGroup[];
  name: string;
  nameIn: string;
  total: number;
}) {
  const t = useTranslations("regions");
  const tNav = useTranslations("nav");
  const tSearch = useTranslations("search");
  const [filter, setFilter] = useState<RegionSpeciesFilter>("all");
  const shown =
    filter === "all" ? groups : groups.filter((item) => item.group === filter);
  const chips: { count: number; id: RegionSpeciesFilter; label: string }[] = [
    { count: total, id: "all", label: tSearch("all") },
    ...groups.map((item) => ({
      count: item.items.length,
      id: item.group,
      label: tNav(item.hub),
    })),
  ];

  function updateFilter(next: RegionSpeciesFilter, count: number) {
    if (next === filter) return;
    setFilter(next);
    trackEvent("region_species_filter", {
      group_filter: next,
      page_type: "region",
      result_count: count,
    });
  }

  return (
    <section className="pt-12 lg:pt-[104px]">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p className={eyebrowClass}>{t("speciesEyebrow")}</p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className={regionH2Class}
              id={REGION_SECTION_IDS.species}
            >
              {t.rich("speciesHeading", {
                count: total,
                n: (chunks) => (
                  <span className="text-(--nw-accent) tabular-nums">
                    {chunks}
                  </span>
                ),
                name,
                nameIn,
              })}
            </AnchoredHeading>
          </div>
          <p className="hidden max-w-[440px] text-[14px] leading-[1.65] text-(--nw-muted) lg:block">
            {t("dataGapBody")}
          </p>
        </div>
        {groups.length > 1 ? (
          <div
            aria-label={t("speciesFilterLabel")}
            className={cn(
              scrollerClass,
              "mt-4 gap-1.5 lg:mx-0 lg:mt-7 lg:flex-wrap lg:overflow-visible lg:px-0",
            )}
            role="group"
          >
            {chips.map((chip) => {
              const active = chip.id === filter;
              return (
                <button
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-[7px] rounded-full pr-[7px] pl-3.5 text-[14px] font-medium whitespace-nowrap motion-safe:transition-colors lg:h-10 lg:gap-2 lg:pr-2 lg:pl-4",
                    focusClass,
                    active
                      ? "bg-(--nw-strong) text-(--nw-on-strong)"
                      : "bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--nw-line)]",
                  )}
                  key={chip.id}
                  onClick={() => updateFilter(chip.id, chip.count)}
                  type="button"
                >
                  {chip.label}
                  <span
                    className={cn(
                      "inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11.5px] font-semibold tabular-nums lg:h-6 lg:min-w-6 lg:text-[12px]",
                      active
                        ? "bg-(--nw-on-strong)/16"
                        : "bg-(--nw-wash) text-(--nw-muted)",
                    )}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
        {total > 0 ? (
          shown.map((item) => (
            <div className="mt-[26px] lg:mt-10" key={item.group}>
              <div className="flex items-center gap-2.5 pb-2.5 lg:gap-3 lg:pb-4">
                <span className="relative size-7 shrink-0 overflow-hidden rounded-[9px] bg-(--nw-cover) lg:size-8 lg:rounded-[10px]">
                  <ClientCoverImage
                    alt=""
                    aria-hidden
                    className="object-cover"
                    sizes="32px"
                    src={GROUP_HUB_ILLUSTRATIONS[item.hub]}
                  />
                </span>
                <h3 className="text-[18px] font-semibold text-(--nw-ink) lg:text-[21px]">
                  {tNav(item.hub)}
                </h3>
                <span className="text-[12.5px] text-(--nw-muted) tabular-nums lg:text-[13px]">
                  {item.items.length}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-(--nw-rule) lg:block"
                />
              </div>
              <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-3">
                {item.items.map((species) => (
                  <li key={species.id}>
                    <RegionSpeciesRow species={species} />
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="mt-6 text-[14px] text-(--nw-muted)">{t("empty")}</p>
        )}
        <p className="mt-[18px] text-[12.5px] leading-[1.6] text-(--nw-muted) lg:hidden">
          {t("speciesNoteShort")}
        </p>
      </div>
    </section>
  );
}

function RegionSpeciesRow({ species }: { species: RegionSpeciesCardItem }) {
  const locale = useLocale();

  return (
    <Link
      className={cn(
        "grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] bg-(--nw-card) py-2 pr-3 pl-2 lg:grid-cols-[64px_minmax(0,1fr)_auto] lg:gap-3.5 lg:rounded-[20px] lg:py-2.5 lg:pr-4 lg:pl-2.5 lg:shadow-(--rg-pill-shadow) lg:hover:shadow-(--rg-card-shadow-hover) lg:motion-safe:transition-[translate,box-shadow] lg:motion-safe:duration-200 lg:motion-safe:hover:-translate-y-0.5",
        focusClass,
      )}
      href={useSpeciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({ source: "region", species_id: species.id })
      }
    >
      <span className="relative block size-14 overflow-hidden rounded-xl bg-(--nw-cover) lg:size-16 lg:rounded-[14px]">
        <ClientCoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover"
          sizes="64px"
          src={species.mobileImage ?? species.image}
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold text-(--nw-ink) lg:text-[15.5px]">
          {species.commonName}
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-(--nw-muted) italic lg:mt-[3px] lg:text-[13px]">
          {species.scientificName}
        </span>
      </span>
      <RegionSpeciesTag compact species={species} />
    </Link>
  );
}
