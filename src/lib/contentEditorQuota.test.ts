import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { PassThrough, Writable } from "node:stream";
import { describe, expect, it, vi } from "vitest";

import {
  assertCodexQuota,
  CodexQuotaError,
  isCodexLimitError,
  parseCodexQuota,
} from "@/lib/contentEditorQuota";

vi.mock("node:child_process", () => ({ spawn: vi.fn() }));

describe("Codex editor quota", () => {
  it("blocks when either Codex window is exhausted", () => {
    expect(
      parseCodexQuota({
        rateLimitsByLimitId: {
          codex: {
            primary: { resetsAt: 100, usedPercent: 45 },
            secondary: { resetsAt: 200, usedPercent: 100 },
          },
        },
      }),
    ).toEqual({ exhausted: true, remainingPercent: 0, resetsAt: 200 });
    expect(
      parseCodexQuota({
        rateLimits: { primary: { resetsAt: 100, usedPercent: 45 } },
      }),
    ).toEqual({ exhausted: false, remainingPercent: 55, resetsAt: 100 });
  });

  it("recognizes a Codex limit failure without treating other failures as a limit", () => {
    expect(isCodexLimitError(new Error("Rate limit exceeded"))).toBe(true);
    expect(isCodexLimitError(new CodexQuotaError())).toBe(true);
    expect(isCodexLimitError(new Error("Invalid JSON output"))).toBe(false);
  });

  it("rejects later edits until the quota recovers and reports the change in color", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const infos = vi.spyOn(console, "info").mockImplementation(() => {});
    let usedPercent = 100;
    vi.mocked(spawn).mockImplementation(() => {
      const stdout = new PassThrough();
      const stdin = new Writable({
        write(chunk, _encoding, done) {
          const request = JSON.parse(String(chunk)) as { id?: number };
          if (request.id === 1)
            queueMicrotask(() => stdout.write('{"id":1,"result":{}}\n'));
          if (request.id === 2)
            queueMicrotask(() =>
              stdout.write(
                `${JSON.stringify({ id: 2, result: { rateLimits: { primary: { usedPercent } } } })}\n`,
              ),
            );
          done();
        },
      });
      return Object.assign(new EventEmitter(), {
        kill: () => true,
        stdin,
        stdout,
      }) as never;
    });
    try {
      await expect(assertCodexQuota("first")).rejects.toBeInstanceOf(
        CodexQuotaError,
      );
      usedPercent = 50;
      await expect(assertCodexQuota("second")).rejects.toBeInstanceOf(
        CodexQuotaError,
      );
      expect(spawn).toHaveBeenCalledTimes(1);
      expect(
        errors.mock.calls.some(([line]) => String(line).includes("\u001b[31m")),
      ).toBe(true);
      await vi.advanceTimersByTimeAsync(60_000);
      expect(
        infos.mock.calls.some(([line]) => String(line).includes("\u001b[32m")),
      ).toBe(true);
      await expect(assertCodexQuota("third")).resolves.toBeUndefined();
    } finally {
      vi.useRealTimers();
      errors.mockRestore();
      infos.mockRestore();
    }
  });
});
