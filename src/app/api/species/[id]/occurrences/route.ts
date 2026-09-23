import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";

import { HALYOMORPHA_RANGE_GEOJSON } from "@/data/halyomorphaRangeRegions";
import { localizeRegionText, regions } from "@/data/mapRegions";
import { getSpeciesById } from "@/data/species";
import { routing } from "@/i18n/routing";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
  getHalyomorphaRegionRecords,
  occurrenceStatusForCount,
} from "@/lib/halyomorphaOccurrences";

export const runtime = "nodejs";
export const revalidate = 86400;

const REGION_IDS = new Set<RegionPathId>(
  HALYOMORPHA_RANGE_GEOJSON.features.map((feature) => feature.properties.id),
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const regionId = url.searchParams.get("region");
  const locale = readLocale(url.searchParams.get("locale"));

  if (regionId && !REGION_IDS.has(regionId as RegionPathId)) {
    return Response.json({ error: "Invalid region" }, { status: 400 });
  }

  const species = getSpeciesById(id);
  if (!species) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const records = getHalyomorphaFieldRecords({
    fieldRecords: species.fieldRecords ?? [],
    gallery: species.gallery,
    locale,
    speciesName: species.commonName,
  });
  const confirmedRecordThreshold = confirmedRecordThresholdForSpecies(id);
  const headers = {
    "Cache-Control":
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  };

  if (!regionId) {
    return Response.json(
      {
        regionNames: regions.map((region) => ({
          id: region.id,
          name: localizeRegionText(region.name, locale),
        })),
        summary: getHalyomorphaOccurrenceSummary(
          records,
          locale,
          confirmedRecordThreshold,
        ),
      },
      { headers },
    );
  }

  const validRegionId = regionId as RegionPathId;
  const regionRecords = getHalyomorphaRegionRecords(records, validRegionId);
  const summary = getHalyomorphaOccurrenceSummary(
    regionRecords,
    locale,
    confirmedRecordThreshold,
  );

  return Response.json(
    {
      records: regionRecords,
      region:
        summary.recordsByRegion[0] ??
        ({
          count: 0,
          id: validRegionId,
          iNaturalistRecordCount: 0,
          name: validRegionId,
          photoRecordCount: 0,
          status: occurrenceStatusForCount(0),
        } satisfies (typeof summary.recordsByRegion)[number]),
    },
    { headers },
  );
}

function readLocale(value: null | string): AppLocale {
  return routing.locales.includes(value as AppLocale)
    ? (value as AppLocale)
    : routing.defaultLocale;
}
