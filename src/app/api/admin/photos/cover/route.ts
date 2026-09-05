import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { type CoverTarget, isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openCoverPullRequest } from "@/lib/adminPhotoPullRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = new Set<CoverTarget>(["both", "desktop", "mobile"]);

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
  const target = readTarget(body);
  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!src) {
    return Response.json({ error: "Invalid cover src" }, { status: 400 });
  }
  if (!target) {
    return Response.json({ error: "Invalid cover target" }, { status: 400 });
  }

  try {
    const pullRequestUrl = await openCoverPullRequest({ id, src, target });
    return Response.json({ pullRequestUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cover update failed";
    return Response.json({ error: message }, { status: 400 });
  }
}

function readString(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

function readTarget(body: unknown): CoverTarget | null {
  if (!body || typeof body !== "object" || !("target" in body)) return null;
  const value = (body as { target?: unknown }).target;
  if (typeof value !== "string" || !TARGETS.has(value as CoverTarget)) {
    return null;
  }
  return value as CoverTarget;
}
