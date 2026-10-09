import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { runAgent } from "@/lib/aiAgent";
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

export async function transformWithAgent(input: {
  after: string;
  before: string;
  selected: string;
}): Promise<EditorResult> {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-editor-ai-"),
  );
  try {
    const schema = path.join(directory, "schema.json");
    const output = path.join(directory, "output.json");
    await fs.writeFile(schema, JSON.stringify(OUTPUT_SCHEMA));
    const prompt = buildEditorPrompt(input);
    await runAgent({
      access: "read-only",
      cwd: directory,
      output,
      profile: "editor",
      prompt,
      schema,
      timeoutMs: 45 * 60 * 1000,
    });
    return editorResultSchema.parse(
      JSON.parse(await fs.readFile(output, "utf8")),
    );
  } finally {
    await fs.rm(directory, { force: true, recursive: true });
  }
}
