import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { runCodexProcess } from "@/lib/codexProcess";
import { type EditorResult, editorResultSchema } from "@/lib/contentEditor";
import { buildEditorPrompt } from "@/lib/contentEditorPrompt";

const OUTPUT_SCHEMA = {
  additionalProperties: false,
  properties: Object.fromEntries(
    ["ka", "en", "ru", "tr"].map((locale) => [locale, { type: "string" }]),
  ),
  required: ["ka", "en", "ru", "tr"],
  type: "object",
};

export async function transformWithCodex(
  input: {
    after: string;
    before: string;
    selected: string;
  },
  reasoningEffort: "medium" | "xhigh" = "xhigh",
): Promise<EditorResult> {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-editor-codex-"),
  );
  try {
    const schema = path.join(directory, "schema.json");
    const output = path.join(directory, "output.json");
    await fs.writeFile(schema, JSON.stringify(OUTPUT_SCHEMA));
    const prompt = buildEditorPrompt(input);
    await runCodexProcess({
      args: [
        "exec",
        "--ephemeral",
        "--skip-git-repo-check",
        "--sandbox",
        "read-only",
        "--config",
        `model_reasoning_effort="${reasoningEffort}"`,
        "--output-schema",
        schema,
        "--output-last-message",
        output,
      ],
      cwd: directory,
      prompt,
      timeoutMs: reasoningEffort === "xhigh" ? 45 * 60 * 1000 : 600_000,
    });
    return editorResultSchema.parse(
      JSON.parse(await fs.readFile(output, "utf8")),
    );
  } finally {
    await fs.rm(directory, { force: true, recursive: true });
  }
}
