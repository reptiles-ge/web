import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import {
  isLocalAdminOriginRequest,
  readAdminJsonText,
} from "@/lib/adminRequest";
import { readAdminSpecies } from "@/lib/adminSpeciesApi";
import { isSpeciesId } from "@/lib/adminSpeciesCatalog";
import {
  formatAdminWorkflowProgress,
  notifyAdminTelegram,
} from "@/lib/adminTelegram";
import { processSpeciesTexts } from "@/lib/speciesTextProcessing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) {
    return localAdminForbiddenResponse();
  }
  let speciesName = "";
  let progress = "";
  try {
    const { id, progress: workflowProgress } = await readAdminJsonText<{
      id?: unknown;
      progress?: unknown;
    }>(request);
    if (typeof id !== "string" || !isSpeciesId(id))
      throw new Error("Invalid species id");
    progress = formatAdminWorkflowProgress(workflowProgress);
    speciesName = (await readAdminSpecies(id)).record.base.commonName;
    const result = await processSpeciesTexts(id);
    await notifyAdminTelegram(
      progress
        ? `✅ ${progress}done ${speciesName} (texts)`
        : `✅ texts done ${speciesName}`,
    );
    return Response.json(result, {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  } catch (error) {
    console.error("species-texts", error);
    if (speciesName)
      await notifyAdminTelegram(
        progress
          ? `❌ ${progress}failed ${speciesName} (texts)`
          : `❌ texts failed ${speciesName}`,
      );
    return Response.json(
      { error: "Text processing failed" },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: 400,
      },
    );
  }
}
