import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import {
  isLocalAdminOriginRequest,
  readAdminJsonText,
} from "@/lib/adminRequest";
import { notifyAdminTelegram } from "@/lib/adminTelegram";
import {
  runSpeciesWorkflow,
  type SpeciesWorkflowMode,
  validateSpeciesWorkflowModes,
} from "@/lib/speciesPageAnalysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) {
    return localAdminForbiddenResponse();
  }

  const steps: Array<{ mode: SpeciesWorkflowMode; report: string }> = [];
  let speciesName = "";
  try {
    const { id, modes } = await readAdminJsonText<{
      id?: unknown;
      modes?: unknown;
    }>(request);
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
      result.failedStep
        ? `⚠️ workflow stopped ${speciesName} (${result.failedStep})${result.pullRequestUrl ? ` — ${result.pullRequestUrl}` : ""}`
        : `✅ ${selectedModes.length + 1}/${selectedModes.length + 1} done ${speciesName} (workflow)`,
    );
    return Response.json(
      { ...result, steps },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: result.failedStep && !result.pullRequestUrl ? 400 : 200,
      },
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
