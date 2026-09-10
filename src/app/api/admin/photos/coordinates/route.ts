import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openPhotoCoordinatesPullRequest } from "@/lib/adminPhotoPullRequest";
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
  const src = readString(body, "src");
  const lat = readString(body, "lat");
  const lng = readString(body, "lng");
  const clear = readBoolean(body, "clear");

  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!src) {
    return Response.json({ error: "Invalid gallery src" }, { status: 400 });
  }

  try {
    const coordinates = clear
      ? null
      : (parsePhotoCoordinatesInput(lat, lng) ?? null);
    if (!clear && !coordinates) {
      return Response.json(
        { error: "კოორდინატები ორივე უნდა იყოს — განედი და გრძედი" },
        { status: 400 },
      );
    }
    const pullRequestUrl = await openPhotoCoordinatesPullRequest({
      coordinates,
      id,
      src,
    });
    return Response.json({
      credit: coordinates
        ? { lat: coordinates.lat, lng: coordinates.lng }
        : {},
      pullRequestUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Coordinates update failed";
    return Response.json({ error: message }, { status: 400 });
  }
}

function readBoolean(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return false;
  return (body as Record<string, unknown>)[key] === true;
}

function readString(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}
