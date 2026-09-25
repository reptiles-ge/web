import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import {
  type EditorRequest,
  type EditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";

const exec = promisify(execFile);
const root = process.cwd();

export async function createEditorPullRequest(
  input: EditorRequest,
  result: EditorResult,
  operationId: string,
) {
  const base = await run("gh", [
    "repo",
    "view",
    "--json",
    "defaultBranchRef",
    "--jq",
    ".defaultBranchRef.name",
  ]);
  if (!/^[a-zA-Z0-9._/-]+$/.test(base))
    throw new Error("Invalid target branch");
  const repository = await run("gh", [
    "repo",
    "view",
    "--json",
    "nameWithOwner",
    "--jq",
    ".nameWithOwner",
  ]);
  const branch = `feature/content-editor-${input.id}-${randomUUID().slice(0, 8)}`;
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-editor-git-"),
  );
  const worktree = path.join(temporary, "checkout");
  let pushed = false;
  let pullRequestUrl = "";
  try {
    await run("git", ["fetch", "origin", base]);
    await run("git", [
      "worktree",
      "add",
      "-b",
      branch,
      worktree,
      `origin/${base}`,
    ]);
    const target = await resolveEditorTarget(input, worktree);
    verifyEditorSelection(target.source, input);
    const files = target.files;
    const updated = target.updated(result);
    for (const [index, file] of files.entries()) {
      await fs.writeFile(path.join(worktree, file), updated[index]);
    }
    const changed = (
      await run(
        "git",
        ["status", "--porcelain", "--untracked-files=all"],
        worktree,
      )
    )
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3));
    if (changed.length === 0 || changed.some((file) => !files.includes(file))) {
      throw new Error("Unexpected changed files in editor worktree");
    }
    await fs.symlink(
      path.join(root, "node_modules"),
      path.join(worktree, "node_modules"),
      "dir",
    );
    await run("pnpm", ["run", "pretest"], worktree);
    await run("pnpm", ["run", "typecheck"], worktree);
    if (input.kind === "guide") {
      await run(
        "pnpm",
        ["exec", "vitest", "run", "src/data/guideArticles.test.ts"],
        worktree,
      );
    }
    await run("git", ["diff", "--check", "--", ...files], worktree);
    await run("git", ["add", "--", ...files], worktree);
    const staged = (
      await run("git", ["diff", "--cached", "--name-only"], worktree)
    )
      .split("\n")
      .filter(Boolean);
    if (staged.length === 0 || staged.some((file) => !files.includes(file))) {
      throw new Error("Unexpected staged files");
    }
    await run(
      "git",
      ["commit", "-m", `content: edit ${input.id} ${input.field}`],
      worktree,
    );
    await run("git", ["push", "-u", "origin", branch], worktree);
    pushed = true;
    const body = path.join(temporary, "pr-body.md");
    await fs.writeFile(
      body,
      `## Summary\n\n- Edit ${input.field} for ${input.id} in KA, EN, RU and TR through the local selection editor\n\n## Validation\n\n- pnpm run pretest\n- pnpm run typecheck\n`,
    );
    try {
      pullRequestUrl = await run(
        "gh",
        [
          "pr",
          "create",
          "--repo",
          repository,
          "--base",
          base,
          "--head",
          branch,
          "--title",
          `Edit ${input.id} ${input.field} in four locales`,
          "--body-file",
          body,
        ],
        worktree,
      );
    } catch {
      pullRequestUrl = await run(
        "gh",
        [
          "pr",
          "view",
          branch,
          "--repo",
          repository,
          "--json",
          "url",
          "--jq",
          ".url",
        ],
        worktree,
      ).catch(() => "");
    }
    if (!/^https:\/\/github\.com\/[^\s]+\/pull\/\d+$/.test(pullRequestUrl))
      throw new Error("Pull request creation failed");
    console.info(
      "content-editor",
      JSON.stringify({
        branch,
        files,
        operationId,
        pullRequestUrl,
      }),
    );
    return pullRequestUrl;
  } finally {
    await run("git", ["worktree", "remove", "--force", worktree]).catch(
      () => undefined,
    );
    await run("git", ["branch", "-D", branch]).catch(() => undefined);
    if (
      pushed &&
      !/^https:\/\/github\.com\/[^\s]+\/pull\/\d+$/.test(pullRequestUrl)
    ) {
      await run("git", ["push", "origin", "--delete", branch]).catch(
        () => undefined,
      );
    }
    await fs.rm(temporary, { force: true, recursive: true });
  }
}

async function run(command: string, args: string[], cwd = root) {
  const { stdout } = await exec(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 1024 * 1024,
    timeout: 180000,
  });
  return stdout.trimEnd();
}
