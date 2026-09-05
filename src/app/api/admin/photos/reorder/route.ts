import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openGalleryReorderPullRequest } from "@/lib/adminPhotoPullRequest";

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

  const id = readId(body);
  const srcs = readSrcs(body);
  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!srcs) {
    return Response.json({ error: "Invalid gallery order" }, { status: 400 });
  }

  try {
    const pullRequestUrl = await openGalleryReorderPullRequest({
      id,
      orderedSrcs: srcs,
    });
    return Response.json({ pullRequestUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reorder failed";
    return Response.json({ error: message }, { status: 400 });
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
