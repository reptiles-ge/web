import { readFileSync } from "node:fs";

import type { ContributorProfile } from "@/data/authors";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type {
  CatalogCard,
  CatalogFullSpecies,
} from "@/data/speciesCatalogTypes";
import type {
  Species,
  SpeciesFieldRecord,
  SpeciesRangeMap,
} from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { contributorDirectory } from "@/lib/contributorCredits";
import { DEFAULT_CONFIRMED_RECORD_THRESHOLD } from "@/lib/halyomorphaOccurrences";

import { speciesFixtureFile } from "./speciesFixtureFiles";

export type SpeciesFixture = CatalogCard & CatalogFullSpecies;

function bareSpecies({
  group: _group,
  habitats: _habitats,
  lookalikes: _lookalikes,
  photoCount: _photoCount,
  slug: _slug,
  ...species
}: SpeciesFixture): Species {
  return species;
}

const fixtures = new Map<AppLocale, SpeciesFixture[]>();
let fieldRecords: Record<string, SpeciesFieldRecord[]> | undefined;
let rangeMaps: Record<string, SpeciesRangeMap> | undefined;

export function catalogSpeciesFixture(): Species[] {
  return speciesCatalogFixture("ka").map(bareSpecies);
}

export function confirmedThresholdFixture(id: string) {
  return (
    rangeMapsFixture()[id]?.confirmedThreshold ??
    DEFAULT_CONFIRMED_RECORD_THRESHOLD
  );
}

export function contributorDirectoryFixture(locale: AppLocale = "ka") {
  return contributorDirectory(contributorsFixture(locale));
}

export function contributorsFixture(
  locale: AppLocale = "ka",
): ContributorProfile[] {
  return readFixture<ContributorProfile[]>(`contributors-${locale}`);
}

export function fieldRecordsFixture() {
  fieldRecords ??=
    readFixture<Record<string, SpeciesFieldRecord[]>>("field-records");
  return fieldRecords;
}

export function fixtureUpdatedAt(species: { id: string }, locale: AppLocale) {
  return localizedFixture(species, locale).updatedAt;
}

export function localizedFixture(
  species: { id: string },
  locale: AppLocale,
): Species {
  const item = speciesFixture(species.id, locale);
  if (!item) throw new Error(`No ${locale} fixture for ${species.id}`);
  return item;
}

export function lookalikesFixture(id: string): string[] {
  return (
    speciesCatalogFixture("ka").find((item) => item.id === id)?.lookalikes ?? []
  );
}

export function rangeMapsFixture() {
  rangeMaps ??= readFixture<Record<string, SpeciesRangeMap>>("range-maps");
  return rangeMaps;
}

export function searchCatalogsFixture(): Record<AppLocale, SpeciesFixture[]> {
  return {
    en: speciesCatalogFixture("en"),
    ka: speciesCatalogFixture("ka"),
    ru: speciesCatalogFixture("ru"),
    tr: speciesCatalogFixture("tr"),
  };
}

export function searchContributorsFixture(): Record<
  AppLocale,
  ContributorProfile[]
> {
  return {
    en: contributorsFixture("en"),
    ka: contributorsFixture("ka"),
    ru: contributorsFixture("ru"),
    tr: contributorsFixture("tr"),
  };
}

export function speciesCatalogFixture(locale: AppLocale): SpeciesFixture[] {
  let fixture = fixtures.get(locale);
  if (!fixture) {
    fixture = readFixture<SpeciesFixture[]>(locale);
    fixtures.set(locale, fixture);
  }
  return fixture;
}

export function speciesFixture(
  id: string,
  locale: AppLocale = "ka",
): Species | undefined {
  const item = speciesCatalogFixture(locale).find((entry) => entry.id === id);
  return item && bareSpecies(item);
}

export function speciesGroupFixture(
  group: AnimalGroup,
  locale: AppLocale = "ka",
) {
  return speciesCatalogFixture(locale)
    .filter((item) => item.group === group)
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}

function readFixture<T>(name: string): T {
  return JSON.parse(readFileSync(speciesFixtureFile(name), "utf8")) as T;
}
