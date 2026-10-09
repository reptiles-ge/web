import matter from "gray-matter";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type { GalleryImage, SpeciesFieldRecord } from "@/data/speciesTypes";

import { getCatalogSpecies } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { pathnames } from "@/i18n/pathnames";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";
import { SPECIES_COLORS } from "@/lib/speciesColors";
import { filterDisplayStats } from "@/lib/speciesContent";
import { getSpeciesFactVisual } from "@/lib/speciesFactVisuals";
import { ANALYSIS_LOCALES } from "@/lib/speciesSuperAnalysisSchema";

export const speciesAnalysisSurfaces = [
  {
    fields: ["description"],
    id: "hero",
    kind: "editable",
    rule: "commonName/scientificName are identity, never rewritten. Description is plain text, no Markdown links.",
    sources: ["src/components/SpeciesProfileHero.tsx"],
  },
  {
    fields: ["stats"],
    id: "facts",
    kind: "mixed",
    rule: "Filtered placeholders and group-specific risk rows; size/elevation scales and IUCN meanings are generated. Stat labels are parser keys, preserve them.",
    sources: [
      "src/components/SpeciesProfileFacts.tsx",
      "src/lib/speciesFactVisuals.ts",
      "src/lib/speciesContent.ts",
    ],
  },
  {
    fields: ["danger"],
    id: "verdict",
    kind: "generated",
    rule: "Risk title/body/112 from shared messages, conditional on group and danger. No duplicate description for groups without risk scale.",
    sources: [
      "src/components/SpeciesVerdict.tsx",
      "src/lib/speciesRisk.ts",
      "src/data/speciesAtlasMeta.ts",
    ],
  },
  {
    fields: ["interaction"],
    id: "interaction",
    kind: "editable",
    rule: "Independent full-width summary block, hidden for empty/placeholder text; same content expanded on desktop/mobile.",
    sources: [
      "src/components/SpeciesProfileBody.tsx",
      "src/components/BiologyExpandable.tsx",
    ],
  },
  {
    fields: ["overview"],
    id: "overview",
    kind: "editable",
    rule: "Collapsible full text; compare with hero description and interaction for repetition.",
    sources: ["src/components/SpeciesOverviewText.tsx"],
  },
  {
    fields: ["identification"],
    id: "identification",
    kind: "mixed",
    rule: "All traits and summary, bidirectional lookalikes. Editable coloration and palette codes; inspect sex/age/season/pattern variation with source scope. Giurza legacy color/handling messages and Halyomorpha annotation/pest copy are separately owned, report only.",
    sources: [
      "src/components/SpeciesIdentification.tsx",
      "src/components/SpeciesLookalikeList.tsx",
      "src/lib/speciesColors.ts",
    ],
  },
  {
    fields: ["habitat", "diet", "behavior", "conservation"],
    id: "biology",
    kind: "editable",
    rule: "Giurza behavior paragraph 2 becomes reproduction; preserve paragraph structure. Halyomorpha special headings, damage table and indoor instructions live in TSX.",
    sources: ["src/components/SpeciesProfileBody.tsx"],
  },
  {
    fields: ["habitat", "fieldRecords"],
    id: "range",
    kind: "generated",
    rule: "Habitat reused in map details; counts, dates, thresholds, regions and confirmation labels come from records/map config. Never copy volatile metrics or coordinates into MDX. Check giurzaRange and speciesRangeCopy.",
    sources: [
      "src/components/map/SpeciesRangeMap.tsx",
      "src/lib/occurrenceSummaries.ts",
      "src/lib/halyomorphaOccurrences.ts",
      "src/data/mapRegions.ts",
      "src/data/speciesRangeMaps/index.ts",
    ],
  },
  {
    fields: ["faq"],
    id: "faq",
    kind: "editable",
    rule: "Questions AND answers, visible FAQ and corresponding schema.",
    sources: [
      "src/components/SpeciesFaqSection.tsx",
      "src/components/SpeciesFaqItems.tsx",
    ],
  },
  {
    fields: ["sources", "datePublished", "dateModified"],
    id: "sources",
    kind: "mixed",
    rule: "All sources including collapsed entries; selected featured sources for giurza, generated counts and dates, shared attribution. Append verified references, never silently remove.",
    sources: [
      "src/components/SpeciesSourcesRelated.tsx",
      "src/components/SpeciesSourcesDisclosure.tsx",
    ],
  },
  {
    fields: [],
    id: "related",
    kind: "generated",
    rule: "Related scores differ from lookalikes; changes affect reverse profiles and quiz distractors. Guide links deduplicated and limited.",
    sources: [
      "src/lib/speciesRoutes.ts",
      "src/lib/speciesRelated.ts",
      "src/lib/speciesGuideLinks.ts",
      "src/lib/clusterGuides.ts",
      "src/data/guideArticles.ts",
    ],
  },
  {
    fields: [],
    id: "quiz",
    kind: "shared",
    rule: "Quiz teaser and guide card titles/descriptions are shared localized copy, not species text. Check empty lookalikes fallback; no quota.",
    sources: [
      "src/components/SpeciesProfileQuiz.tsx",
      "src/components/SpeciesGuideFeature.tsx",
      "src/lib/quizzes.ts",
      "src/lib/snakeQuiz.ts",
    ],
  },
  {
    fields: [
      "gallery",
      "imageCredit",
      "mobileImageCredit",
      "audio",
      "location",
    ],
    id: "media",
    kind: "generated",
    rule: "Alt/captions/credit/location/date and audio attribution. KA owns photos; translations sparse overlays by src. Preserve attribution and field-verification status.",
    sources: [
      "src/components/SpeciesGallery.tsx",
      "src/components/SpeciesMobileHeroCredit.tsx",
      "src/components/SpeciesVoicePlayer.tsx",
      "src/lib/speciesMeta.ts",
      "src/data/speciesMedia.ts",
    ],
  },
  {
    fields: ["description", "overview", "commonName", "scientificName"],
    id: "metadata",
    kind: "generated",
    rule: "Title/meta overrides, fallback overview, keywords, share text, JSON-LD and localized canonical URLs. Report conflicts at source; never add keyword stuffing or rewrite slugs.",
    sources: [
      "src/lib/createSpeciesRoute.tsx",
      "src/lib/speciesMeta.ts",
      "src/lib/speciesShareText.ts",
      "src/lib/kaMetaDescriptionOverrides.ts",
    ],
  },
  {
    fields: [],
    id: "navigation",
    kind: "shared",
    rule: "Conditional section nav, generated headings and breadcrumbs; only link-capable fields may contain Markdown.",
    sources: [
      "src/components/SpeciesProfile.tsx",
      "src/lib/speciesBreadcrumbs.ts",
      "src/lib/toc.ts",
      "src/components/PhoneLinkedText.tsx",
    ],
  },
] as const;

export type SpeciesAnalysisContext = Awaited<
  ReturnType<typeof buildSpeciesAnalysisContext>
>;

export async function buildSpeciesAnalysisContext(id: string, cwd: string) {
  const rangeFile = `src/data/speciesRangeMaps/${id}.ts`;
  const sources = [
    ...new Set([
      ...speciesAnalysisSurfaces.flatMap((surface) => [...surface.sources]),
      rangeFile,
      "scripts/compile-occurrences.ts",
      "src/data/speciesRangeMaps/base.ts",
      "src/i18n/localizeSpecies.ts",
    ]),
  ];
  const [content, catalog, templateEntries, allSourceFiles, paths] =
    await Promise.all([
      readSpeciesAnalysisContent(id, cwd),
      Promise.all(
        getCatalogSpecies().map(async ({ id: candidateId }) => {
          const data = matter(
            await fs.readFile(
              path.join(cwd, `src/content/species/${candidateId}/ka.mdx`),
              "utf8",
            ),
          ).data;
          return {
            commonName: String(data.commonName),
            contentPath: `src/content/species/${candidateId}/ka.mdx`,
            family: String(data.family),
            group: getSpeciesAtlasMeta(candidateId).group,
            id: candidateId,
            scientificName: String(data.scientificName),
          };
        }),
      ),
      Promise.all(
        ANALYSIS_LOCALES.map(async (locale) => {
          const messages = JSON.parse(
            await fs.readFile(
              path.join(cwd, `messages/${locale}.json`),
              "utf8",
            ),
          );
          const keys = [
            "profile",
            "danger",
            "attribution",
            ...(id === "macrovipera-lebetina"
              ? ["giurzaIdentification", "giurzaRange"]
              : []),
          ];
          return [
            locale,
            {
              riskVerdict: Object.fromEntries(
                Object.entries(messages.riskToHumans ?? {}).filter(([key]) =>
                  /^scale(High|Moderate|Harmless)(Title|Body)$/.test(key),
                ),
              ),
              ...Object.fromEntries(
                keys
                  .filter((key) => messages[key])
                  .map((key) => [key, messages[key]]),
              ),
            },
          ];
        }),
      ),
      Promise.all(
        sources.map(async (file) => ({
          file,
          hash: await fs
            .readFile(path.join(cwd, file), "utf8")
            .then(analysisContentHash)
            .catch(() => null),
        })),
      ),
      Promise.all(
        Object.keys(pathnames)
          .filter((pathname) => !pathname.includes("["))
          .map(async (pathname) =>
            fs
              .access(path.join(cwd, "src/app/[locale]", pathname, "page.tsx"))
              .then(() => pathname)
              .catch(() => null),
          ),
      ),
    ]);
  if (!catalog.some((item) => item.id === id))
    throw new Error("Species is not published");
  const ka = content.ka.data;
  const records = getHalyomorphaFieldRecords({
    fieldRecords: (ka.fieldRecords ?? []) as SpeciesFieldRecord[],
    gallery: (ka.gallery ?? []) as GalleryImage[],
    locale: "ka",
    speciesName: String(ka.commonName),
  });
  const occurrenceSummary = getHalyomorphaOccurrenceSummary(
    records,
    "ka",
    confirmedRecordThresholdForSpecies(id),
  );
  return {
    catalog,
    colorPalette: SPECIES_COLORS,
    content: Object.fromEntries(
      ANALYSIS_LOCALES.map((locale) => {
        const { data, raw } = content[locale];
        return [
          locale,
          {
            hash: analysisContentHash(raw),
            ...data,
            fieldRecords: {
              count: Array.isArray(data.fieldRecords)
                ? data.fieldRecords.length
                : 0,
              source: `src/content/species/${id}/${locale}.mdx`,
            },
          } as {
            [key: string]: unknown;
            fieldRecords: { count: number; source: string };
            hash: string;
          },
        ];
      }),
    ),
    editableFields: speciesEditableFields(content.ka.data),
    factVisuals: ANALYSIS_LOCALES.map((locale) => ({
      locale,
      stats: filterDisplayStats(
        (content[locale].data.stats ?? []) as Array<{
          label: string;
          value: string;
        }>,
        getSpeciesAtlasMeta(id).group,
      ).map((stat) => ({
        ...stat,
        visual: getSpeciesFactVisual(stat, locale),
      })),
    })),
    id,
    internalPaths: paths.filter(
      (pathname): pathname is string => pathname !== null,
    ),
    locales: ANALYSIS_LOCALES,
    occurrenceSummary: {
      ...occurrenceSummary,
      recordsByRegion: occurrenceSummary.recordsByRegion.map(
        ({ center: _center, ...region }) => region,
      ),
    },
    registrySources: [
      "src/data/speciesPublish.ts",
      "src/data/species.ts",
      "src/data/speciesAtlasMeta.ts",
      "src/i18n/pathnames.ts",
      "src/lib/speciesRoutes.ts",
      "src/lib/snakeQuiz.ts",
      "src/lib/speciesGuideLinks.ts",
    ],
    sourceFiles: allSourceFiles.filter(
      (source) => source.file !== rangeFile || source.hash,
    ),
    surfaces: speciesAnalysisSurfaces,
    templates: Object.fromEntries(templateEntries),
  };
}

export async function readSpeciesAnalysisContent(id: string, cwd: string) {
  return Object.fromEntries(
    await Promise.all(
      ANALYSIS_LOCALES.map(async (locale) => {
        const raw = await fs.readFile(
          path.join(cwd, `src/content/species/${id}/${locale}.mdx`),
          "utf8",
        );
        return [
          locale,
          { data: matter(raw).data as Record<string, unknown>, raw },
        ];
      }),
    ),
  ) as Record<
    (typeof ANALYSIS_LOCALES)[number],
    { data: Record<string, unknown>; raw: string }
  >;
}

function analysisContentHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
function speciesEditableFields(data: Record<string, unknown>) {
  const fields = [
    "description",
    "interaction",
    "overview",
    "habitat",
    "diet",
    "behavior",
    "conservation",
  ];
  const identification = data.identification as
    undefined | { colors?: string[]; traits?: string[] };
  if (identification) {
    fields.push("identification.summary", "identification.coloration");
    (identification.colors ?? []).forEach((_, index) =>
      fields.push(`identification.colors.${index}`),
    );
    identification.traits?.forEach((_, index) =>
      fields.push(`identification.traits.${index}`),
    );
  }
  (data.faq as undefined | unknown[])?.forEach((_, index) =>
    fields.push(`faq.${index}.question`, `faq.${index}.answer`),
  );
  (data.stats as undefined | unknown[])?.forEach((_, index) =>
    fields.push(`stats.${index}.value`),
  );
  return fields;
}
