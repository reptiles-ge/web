import { rmSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const execFileSync = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({ execFileSync }));
vi.mock("@/lib/imageOptimize", () => ({ applyOptimizeCatalog: vi.fn() }));

import type { OptimizeCatalogUpdate } from "@/lib/imageOptimize";

import { openStandalonePhotoPullRequest } from "@/lib/adminPhotoPullRequest";

describe("standalone photo PRs", () => {
  beforeEach(() => {
    execFileSync.mockReset();
  });

  it("refuses an empty catalog", async () => {
    await expect(openStandalonePhotoPullRequest([])).rejects.toThrow(
      "No optimized photos to catalog",
    );
  });

  it("creates a standalone photo branch from the current branch", async () => {
    execFileSync.mockImplementation((command: string, args: string[]) => {
      if (command === "gh" && args[0] === "pr" && args[1] === "list") {
        return "[]";
      }
      if (command === "gh" && args[0] === "repo") {
        return '{"nameWithOwner":"reptiles-ge/web"}';
      }
      if (command === "gh" && args[0] === "pr" && args[1] === "create") {
        return "https://github.com/reptiles-ge/web/pull/999";
      }
      if (args[0] === "branch" && args[1] === "--show-current") {
        return "feature/bed-bug-atlas\n";
      }
      if (args[0] === "diff") throw new Error("staged changes");
      if (args[0] === "remote") {
        return "https://github.com/reptiles-ge/web.git\n";
      }
      if (args[0] === "worktree" && args[1] === "remove") {
        rmSync(args.at(-1) as string, { force: true, recursive: true });
      }
      return "";
    });

    const catalog = [{ key: "external/photo.jpg" }] as OptimizeCatalogUpdate[];
    const url = await openStandalonePhotoPullRequest(catalog);

    expect(url).toBe("https://github.com/reptiles-ge/web/pull/999");
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["push", "-u", "origin", "HEAD:refs/heads/feature/bed-bug-atlas"],
      expect.any(Object),
    );
    expect(
      execFileSync.mock.calls.some(
        ([command, args]) =>
          command === "git" &&
          args[0] === "worktree" &&
          args[1] === "add" &&
          args.at(-1) === "HEAD",
      ),
    ).toBe(true);
    expect(
      execFileSync.mock.calls.some(
        ([command, args]) =>
          command === "gh" &&
          args[0] === "pr" &&
          args[1] === "create" &&
          args[args.indexOf("--base") + 1] === "feature/bed-bug-atlas",
      ),
    ).toBe(true);
  });
});
