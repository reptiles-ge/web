import { type CoverTarget, isSpeciesContentId } from "@/lib/adminGalleryMdx";
import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";
import { setAdminSpeciesCover } from "@/lib/adminSpeciesApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = new Set<CoverTarget>(["both", "desktop", "mobile"]);

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readBodyString(body, "id");
  const src = readBodyString(body, "src");
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
    return Response.json(await setAdminSpeciesCover(id, { src, target }));
  } catch (error) {
    return adminErrorResponse(error, "Cover update failed");
  }
}

function readTarget(body: unknown): CoverTarget | null {
  if (!body || typeof body !== "object" || !("target" in body)) return null;
  const value = (body as { target?: unknown }).target;
  if (typeof value !== "string" || !TARGETS.has(value as CoverTarget)) {
    return null;
  }
  return value as CoverTarget;
}
