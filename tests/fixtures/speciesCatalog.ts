import { readFileSync } from "node:fs";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type {
  CatalogCard,
  CatalogFullSpecies,
} from "@/data/speciesCatalogTypes";
import type { Species, SpeciesFieldRecord } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

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

export function catalogSpeciesFixture(): Species[] {
  return speciesCatalogFixture("ka").map(bareSpecies);
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

export function searchCatalogsFixture(): Record<AppLocale, SpeciesFixture[]> {
  return {
    en: speciesCatalogFixture("en"),
    ka: speciesCatalogFixture("ka"),
    ru: speciesCatalogFixture("ru"),
    tr: speciesCatalogFixture("tr"),
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
