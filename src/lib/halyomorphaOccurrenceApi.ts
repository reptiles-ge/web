import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";
import type {
  HalyomorphaFieldRecord,
  HalyomorphaOccurrenceSummary,
  HalyomorphaRegionSummary,
} from "@/lib/halyomorphaOccurrences";

export type HalyomorphaMapSummaryResponse = {
  regionNames: Pick<HalyomorphaRegionSummary, "id" | "name">[];
  summary: HalyomorphaOccurrenceSummary;
};

export type HalyomorphaRegionOccurrenceResponse = {
  records: HalyomorphaFieldRecord[];
  region: HalyomorphaRegionSummary;
};

export async function loadHalyomorphaMapSummary(
  speciesId: string,
  locale: AppLocale,
  signal: AbortSignal,
) {
  const response = await fetch(
    `/api/species/${encodeURIComponent(speciesId)}/occurrences?locale=${locale}`,
    { signal },
  );
  if (!response.ok) throw new Error("Occurrence summary request failed");
  return (await response.json()) as HalyomorphaMapSummaryResponse;
}

export async function loadHalyomorphaRegionOccurrences(
  speciesId: string,
  regionId: RegionPathId,
  locale: AppLocale,
) {
  const params = new URLSearchParams({ locale, region: regionId });
  const response = await fetch(
    `/api/species/${encodeURIComponent(speciesId)}/occurrences?${params}`,
  );
  if (!response.ok) throw new Error("Occurrence request failed");
  return (await response.json()) as HalyomorphaRegionOccurrenceResponse;
}
