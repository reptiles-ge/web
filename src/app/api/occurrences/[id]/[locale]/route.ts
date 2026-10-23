import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getRegionOccurrenceRecords } from "@/lib/occurrenceSummaries";
import { getSpeciesFieldRecords } from "@/lib/speciesFieldRecordsApi";
import { getSpeciesProfile } from "@/lib/speciesProfileApi";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; locale: string }> },
) {
  const { id, locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const [profile, fieldRecords] = await Promise.all([
    getSpeciesProfile(id, "ka"),
    getSpeciesFieldRecords(id),
  ]);
  if (!profile) return new Response(null, { headers: noindex, status: 404 });
  const records = getRegionOccurrenceRecords({
    fieldRecords,
    gallery: profile.species.gallery,
    locale,
    speciesName: profile.species.commonName,
  });
  return Response.json(records, {
    headers: { ...noindex, "Cache-Control": "public, max-age=3600" },
  });
}
