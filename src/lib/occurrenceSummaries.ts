import type { AppLocale } from "@/i18n/routing";

import {
  occurrenceSummaries,
  speciesIdsWithFieldRecords,
} from "@/data/occurrenceSummaries.generated";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaOccurrenceSummary,
  regionName,
} from "@/lib/halyomorphaOccurrences";

const speciesWithFieldRecords = new Set(speciesIdsWithFieldRecords);

export function getOccurrenceSummary(speciesId: string, locale: AppLocale) {
  const entry = occurrenceSummaries[speciesId];
  const summary = entry ? (entry.locales?.[locale] ?? entry.base) : undefined;
  if (!summary) {
    return getHalyomorphaOccurrenceSummary(
      [],
      locale,
      confirmedRecordThresholdForSpecies(speciesId),
    );
  }
  return {
    ...summary,
    recordsByRegion: summary.recordsByRegion.map((region) => ({
      ...region,
      name: regionName(region.id, locale),
    })),
  };
}

export function hasFieldRecords(speciesId: string) {
  return speciesWithFieldRecords.has(speciesId);
}
