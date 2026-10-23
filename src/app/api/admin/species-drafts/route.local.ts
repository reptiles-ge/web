import {
  adminErrorResponse,
  readBodyString,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";
import {
  approveAdminSpeciesDraft,
  rejectAdminSpeciesDraft,
} from "@/lib/adminSpeciesApi";
import { isSpeciesId } from "@/lib/adminSpeciesCatalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { body, response } = await readLocalAdminJsonBody(request);
  if (response) return response;

  const id = readBodyString(body, "id");
  const decision = readBodyString(body, "decision");
  const draftId = Number(
    body && typeof body === "object" && "draftId" in body
      ? (body as { draftId: unknown }).draftId
      : NaN,
  );
  if (!id || !isSpeciesId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }
  if (!Number.isInteger(draftId) || draftId < 1) {
    return Response.json({ error: "Invalid draft id" }, { status: 400 });
  }
  if (decision !== "approve" && decision !== "reject") {
    return Response.json({ error: "Invalid decision" }, { status: 400 });
  }

  try {
    return Response.json(
      decision === "approve"
        ? await approveAdminSpeciesDraft(id, draftId)
        : await rejectAdminSpeciesDraft(id, draftId),
    );
  } catch (error) {
    return adminErrorResponse(error, "Draft decision failed");
  }
}
