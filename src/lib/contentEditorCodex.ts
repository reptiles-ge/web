import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { type EditorResult, editorResultSchema } from "@/lib/contentEditor";
import { buildEditorPrompt } from "@/lib/contentEditorPrompt";
import {
  assertCodexQuota,
  CodexQuotaError,
  reportCodexQuota,
} from "@/lib/contentEditorQuota";

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
  operationId: string,
): Promise<EditorResult> {
  await assertCodexQuota(operationId);
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-editor-codex-"),
  );
  try {
    const schema = path.join(directory, "schema.json");
    const output = path.join(directory, "output.json");
    await fs.writeFile(schema, JSON.stringify(OUTPUT_SCHEMA));
    const prompt = buildEditorPrompt(input);
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
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
          env: {
            CODEX_HOME: process.env.CODEX_HOME,
            HOME: process.env.HOME,
            LANG: process.env.LANG,
            NODE_ENV: process.env.NODE_ENV,
            PATH: process.env.PATH,
            TMPDIR: process.env.TMPDIR,
          },
          signal: AbortSignal.timeout(180000),
          stdio: ["pipe", "ignore", "pipe"],
        },
      );
      let errorText = "";
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => {
        errorText = (errorText + chunk).slice(-4000);
      });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) resolve();
        else
          reject(
            new Error(`Codex exited with ${code}: ${errorText.slice(-500)}`),
          );
      });
      child.stdin.end(prompt);
    });
    const result = editorResultSchema.parse(
      JSON.parse(await fs.readFile(output, "utf8")),
    );
    await reportCodexQuota(operationId);
    return result;
  } catch (error) {
    if (await reportCodexQuota(operationId, error)) throw new CodexQuotaError();
    throw error;
  } finally {
    await fs.rm(directory, { force: true, recursive: true });
  }
}
