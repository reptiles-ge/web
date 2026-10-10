"use client";

import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { atlasSpeciesImage } from "@/data/atlasFilters";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { type SpeciesListItem } from "@/data/speciesListItem";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";

export function AtlasRecent({ species }: { species: SpeciesListItem[] }) {
  const t = useTranslations("speciesAtlas");

  return (
    <section className="bg-background pb-10 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("recentEyebrow")}
            </p>
            <h2 className="mt-2.5 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]">
              {t("recentTitle")}
            </h2>
          </div>
          <p className="hidden text-[16px] leading-[1.65] text-muted-foreground lg:block lg:max-w-[420px] lg:pb-1.5">
            {t("recentSubtitle")}
          </p>
        </div>

        <ul className="mt-4 overflow-hidden rounded-[22px] bg-card lg:mt-8 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:rounded-none lg:bg-transparent">
          {species.map((item) => (
            <li key={item.id}>
              <RecentSpeciesRow species={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentSpeciesRow({ species }: { species: SpeciesListItem }) {
  const locale = useLocale() as AppLocale;
  const date = formatContentDate(species.updatedAt, locale);
  const group = getSpeciesAtlasMeta(species.id).group;
  const image =
    atlasSpeciesImage(species) ||
    GROUP_HUB_ILLUSTRATIONS[ANIMAL_GROUP_TO_HUB[group]];

  return (
    <Link
      className="group flex min-h-[72px] items-center gap-3 border-b border-secondary px-3.5 py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none lg:gap-3.5 lg:rounded-3xl lg:border-0 lg:bg-card lg:p-3 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_10px_26px_rgba(14,20,17,0.05)] lg:transition-transform lg:hover:-translate-y-0.5"
      href={useSpeciesHref(species.id, locale)}
    >
      <span className="relative size-[52px] shrink-0 overflow-hidden rounded-[14px] bg-[#151c18] lg:size-[72px] lg:rounded-2xl">
        <CoverImage alt="" aria-hidden sizes="72px" src={image} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="hidden items-center gap-1.5 text-[12px] font-medium text-primary lg:inline-flex">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#6fad88]"
          />
          {date}
        </span>
        <span className="block font-display text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary lg:mt-1 lg:text-[16px]">
          {species.commonName}
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground italic">
          {species.scientificName}
        </span>
      </span>
      <span className="shrink-0 text-[12px] font-medium text-primary lg:hidden">
        {date}
      </span>
    </Link>
  );
}
