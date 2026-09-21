import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";
import type {
  HalyomorphaFieldRecord,
  HalyomorphaRegionSummary,
} from "@/lib/halyomorphaOccurrences";

export type HalyomorphaRegionOccurrenceResponse = {
  records: HalyomorphaFieldRecord[];
  region: HalyomorphaRegionSummary;
};

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
