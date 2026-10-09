import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { runCodexProcess } from "@/lib/codexProcess";

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

beforeEach(() => vi.clearAllMocks());

describe("local Codex subprocess", () => {
  it("overrides the unsupported inherited model while preserving stage options", async () => {
    const child = mockChild();
    const pending = runCodexProcess({
      args: [
        "exec",
        "--sandbox",
        "read-only",
        "--output-schema",
        "/tmp/schema.json",
      ],
      cwd: "/tmp/worktree",
      prompt: "Read sources",
      timeoutMs: 1000,
    });
    expect(spawn).toHaveBeenCalledWith(
      "codex",
      [
        "exec",
        "--sandbox",
        "read-only",
        "--output-schema",
        "/tmp/schema.json",
        "--model",
        "gpt-6-sol",
        "--cd",
        "/tmp/worktree",
        "-",
      ],
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
    const pending = runCodexProcess({
      args: ["exec"],
      cwd: "/tmp",
      prompt: "Test",
      timeoutMs: 1000,
    });
    child.stderr.emit("data", "Model is not supported");
    child.emit("close", 1);
    await expect(pending).rejects.toThrow(
      "Codex exited with 1: Model is not supported",
    );
  });
});
