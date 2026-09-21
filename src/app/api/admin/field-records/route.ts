import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openFieldRecordPullRequest } from "@/lib/adminPhotoPullRequest";
import { parsePhotoCoordinatesInput } from "@/lib/photoCoordinates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminEnabled()) return localAdminForbiddenResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = readString(body, "id");
  const locality = readString(body, "locality");
  const lat = readString(body, "lat");
  const lng = readString(body, "lng");

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
    const date = readString(body, "date");
    const note = readString(body, "note");
    const observer = readString(body, "observer");
    const source = readString(body, "source");
    const url = readString(body, "url");
    if (date) record.date = date;
    if (note) record.note = note;
    if (observer) record.observer = observer;
    if (source) record.source = source;
    if (url) record.url = url;
    const pullRequestUrl = await openFieldRecordPullRequest({ id, record });
    return Response.json({ pullRequestUrl, record });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Field record update failed";
    return Response.json({ error: message }, { status: 400 });
  }
}

function readEvidence(
  body: unknown,
): NonNullable<SpeciesFieldRecord["evidence"]> {
  const value = readString(body, "evidence");
  if (value === "literature" || value === "specimen") return value;
  return "observation";
}

function readString(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}
