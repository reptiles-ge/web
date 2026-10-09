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
  getSpeciesSuperAnalysisJob,
  startSpeciesSuperAnalysisJob,
} from "@/lib/speciesSuperAnalysisJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function GET(request: Request) {
  let origin = request.headers.get("origin");
  if (!origin) {
    try {
      origin = new URL(request.headers.get("referer") ?? "").origin;
    } catch {
      return localAdminForbiddenResponse();
    }
  }
  if (
    !isLocalAdminOriginRequest(
      new Request(request.url, { headers: { origin } }),
    )
  )
    return localAdminForbiddenResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !isSpeciesContentId(id))
    return Response.json(
      { error: "Invalid species id" },
      { headers, status: 400 },
    );
  try {
    return Response.json(await getSpeciesSuperAnalysisJob(id), { headers });
  } catch {
    return Response.json(
      { error: "Could not read analysis progress" },
      { headers, status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) return localAdminForbiddenResponse();
  try {
    const { id, runId } = await readAdminJsonText<{
      id?: unknown;
      runId?: unknown;
    }>(request);
    if (
      typeof id !== "string" ||
      !isSpeciesContentId(id) ||
      typeof runId !== "string" ||
      !/^[0-9a-f-]{36}$/.test(runId)
    )
      throw new Error("Invalid analysis request");
    readAdminSpeciesGallery(id);
    const existing = await getSpeciesSuperAnalysisJob(id);
    const job =
      existing?.runId === runId
        ? existing
        : startSpeciesSuperAnalysisJob(id, runId);
    return Response.json(job, { headers, status: 202 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { headers, status: 400 },
    );
  }
}
