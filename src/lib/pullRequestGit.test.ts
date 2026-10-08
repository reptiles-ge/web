import { describe, expect, it, vi } from "vitest";

import {
  cleanupPullRequestWorktree,
  createOrFindPullRequest,
  isPullRequestUrl,
} from "@/lib/pullRequestGit";

const input = {
  base: "main",
  body: "body.md",
  branch: "feature/x",
  repository: "owner/repo",
  title: "Title",
  worktree: "/tmp/wt",
};

describe("isPullRequestUrl", () => {
  it("accepts a GitHub pull request URL", () => {
    expect(isPullRequestUrl("https://github.com/owner/repo/pull/12")).toBe(
      true,
    );
  });

  it.each([
    "",
    "https://github.com/owner/repo/pull/",
    "https://github.com/owner/repo/issues/12",
    "https://example.com/owner/repo/pull/12",
    "https://github.com/owner/repo/pull/12\nextra",
    "https://github.com/owner/repo/pull/12 ",
  ])("rejects %j", (url) => {
    expect(isPullRequestUrl(url)).toBe(false);
  });
});

describe("cleanupPullRequestWorktree", () => {
  it("removes the worktree and the local branch", async () => {
    const run = vi.fn().mockResolvedValue("");
    await cleanupPullRequestWorktree(run, {
      branch: "feature/x",
      deleteRemoteBranch: false,
      worktree: "/tmp/wt",
    });
    expect(run.mock.calls.map(([, args]) => args)).toEqual([
      ["worktree", "remove", "--force", "/tmp/wt"],
      ["branch", "-D", "feature/x"],
    ]);
  });

  it("also deletes the remote branch when asked", async () => {
    const run = vi.fn().mockResolvedValue("");
    await cleanupPullRequestWorktree(run, {
      branch: "feature/x",
      deleteRemoteBranch: true,
      worktree: "/tmp/wt",
    });
    expect(run).toHaveBeenLastCalledWith("git", [
      "push",
      "origin",
      "--delete",
      "feature/x",
    ]);
  });

  it("keeps going when a step fails", async () => {
    const run = vi.fn().mockRejectedValue(new Error("gone"));
    await expect(
      cleanupPullRequestWorktree(run, {
        branch: "feature/x",
        deleteRemoteBranch: true,
        worktree: "/tmp/wt",
      }),
    ).resolves.toBeUndefined();
    expect(run).toHaveBeenCalledTimes(3);
  });
});

describe("createOrFindPullRequest", () => {
  it("returns the URL printed by gh pr create", async () => {
    const run = vi.fn().mockResolvedValue("https://github.com/o/r/pull/1");
    await expect(createOrFindPullRequest(run, input)).resolves.toBe(
      "https://github.com/o/r/pull/1",
    );
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][2]).toBe("/tmp/wt");
  });

  it("falls back to the existing pull request", async () => {
    const run = vi
      .fn()
      .mockRejectedValueOnce(new Error("already exists"))
      .mockResolvedValueOnce("https://github.com/o/r/pull/2");
    await expect(createOrFindPullRequest(run, input)).resolves.toBe(
      "https://github.com/o/r/pull/2",
    );
    expect(run.mock.calls[1][1]).toEqual(
      expect.arrayContaining(["pr", "view", "feature/x"]),
    );
  });

  it("rethrows the create error when no pull request exists", async () => {
    const run = vi
      .fn()
      .mockRejectedValueOnce(new Error("create failed"))
      .mockRejectedValueOnce(new Error("view failed"));
    await expect(createOrFindPullRequest(run, input)).rejects.toThrow(
      "create failed",
    );
  });
});
