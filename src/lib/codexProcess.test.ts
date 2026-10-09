import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AgentTask } from "@/lib/aiAgent";

import { CODEX_SETTINGS } from "@/lib/aiAgentProfiles";
import { codexArgs, runCodexProcess } from "@/lib/codexProcess";

vi.mock("node:child_process", () => ({ spawn: vi.fn() }));

function mockChild() {
  const child = Object.assign(new EventEmitter(), {
    stderr: Object.assign(new EventEmitter(), { setEncoding: vi.fn() }),
    stdin: { end: vi.fn() },
  });
  vi.mocked(spawn).mockReturnValue(
    child as unknown as ReturnType<typeof spawn>,
  );
  return child;
}

const task: AgentTask = {
  access: "read-only",
  cwd: "/tmp/worktree",
  output: "/tmp/out.json",
  profile: "super:analysis",
  prompt: "Read sources",
  schema: "/tmp/schema.json",
  timeoutMs: 1000,
  webSearch: true,
};

beforeEach(() => vi.clearAllMocks());

describe("local Codex subprocess", () => {
  it("keeps the read-only sandbox, live search and schema output", () => {
    expect(codexArgs(task, CODEX_SETTINGS)).toEqual([
      "exec",
      "--ephemeral",
      "--skip-git-repo-check",
      "--sandbox",
      "read-only",
      "--config",
      'model_reasoning_effort="xhigh"',
      "--config",
      'web_search="live"',
      "--output-schema",
      "/tmp/schema.json",
      "--output-last-message",
      "/tmp/out.json",
      "--model",
      "gpt-6-sol",
      "--cd",
      "/tmp/worktree",
      "-",
    ]);
  });

  it("grants network and no approvals only to workspace-write tasks", () => {
    const args = codexArgs(
      {
        ...task,
        access: "workspace-write",
        schema: undefined,
        webSearch: undefined,
      },
      CODEX_SETTINGS,
    );
    expect(args).toContain("sandbox_workspace_write.network_access=true");
    expect(args).toContain('approval_policy="never"');
    expect(args).not.toContain("--output-schema");
    expect(args.some((arg) => arg.startsWith("web_search"))).toBe(false);
  });

  it("pipes the prompt and resolves on success", async () => {
    const child = mockChild();
    const pending = runCodexProcess(task, CODEX_SETTINGS);
    expect(spawn).toHaveBeenCalledWith(
      "codex",
      codexArgs(task, CODEX_SETTINGS),
      expect.objectContaining({
        cwd: "/tmp/worktree",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(child.stdin.end).toHaveBeenCalledWith("Read sources");
    child.emit("close", 0);
    await expect(pending).resolves.toBeUndefined();
  });

  it("propagates failed inference without treating MCP warnings as success", async () => {
    const child = mockChild();
    const pending = runCodexProcess(task, CODEX_SETTINGS);
    child.stderr.emit("data", "Model is not supported");
    child.emit("close", 1);
    await expect(pending).rejects.toThrow(
      "Codex exited with 1: Model is not supported",
    );
  });
});
