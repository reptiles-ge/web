import type { RegionPathId } from "@/data/georgia-paths";
import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { HALYOMORPHA_RANGE_GEOJSON } from "@/data/halyomorphaRangeRegions";
import { getRegionById, localizeRegionText } from "@/data/mapRegions";
import { optimizedImgSrc } from "@/data/optimizedImages";
import { formatPhotoDate } from "@/lib/formatDate";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

export type HalyomorphaFieldRecord = {
  accessibleLabel: string;
  author?: string;
  date?: string;
  formattedDate?: string;
  galleryHref?: string;
  gallerySrc?: string;
  id: string;
  imageAlt: string;
  kind: "location" | "photo";
  lat: number;
  lng: number;
  locality: string;
  note?: string;
  rawLocality?: string;
  regionId?: RegionPathId;
  source?: string;
  thumbSrc?: string;
  url?: string;
};

export type HalyomorphaOccurrenceSummary = {
  firstYear?: number;
  iNaturalistRecordCount: number;
  lastYear?: number;
  photoRecordCount: number;
  recordsByRegion: HalyomorphaRegionSummary[];
  regionsWithRecords: number;
  totalRecords: number;
};

export type HalyomorphaRegionSummary = {
  center?: { lat: number; lng: number };
  count: number;
  firstYear?: number;
  id: RegionPathId;
  iNaturalistRecordCount: number;
  lastYear?: number;
  name: string;
  photoRecordCount: number;
};

export function getHalyomorphaFieldRecords({
  fieldRecords,
  gallery,
  locale,
  speciesName,
}: {
  fieldRecords: SpeciesFieldRecord[];
  gallery: GalleryImage[];
  locale: AppLocale;
  speciesName: string;
}) {
  const records = new Map<string, HalyomorphaFieldRecord>();
  for (const record of [
    ...getFieldPhotoRecords(gallery, locale, speciesName),
    ...getManualFieldRecords(fieldRecords, locale, speciesName),
  ]) {
    const key = occurrenceKey(record);
    const existing = records.get(key);
    records.set(key, existing ? mergeRecords(existing, record) : record);
  }
  return Array.from(records.values()).sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
}

export function getHalyomorphaOccurrenceSummary(
  records: HalyomorphaFieldRecord[],
  locale: AppLocale,
): HalyomorphaOccurrenceSummary {
  const years = records.flatMap((record) => yearFromDate(record.date));
  const byRegion = new Map<RegionPathId, HalyomorphaFieldRecord[]>();
  for (const record of records) {
    if (!record.regionId) continue;
    byRegion.set(record.regionId, [
      ...(byRegion.get(record.regionId) ?? []),
      record,
    ]);
  }

  const recordsByRegion = Array.from(byRegion, ([id, regionRecords]) => {
    const regionYears = regionRecords.flatMap((record) =>
      yearFromDate(record.date),
    );
    const center = getRecordCenter(regionRecords);
    return {
      center,
      count: regionRecords.length,
      firstYear: min(regionYears),
      id,
      iNaturalistRecordCount: regionRecords.filter(isINaturalistRecord).length,
      lastYear: max(regionYears),
      name: regionName(id, locale),
      photoRecordCount: regionRecords.filter(
        (record) => record.kind === "photo",
      ).length,
    };
  }).sort((a, b) => b.count - a.count);

  return {
    firstYear: min(years),
    iNaturalistRecordCount: records.filter(isINaturalistRecord).length,
    lastYear: max(years),
    photoRecordCount: records.filter((record) => record.kind === "photo")
      .length,
    recordsByRegion,
    regionsWithRecords: recordsByRegion.length,
    totalRecords: records.length,
  };
}

export function getHalyomorphaRegionRecords(
  records: HalyomorphaFieldRecord[],
  regionId: RegionPathId,
) {
  return records.filter((record) => record.regionId === regionId);
}

function fieldRecordAuthor(record: SpeciesFieldRecord) {
  const name = record.observerName?.trim();
  const handle = record.observer?.trim();
  const source = record.source?.trim();
  if (name && handle && name !== handle && source === "iNaturalist") {
    return `${name} (@${handle})`;
  }
  if (name) return name;
  if (handle && source === "iNaturalist") return `@${handle}`;
  return handle || source;
}

function fieldRecordId(value: string, index: number) {
  const filename = value
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  const slug = filename?.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  return `${slug || "field-record"}-${index}`;
}

function getFieldPhotoRecords(
  gallery: GalleryImage[],
  locale: AppLocale,
  speciesName: string,
): HalyomorphaFieldRecord[] {
  return gallery.flatMap((item, index) => {
    const credit = item.credit;
    if (
      !credit ||
      typeof credit.lat !== "number" ||
      typeof credit.lng !== "number" ||
      !Number.isFinite(credit.lat) ||
      !Number.isFinite(credit.lng)
    ) {
      return [];
    }

    const photoConfidence = item.photoConfidence ?? credit.photoConfidence;
    const rawLocality = credit.location?.trim();
    if (photoConfidence !== "georgia-field" || !rawLocality) return [];

    const regionId = regionIdForPoint(credit.lng, credit.lat);
    const locality = normalizeLocality(rawLocality, regionId, locale);
    const formattedDate = credit.date
      ? formatPhotoDate(credit.date, locale)
      : undefined;
    const author = credit.photographer?.trim();
    const id = fieldRecordId(item.src, index);

    return [
      {
        accessibleLabel: [`${speciesName} — ${locality}`, formattedDate, author]
          .filter(Boolean)
          .join(", "),
        author,
        date: credit.date,
        formattedDate,
        galleryHref: `#${SPECIES_SECTION_IDS.gallery}`,
        gallerySrc: optimizedImgSrc(item.src, 1200),
        id,
        imageAlt: `${speciesName} — ${locality}`,
        kind: "photo",
        lat: credit.lat,
        lng: credit.lng,
        locality,
        rawLocality,
        regionId,
        thumbSrc: optimizedImgSrc(item.src, 320),
        url: credit.url,
      },
    ];
  });
}

function getManualFieldRecords(
  records: SpeciesFieldRecord[],
  locale: AppLocale,
  speciesName: string,
): HalyomorphaFieldRecord[] {
  return records.map((record, index) => {
    const regionId = regionIdForPoint(record.lng, record.lat);
    const rawLocality = record.locality;
    const locality = normalizeLocality(rawLocality, regionId, locale);
    const formattedDate = record.date
      ? formatPhotoDate(record.date, locale)
      : undefined;
    const author = fieldRecordAuthor(record);
    const id = fieldRecordId(record.url || rawLocality, index);

    return {
      accessibleLabel: [`${speciesName} — ${locality}`, formattedDate, author]
        .filter(Boolean)
        .join(", "),
      author,
      date: record.date,
      formattedDate,
      id,
      imageAlt: `${speciesName} — ${locality}`,
      kind: "location",
      lat: record.lat,
      lng: record.lng,
      locality,
      note: record.note,
      rawLocality,
      regionId,
      source: record.source,
      url: record.url,
    };
  });
}

function getRecordCenter(records: HalyomorphaFieldRecord[]) {
  if (records.length === 0) return undefined;
  const total = records.reduce(
    (sum, record) => ({
      lat: sum.lat + record.lat,
      lng: sum.lng + record.lng,
    }),
    { lat: 0, lng: 0 },
  );
  return {
    lat: total.lat / records.length,
    lng: total.lng / records.length,
  };
}

function iNaturalistObservationId(value?: string) {
  const match = value?.match(/(?:observations\/|observation\s*#)(\d+)/i);
  return match?.[1];
}

function isINaturalistRecord(record: HalyomorphaFieldRecord) {
  return (
    record.source === "iNaturalist" || record.url?.includes("inaturalist.org")
  );
}

function max(values: number[]) {
  return values.length ? Math.max(...values) : undefined;
}

function mergeRecords(
  existing: HalyomorphaFieldRecord,
  next: HalyomorphaFieldRecord,
): HalyomorphaFieldRecord {
  if (existing.kind === "photo") {
    return {
      ...existing,
      note: existing.note ?? next.note,
      source: existing.source ?? next.source,
      url: existing.url ?? next.url,
    };
  }
  if (next.kind === "photo") return mergeRecords(next, existing);
  return existing;
}

function min(values: number[]) {
  return values.length ? Math.min(...values) : undefined;
}

function normalizeLocality(
  rawLocality: string,
  regionId: RegionPathId | undefined,
  locale: AppLocale,
) {
  const fallback = regionId ? regionName(regionId, locale) : rawLocality;
  const stripped = rawLocality
    .replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}\s*,\s*/i, "")
    .replace(/\s*,\s*(Georgia|Georgië|Грузия|GE)$/i, "")
    .replace(/\s*,\s*GE-[A-Z]{2}\s*,\s*GE$/i, "")
    .trim();
  if (!stripped || /^undefined location$/i.test(stripped)) return fallback;
  if (locale === "ka" && /[А-Яа-яЁё]/.test(stripped)) return fallback;
  if (/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}$/i.test(stripped)) return fallback;
  return stripped.split(",")[0]?.trim() || fallback;
}

function occurrenceKey(record: HalyomorphaFieldRecord) {
  const iNaturalistId =
    iNaturalistObservationId(record.url) ??
    iNaturalistObservationId(record.note);
  if (iNaturalistId) return `inaturalist:${iNaturalistId}`;
  if (record.url) return `url:${sourceKey(record.url)}`;
  return record.id;
}

function pointInFeature(lng: number, lat: number, rings: [number, number][][]) {
  const [outerRing, ...holes] = rings;
  if (!outerRing || !pointInRing(lng, lat, outerRing)) return false;
  return !holes.some((ring) => pointInRing(lng, lat, ring));
}

function pointInRing(lng: number, lat: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [lngI, latI] = ring[i];
    const [lngJ, latJ] = ring[j];
    const intersects =
      latI > lat !== latJ > lat &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;
    if (intersects) inside = !inside;
  }
  return inside;
}

function regionIdForPoint(lng: number, lat: number) {
  return HALYOMORPHA_RANGE_GEOJSON.features.find((feature) =>
    pointInFeature(lng, lat, feature.geometry.coordinates),
  )?.properties.id;
}

function regionName(id: RegionPathId, locale: AppLocale) {
  const region = getRegionById(id);
  return region ? localizeRegionText(region.name, locale) : id;
}

function sourceKey(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function yearFromDate(date?: string) {
  const year = date ? Number(date.slice(0, 4)) : NaN;
  return Number.isFinite(year) ? [year] : [];
}
