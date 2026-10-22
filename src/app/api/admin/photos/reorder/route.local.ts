import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { adminErrorResponse, readLocalAdminJsonBody } from "@/lib/adminRequest";
import { reorderAdminSpeciesPhotos } from "@/lib/adminSpeciesApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readId(body);
  const srcs = readSrcs(body);
  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!srcs) {
    return Response.json({ error: "Invalid gallery order" }, { status: 400 });
  }

  try {
    return Response.json(await reorderAdminSpeciesPhotos(id, srcs));
  } catch (error) {
    return adminErrorResponse(error, "Reorder failed");
  }
}

function readId(body: unknown) {
  if (!body || typeof body !== "object" || !("id" in body)) return "";
  return typeof body.id === "string" ? body.id.trim() : "";
}

function readSrcs(body: unknown): null | string[] {
  if (!body || typeof body !== "object" || !("srcs" in body)) return null;
  const value = body.srcs;
  if (!Array.isArray(value) || value.length < 2) return null;
  const srcs: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) return null;
    srcs.push(item.trim());
  }
  if (new Set(srcs).size !== srcs.length) return null;
  return srcs;
}
