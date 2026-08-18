import type { Species } from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
import {
  RACER_CLUSTER_IDS,
  VENOMOUS_VIPER_IDS,
} from "@/lib/clusterGuides";
import { siteConfig } from "@/lib/site";

const racerIdSet = new Set<string>(RACER_CLUSTER_IDS);
const viperIdSet = new Set<string>(VENOMOUS_VIPER_IDS);

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

export function speciesSeoAnchor(commonName: string, scientificName: string) {
  return `${commonName} (${scientificName})`;
}

export function isRacerClusterSpecies(id: string) {
  return racerIdSet.has(id);
}

export function isVenomousViperClusterSpecies(id: string) {
  return viperIdSet.has(id);
}

export function speciesAliasKeywords(id: string, locale: AppLocale) {
  const aliases = SPECIES_ALIASES[id];
  if (!aliases) return [];
  return locale === "en" ? aliases.en : aliases.ka;
}

export function speciesSeoKeywords(species: Species, locale: AppLocale) {
  const group = getSpeciesAtlasMeta(species.id).group;
  const venomous = group === "snake" && isVenomousDanger(species.danger);
  const aliases = speciesAliasKeywords(species.id, locale);

  return uniqueKeywords([
    species.commonName,
    species.scientificName,
    species.genus,
    species.family,
    ...aliases,
    ...(venomous
      ? locale === "en"
        ? ["venomous snakes Georgia", "venomous snakes in Georgia"]
        : ["შხამიანი გველები საქართველოში", "შხამიანი გველები", "გველგესლა"]
      : []),
    ...(isRacerClusterSpecies(species.id)
      ? locale === "en"
        ? ["snakes in Georgia", "racers"]
        : ["გველები საქართველოში", "მცურავი"]
      : []),
    ...(species.id === "pseudopus-apodus"
      ? locale === "en"
        ? ["lizards in Georgia", "glass lizard"]
        : ["ხვლიკები საქართველოში", "გველხოკერა"]
      : []),
    locale === "en" ? "Georgia reptiles" : "ქვეწარმავლები",
    locale === "en" ? "Georgia" : "საქართველო",
    locale === "en" ? "Caucasus" : "კავკასია",
    locale === "en" ? "atlas" : "ატლასი",
    siteConfig.name,
  ]);
}

export function speciesJsonLdKeywords(species: Species, locale: AppLocale) {
  return speciesSeoKeywords(species, locale).join(", ");
}

export type SeoDefinedTerm = {
  ka: string;
  en: string;
  kind: "path" | "species";
  path?: "/" | "/venomous-snakes" | "/snakes" | "/lizards" | "/species";
  speciesId?: string;
};

export const HOME_DEFINED_TERMS: SeoDefinedTerm[] = [
  {
    ka: "ქვეწარმავლები",
    en: "Reptiles",
    kind: "path",
    path: "/",
  },
  {
    ka: "საქართველოს ქვეწარმავლები",
    en: "Georgia reptiles",
    kind: "path",
    path: "/",
  },
  {
    ka: "შხამიანი გველები საქართველოში",
    en: "venomous snakes Georgia",
    kind: "path",
    path: "/venomous-snakes",
  },
  {
    ka: "გველები",
    en: "snakes in Georgia",
    kind: "path",
    path: "/snakes",
  },
  {
    ka: "ხვლიკები",
    en: "lizards in Georgia",
    kind: "path",
    path: "/lizards",
  },
  {
    ka: "ატლასი",
    en: "atlas",
    kind: "path",
    path: "/species",
  },
  {
    ka: "გიურზა",
    en: "Levantine viper",
    kind: "species",
    speciesId: "macrovipera-lebetina",
  },
  {
    ka: "დინიკის გველგესლა",
    en: "Dinnik's viper",
    kind: "species",
    speciesId: "vipera-dinniki",
  },
  {
    ka: "კავკასიური გველგესლა",
    en: "Caucasus viper",
    kind: "species",
    speciesId: "vipera-kaznakovi",
  },
  {
    ka: "ცხვირრქოსანი გველგესლა",
    en: "Transcaucasian long-nosed viper",
    kind: "species",
    speciesId: "vipera-transcaucasiana",
  },
  {
    ka: "დარევსკის გველგესლა",
    en: "Darevsky's viper",
    kind: "species",
    speciesId: "vipera-darevskii",
  },
  {
    ka: "ველის გველგესლა",
    en: "eastern steppe viper",
    kind: "species",
    speciesId: "vipera-renardi",
  },
  {
    ka: "გველხოკერა",
    en: "European glass lizard",
    kind: "species",
    speciesId: "pseudopus-apodus",
  },
  {
    ka: "წენგოსფერი მცურავი",
    en: "Dahl's whip snake",
    kind: "species",
    speciesId: "platyceps-najadum",
  },
  {
    ka: "სახეებიანი მცურავი",
    en: "steppe ratsnake",
    kind: "species",
    speciesId: "elaphe-dione",
  },
  {
    ka: "კატისთვალა",
    en: "European cat snake",
    kind: "species",
    speciesId: "telescopus-fallax",
  },
  {
    ka: "ესკულაპის მცურავი",
    en: "Aesculapian snake",
    kind: "species",
    speciesId: "zamenis-longissimus",
  },
];
