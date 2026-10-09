import {
  type AiBackend,
  type AiProfile,
  claudeProfileSettings,
  CODEX_SETTINGS,
} from "@/lib/aiAgentProfiles";
import { type ClaudeRun, runClaudeProcess } from "@/lib/claudeProcess";
import { runCodexProcess } from "@/lib/codexProcess";
import { serverEnv } from "@/lib/env";

export type AgentRun = ClaudeRun & {
  backend: AiBackend;
  effort: string;
  model: string;
};

export type AgentTask = {
  access: "read-only" | "workspace-write";
  attempt?: number;
  cwd: string;
  output: string;
  profile: AiProfile;
  prompt: string;
  readDirectories?: string[];
  schema?: string;
  timeoutMs: number;
  webSearch?: boolean;
};

export function formatAgentRun(run: AgentRun) {
  return [
    `${run.model} (${run.effort})`,
    run.costUsd === undefined ? "" : `$${run.costUsd.toFixed(2)}`,
    run.durationMs === undefined
      ? ""
      : `${Math.round(run.durationMs / 60_000)} min`,
    run.turns === undefined ? "" : `${run.turns} turns`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export async function runAgent(task: AgentTask): Promise<AgentRun> {
  const env = serverEnv();
  if (env.AI_BACKEND === "codex") {
    await runCodexProcess(task, CODEX_SETTINGS);
    return { backend: "codex", ...CODEX_SETTINGS };
  }
  const settings = claudeProfileSettings(task.profile, task.attempt ?? 0, {
    effort: env.AI_EFFORT_OVERRIDES,
    model: env.AI_MODEL_OVERRIDES,
  });
  return {
    backend: "claude",
    ...settings,
    ...(await runClaudeProcess(task, settings)),
  };
}
