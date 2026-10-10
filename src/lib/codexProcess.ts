import { spawn } from "node:child_process";

import type { AgentTask } from "@/lib/aiAgent";
import type { AiProfileSettings } from "@/lib/aiAgentProfiles";

export function codexArgs(task: AgentTask, settings: AiProfileSettings) {
  return [
    "exec",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    task.access,
    "--config",
    `model_reasoning_effort="${settings.effort}"`,
    ...(task.access === "workspace-write"
      ? [
          "--config",
          "sandbox_workspace_write.network_access=true",
          "--config",
          'approval_policy="never"',
        ]
      : []),
    ...(task.webSearch === undefined
      ? []
      : ["--config", `web_search="${task.webSearch ? "live" : "disabled"}"`]),
    ...(task.schema ? ["--output-schema", task.schema] : []),
    "--output-last-message",
    task.output,
    "--model",
    settings.model,
    "--cd",
    task.cwd,
    "-",
  ];
}

export function runCodexProcess(task: AgentTask, settings: AiProfileSettings) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("codex", codexArgs(task, settings), {
      cwd: task.cwd,
      env: {
        CODEX_HOME: process.env.CODEX_HOME,
        HOME: process.env.HOME,
        LANG: process.env.LANG,
        NODE_ENV: process.env.NODE_ENV,
        PATH: process.env.PATH,
        TMPDIR: process.env.TMPDIR,
      },
      signal: AbortSignal.timeout(task.timeoutMs),
      stdio: ["pipe", "ignore", "pipe"],
    });
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
    child.stdin.end(task.prompt);
  });
}
