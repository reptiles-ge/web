import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import fs from "node:fs/promises";
import { z } from "zod/v4";

import type { AgentTask } from "@/lib/aiAgent";
import type { AiProfileSettings } from "@/lib/aiAgentProfiles";

const READ_TOOLS = ["Read", "Glob", "Grep"];
const WEB_TOOLS = ["WebSearch", "WebFetch"];
const WRITE_TOOLS = ["Edit", "Write", "Bash"];
const MAX_STDOUT = 8_000_000;

const claudeResultSchema = z.object({
  api_error_status: z.number().nullable().optional(),
  duration_ms: z.number().optional(),
  is_error: z.boolean().optional(),
  num_turns: z.number().optional(),
  result: z.string().optional(),
  structured_output: z.unknown().optional(),
  subtype: z.string().optional(),
  total_cost_usd: z.number().optional(),
});

const jsonSchemaFileSchema = z.record(z.string(), z.unknown());

export type ClaudeRun = {
  costUsd?: number;
  durationMs?: number;
  turns?: number;
};

export async function claudeArgs(task: AgentTask, settings: AiProfileSettings) {
  const tools = claudeTools(task).join(",");
  return [
    "-p",
    "--output-format",
    "json",
    "--model",
    settings.model,
    "--effort",
    settings.effort,
    "--no-session-persistence",
    "--setting-sources",
    "project",
    "--strict-mcp-config",
    "--disable-slash-commands",
    "--permission-mode",
    "dontAsk",
    "--tools",
    tools,
    "--allowedTools",
    tools,
    ...(task.readDirectories ?? []).flatMap((directory) => [
      "--add-dir",
      directory,
    ]),
    ...(task.schema ? ["--json-schema", await claudeSchema(task.schema)] : []),
  ];
}

export function claudeTools(task: AgentTask) {
  return task.access === "workspace-write"
    ? [...READ_TOOLS, ...WRITE_TOOLS, ...WEB_TOOLS]
    : [...READ_TOOLS, ...(task.webSearch ? WEB_TOOLS : [])];
}

export async function runClaudeProcess(
  task: AgentTask,
  settings: AiProfileSettings,
) {
  const args = await claudeArgs(task, settings);
  const stdout = await new Promise<string>((resolve, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn("claude", args, {
      cwd: task.cwd,
      env: claudeEnv(),
      signal: AbortSignal.timeout(task.timeoutMs),
    });
    let output = "";
    let errorText = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      output += chunk;
      if (output.length > MAX_STDOUT) {
        child.kill();
        reject(new Error("Claude output is too large"));
      }
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      errorText = (errorText + chunk).slice(-4000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const parsed = parseClaudeResult(output);
      if (parsed?.is_error || (parsed && parsed.subtype !== "success"))
        reject(
          new Error(
            `Claude failed (${parsed.api_error_status ? `HTTP ${parsed.api_error_status}` : (parsed.subtype ?? "error")}): ${(parsed.result ?? errorText).slice(-500)}`,
          ),
        );
      else if (code === 0) resolve(output);
      else
        reject(
          new Error(
            `Claude exited with ${code}: ${(errorText || output).slice(-500)}`,
          ),
        );
    });
    child.stdin.end(task.prompt);
  });
  const result = parseClaudeResult(stdout);
  if (!result) throw new Error("Claude returned unreadable output");
  await fs.writeFile(
    task.output,
    task.schema && result.structured_output !== undefined
      ? JSON.stringify(result.structured_output)
      : (result.result ?? ""),
    { mode: 0o600 },
  );
  return {
    costUsd: result.total_cost_usd,
    durationMs: result.duration_ms,
    turns: result.num_turns,
  } satisfies ClaudeRun;
}

function claudeEnv() {
  return Object.fromEntries(
    [
      "ANTHROPIC_API_KEY",
      "CLAUDE_CONFIG_DIR",
      "HOME",
      "LANG",
      "LOGNAME",
      "NODE_ENV",
      "PATH",
      "TMPDIR",
      "USER",
    ].flatMap((key) =>
      process.env[key] === undefined ? [] : [[key, process.env[key]]],
    ),
  ) as NodeJS.ProcessEnv;
}

async function claudeSchema(file: string) {
  const text = await fs.readFile(file, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Claude schema is not valid JSON: ${file}`);
  }
  const result = jsonSchemaFileSchema.safeParse(parsed);
  if (!result.success)
    throw new Error(`Claude schema must be a JSON object: ${file}`);
  const { $schema: _, ...schema } = result.data;
  return JSON.stringify(schema);
}

function parseClaudeResult(stdout: string) {
  try {
    return claudeResultSchema.parse(JSON.parse(stdout));
  } catch {
    return null;
  }
}
