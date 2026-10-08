import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openFieldRecordPullRequest } from "@/lib/adminPhotoPullRequest";
import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";
import { parsePhotoCoordinatesInput } from "@/lib/photoCoordinates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readBodyString(body, "id");
  const locality = readBodyString(body, "locality");
  const lat = readBodyString(body, "lat");
  const lng = readBodyString(body, "lng");

  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!locality) {
    return Response.json({ error: "ლოკაცია აუცილებელია" }, { status: 400 });
  }

  try {
    const coordinates = parsePhotoCoordinatesInput(lat, lng);
    if (!coordinates) {
      return Response.json(
        { error: "კოორდინატები აუცილებელია" },
        { status: 400 },
      );
    }

    const record: SpeciesFieldRecord = {
      evidence: readEvidence(body),
      lat: coordinates.lat,
      lng: coordinates.lng,
      locality,
    };
    const date = readBodyString(body, "date");
    const note = readBodyString(body, "note");
    const observer = readBodyString(body, "observer");
    const observerName = readBodyString(body, "observerName");
    const source = readBodyString(body, "source");
    const url = readBodyString(body, "url");
    if (date) record.date = date;
    if (note) record.note = note;
    if (observer) record.observer = observer;
    if (observerName) record.observerName = observerName;
    if (source) record.source = source;
    if (url) record.url = url;
    const pullRequestUrl = await openFieldRecordPullRequest({ id, record });
    return Response.json({ pullRequestUrl, record });
  } catch (error) {
    return adminErrorResponse(error, "Field record update failed");
  }
}

function readEvidence(
  body: unknown,
): NonNullable<SpeciesFieldRecord["evidence"]> {
  const value = readBodyString(body, "evidence");
  if (value === "literature" || value === "specimen") return value;
  return "observation";
}
