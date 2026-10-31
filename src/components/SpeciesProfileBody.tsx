import { getTranslations } from "next-intl/server";

import type { HalyomorphaAnnotationMarkerKey } from "@/content/halyomorphaProfileCopy";
import type {
  DangerLevel,
  GalleryImage,
  PhotoCredit,
  Species,
  SpeciesFieldRecord,
  SpeciesStat,
} from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { ContributorDirectory } from "@/lib/contributorCredits";
import type { CatalogCard } from "@/lib/speciesCatalogApi";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyDisclosure } from "@/components/BiologyDisclosure";
import { BiologyExpandable } from "@/components/BiologyExpandable";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { SectionNav } from "@/components/SectionNav";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesGuideFeature } from "@/components/SpeciesGuideFeature";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesMobileLede } from "@/components/SpeciesMobileLede";
import { SpeciesOverviewText } from "@/components/SpeciesOverviewText";
import { SpeciesPageStats } from "@/components/SpeciesPageStats";
import { SpeciesProfileFacts } from "@/components/SpeciesProfileFacts";
import { SpeciesProfileQuiz } from "@/components/SpeciesProfileQuiz";
import { SpeciesSourcesRelated } from "@/components/SpeciesSourcesRelated";
import { SpeciesVerdict } from "@/components/SpeciesVerdict";
import {
  HALYOMORPHA_ANNOTATION_COPY,
  HALYOMORPHA_PEST_COPY,
} from "@/content/halyomorphaProfileCopy";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { getContributorDirectory } from "@/lib/authorsApi";
import { type HubClusterCard } from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { formatPhotoDate } from "@/lib/formatDate";
import {
  getSpeciesIdentificationPhoto,
  isPlaceholderBody,
} from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import {
  SPECIES_SECTION_IDS,
  type SpeciesProfileSectionAvailability,
  speciesProfileSectionIds,
} from "@/lib/toc";

type BiologyBlockItem = {
  body: string;
  id: string;
  title: string;
};

type SpeciesProfileBodyProps = {
  biologyBlocks: BiologyBlockItem[];
  biologyTitle?: string;
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  editable: boolean;
  fieldRecords: SpeciesFieldRecord[];
  gallery: GalleryImage[];
  guideLinks: HubClusterCard[];
  hasRange: boolean;
  heroCredit?: PhotoCredit;
  linkDangerStats: boolean;
  locale: AppLocale;
  lookalikes: CatalogCard[];
  mobileGallery: GalleryImage[];
  related: CatalogCard[];
  showIdentification: boolean;
  species: Species;
  views: number;
};

const HALYOMORPHA_ANNOTATED_IMAGE_SRC =
  "https://cdn.reptiles.ge/halyomorpha-halys-mishel-1.jpg";

const HALYOMORPHA_ANNOTATION_MARKERS: Array<{
  key: HalyomorphaAnnotationMarkerKey;
  label: { x: number; y: number };
  line: { x1: number; x2: number; y1: number; y2: number };
  point: { x: number; y: number };
}> = [
  {
    key: "antenna",
    label: { x: 6, y: 8 },
    line: { x1: 22, x2: 27, y1: 21, y2: 35 },
    point: { x: 27, y: 35 },
  },
  {
    key: "abdomen",
    label: { x: 5, y: 78 },
    line: { x1: 29, x2: 39, y1: 80, y2: 64 },
    point: { x: 39, y: 64 },
  },
  {
    key: "shoulders",
    label: { x: 94, y: 10 },
    line: { x1: 73, x2: 43, y1: 24, y2: 40 },
    point: { x: 43, y: 40 },
  },
  {
    key: "legs",
    label: { x: 96, y: 77 },
    line: { x1: 78, x2: 67, y1: 79, y2: 52 },
    point: { x: 67, y: 52 },
  },
];

function insetAnnotationLineEnd(
  line: (typeof HALYOMORPHA_ANNOTATION_MARKERS)[number]["line"],
) {
  const inset = 2.9;
  const dx = line.x1 - line.x2;
  const dy = line.y1 - line.y2;
  const length = Math.hypot(dx, dy);
  if (length === 0) return { x: line.x2, y: line.y2 };
  return {
    x: line.x2 + (dx / length) * inset,
    y: line.y2 + (dy / length) * inset,
  };
}

const SPLIT_SECTION_CLASS =
  "mx-auto grid max-w-[1400px] px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-10";
const SPLIT_SECTION_BODY_CLASS = "lg:pt-9 lg:[&>p:first-child]:mt-0";

export async function SpeciesProfileBody({
  biologyBlocks,
  biologyTitle,
  dangerValue,
  displayStats,
  editable,
  fieldRecords,
  gallery,
  guideLinks,
  hasRange,
  heroCredit,
  linkDangerStats,
  locale,
  lookalikes,
  mobileGallery,
  related,
  showIdentification,
  species,
  views,
}: SpeciesProfileBodyProps) {
  const [t, contributors] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getContributorDirectory(locale),
  ]);
  const riskLevel = getSpeciesRiskChip(species)?.level;
  const habitatBlock = biologyBlocks.find((block) => block.id === "habitat");
  const naturalHistoryBlocks = biologyBlocks.filter(
    (block) => block.id !== "habitat",
  );
  return (
    <>
      <SpeciesProfileSummary
        dangerValue={dangerValue}
        displayStats={displayStats}
        editable={editable}
        gallery={mobileGallery}
        guideLinks={guideLinks}
        heroCredit={heroCredit}
        linkDangerStats={linkDangerStats}
        locale={locale}
        species={species}
        views={views}
      />

      <SpeciesProfileNavigation
        counts={{
          [SPECIES_SECTION_IDS.faq]: species.faq?.length ?? 0,
          [SPECIES_SECTION_IDS.gallery]: gallery.length,
          [SPECIES_SECTION_IDS.sources]: species.sources.length,
        }}
        locale={locale}
        name={species.commonName}
        publishedAt={species.publishedAt}
        riskLevel={riskLevel}
        sections={{
          biology: naturalHistoryBlocks.length > 0,
          faq: Boolean(species.faq?.length),
          gallery: gallery.length > 0,
          habitat: false,
          identification: showIdentification,
          range: hasRange || Boolean(habitatBlock),
          sources: species.sources.length > 0,
        }}
        updatedAt={species.updatedAt}
        views={views}
      />

      <section className="bg-surface py-11 lg:py-20">
        <div className={SPLIT_SECTION_CLASS}>
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("overview")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-5 max-w-2xl font-display text-display-title leading-[1.14] font-bold"
              id={SPECIES_SECTION_IDS.overview}
              slugSource={t("overviewTitle", { name: species.commonName })}
            >
              {t("overviewTitle", { name: species.commonName })}
            </AnchoredHeading>
          </div>
          <div className={SPLIT_SECTION_BODY_CLASS}>
            <SpeciesOverviewText
              body={species.overview}
              editable={editable}
              speciesId={species.id}
            />
          </div>
        </div>
      </section>

      {showIdentification && species.identification ? (
        <SpeciesProfileIdentification
          contributors={contributors}
          identification={species.identification}
          locale={locale}
          lookalikes={lookalikes}
          species={species}
        />
      ) : null}

      {species.id === "halyomorpha-halys" ? (
        <HalyomorphaIdentificationFigure
          anchorLabel={t("anchorLink")}
          gallery={gallery}
          locale={locale}
        />
      ) : null}

      {species.id === "halyomorpha-halys" ? (
        <HalyomorphaPestSections
          anchorLabel={t("anchorLink")}
          locale={locale}
        />
      ) : null}

      <SpeciesProfileQuiz locale={locale} species={species} />

      <SpeciesRangeMap
        editable={editable}
        fieldRecords={fieldRecords}
        gallery={gallery}
        habitatDetails={habitatBlock?.body}
        locale={locale}
        speciesId={species.id}
        speciesName={species.commonName}
        updatedAt={species.updatedAt}
      />

      <SpeciesProfileBiology
        blocks={naturalHistoryBlocks}
        editable={editable}
        locale={locale}
        speciesId={species.id}
        title={biologyTitle}
      />

      {gallery.length > 0 ? (
        <SpeciesGallery
          images={gallery}
          locale={locale}
          name={species.commonName}
          scientificName={species.scientificName}
          speciesId={species.id}
        />
      ) : null}

      {guideLinks.length > 0 ? (
        <SpeciesGuideFeature
          gallery={gallery}
          guideLinks={guideLinks}
          locale={locale}
          speciesId={species.id}
          speciesName={species.commonName}
        />
      ) : null}

      {species.faq && species.faq.length > 0 ? (
        <SpeciesFaqSection
          entityId={species.id}
          items={species.faq}
          locale={locale}
          name={species.commonName}
          pageType="species"
        />
      ) : null}

      <SpeciesSourcesRelated
        locale={locale}
        publishedAt={species.publishedAt}
        related={related}
        sources={species.sources}
        speciesId={species.id}
        updatedAt={species.updatedAt}
      />
    </>
  );
}

function HalyomorphaIdentificationFigure({
  anchorLabel,
  gallery,
  locale,
}: {
  anchorLabel: string;
  gallery: GalleryImage[];
  locale: AppLocale;
}) {
  const copy = HALYOMORPHA_ANNOTATION_COPY[locale];
  const photo =
    gallery.find((item) => item.src === HALYOMORPHA_ANNOTATED_IMAGE_SRC) ??
    gallery[0];
  const src = photo?.src ?? HALYOMORPHA_ANNOTATED_IMAGE_SRC;
  const credit = photo?.credit;
  const creditParts = [
    credit?.photographer,
    credit?.location,
    credit?.date ? formatPhotoDate(credit.date, locale) : null,
  ].filter((item): item is string => Boolean(item));
  const entry = optimizedEntry(src);
  const arrowId = "halyomorpha-identification-arrow";
  const sizes =
    "(max-width: 1023px) calc(100vw - 3rem), (max-width: 1479px) calc((min(1400px, 100vw - 5rem) - 2.5rem) * 0.58), 800px";

  return (
    <section className="bg-surface py-11 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(420px,1fr)] lg:items-center lg:gap-16 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {copy.label}
          </p>
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="mt-5 max-w-3xl font-display text-display-title font-bold"
            id="stink-bug-comparison"
            slugSource={copy.title}
          >
            {copy.title}
          </AnchoredHeading>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            {copy.intro}
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-primary/55 pl-5 text-[15px] leading-relaxed font-medium text-foreground">
            {copy.note}
          </p>
        </div>

        <figure className="group">
          <div className="relative aspect-1024/936 overflow-hidden rounded-card bg-ink">
            <picture className="media-placeholder absolute inset-0 block size-full">
              {pictureSources(src, { sizes }).map((source) => (
                <source key={source.key} {...source.props} />
              ))}
              <img
                alt={copy.alt}
                className="absolute inset-0 size-full object-cover text-transparent"
                decoding="async"
                height={entry?.height}
                loading="lazy"
                sizes={sizes}
                src={optimizedImgSrc(src, 800)}
                width={entry?.width}
              />
            </picture>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/25"
            />
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden size-full sm:block"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <marker
                  id={arrowId}
                  markerHeight="5"
                  markerUnits="strokeWidth"
                  markerWidth="5"
                  orient="auto"
                  refX="4"
                  refY="2.5"
                >
                  <path className="fill-white" d="M0,0 L5,2.5 L0,5 Z" />
                </marker>
              </defs>
              {HALYOMORPHA_ANNOTATION_MARKERS.map((marker) => {
                const lineEnd = insetAnnotationLineEnd(marker.line);

                return (
                  <g key={marker.key}>
                    <line
                      className="stroke-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.85)]"
                      markerEnd={`url(#${arrowId})`}
                      strokeLinecap="round"
                      strokeWidth="0.75"
                      x1={marker.line.x1}
                      x2={lineEnd.x}
                      y1={marker.line.y1}
                      y2={lineEnd.y}
                    />
                    <circle
                      className="fill-white stroke-ink"
                      cx={marker.point.x}
                      cy={marker.point.y}
                      r="1.25"
                      strokeWidth="0.3"
                    />
                  </g>
                );
              })}
            </svg>
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <div
                className="absolute z-2 hidden max-w-48 items-center gap-2 border border-white/35 bg-ink/80 px-3 py-2 text-[11px] leading-snug font-medium text-white shadow-lg backdrop-blur-sm sm:flex"
                key={marker.key}
                style={{
                  left: `${marker.label.x}%`,
                  top: `${marker.label.y}%`,
                  transform:
                    marker.label.x > 50 ? "translateX(-100%)" : undefined,
                }}
              >
                <span className="flex size-5 shrink-0 items-center justify-center border border-white/45 text-[10px]">
                  {index + 1}
                </span>
                <span>{copy.labels[marker.key]}</span>
              </div>
            ))}
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <span
                aria-hidden="true"
                className="absolute z-2 flex size-7 -translate-1/2 items-center justify-center border border-white/75 bg-ink/75 text-[12px] font-semibold text-white shadow-lg sm:hidden"
                key={marker.key}
                style={{
                  left: `${marker.point.x}%`,
                  top: `${marker.point.y}%`,
                }}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <figcaption className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            {copy.caption}
            {creditParts.length > 0 ? (
              <span className="mt-1 block text-[12px] text-muted-foreground/80">
                {copy.creditLabel}: {creditParts.join(" · ")}
              </span>
            ) : null}
          </figcaption>
          <ol className="mt-4 grid gap-2 text-[13px] leading-snug text-foreground sm:hidden">
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <li className="grid grid-cols-[auto_1fr] gap-3" key={marker.key}>
                <span className="flex size-6 items-center justify-center border border-border text-[11px] font-semibold">
                  {index + 1}
                </span>
                <span className="self-center">{copy.labels[marker.key]}</span>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </section>
  );
}

function HalyomorphaPestSections({
  anchorLabel,
  locale,
}: {
  anchorLabel: string;
  locale: AppLocale;
}) {
  const copy = HALYOMORPHA_PEST_COPY[locale];

  return (
    <section className="bg-background py-11 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {copy.label}
        </p>
        <AnchoredHeading
          anchorLabel={anchorLabel}
          className="mt-5 max-w-3xl font-display text-display-title font-bold"
          id="damage"
          slugSource={copy.damageTitle}
        >
          {copy.damageTitle}
        </AnchoredHeading>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          {copy.damageIntro}
        </p>

        <div className="mt-8 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                <th className="py-4 pr-5 font-medium">{copy.headers.crop}</th>
                <th className="px-5 py-4 font-medium">{copy.headers.damage}</th>
                <th className="py-4 pl-5 font-medium">{copy.headers.signs}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {copy.damageRows.map((row) => (
                <tr key={row.crop}>
                  <th className="py-5 pr-5 align-top text-[15px] font-semibold text-foreground">
                    {row.crop}
                  </th>
                  <td className="p-5 align-top text-[14px] leading-relaxed text-muted-foreground">
                    {row.damage}
                  </td>
                  <td className="py-5 pl-5 align-top text-[14px] leading-relaxed text-muted-foreground">
                    {row.signs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          {copy.damageNote}
        </p>

        <AnchoredHeading
          anchorLabel={anchorLabel}
          className="mt-18 max-w-3xl font-display text-display-title font-bold lg:mt-24"
          id="indoors"
          slugSource={copy.indoorsTitle}
        >
          {copy.indoorsTitle}
        </AnchoredHeading>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          {copy.indoorsIntro}
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {copy.indoorsSteps.map((step) => (
            <div
              className="border-y border-border py-5 md:border-y-0 md:border-l md:py-0 md:pr-4 md:pl-5"
              key={step.title}
            >
              <h3 className="font-display text-[18px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function SpeciesProfileBiology({
  blocks,
  editable,
  locale,
  speciesId,
  title,
}: {
  blocks: BiologyBlockItem[];
  editable: boolean;
  locale: AppLocale;
  speciesId: string;
  title?: string;
}) {
  if (blocks.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "profile" });

  const behavior = blocks.find((block) => block.id === "behavior");
  const behaviorParagraphs = behavior?.body.split(/\n+/).filter(Boolean) ?? [];
  const blockOrder = new Map([
    ["behavior", 1],
    ["conservation", 3],
    ["diet", 0],
    ["reproduction", 2],
  ]);
  const orderedBlocks = [...blocks].sort(
    (left, right) =>
      (blockOrder.get(left.id) ?? 4) - (blockOrder.get(right.id) ?? 4),
  );
  const displayBlocks =
    speciesId === "macrovipera-lebetina"
      ? orderedBlocks.flatMap((block) => {
          if (block.id !== "behavior" || behaviorParagraphs.length < 2) {
            return [block];
          }
          return [
            {
              ...block,
              body: [
                behaviorParagraphs[0],
                ...behaviorParagraphs.slice(2),
              ].join("\n\n"),
            },
            {
              body: behaviorParagraphs[1],
              id: "reproduction",
              title: t("reproduction"),
            },
          ];
        })
      : orderedBlocks;
  const editorField = editable && speciesId !== "macrovipera-lebetina";

  return (
    <section className="bg-background py-9 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-[60px]">
        <div className="px-2 lg:px-0">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("biology")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-3 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[44px] lg:leading-[1.1]"
            id={SPECIES_SECTION_IDS.biology}
          >
            {title ?? t("naturalHistoryTitle")}
          </AnchoredHeading>
        </div>
        <div className="mt-5 flex flex-col gap-2 lg:mt-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
          {displayBlocks.map((block, index) => (
            <BiologyDisclosure
              anchorLabel={t("anchorLink")}
              body={block.body}
              className={
                displayBlocks.length % 2 === 1 &&
                index === displayBlocks.length - 1
                  ? "lg:col-span-2"
                  : undefined
              }
              defaultOpen={index === 0}
              editorField={editorField ? block.id : undefined}
              id={block.id}
              key={block.id}
              readLess={t("readLess")}
              readMore={t("readMore")}
              speciesId={editorField ? speciesId : undefined}
              title={block.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpeciesProfileIdentification({
  contributors,
  identification,
  locale,
  lookalikes,
  species,
}: {
  contributors: ContributorDirectory;
  identification: NonNullable<Species["identification"]>;
  locale: AppLocale;
  lookalikes: CatalogCard[];
  species: Species;
}) {
  const photo =
    species.id === "halyomorpha-halys"
      ? null
      : species.id === "macrovipera-lebetina"
        ? (species.gallery.find((item) =>
            item.src.endsWith("macrovipera-lebetina-ioane-2.jpg"),
          ) ?? getSpeciesIdentificationPhoto(species))
        : getSpeciesIdentificationPhoto(species);

  return (
    <SpeciesIdentification
      identification={identification}
      locale={locale}
      lookalikes={lookalikes}
      name={species.commonName}
      photo={photo}
      photoAlt={speciesPhotoAlt(
        species.commonName,
        species.scientificName,
        photo?.credit,
        contributors,
      )}
      speciesId={species.id}
    />
  );
}

async function SpeciesProfileNavigation({
  counts,
  locale,
  name,
  publishedAt,
  riskLevel,
  sections,
  updatedAt,
  views,
}: {
  counts: Partial<Record<string, number>>;
  locale: AppLocale;
  name: string;
  publishedAt?: string;
  riskLevel?: DangerLevel;
  sections: SpeciesProfileSectionAvailability;
  updatedAt?: string;
  views: number;
}) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const availableIds = speciesProfileSectionIds(sections);
  const sectionOrder = [
    SPECIES_SECTION_IDS.overview,
    SPECIES_SECTION_IDS.identification,
    SPECIES_SECTION_IDS.range,
    SPECIES_SECTION_IDS.biology,
    SPECIES_SECTION_IDS.gallery,
    SPECIES_SECTION_IDS.faq,
    SPECIES_SECTION_IDS.sources,
  ];
  const ids = sectionOrder.filter((id) => availableIds.includes(id));
  const labels = {
    [SPECIES_SECTION_IDS.biology]: t("biology"),
    [SPECIES_SECTION_IDS.faq]: t("faq"),
    [SPECIES_SECTION_IDS.gallery]: t("gallery"),
    [SPECIES_SECTION_IDS.habitat]: t("habitat"),
    [SPECIES_SECTION_IDS.identification]: t("identification"),
    [SPECIES_SECTION_IDS.overview]: t("overview"),
    [SPECIES_SECTION_IDS.range]: t("range"),
    [SPECIES_SECTION_IDS.sources]: t("sourcesTitle"),
  };

  return (
    <SectionNav
      ariaLabel={t("contents")}
      items={ids.map((id) => ({ count: counts[id], id, label: labels[id] }))}
      meta={
        <SpeciesPageStats
          locale={locale}
          publishedAt={publishedAt}
          updatedAt={updatedAt}
          views={views}
        />
      }
      name={name}
      riskLevel={riskLevel}
    />
  );
}

async function SpeciesProfileSummary({
  dangerValue,
  displayStats,
  editable,
  gallery,
  guideLinks,
  heroCredit,
  linkDangerStats,
  locale,
  species,
  views,
}: Pick<
  SpeciesProfileBodyProps,
  | "dangerValue"
  | "displayStats"
  | "editable"
  | "gallery"
  | "guideLinks"
  | "heroCredit"
  | "linkDangerStats"
  | "locale"
  | "species"
  | "views"
>) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const riskLevel = getSpeciesRiskChip(species)?.level;
  const interactionBody =
    species.interaction && !isPlaceholderBody(species.interaction)
      ? species.interaction
      : null;
  return (
    <div className="relative z-10 -mt-7 rounded-t-[32px] bg-background pt-4 pb-6 lg:mt-[-86px] lg:rounded-none lg:bg-transparent lg:pt-0 lg:pb-14">
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] flex-col lg:grid lg:items-stretch lg:gap-4 lg:px-[60px]",
          riskLevel &&
            displayStats.length > 0 &&
            "lg:grid-cols-[430px_minmax(0,1fr)]",
        )}
      >
        <SpeciesVerdict
          credits={
            gallery.length > 0
              ? gallery.map((photo, index) =>
                  index === 0 ? heroCredit : photo.credit,
                )
              : [heroCredit]
          }
          guideLinks={guideLinks}
          level={riskLevel}
          locale={locale}
          speciesId={species.id}
        />
        {species.description ? (
          <SpeciesMobileLede description={species.description} />
        ) : null}
        <SpeciesProfileFacts
          danger={species.danger}
          dangerValue={dangerValue}
          displayStats={displayStats}
          editable={editable}
          linkDangerStats={linkDangerStats}
          locale={locale}
          publishedAt={species.publishedAt}
          speciesId={species.id}
          stats={species.stats}
          updatedAt={species.updatedAt}
          views={views}
        />
        {interactionBody ? (
          <aside className="mx-4 mt-2 rounded-[22px] bg-gold/12 p-5 max-lg:order-1 lg:col-span-full lg:mx-0 lg:mt-0 lg:rounded-[26px] lg:px-7 lg:py-6">
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="font-display text-[19px] font-semibold text-foreground"
              id={SPECIES_SECTION_IDS.interaction}
            >
              {t("interaction")}
            </AnchoredHeading>
            <BiologyExpandable
              body={interactionBody}
              editorField={editable ? "interaction" : undefined}
              needsExpand={interactionBody.length > 260}
              readLess={t("readLess")}
              readMore={t("readMore")}
              speciesId={editable ? species.id : undefined}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
