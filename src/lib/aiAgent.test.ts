import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type AgentTask, formatAgentRun, runAgent } from "@/lib/aiAgent";
import { runClaudeProcess } from "@/lib/claudeProcess";
import { runCodexProcess } from "@/lib/codexProcess";

vi.mock("@/lib/claudeProcess", () => ({ runClaudeProcess: vi.fn() }));
vi.mock("@/lib/codexProcess", () => ({ runCodexProcess: vi.fn() }));

const task: AgentTask = {
  access: "read-only",
  attempt: 1,
  cwd: "/tmp",
  output: "/tmp/out.json",
  profile: "super:texts",
  prompt: "Edit",
  timeoutMs: 1000,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(runClaudeProcess).mockResolvedValue({
    costUsd: 0.5,
    durationMs: 90_000,
    turns: 3,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("AI backend selection", () => {
  it("defaults to Claude and escalates effort on a repair attempt", async () => {
    vi.stubEnv("AI_BACKEND", "");
    await expect(runAgent(task)).resolves.toEqual({
      backend: "claude",
      costUsd: 0.5,
      durationMs: 90_000,
      effort: "high",
      model: "claude-opus-5-5",
      turns: 3,
    });
    expect(runClaudeProcess).toHaveBeenCalledWith(task, {
      effort: "high",
      model: "claude-opus-5-5",
    });
    expect(runCodexProcess).not.toHaveBeenCalled();
  });

  it("reads effort and model overrides from the environment", async () => {
    vi.stubEnv("AI_EFFORT_OVERRIDES", "super:texts=low");
    vi.stubEnv("AI_MODEL_OVERRIDES", "super:texts=claude-sonnet-5-5");
    await runAgent({ ...task, attempt: 0 });
    expect(runClaudeProcess).toHaveBeenCalledWith(expect.anything(), {
      effort: "low",
      model: "claude-sonnet-5-5",
    });
  });

  it("keeps the previous Codex model and effort when selected", async () => {
    vi.stubEnv("AI_BACKEND", "codex");
    await expect(runAgent(task)).resolves.toEqual({
      backend: "codex",
      effort: "xhigh",
      model: "gpt-6-sol",
    });
    expect(runCodexProcess).toHaveBeenCalledWith(task, {
      effort: "xhigh",
      model: "gpt-6-sol",
    });
    expect(runClaudeProcess).not.toHaveBeenCalled();
  });
});

describe("AI run summary", () => {
  it("lists model, effort, cost, minutes and turns", () => {
    expect(
      formatAgentRun({
        backend: "claude",
        costUsd: 1.234,
        durationMs: 150_000,
        effort: "high",
        model: "claude-opus-5-5",
        turns: 9,
      }),
    ).toBe("claude-opus-5-5 (high) · $1.23 · 3 min · 9 turns");
  });

  it("omits cost for Codex runs", () => {
    expect(
      formatAgentRun({ backend: "codex", effort: "xhigh", model: "gpt-6-sol" }),
    ).toBe("gpt-6-sol (xhigh)");
  });
});
