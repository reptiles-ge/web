import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import {
  speciesCreationCodexPrompt,
  validateSpeciesCreationInput,
} from "@/lib/speciesPageAnalysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (
    !isLocalAdminEnabled() ||
    !["127.0.0.1", "[::1]", "localhost"].includes(url.hostname) ||
    request.headers.get("origin") !== url.origin
  ) {
    return localAdminForbiddenResponse();
  }

  try {
    const text = await request.text();
    if (text.length > 1000) throw new Error("Invalid request");
    const body = JSON.parse(text) as {
      commonName?: unknown;
      scientificName?: unknown;
    };
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
