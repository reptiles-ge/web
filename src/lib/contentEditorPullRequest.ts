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
import {
  cleanupPullRequestWorktree,
  createOrFindPullRequest,
  isPullRequestUrl,
} from "@/lib/pullRequestGit";

const exec = promisify(execFile);
const root = process.cwd();
const queues = new Map<string, Promise<unknown>>();

type Edit = {
  field: string;
  id: string;
  kind: EditorRequest["kind"];
  result: EditorResult;
  selection?: EditorRequest;
  source?: string;
};

export async function createEditorPullRequest(
  input: EditorRequest,
  result: EditorResult,
  operationId: string,
) {
  return enqueue([{ ...input, result, selection: input }], operationId);
}

async function createPullRequest(edits: Edit[], operationId: string) {
  const input = edits[0];
  const { base, repository } = await pullRequestTarget();
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
    const allowedFiles = new Set<string>();
    for (const edit of edits) {
      const target = await resolveEditorTarget(edit, worktree);
      if (edit.selection) verifyEditorSelection(target.source, edit.selection);
      else if (target.source !== edit.source)
        throw new Error(`Content changed for ${edit.field}; reload and retry`);
      const updated = target.updated(edit.result);
      for (const [index, file] of target.files.entries()) {
        allowedFiles.add(file);
        await fs.writeFile(path.join(worktree, file), updated[index]);
      }
    }
    const files = [...allowedFiles];
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
    if (changed.some((file) => !allowedFiles.has(file))) {
      throw new Error("Unexpected changed files in editor worktree");
    }
    if (!changed.length)
      throw new Error("No content changes to create a pull request");
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
    if (staged.length === 0 || staged.some((file) => !allowedFiles.has(file))) {
      throw new Error("Unexpected staged files");
    }
    await run(
      "git",
      [
        "commit",
        "-m",
        `content: edit ${input.id} ${edits.length > 1 ? "page texts" : input.field}`,
      ],
      worktree,
    );
    await run("git", ["push", "-u", "origin", branch], worktree);
    pushed = true;
    const body = path.join(temporary, "pr-body.md");
    await fs.writeFile(
      body,
      `## Summary\n\n- Edit ${edits.map((edit) => edit.field).join(", ")} for ${input.id} in KA, EN, RU and TR through the local content editor\n\n## Checks\n\n- pnpm run pretest\n- pnpm run typecheck\n`,
    );
    pullRequestUrl = await createOrFindPullRequest(run, {
      base,
      body,
      branch,
      repository,
      title: `Edit ${input.id} ${edits.length > 1 ? "page texts" : input.field} in four locales`,
      worktree,
    });
    if (!isPullRequestUrl(pullRequestUrl))
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
    await cleanupPullRequestWorktree(run, {
      branch,
      deleteRemoteBranch: pushed && !isPullRequestUrl(pullRequestUrl),
      worktree,
    });
    await fs.rm(temporary, { force: true, recursive: true });
  }
}

async function enqueue(edits: Edit[], operationId: string) {
  const { id, kind } = edits[0];
  const key = `${kind}:${id}`;
  const previous = queues.get(key) ?? Promise.resolve();
  const current = previous
    .catch(() => undefined)
    .then(() => createPullRequest(edits, operationId));
  queues.set(key, current);
  try {
    return await current;
  } finally {
    if (queues.get(key) === current) queues.delete(key);
  }
}

async function pullRequestTarget() {
  const info = JSON.parse(
    await run("gh", [
      "repo",
      "view",
      "--json",
      "defaultBranchRef,nameWithOwner",
    ]),
  ) as { defaultBranchRef: { name: string }; nameWithOwner: string };
  const base = info.defaultBranchRef.name;
  if (!/^[a-zA-Z0-9._/-]+$/.test(base))
    throw new Error("Invalid target branch");
  return { base, repository: info.nameWithOwner };
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
