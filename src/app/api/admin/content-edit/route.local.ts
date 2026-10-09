import { randomUUID } from "node:crypto";

import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import { isLocalAdminOriginRequest } from "@/lib/adminRequest";
import {
  editorRequestSchema,
  validateEditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { transformWithAgent } from "@/lib/contentEditorAgent";
import { createEditorPullRequest } from "@/lib/contentEditorPullRequest";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) {
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
      await transformWithAgent(selection),
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
    console.error(
      "content-editor",
      JSON.stringify({
        durationMs: Date.now() - started,
        error: error instanceof Error ? error.message : String(error),
        operationId,
        phase,
      }),
    );
    return Response.json(
      { error: phase },
      { headers: { "X-Robots-Tag": "noindex" }, status: 400 },
    );
  }
}
