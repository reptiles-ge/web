import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

const SPECIES_ALIASES: Record<string, { ka: string[]; en: string[] }> = {
  "vipera-dinniki": {
    ka: ["დინიკის გველგესლა", "გველგესლა"],
    en: ["Dinnik's viper"],
  },
  "macrovipera-lebetina": {
    ka: ["გიურზა"],
    en: ["Levantine viper", "giurza"],
  },
  "vipera-kaznakovi": {
    ka: ["კავკასიური გველგესლა", "გველგესლა"],
    en: ["Caucasus viper"],
  },
  "vipera-transcaucasiana": {
    ka: ["ცხვირრქოსანი გველგესლა", "გველგესლა"],
    en: ["Transcaucasian long-nosed viper"],
  },
  "vipera-darevskii": {
    ka: ["დარევსკის გველგესლა", "გველგესლა"],
    en: ["Darevsky's viper"],
  },
  "vipera-renardi": {
    ka: ["ველის გველგესლა", "სტეპის გველგესლა", "გველგესლა"],
    en: ["eastern steppe viper", "steppe viper"],
  },
  "pseudopus-apodus": {
    ka: ["გველხოკერა"],
    en: ["European glass lizard", "sheltopusik"],
  },
  "platyceps-najadum": {
    ka: ["წენგოსფერი მცურავი"],
    en: ["Dahl's whip snake"],
  },
  "elaphe-dione": {
    ka: ["სახეებიანი მცურავი"],
    en: ["steppe ratsnake"],
  },
  "telescopus-fallax": {
    ka: ["კატისთვალა"],
    en: ["European cat snake"],
  },
  "zamenis-longissimus": {
    ka: ["ესკულაპის მცურავი", "გრძელი მცურავი"],
    en: ["Aesculapian snake"],
  },
  "bufotes-viridis": {
    ka: ["Bufo viridis"],
    en: ["Bufo viridis", "European green toad"],
  },
  "mertensiella-caucasica": {
    ka: ["Salamandra caucasica"],
    en: ["Caucasian salamander", "Salamandra caucasica"],
  },
};

export function uniqueKeywords(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const value of values) {
    const item = value?.trim();
    if (!item) continue;
    const key = item.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    keywords.push(item);
  }

  return keywords;
}

export function siteKeywords(locale: AppLocale) {
  return locale === "en"
    ? ["Georgia reptiles", "Caucasus reptiles", "reptile atlas"]
    : [
        "ქვეწარმავლები",
        "საქართველოს ქვეწარმავლები",
        "კავკასია",
        "ქვეწარმავლების ატლასი",
      ];
}

export function speciesSeoAnchor(commonName: string, scientificName: string) {
  return `${commonName} (${scientificName})`;
}

export function speciesAliasKeywords(id: string, locale: AppLocale) {
  const aliases = SPECIES_ALIASES[id];
  if (!aliases) return [];
  return locale === "en" ? aliases.en : aliases.ka;
}

export function speciesSeoKeywords(species: Species, locale: AppLocale) {
  return uniqueKeywords([
    species.commonName,
    species.scientificName,
    species.genus,
    species.family,
    ...speciesAliasKeywords(species.id, locale),
    locale === "en" ? "Georgia" : "საქართველო",
    locale === "en" ? "Caucasus" : "კავკასია",
  ]);
}

export function speciesJsonLdKeywords(species: Species, locale: AppLocale) {
  return speciesSeoKeywords(species, locale).join(", ");
}

export type SeoDefinedTerm = {
  ka: string;
  en: string;
  speciesId: string;
};

export const HOME_DEFINED_TERMS: SeoDefinedTerm[] = [
  {
    ka: "გიურზა",
    en: "Levantine viper",
    speciesId: "macrovipera-lebetina",
  },
  {
    ka: "დინიკის გველგესლა",
    en: "Dinnik's viper",
    speciesId: "vipera-dinniki",
  },
  {
    ka: "კავკასიური გველგესლა",
    en: "Caucasus viper",
    speciesId: "vipera-kaznakovi",
  },
  {
    ka: "ცხვირრქოსანი გველგესლა",
    en: "Transcaucasian long-nosed viper",
    speciesId: "vipera-transcaucasiana",
  },
  {
    ka: "დარევსკის გველგესლა",
    en: "Darevsky's viper",
    speciesId: "vipera-darevskii",
  },
  {
    ka: "ველის გველგესლა",
    en: "eastern steppe viper",
    speciesId: "vipera-renardi",
  },
  {
    ka: "გველხოკერა",
    en: "European glass lizard",
    speciesId: "pseudopus-apodus",
  },
  {
    ka: "წენგოსფერი მცურავი",
    en: "Dahl's whip snake",
    speciesId: "platyceps-najadum",
  },
  {
    ka: "სახეებიანი მცურავი",
    en: "steppe ratsnake",
    speciesId: "elaphe-dione",
  },
  {
    ka: "კატისთვალა",
    en: "European cat snake",
    speciesId: "telescopus-fallax",
  },
  {
    ka: "ესკულაპის მცურავი",
    en: "Aesculapian snake",
    speciesId: "zamenis-longissimus",
  },
];
