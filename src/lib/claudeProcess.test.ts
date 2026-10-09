import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AgentTask } from "@/lib/aiAgent";

import { claudeArgs, claudeTools, runClaudeProcess } from "@/lib/claudeProcess";

vi.mock("node:child_process", () => ({ spawn: vi.fn() }));

const settings = { effort: "high", model: "claude-opus-5-5" };
let directory: string;
let task: AgentTask;

function mockChild() {
  const stream = () =>
    Object.assign(new EventEmitter(), { setEncoding: vi.fn() });
  const child = Object.assign(new EventEmitter(), {
    kill: vi.fn(),
    stderr: stream(),
    stdin: { end: vi.fn() },
    stdout: stream(),
  });
  vi.mocked(spawn).mockReturnValue(
    child as unknown as ReturnType<typeof spawn>,
  );
  return child;
}

async function settle(
  child: ReturnType<typeof mockChild>,
  result: object,
  code = 0,
) {
  await vi.waitFor(() => expect(spawn).toHaveBeenCalled());
  child.stdout.emit("data", JSON.stringify(result));
  child.emit("close", code);
}

beforeEach(async () => {
  vi.clearAllMocks();
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "claude-process-"));
  const schema = path.join(directory, "schema.json");
  await fs.writeFile(schema, '{"type":"object"}');
  task = {
    access: "read-only",
    cwd: "/tmp/worktree",
    output: path.join(directory, "out.json"),
    profile: "super:analysis",
    prompt: "Read sources",
    readDirectories: [directory],
    schema,
    timeoutMs: 1000,
    webSearch: true,
  };
});

afterEach(async () => {
  await fs.rm(directory, { force: true, recursive: true });
});

describe("Claude tool access", () => {
  it("reads only, adding web tools when the stage researches", () => {
    expect(claudeTools(task)).toEqual([
      "Read",
      "Glob",
      "Grep",
      "WebSearch",
      "WebFetch",
    ]);
    expect(claudeTools({ ...task, webSearch: false })).toEqual([
      "Read",
      "Glob",
      "Grep",
    ]);
  });

  it("allows edits, shell and network only for workspace-write tasks", () => {
    expect(claudeTools({ ...task, access: "workspace-write" })).toEqual([
      "Read",
      "Glob",
      "Grep",
      "Edit",
      "Write",
      "Bash",
      "WebSearch",
      "WebFetch",
    ]);
  });

  it("runs headless with model, effort, schema and no user plugins", async () => {
    const args = await claudeArgs(task, settings);
    expect(args.slice(0, 7)).toEqual([
      "-p",
      "--output-format",
      "json",
      "--model",
      "claude-opus-5-5",
      "--effort",
      "high",
    ]);
    for (const flag of [
      "--no-session-persistence",
      "--strict-mcp-config",
      "--disable-slash-commands",
    ])
      expect(args).toContain(flag);
    expect(args[args.indexOf("--setting-sources") + 1]).toBe("project");
    expect(args[args.indexOf("--permission-mode") + 1]).toBe("dontAsk");
    expect(args[args.indexOf("--tools") + 1]).toBe(
      "Read,Glob,Grep,WebSearch,WebFetch",
    );
    expect(args[args.indexOf("--add-dir") + 1]).toBe(directory);
    expect(args[args.indexOf("--json-schema") + 1]).toBe('{"type":"object"}');
  });
});

describe("Claude subprocess", () => {
  it("writes structured output and reports cost", async () => {
    const child = mockChild();
    const pending = runClaudeProcess(task, settings);
    await settle(child, {
      duration_ms: 120_000,
      is_error: false,
      num_turns: 7,
      structured_output: { stage: "analysis" },
      subtype: "success",
      total_cost_usd: 1.25,
    });
    await expect(pending).resolves.toEqual({
      costUsd: 1.25,
      durationMs: 120_000,
      turns: 7,
    });
    expect(child.stdin.end).toHaveBeenCalledWith("Read sources");
    expect(await fs.readFile(task.output, "utf8")).toBe('{"stage":"analysis"}');
    expect(spawn).toHaveBeenCalledWith(
      "claude",
      expect.any(Array),
      expect.objectContaining({
        cwd: "/tmp/worktree",
        env: expect.not.objectContaining({ CLAUDECODE: expect.anything() }),
      }),
    );
  });

  it("writes the final text report when no schema is requested", async () => {
    const child = mockChild();
    const pending = runClaudeProcess(
      { ...task, access: "workspace-write", schema: undefined },
      settings,
    );
    await settle(child, { result: "ანგარიში", subtype: "success" });
    await pending;
    expect(await fs.readFile(task.output, "utf8")).toBe("ანგარიში");
  });

  it("surfaces usage-limit and other error results", async () => {
    const child = mockChild();
    const pending = runClaudeProcess(task, settings);
    await settle(
      child,
      {
        is_error: true,
        result: "You're out of extra usage",
        subtype: "success",
      },
      1,
    );
    await expect(pending).rejects.toThrow("You're out of extra usage");
    await expect(fs.access(task.output)).rejects.toThrow();
  });

  it("rejects a non-zero exit without a result", async () => {
    const child = mockChild();
    const pending = runClaudeProcess(task, settings);
    await vi.waitFor(() => expect(spawn).toHaveBeenCalled());
    child.stderr.emit("data", "command not found");
    child.emit("close", 127);
    await expect(pending).rejects.toThrow(
      "Claude exited with 127: command not found",
    );
  });
});
