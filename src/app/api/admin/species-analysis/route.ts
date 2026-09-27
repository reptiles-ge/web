import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { analyzeSpeciesPage } from "@/lib/speciesPageAnalysis";

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

  let report = "";
  let speciesName = "";
  try {
    const text = await request.text();
    if (text.length > 1000) throw new Error("Invalid request");
    const { id } = JSON.parse(text) as { id?: unknown };
    if (typeof id !== "string" || !isSpeciesContentId(id))
      throw new Error("Invalid species id");
    speciesName = readAdminSpeciesGallery(id).commonName;
    const result = await analyzeSpeciesPage(id, (value) => {
      report = value;
    });
    const response = Response.json(result, {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
    await notifyTelegram("done", speciesName);
    return response;
  } catch (error) {
    console.error("species-analysis", error);
    if (speciesName) await notifyTelegram("failed", speciesName);
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

async function notifyTelegram(status: "done" | "failed", speciesName: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("species-analysis Telegram is not configured");
    return;
  }
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: chatId,
          text: `${status === "done" ? "✅ done" : "❌ failed"} ${speciesName}`,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(10000),
      },
    );
    const result = (await response.json()) as { ok?: boolean };
    if (!response.ok || !result.ok)
      console.error("species-analysis Telegram notification failed");
  } catch {
    console.error("species-analysis Telegram notification failed");
  }
}
