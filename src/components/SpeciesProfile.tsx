import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesProfileBody } from "@/components/SpeciesProfileBody";
import { SpeciesProfileHero } from "@/components/SpeciesProfileHero";
import { SpeciesViewTracker } from "@/components/SpeciesViewTracker";
import { getHerpetofaunaChecklistStatus } from "@/data/herpetofauna-checklist";
import { getRegionsForSpecies } from "@/data/mapRegions";
import { pictureSources } from "@/data/optimizedImages";
import { type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { resolvePhotoCredit } from "@/data/speciesMedia";
import { getHubIndexTitleKey, getSpeciesGuideLinks } from "@/lib/clusterGuides";
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
  lookalikes: Species[];
  related: Species[];
  species: Species;
};

export async function SpeciesProfile({
  lookalikes,
  related,
  species,
}: SpeciesProfileProps) {
  const [locale, t, tHubs, tDanger] = await Promise.all([
    getLocale() as Promise<AppLocale>,
    getTranslations("profile"),
    getTranslations("groupHubShared"),
    getTranslations("danger"),
  ]);
  const guideLinks = getSpeciesGuideLinks(species.id);
  const parent = getSpeciesParentHub(species);
  const groupLabel = tHubs(`hubs.${parent.hubId}`);
  const breadcrumbs = buildSpeciesBreadcrumbs({
    groupLabel,
    homeLabel: t("breadcrumbHome"),
    indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
    species,
    venomousLabel: t("breadcrumbVenomous"),
  });
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
  const checklist = getHerpetofaunaChecklistStatus(species.id);
  const checklistNote =
    checklist === "candidate"
      ? t("checklistCandidate")
      : checklist === "introduced"
        ? t("checklistIntroduced")
        : null;
  const linkDangerStats = usesDangerScale(group) && Boolean(species.danger);
  const showIdentification = hasRealIdentification(species.identification);
  const biologyBlocks = [
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
  ].filter((block) => !isPlaceholderBody(block.body));

  return (
    <div className="min-h-screen bg-background">
      <SpeciesViewTracker
        galleryCount={gallery.length}
        group={group}
        hasIdentification={showIdentification}
        hasRange={getRegionsForSpecies(species.id).length > 0}
        scientificName={species.scientificName}
        speciesId={species.id}
      />
      <SpeciesProfileHero
        breadcrumbs={breadcrumbs}
        desktopHeroSrc={desktopHeroSrc}
        group={group}
        heroDesktopSources={heroDesktopSources}
        heroPrimarySources={heroPrimarySources}
        imageAlt={imageAlt}
        mobileHeroSrc={mobileHeroSrc}
        mobileImageAlt={mobileImageAlt}
        species={species}
      />
      <SpeciesProfileBody
        biologyBlocks={biologyBlocks}
        checklistNote={checklistNote}
        dangerValue={dangerValue}
        displayStats={displayStats}
        gallery={gallery}
        guideLinks={guideLinks}
        linkDangerStats={linkDangerStats}
        locale={locale}
        lookalikes={lookalikes}
        related={related}
        showIdentification={showIdentification}
        species={species}
      />
    </div>
  );
}
