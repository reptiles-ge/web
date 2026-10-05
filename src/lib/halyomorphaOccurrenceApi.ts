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

type OccurrenceFile = {
  regions: Partial<Record<RegionPathId, HalyomorphaRegionOccurrenceResponse>>;
};

const files = new Map<string, Promise<HalyomorphaFieldRecord[]>>();

export function loadHalyomorphaOccurrences(
  speciesId: string,
  locale: AppLocale,
  dataRevision: string,
) {
  const url = `/data/occurrences/${encodeURIComponent(speciesId)}/${locale}.json?v=${encodeURIComponent(dataRevision)}`;
  let file = files.get(url);
  if (!file) {
    file = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error("Occurrence request failed");
      const { regions } = (await response.json()) as OccurrenceFile;
      return Object.values(regions).flatMap((region) => region.records);
    });
    files.set(url, file);
    file.catch(() => files.delete(url));
  }
  return file;
}
