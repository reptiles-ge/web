import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { openRemovePhotoPullRequest } from "@/lib/adminPhotoPullRequest";
import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readBodyString(body, "id");
  const src = readBodyString(body, "src");
  if (!id || !isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!src) {
    return Response.json({ error: "Invalid gallery src" }, { status: 400 });
  }

  try {
    const result = await openRemovePhotoPullRequest({ id, src });
    return Response.json(result);
  } catch (error) {
    return adminErrorResponse(error, "Remove photo failed");
  }
}
