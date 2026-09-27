import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { notifyAdminTelegram } from "@/lib/adminTelegram";
import {
  runSpeciesWorkflow,
  type SpeciesWorkflowMode,
  validateSpeciesWorkflowModes,
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

  const steps: Array<{ mode: SpeciesWorkflowMode; report: string }> = [];
  let speciesName = "";
  try {
    const text = await request.text();
    if (text.length > 1000) throw new Error("Invalid request");
    const { id, modes } = JSON.parse(text) as { id?: unknown; modes?: unknown };
    if (typeof id !== "string" || !isSpeciesContentId(id))
      throw new Error("Invalid species id");
    const selectedModes = validateSpeciesWorkflowModes(modes);
    speciesName = readAdminSpeciesGallery(id).commonName;
    const result = await runSpeciesWorkflow(
      id,
      selectedModes,
      async (mode, report) => {
        steps.push({ mode, report });
        await notifyAdminTelegram(
          `✅ ${steps.length}/${selectedModes.length + 1} done ${speciesName} (${mode})`,
        );
      },
    );
    await notifyAdminTelegram(
      `✅ ${selectedModes.length + 1}/${selectedModes.length + 1} done ${speciesName} (workflow)`,
    );
    return Response.json(
      { ...result, steps },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
    );
  } catch (error) {
    console.error("species-workflow", error);
    if (speciesName)
      await notifyAdminTelegram(`❌ workflow failed ${speciesName}`);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Workflow failed",
        steps,
      },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: 400,
      },
    );
  }
}
