import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaFieldRecord } from "@/lib/halyomorphaOccurrences";

const files = new Map<string, Promise<HalyomorphaFieldRecord[]>>();

export function loadHalyomorphaOccurrences(
  speciesId: string,
  locale: AppLocale,
  dataRevision: string,
) {
  const url = `/api/occurrences/${encodeURIComponent(speciesId)}/${locale}?v=${encodeURIComponent(dataRevision)}`;
  let file = files.get(url);
  if (!file) {
    file = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error("Occurrence request failed");
      return (await response.json()) as HalyomorphaFieldRecord[];
    });
    files.set(url, file);
    file.catch(() => files.delete(url));
  }
  return file;
}
