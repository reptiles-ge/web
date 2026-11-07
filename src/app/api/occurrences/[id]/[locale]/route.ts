import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getRegionOccurrenceRecords } from "@/lib/occurrenceSummaries";
import { getSpeciesFieldRecords } from "@/lib/speciesFieldRecordsApi";
import { getSpeciesProfile } from "@/lib/speciesProfileApi";
import { getSpeciesRangeMap } from "@/lib/speciesRangeMapApi";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; locale: string }> },
) {
  const { id, locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const [profile, fieldRecords, rangeMap] = await Promise.all([
    getSpeciesProfile(id, "ka"),
    getSpeciesFieldRecords(id),
    getSpeciesRangeMap(id, locale),
  ]);
  if (!profile) return new Response(null, { headers: noindex, status: 404 });
  const records = rangeMap?.hidePoints
    ? []
    : getRegionOccurrenceRecords({
        fieldRecords,
        gallery: profile.species.gallery,
        locale,
        speciesName: profile.species.commonName,
      });
  return Response.json(records, {
    headers: { ...noindex, "Cache-Control": "public, max-age=3600" },
  });
}
