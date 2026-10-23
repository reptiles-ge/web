import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";
import { setAdminSpeciesPhotoCoordinates } from "@/lib/adminSpeciesApi";
import { isSpeciesId } from "@/lib/adminSpeciesCatalog";
import { parsePhotoCoordinatesInput } from "@/lib/photoCoordinates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readBodyString(body, "id");
  const src = readBodyString(body, "src");
  const lat = readBodyString(body, "lat");
  const lng = readBodyString(body, "lng");
  const clear = readBoolean(body, "clear");

  if (!id || !isSpeciesId(id)) {
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
    return Response.json(
      await setAdminSpeciesPhotoCoordinates(id, src, coordinates),
    );
  } catch (error) {
    return adminErrorResponse(error, "Coordinates update failed");
  }
}

function readBoolean(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return false;
  return (body as Record<string, unknown>)[key] === true;
}
