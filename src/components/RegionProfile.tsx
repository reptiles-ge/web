"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactNode } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { LocalizedRegionContent } from "@/data/regionContent";
import type { RegionSpeciesCardItem } from "@/data/regions";

import { RegionHero } from "@/components/region-profile/RegionHero";
import {
  RegionFaq,
  RegionHabitats,
  RegionRelated,
  RegionSummary,
} from "@/components/region-profile/RegionInfoSections";
import {
  RegionSectionNav,
  type RegionSectionNavItem,
} from "@/components/region-profile/RegionSectionNav";
import { RegionSpeciesList } from "@/components/region-profile/RegionSpeciesList";
import { RegionVenomous } from "@/components/region-profile/RegionVenomous";
import { RegionShapeDefs } from "@/components/regions-index/RegionShapes";
import { georgiaRegionPaths } from "@/data/georgia-paths";
import { localizeRegionText, type Region } from "@/data/mapRegions";
import { groupRegionSpecies } from "@/lib/regionSpeciesGroups";
import { REGION_SECTION_IDS } from "@/lib/toc";

type RegionProfileProps = {
  attribution?: ReactNode;
  content: LocalizedRegionContent;
  news?: ReactNode;
  newsCount?: number;
  region: Region;
  species: RegionSpeciesCardItem[];
  summary: string[];
  venomous: RegionSpeciesCardItem[];
};

const MAP_REGION_IDS = Object.keys(georgiaRegionPaths) as RegionPathId[];

export function RegionProfile({
  attribution,
  content,
  news,
  newsCount = 0,
  region,
  species,
  summary,
  venomous,
}: RegionProfileProps) {
  const locale = useLocale();
  const t = useTranslations("regions");
  const tNav = useTranslations("nav");
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const { biome, faq, habitats, overview, related } = content;
  const groups = groupRegionSpecies(species, locale);

  const stats = [
    {
      count: species.length,
      label: t("stats.species", { count: species.length }),
    },
    {
      count: venomous.length,
      label: t("stats.venomous", { count: venomous.length }),
      venomous: true,
    },
    {
      count: groups.length,
      label: t("stats.groups", { count: groups.length }),
    },
    {
      count: habitats.length,
      label: t("stats.habitats", { count: habitats.length }),
    },
  ];

  const sections: (false | RegionSectionNavItem)[] = [
    venomous.length > 0 && {
      count: venomous.length,
      id: REGION_SECTION_IDS.venomous,
      label: t("venomousTab"),
      venomous: true,
    },
    {
      count: species.length,
      id: REGION_SECTION_IDS.species,
      label: t("speciesEyebrow"),
    },
    { id: REGION_SECTION_IDS.habitats, label: t("habitatsTitle") },
    faq.length > 0 && {
      count: faq.length,
      id: REGION_SECTION_IDS.faq,
      label: t("faqEyebrow"),
      phoneCount: false,
    },
    newsCount > 0 && {
      count: newsCount,
      desktopOnly: true,
      id: REGION_SECTION_IDS.news,
      label: tNav("news"),
    },
    related.length > 0 && {
      id: REGION_SECTION_IDS.related,
      label: t("relatedTitle"),
      phoneLabel: t("relatedEyebrow"),
    },
  ];

  return (
    <div className="editorial-page regions-atlas min-h-screen overflow-x-clip bg-background text-(--nw-ink) antialiased">
      <RegionShapeDefs ids={MAP_REGION_IDS} />
      <RegionHero
        biome={biome}
        name={name}
        overview={overview}
        regionId={region.id}
        stats={stats}
        subtitle={t("regionTitle", { name, nameIn })}
        venomousCount={venomous.length}
      />
      <RegionSectionNav
        items={sections.filter((item) => item !== false)}
        label={t("sectionsLabel")}
      />
      {venomous.length > 0 ? (
        <RegionVenomous name={name} nameIn={nameIn} species={venomous} />
      ) : null}
      <RegionSpeciesList
        groups={groups}
        name={name}
        nameIn={nameIn}
        total={species.length}
      />
      <RegionHabitats
        description={localizeRegionText(region.description, locale)}
        habitats={habitats}
        kinds={content.habitatKinds}
      />
      <RegionSummary name={name} paragraphs={summary} />
      {faq.length > 0 ? (
        <RegionFaq attribution={attribution} items={faq} regionId={region.id} />
      ) : null}
      {news}
      {related.length > 0 ? <RegionRelated related={related} /> : null}
    </div>
  );
}
