import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";
import { removeAdminSpeciesPhoto } from "@/lib/adminSpeciesApi";

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
    return Response.json(await removeAdminSpeciesPhoto(id, src));
  } catch (error) {
    return adminErrorResponse(error, "Remove photo failed");
  }
}
