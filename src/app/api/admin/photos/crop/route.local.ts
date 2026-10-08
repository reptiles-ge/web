import type { CoverCropRect } from "@/lib/coverCrop";

import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { cropSpeciesCover } from "@/lib/adminPhotos";
import { adminErrorResponse, readLocalAdminJsonBody } from "@/lib/adminRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const data = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  const id = typeof data.id === "string" ? data.id.trim() : "";
  const src = typeof data.src === "string" ? data.src.trim() : "";
  const target = data.target;
  const crop = readCrop(data.crop);
  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!src) {
    return Response.json({ error: "Invalid cover src" }, { status: 400 });
  }
  if (target !== "desktop" && target !== "mobile") {
    return Response.json({ error: "Invalid cover target" }, { status: 400 });
  }
  if (!crop) {
    return Response.json({ error: "Invalid crop" }, { status: 400 });
  }

  try {
    return Response.json(await cropSpeciesCover({ crop, id, src, target }));
  } catch (error) {
    return adminErrorResponse(error, "Crop failed");
  }
}

function readCrop(value: unknown): CoverCropRect | null {
  if (!value || typeof value !== "object") return null;
  const { height, width, x, y } = value as Record<string, unknown>;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }
  return { height, width, x, y };
}
