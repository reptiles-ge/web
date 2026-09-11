import { getTranslations } from "next-intl/server";

import type { GalleryImage, Species, SpeciesStat } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { SpeciesBreadcrumbCrumb } from "@/lib/speciesBreadcrumbs";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyBlock } from "@/components/BiologyBlock";
import { ContentAttribution } from "@/components/ContentAttribution";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideStaticGrid } from "@/components/RelatedGuideStaticGrid";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesProfileFacts } from "@/components/SpeciesProfileFacts";
import { SpeciesProfileRelated } from "@/components/SpeciesProfileRelated";
import { SpeciesSources } from "@/components/SpeciesSources";
import { Link } from "@/i18n/navigation";
import {
  type HubClusterCard,
  isLizardSpecies,
  isSnakeSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { formatContentDate } from "@/lib/formatDate";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type BiologyBlockItem = {
  body: string;
  id: string;
  title: string;
};

type SpeciesProfileBodyProps = {
  biologyBlocks: BiologyBlockItem[];
  breadcrumbs: SpeciesBreadcrumbCrumb[];
  checklistNote: null | string;
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  gallery: GalleryImage[];
  guideLinks: HubClusterCard[];
  linkDangerStats: boolean;
  locale: AppLocale;
  lookalikes: Species[];
  related: Species[];
  showIdentification: boolean;
  species: Species;
};

export async function SpeciesProfileBody({
  biologyBlocks,
  breadcrumbs,
  checklistNote,
  dangerValue,
  displayStats,
  gallery,
  guideLinks,
  linkDangerStats,
  locale,
  lookalikes,
  related,
  showIdentification,
  species,
}: SpeciesProfileBodyProps) {
  const t = await getTranslations("profile");
  const snake = isSnakeSpecies(species);
  const lizard = isLizardSpecies(species);

  return (
    <>
      <SpeciesBreadcrumbTrail
        ariaLabel={t("breadcrumbAria")}
        breadcrumbs={breadcrumbs}
      />

      <SpeciesProfileFacts
        checklistNote={checklistNote}
        danger={species.danger}
        dangerValue={dangerValue}
        displayStats={displayStats}
        interaction={species.interaction}
        linkDangerStats={linkDangerStats}
      />

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("overview")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-5 max-w-2xl font-display text-display-title"
            id={SPECIES_SECTION_IDS.overview}
            slugSource={`${t("whoIs")} ${species.commonName}`}
          >
            {t("whoIs")} {species.commonName}
          </AnchoredHeading>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]">
            <PhoneLinkedText>{species.overview}</PhoneLinkedText>
          </p>
          <p className="mt-6 text-[12px] tracking-wide text-muted-foreground">
            {t("lastUpdated")}{" "}
            <time dateTime={species.updatedAt}>
              {formatContentDate(species.updatedAt, locale)}
            </time>
          </p>
        </div>
      </section>

      {gallery.length > 0 ? (
        <SpeciesGallery
          images={gallery}
          location={species.location}
          name={species.commonName}
          scientificName={species.scientificName}
          speciesId={species.id}
          tone="background"
        />
      ) : null}

      <SpeciesRangeMap
        speciesId={species.id}
        speciesName={species.commonName}
      />

      {showIdentification && species.identification ? (
        <SpeciesIdentification
          identification={species.identification}
          name={species.commonName}
        />
      ) : null}

      <SpeciesProfileRelated
        locale={locale}
        related={lookalikes}
        variant="lookalikes"
      />

      {snake ? (
        <QuizPracticeCta
          body={t("quizCtaBody", { name: species.commonName })}
          className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          quizId="snake"
          source="species"
          speciesId={species.id}
          title={t("quizCtaTitle")}
        />
      ) : lizard ? (
        <QuizPracticeCta
          body={t("quizCtaBodyLizard", { name: species.commonName })}
          className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          quizId="lizard"
          source="species"
          speciesId={species.id}
          title={t("quizCtaTitleLizard")}
        />
      ) : null}

      <SpeciesProfileBiology blocks={biologyBlocks} isSnake={snake} />

      {species.faq && species.faq.length > 0 ? (
        <SpeciesFaqSection
          entityId={species.id}
          items={species.faq}
          name={species.commonName}
          pageType="species"
        />
      ) : null}

      <ContentAttribution
        sourcesHref={
          species.sources.length > 0
            ? `#${SPECIES_SECTION_IDS.sources}`
            : undefined
        }
        updatedAt={species.updatedAt}
      />

      <SpeciesSources sources={species.sources} speciesId={species.id} />

      {guideLinks.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
              {t("guidesEyebrow")}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-display-card font-semibold">
              {t("guidesTitle")}
            </h2>
            <RelatedGuideStaticGrid
              cards={guideLinks}
              className="mt-8"
              locale={locale}
            />
          </div>
        </section>
      ) : null}

      <SpeciesProfileRelated locale={locale} related={related} />
    </>
  );
}

function biologyGridClass(count: number) {
  if (count >= 4 || count === 2) {
    return "md:grid-cols-2";
  }
  if (count >= 3) {
    return "md:grid-cols-3";
  }
  return "md:grid-cols-1";
}

function SpeciesBreadcrumbTrail({
  ariaLabel,
  breadcrumbs,
}: {
  ariaLabel: string;
  breadcrumbs: SpeciesBreadcrumbCrumb[];
}) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-border bg-background">
      <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-2 gap-y-1 px-6 py-4 text-[13px] text-muted-foreground lg:px-10">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              className="inline-flex items-center gap-2"
              key={crumb.href ? `${crumb.href}:${crumb.name}` : crumb.name}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              ) : null}
              {crumb.href && !isLast ? (
                <Link
                  className="transition-colors hover:text-foreground"
                  href={crumb.href}
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground" : undefined}
                >
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

async function SpeciesProfileBiology({
  blocks,
  isSnake,
}: {
  blocks: BiologyBlockItem[];
  isSnake: boolean;
}) {
  if (blocks.length === 0) {
    return null;
  }

  const t = await getTranslations("profile");

  return (
    <section
      className={cn(
        "bg-surface pb-20 lg:pb-28",
        isSnake ? "pt-12 lg:pt-16" : "pt-20 lg:pt-28",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          {t("biology")}
        </p>
        <AnchoredHeading
          anchorLabel={t("anchorLink")}
          className="mt-5 max-w-2xl font-display text-display-title"
          id={SPECIES_SECTION_IDS.biology}
        >
          {t("biologyTitle")}
        </AnchoredHeading>
        <div
          className={cn(
            "mt-14 grid gap-12 md:gap-10",
            biologyGridClass(blocks.length),
          )}
        >
          {blocks.map((block) => (
            <BiologyBlock
              body={block.body}
              headingId={block.id}
              key={block.title}
              title={block.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
