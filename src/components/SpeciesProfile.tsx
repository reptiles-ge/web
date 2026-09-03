"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesProfileBody } from "@/components/SpeciesProfileBody";
import { SpeciesProfileHero } from "@/components/SpeciesProfileHero";
import { pictureSources } from "@/data/optimizedImages";
import { getRegionsForSpecies } from "@/data/regions";
import { resolvePhotoCredit, type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { trackEvent } from "@/lib/analytics";
import {
  getHubIndexTitleKey,
  getSpeciesGuideLinks,
} from "@/lib/clusterGuides";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import {
  filterDisplayStats,
  getSpeciesHeroSources,
  hasRealIdentification,
  isPlaceholderBody,
} from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { usesDangerScale } from "@/lib/speciesRisk";

type SpeciesProfileProps = {
  related: Species[];
  species: Species;
};

export function SpeciesProfile({
  related: rawRelated,
  species: rawSpecies,
}: SpeciesProfileProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("profile");
  const tHubs = useTranslations("groupHubShared");
  const tDanger = useTranslations("danger");
  const species = useMemo(
    () => localizeSpecies(rawSpecies, locale),
    [rawSpecies, locale],
  );
  const related = useMemo(
    () => rawRelated.map((item) => localizeSpecies(item, locale)),
    [rawRelated, locale],
  );
  const guideLinks = getSpeciesGuideLinks(species.id);
  const breadcrumbs = useMemo(() => {
    const parent = getSpeciesParentHub(species);
    const groupLabel = tHubs(`hubs.${parent.hubId}`);
    return buildSpeciesBreadcrumbs({
      groupLabel,
      homeLabel: t("breadcrumbHome"),
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
      species,
      venomousLabel: t("breadcrumbVenomous"),
    });
  }, [species, t, tHubs]);
  const { desktopHeroSrc, gallery, mobileHeroSrc, primary } =
    getSpeciesHeroSources(species);
  const heroDesktopSources = pictureSources(desktopHeroSrc, {
    media: "(min-width: 1024px)",
    sizes: "100vw",
  });
  const heroPrimarySources = pictureSources(mobileHeroSrc ?? desktopHeroSrc, {
    sizes: "100vw",
  });
  const heroCredit = resolvePhotoCredit(species.imageCredit, primary?.credit);
  const mobileHeroCredit = resolvePhotoCredit(
    species.mobileImageCredit,
    species.imageCredit,
    primary?.credit,
  );
  const imageAlt = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    species.location,
    heroCredit,
  );
  const mobileImageAlt = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    species.location,
    mobileHeroCredit,
  );
  const group = getSpeciesAtlasMeta(species.id).group;
  const displayStats = filterDisplayStats(species.stats, group);
  const dangerValue = species.danger ? tDanger(species.danger) : null;
  const linkDangerStats = usesDangerScale(group) && Boolean(species.danger);
  const showIdentification = hasRealIdentification(species.identification);

  useEffect(() => {
    trackEvent("species_view", {
      group,
      has_gallery: gallery.length > 0,
      has_identification: showIdentification,
      has_range: getRegionsForSpecies(species.id).length > 0,
      page_type: "species",
      scientific_name: species.scientificName,
      species_id: species.id,
    });
  }, [
    species.id,
    species.scientificName,
    group,
    gallery.length,
    showIdentification,
  ]);
  const biologyBlocks = useMemo(
    () =>
      [
        {
          body: species.habitat,
          id: "habitat",
          title: t("habitat"),
        },
        { body: species.diet, id: "diet", title: t("diet") },
        { body: species.behavior, id: "behavior", title: t("behavior") },
        {
          body: species.conservation,
          id: "conservation",
          title: t("conservation"),
        },
      ].filter((block) => !isPlaceholderBody(block.body)),
    [species.behavior, species.conservation, species.diet, species.habitat, t],
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <SpeciesProfileHero
          breadcrumbs={breadcrumbs}
          desktopHeroSrc={desktopHeroSrc}
          group={group}
          heroCredit={heroCredit}
          heroDesktopSources={heroDesktopSources}
          heroPrimarySources={heroPrimarySources}
          imageAlt={imageAlt}
          mobileHeroCredit={mobileHeroCredit}
          mobileHeroSrc={mobileHeroSrc}
          mobileImageAlt={mobileImageAlt}
          species={species}
        />
        <SpeciesProfileBody
          biologyBlocks={biologyBlocks}
          dangerValue={dangerValue}
          displayStats={displayStats}
          linkDangerStats={linkDangerStats}
          gallery={gallery}
          guideLinks={guideLinks}
          locale={locale}
          related={related}
          showIdentification={showIdentification}
          species={species}
        />
      </main>
    </div>
  );
}
