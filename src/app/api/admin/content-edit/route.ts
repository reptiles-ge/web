import { randomUUID } from "node:crypto";

import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import {
  editorRequestSchema,
  validateEditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { transformWithCodex } from "@/lib/contentEditorCodex";
import { createEditorPullRequest } from "@/lib/contentEditorPullRequest";
import { CodexQuotaError } from "@/lib/contentEditorQuota";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";

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
  const operationId = randomUUID();
  const started = Date.now();
  let phase = "request";
  try {
    const text = await request.text();
    if (text.length > 30000)
      return Response.json({ error: "request" }, { status: 413 });
    const input = editorRequestSchema.parse(JSON.parse(text));
    const target = await resolveEditorTarget(input);
    const selection = verifyEditorSelection(target.source, input);
    console.info(
      "content-editor",
      JSON.stringify({
        field: input.field,
        id: input.id,
        kind: input.kind,
        operationId,
        phase: "codex-start",
      }),
    );
    phase = "codex";
    const result = validateEditorResult(
      await transformWithCodex(selection, operationId),
      selection,
    );
    console.info(
      "content-editor",
      JSON.stringify({ operationId, phase: "codex-validated" }),
    );
    phase = "git";
    const pullRequestUrl = await createEditorPullRequest(
      input,
      result,
      operationId,
    );
    console.info(
      "content-editor",
      JSON.stringify({
        durationMs: Date.now() - started,
        operationId,
        phase: "complete",
      }),
    );
    return Response.json(
      { pullRequestUrl },
      { headers: { "X-Robots-Tag": "noindex" } },
    );
  } catch (error) {
    const limited = error instanceof CodexQuotaError;
    console.error(
      "content-editor",
      JSON.stringify({
        durationMs: Date.now() - started,
        error: error instanceof Error ? error.message : "unknown",
        operationId,
        phase,
      }),
    );
    return Response.json(
      { error: limited ? "limit" : phase },
      { headers: { "X-Robots-Tag": "noindex" }, status: limited ? 429 : 400 },
    );
  }
}
