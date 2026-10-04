import type { CoverCropRect } from "@/lib/coverCrop";

import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { cropSpeciesCover } from "@/lib/adminPhotos";

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
    const message = error instanceof Error ? error.message : "Crop failed";
    return Response.json({ error: message }, { status: 400 });
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
