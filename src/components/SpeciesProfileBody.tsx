import { getTranslations } from "next-intl/server";

import type { GalleryImage, Species, SpeciesStat } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyBlock } from "@/components/BiologyBlock";
import { ContentAttribution } from "@/components/ContentAttribution";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesProfileFacts } from "@/components/SpeciesProfileFacts";
import { SpeciesProfileRelated } from "@/components/SpeciesProfileRelated";
import { SpeciesSources } from "@/components/SpeciesSources";
import { type HubClusterCard, isSnakeSpecies } from "@/lib/clusterGuides";
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
  checklistNote: null | string;
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  gallery: GalleryImage[];
  guideLinks: HubClusterCard[];
  linkDangerStats: boolean;
  locale: AppLocale;
  related: Species[];
  showIdentification: boolean;
  species: Species;
};

export async function SpeciesProfileBody({
  biologyBlocks,
  checklistNote,
  dangerValue,
  displayStats,
  gallery,
  guideLinks,
  linkDangerStats,
  locale,
  related,
  showIdentification,
  species,
}: SpeciesProfileBodyProps) {
  const t = await getTranslations("profile");
  const snake = isSnakeSpecies(species);

  return (
    <>
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
            {species.overview}
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

      {snake ? (
        <QuizPracticeCta
          body={t("quizCtaBody", { name: species.commonName })}
          className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          source="species"
          speciesId={species.id}
          title={t("quizCtaTitle")}
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
            <RelatedGuideGrid
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
