import type { SpeciesRangeMap, SpeciesRangeMapCopy } from "@/data/speciesTypes";

import type { ApiDatabase } from "./database";

import { RECORD_LOCALES } from "./speciesRows";
import { RANGE_MAP_TEXT_COLUMNS, RANGE_MAP_TEXT_KEYS } from "./speciesSchema";

type RangeMapRow = {
  confirmed_threshold: null | number;
  inaturalist_taxon_id: number;
  range_source: null | SpeciesRangeMap["rangeSource"];
};

type TextRow = Record<
  (typeof RANGE_MAP_TEXT_COLUMNS)[number],
  null | string
> & {
  locale: (typeof RECORD_LOCALES)[number];
};

export async function readRangeMap(
  db: ApiDatabase,
  speciesId: string,
): Promise<null | SpeciesRangeMap> {
  const [settings, texts] = await db.batch([
    db
      .prepare(
        "SELECT inaturalist_taxon_id, range_source, confirmed_threshold FROM species_range_maps WHERE species_id = ?",
      )
      .bind(speciesId),
    db
      .prepare(
        `SELECT locale, ${RANGE_MAP_TEXT_COLUMNS.join(", ")} FROM species_range_map_texts WHERE species_id = ?`,
      )
      .bind(speciesId),
  ]);
  const row = (settings!.results as RangeMapRow[])[0];
  if (!row) return null;
  const copy = Object.fromEntries(
    RECORD_LOCALES.map((locale) => [locale, {}]),
  ) as SpeciesRangeMap["copy"];
  for (const text of texts!.results as TextRow[]) {
    const entry: SpeciesRangeMapCopy = {};
    RANGE_MAP_TEXT_KEYS.forEach((key, index) => {
      const value = text[RANGE_MAP_TEXT_COLUMNS[index]!];
      if (value !== null) entry[key] = value;
    });
    copy[text.locale] = entry;
  }
  const rangeMap: SpeciesRangeMap = {
    copy,
    iNaturalistTaxonId: row.inaturalist_taxon_id,
  };
  if (row.range_source !== null) rangeMap.rangeSource = row.range_source;
  if (row.confirmed_threshold !== null) {
    rangeMap.confirmedThreshold = row.confirmed_threshold;
  }
  return rangeMap;
}
