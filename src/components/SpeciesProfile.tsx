import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesProfileBody } from "@/components/SpeciesProfileBody";
import { SpeciesProfileHero } from "@/components/SpeciesProfileHero";
import { SpeciesViewTracker } from "@/components/SpeciesViewTracker";
import { getRegionsForSpecies } from "@/data/mapRegions";
import { pictureSources } from "@/data/optimizedImages";
import { type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { resolvePhotoCredit } from "@/data/speciesMedia";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
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

const HALYOMORPHA_BIOLOGY_COPY: Record<
  AppLocale,
  {
    behavior: string;
    biologyTitle: string;
    conservation: string;
    diet: string;
    habitat: string;
  }
> = {
  en: {
    behavior: "Life cycle",
    biologyTitle: "Habitat · diet · life cycle · control",
    conservation: "Control and management",
    diet: "Diet",
    habitat: "Habitat and range",
  },
  ka: {
    behavior: "სიცოცხლის ციკლი",
    biologyTitle: "ჰაბიტატი · კვება · სიცოცხლის ციკლი · კონტროლი",
    conservation: "კონტროლი და მართვა",
    diet: "კვება",
    habitat: "ჰაბიტატი და გავრცელება",
  },
  ru: {
    behavior: "Жизненный цикл",
    biologyTitle: "Местообитание · питание · жизненный цикл · контроль",
    conservation: "Контроль и управление",
    diet: "Питание",
    habitat: "Местообитание и ареал",
  },
  tr: {
    behavior: "Yaşam döngüsü",
    biologyTitle: "Yaşam alanı · beslenme · yaşam döngüsü · kontrol",
    conservation: "Kontrol ve yönetim",
    diet: "Beslenme",
    habitat: "Yaşam alanı ve yayılış",
  },
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
  const linkDangerStats = usesDangerScale(group) && Boolean(species.danger);
  const showIdentification = hasRealIdentification(species.identification);
  const biologyCopy =
    species.id === "halyomorpha-halys"
      ? HALYOMORPHA_BIOLOGY_COPY[locale]
      : undefined;
  const biologyBlocks = [
    {
      body: species.habitat,
      id: "habitat",
      title: biologyCopy?.habitat ?? t("habitat"),
    },
    { body: species.diet, id: "diet", title: biologyCopy?.diet ?? t("diet") },
    {
      body: species.behavior,
      id: "behavior",
      title: biologyCopy?.behavior ?? t("behavior"),
    },
    {
      body: species.conservation,
      id: "conservation",
      title: biologyCopy?.conservation ?? t("conservation"),
    },
  ].filter((block) => !isPlaceholderBody(block.body));
  const editable = locale === "ka" && isLocalAdminEnabled();

  return (
    <div className="min-h-screen bg-background">
      <SpeciesViewTracker
        galleryCount={gallery.length}
        group={group}
        hasIdentification={showIdentification}
        hasRange={
          getRegionsForSpecies(species.id).length > 0 ||
          Boolean(species.fieldRecords?.length)
        }
        scientificName={species.scientificName}
        speciesId={species.id}
      />
      <SpeciesProfileHero
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
        biologyTitle={biologyCopy?.biologyTitle}
        breadcrumbs={breadcrumbs}
        dangerValue={dangerValue}
        displayStats={displayStats}
        editable={editable}
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
