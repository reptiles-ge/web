import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import {
  isLocalAdminOriginRequest,
  readAdminJsonText,
} from "@/lib/adminRequest";
import {
  formatAdminWorkflowProgress,
  notifyAdminTelegram,
} from "@/lib/adminTelegram";
import { analyzeSpeciesPage } from "@/lib/speciesPageAnalysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) {
    return localAdminForbiddenResponse();
  }

  let report = "";
  let speciesName = "";
  let progress = "";
  try {
    const {
      id,
      mode = "analysis",
      progress: workflowProgress,
    } = await readAdminJsonText<{
      id?: unknown;
      mode?: unknown;
      progress?: unknown;
    }>(request);
    if (typeof id !== "string" || !isSpeciesContentId(id))
      throw new Error("Invalid species id");
    if (
      mode !== "analysis" &&
      mode !== "links" &&
      mode !== "lookalikes" &&
      mode !== "records"
    )
      throw new Error("Invalid analysis mode");
    progress = formatAdminWorkflowProgress(workflowProgress);
    speciesName = readAdminSpeciesGallery(id).commonName;
    const result = await analyzeSpeciesPage(
      id,
      (value) => {
        report = value;
      },
      mode,
    );
    const response = Response.json(result, {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
    await notifyAdminTelegram(
      `✅ ${progress}done ${speciesName}${progress ? ` (${mode})` : ""}`,
    );
    return response;
  } catch (error) {
    console.error("species-analysis", error);
    if (speciesName)
      await notifyAdminTelegram(`❌ ${progress}failed ${speciesName}`);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Analysis failed",
        report,
      },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: 400,
      },
    );
  }
}
