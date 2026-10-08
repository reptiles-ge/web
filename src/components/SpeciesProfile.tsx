import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesPageAnalysis } from "@/components/admin/SpeciesPageAnalysis";
import { SpeciesActionBar } from "@/components/SpeciesActionBar";
import { SpeciesProfileBody } from "@/components/SpeciesProfileBody";
import { SpeciesProfileHero } from "@/components/SpeciesProfileHero";
import { SpeciesViewTracker } from "@/components/SpeciesViewTracker";
import { getRegionsForSpecies } from "@/data/mapRegions";
import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";
import { type Species } from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { resolvePhotoCredit } from "@/data/speciesMedia";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { getHubIndexTitleKey } from "@/lib/clusterGuides";
import { hasFieldRecords } from "@/lib/occurrenceSummaries";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import {
  filterDisplayStats,
  getSpeciesGalleryPreview,
  getSpeciesHeroSources,
  hasRealIdentification,
  isPlaceholderBody,
} from "@/lib/speciesContent";
import { getSpeciesProfileGuideLinks } from "@/lib/speciesGuideLinks";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { usesDangerScale } from "@/lib/speciesRisk";
import { speciesShareMessage } from "@/lib/speciesShareText";

type SpeciesProfileProps = {
  locale: AppLocale;
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
    biologyTitle: "Diet · life cycle · control",
    conservation: "Control and management",
    diet: "Diet",
    habitat: "Habitat and range",
  },
  ka: {
    behavior: "სიცოცხლის ციკლი",
    biologyTitle: "კვება · სიცოცხლის ციკლი · კონტროლი",
    conservation: "კონტროლი და მართვა",
    diet: "კვება",
    habitat: "ჰაბიტატი და გავრცელება",
  },
  ru: {
    behavior: "Жизненный цикл",
    biologyTitle: "Питание · жизненный цикл · контроль",
    conservation: "Контроль и управление",
    diet: "Питание",
    habitat: "Местообитание и ареал",
  },
  tr: {
    behavior: "Yaşam döngüsü",
    biologyTitle: "Beslenme · yaşam döngüsü · kontrol",
    conservation: "Kontrol ve yönetim",
    diet: "Beslenme",
    habitat: "Yaşam alanı ve yayılış",
  },
};

export async function SpeciesProfile({
  locale,
  lookalikes,
  related,
  species,
}: SpeciesProfileProps) {
  const [t, tHubs, tDanger, tAnalysis] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "danger" }),
    getTranslations({ locale, namespace: "pageAnalysis" }),
  ]);
  const guideLinks = getSpeciesProfileGuideLinks(species.id);
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
  const emergency = usesDangerScale(group) && isVenomousDanger(species.danger);
  const shareText = speciesShareMessage({
    commonName: species.commonName,
    danger: species.danger,
    group,
    id: species.id,
    labels: {
      details: t("copyShareDetails"),
      harmless: t("copyShareHarmless"),
      rearFanged: t("copyShareRearFanged"),
      venomous: t("copyShareVenomous"),
    },
    locale,
    scientificName: species.scientificName,
  });
  const gallerySrc = primary ? optimizedImgSrc(primary.src, 1200) : null;
  const linkDangerStats = usesDangerScale(group) && Boolean(species.danger);
  const hasRange =
    getRegionsForSpecies(species.id).length > 0 || hasFieldRecords(species.id);
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
  const localAdmin = isLocalAdminEnabled();
  const editable = locale === "ka" && localAdmin;

  return (
    <div className="min-h-screen bg-background **:[[id]]:scroll-mt-48">
      <SpeciesViewTracker
        galleryCount={gallery.length}
        group={group}
        hasIdentification={showIdentification}
        hasRange={hasRange}
        scientificName={species.scientificName}
        speciesId={species.id}
      />
      <SpeciesProfileHero
        breadcrumbs={breadcrumbs}
        desktopHeroSrc={desktopHeroSrc}
        emergency={emergency}
        galleryCount={gallery.length}
        galleryPreview={getSpeciesGalleryPreview(species)}
        gallerySrc={gallerySrc}
        group={group}
        heroDesktopSources={heroDesktopSources}
        heroPrimarySources={heroPrimarySources}
        imageAlt={imageAlt}
        locale={locale}
        mobileHeroSrc={mobileHeroSrc}
        mobileImageAlt={mobileImageAlt}
        shareText={shareText}
        species={species}
      />
      <SpeciesProfileBody
        biologyBlocks={biologyBlocks}
        biologyTitle={biologyCopy?.biologyTitle}
        dangerValue={dangerValue}
        displayStats={displayStats}
        editable={editable}
        gallery={gallery}
        guideLinks={guideLinks}
        hasRange={hasRange}
        heroCredit={mobileHeroCredit}
        linkDangerStats={linkDangerStats}
        locale={locale}
        lookalikes={lookalikes}
        related={related}
        showIdentification={showIdentification}
        species={species}
      />
      <SpeciesActionBar
        emergency={emergency}
        galleryCount={gallery.length}
        gallerySrc={gallerySrc}
        locale={locale}
        shareText={shareText}
        shareTitle={species.commonName}
        speciesId={species.id}
      />
      {localAdmin ? (
        <SpeciesPageAnalysis
          copy={{
            action: tAnalysis("action"),
            addStep: tAnalysis("addStep"),
            availableSteps: tAnalysis("availableSteps"),
            closeWorkflow: tAnalysis("closeWorkflow"),
            configureWorkflow: tAnalysis("configureWorkflow"),
            emptyWorkflow: tAnalysis("emptyWorkflow"),
            error: tAnalysis("error"),
            linksAction: tAnalysis("linksAction"),
            linksProcessing: tAnalysis("linksProcessing"),
            lookalikesAction: tAnalysis("lookalikesAction"),
            lookalikesProcessing: tAnalysis("lookalikesProcessing"),
            moveDown: tAnalysis("moveDown"),
            moveUp: tAnalysis("moveUp"),
            noChanges: tAnalysis("noChanges"),
            openPr: tAnalysis("openPr"),
            processing: tAnalysis("processing"),
            recordsAction: tAnalysis("recordsAction"),
            recordsProcessing: tAnalysis("recordsProcessing"),
            removeStep: tAnalysis("removeStep"),
            report: tAnalysis("report"),
            runWorkflow: tAnalysis("runWorkflow"),
            sameBranch: tAnalysis("sameBranch"),
            sameBranchHint: tAnalysis("sameBranchHint"),
            textsAction: tAnalysis("textsAction"),
            textsError: tAnalysis("textsError"),
            textsNoChanges: tAnalysis("textsNoChanges"),
            textsProcessing: tAnalysis("textsProcessing"),
            textsReport: tAnalysis("textsReport"),
            textsStale: tAnalysis("textsStale"),
            workflowDescription: tAnalysis("workflowDescription"),
            workflowError: tAnalysis("workflowError"),
            workflowProcessing: tAnalysis("workflowProcessing"),
            workflowTitle: tAnalysis("workflowTitle"),
          }}
          id={species.id}
        />
      ) : null}
    </div>
  );
}
