import type { AppLocale } from "@/i18n/routing";

import type { AdminSpeciesRecord, SpeciesTextsInput } from "./species";

export type SpeciesTextKey =
  | "behavior"
  | "commonName"
  | "conservation"
  | "description"
  | "diet"
  | "habitat"
  | "interaction"
  | "location"
  | "overview";

export type SpeciesTexts = SpeciesTextsInput["texts"];

type Record = AdminSpeciesRecord["record"];

type Source = Pick<
  Record["base"],
  | "behavior"
  | "commonName"
  | "conservation"
  | "description"
  | "diet"
  | "facts"
  | "faq"
  | "habitat"
  | "identification"
  | "interaction"
  | "location"
  | "overview"
  | "stats"
>;

export const SPECIES_TEXT_FIELDS: ReadonlyArray<{
  key: SpeciesTextKey;
  label: string;
}> = [
  { key: "overview", label: "Overview" },
  { key: "description", label: "Description" },
  { key: "habitat", label: "Habitat" },
  { key: "location", label: "Distribution" },
  { key: "diet", label: "Diet" },
  { key: "behavior", label: "Behaviour" },
  { key: "interaction", label: "Encounters with people" },
  { key: "conservation", label: "Conservation" },
];

export function speciesTextIssues(texts: SpeciesTexts) {
  return [
    ...(texts.commonName.trim() ? [] : ["The common name is empty."]),
    ...texts.facts.flatMap((fact, index) =>
      fact.trim() ? [] : [`Fact ${index + 1} is empty.`],
    ),
    ...(texts.faq ?? []).flatMap((item, index) =>
      item.question.trim() && item.answer.trim()
        ? []
        : [`Question ${index + 1} needs a question and an answer.`],
    ),
    ...texts.stats.flatMap((stat, index) =>
      stat.label.trim() && stat.value.trim()
        ? []
        : [`Stat ${index + 1} needs a label and a value.`],
    ),
  ];
}

export function speciesTextsOf(
  record: Record,
  locale: AppLocale,
): SpeciesTexts {
  const source: Source =
    locale === "ka" ? record.base : record.translations[locale];
  const { identification } = source;
  return {
    behavior: source.behavior,
    commonName: source.commonName,
    conservation: source.conservation,
    description: source.description,
    diet: source.diet,
    facts: source.facts,
    ...(source.faq ? { faq: source.faq } : {}),
    habitat: source.habitat,
    ...(identification
      ? {
          identification: {
            ...(identification.coloration === undefined
              ? {}
              : { coloration: identification.coloration }),
            summary: identification.summary,
            traits: identification.traits,
          },
        }
      : {}),
    ...(source.interaction === undefined
      ? {}
      : { interaction: source.interaction }),
    location: source.location,
    overview: source.overview,
    stats: source.stats,
  };
}
