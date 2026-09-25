import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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

export async function transformWithCodex(input: {
  after: string;
  before: string;
  selected: string;
}): Promise<EditorResult> {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-editor-codex-"),
  );
  try {
    const schema = path.join(directory, "schema.json");
    const output = path.join(directory, "output.json");
    await fs.writeFile(schema, JSON.stringify(OUTPUT_SCHEMA));
    const prompt = buildEditorPrompt(input);
    await new Promise<void>((resolve, reject) => {
      const process = spawn(
        "codex",
        [
          "exec",
          "--ephemeral",
          "--skip-git-repo-check",
          "--sandbox",
          "read-only",
          "--cd",
          directory,
          "--output-schema",
          schema,
          "--output-last-message",
          output,
          "-",
        ],
        {
          cwd: directory,
          signal: AbortSignal.timeout(180000),
          stdio: ["pipe", "ignore", "pipe"],
        },
      );
      let errorText = "";
      process.stderr.setEncoding("utf8");
      process.stderr.on("data", (chunk: string) => {
        errorText = (errorText + chunk).slice(-4000);
      });
      process.on("error", reject);
      process.on("close", (code) => {
        if (code === 0) resolve();
        else
          reject(
            new Error(`Codex exited with ${code}: ${errorText.slice(-500)}`),
          );
      });
      process.stdin.end(prompt);
    });
    return editorResultSchema.parse(
      JSON.parse(await fs.readFile(output, "utf8")),
    );
  } finally {
    await fs.rm(directory, { force: true, recursive: true });
  }
}
