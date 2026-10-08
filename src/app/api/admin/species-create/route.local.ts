import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import {
  isLocalAdminOriginRequest,
  readAdminJsonText,
} from "@/lib/adminRequest";
import {
  speciesCreationCodexPrompt,
  validateSpeciesCreationInput,
} from "@/lib/speciesPageAnalysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) {
    return localAdminForbiddenResponse();
  }

  try {
    const body = await readAdminJsonText<{
      commonName?: unknown;
      scientificName?: unknown;
    }>(request);
    const input = validateSpeciesCreationInput(
      body.commonName,
      body.scientificName,
    );
    const prompt = await speciesCreationCodexPrompt(input);
    return Response.json(
      { prompt },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
      },
    );
  } catch (error) {
    console.error("species-create", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Creation failed" },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: 400,
      },
    );
  }
}
