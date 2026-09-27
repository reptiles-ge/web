import { randomUUID } from "node:crypto";

import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { notifyAdminTelegram } from "@/lib/adminTelegram";
import { StaleSpeciesContentError } from "@/lib/contentEditorPullRequest";
import { processSpeciesTexts } from "@/lib/speciesTextProcessing";

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
  let speciesName = "";
  try {
    const text = await request.text();
    if (text.length > 1000) throw new Error("Invalid request");
    const { id } = JSON.parse(text) as { id?: unknown };
    if (typeof id !== "string" || !isSpeciesContentId(id))
      throw new Error("Invalid species id");
    speciesName = readAdminSpeciesGallery(id).commonName;
    const result = await processSpeciesTexts(id, randomUUID());
    await notifyAdminTelegram(`✅ texts done ${speciesName}`);
    return Response.json(result, {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  } catch (error) {
    console.error("species-texts", error);
    if (speciesName)
      await notifyAdminTelegram(`❌ texts failed ${speciesName}`);
    const stale = error instanceof StaleSpeciesContentError;
    return Response.json(
      {
        error: stale ? "stale" : "Text processing failed",
      },
      {
        headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
        status: stale ? 409 : 400,
      },
    );
  }
}
