import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  applyOptimizeCatalog,
  type OptimizeCatalogUpdate,
} from "@/lib/imageOptimize";

const REPO_ROOT = process.cwd();
const BASE_REF = "origin/staging";
const BASE_BRANCH = "staging";
const STANDALONE_ID = "external";

export async function openStandalonePhotoPullRequest(
  catalog: OptimizeCatalogUpdate[],
): Promise<string> {
  if (catalog.length === 0) {
    throw new Error("No optimized photos to catalog");
  }

  return withPhotoPullRequest({
    apply: (worktree) => applyOptimizeCatalog(worktree, catalog),
    commitBody:
      "Standalone originals and AVIF/WebP derivatives are already on the CDN.",
    files: optimizeCatalogFiles(catalog),
    prBody: [
      "## Summary",
      "- Register standalone CDN photos in `image-manifest.json` and `optimizedImages.generated.ts`",
      "- Originals and AVIF/WebP derivatives are already on `cdn.reptiles.ge`",
      "- No species gallery changes",
      "",
      "## Test plan",
      "- [ ] Uploaded URLs resolve on the CDN",
      "- [ ] Optimized image lookup returns AVIF/WebP sources for the originals",
    ].join("\n"),
    title: "Catalog standalone CDN photos",
  });
}

function createPullRequest(input: {
  baseBranch: string;
  body: string;
  branch: string;
  cwd: string;
  repo: string;
  title: string;
}) {
  const created = run(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      input.repo,
      "--base",
      input.baseBranch,
      "--head",
      input.branch,
      "--title",
      input.title,
      "--body",
      input.body,
    ],
    input.cwd,
  );
  const url = created.match(/https:\/\/github\.com\/\S+/)?.[0] ?? created;
  if (!url.startsWith("http")) {
    throw new Error(created || "gh pr create did not return a URL");
  }
  try {
    run("gh", ["pr", "edit", url, "--body", input.body], input.cwd);
  } catch {
    return url;
  }
  return url;
}

function currentBranchName(cwd: string) {
  try {
    return run("git", ["branch", "--show-current"], cwd);
  } catch {
    return "";
  }
}

async function findOpenPhotoPullRequest(
  baseBranch: string,
): Promise<null | { branch: string; url: string }> {
  try {
    const raw = run(
      "gh",
      [
        "pr",
        "list",
        "--base",
        baseBranch,
        "--state",
        "open",
        "--limit",
        "50",
        "--json",
        "headRefName,url",
      ],
      REPO_ROOT,
    );
    const prs = JSON.parse(raw) as Array<{
      headRefName?: string;
      url?: string;
    }>;
    const prefix = `photos/${STANDALONE_ID}-`;
    const match = prs.find(
      (pr) =>
        typeof pr.headRefName === "string" &&
        pr.headRefName.startsWith(prefix) &&
        typeof pr.url === "string" &&
        pr.url.startsWith("http"),
    );
    if (match?.headRefName && match.url) {
      return { branch: match.headRefName, url: match.url };
    }
  } catch {}

  try {
    const remote = run("git", ["remote", "get-url", "origin"], REPO_ROOT);
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) return null;
    const [, owner, repo] = match;
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&base=${encodeURIComponent(baseBranch)}&per_page=100`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const prs = (await response.json()) as Array<{
      head?: { ref?: string };
      html_url?: string;
    }>;
    const matchPr = prs.find((pr) =>
      pr.head?.ref?.startsWith(`photos/${STANDALONE_ID}-`),
    );
    return matchPr?.head?.ref && matchPr.html_url
      ? { branch: matchPr.head.ref, url: matchPr.html_url }
      : null;
  } catch {
    return null;
  }
}

function githubRepoName(cwd: string) {
  const raw = run("gh", ["repo", "view", "--json", "nameWithOwner"], cwd);
  const parsed = JSON.parse(raw) as { nameWithOwner?: string };
  if (!parsed.nameWithOwner) {
    throw new Error("Could not resolve GitHub repository");
  }
  return parsed.nameWithOwner;
}

function hasStagedChanges(cwd: string) {
  try {
    execFileSync("git", ["diff", "--cached", "--quiet"], {
      cwd,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      stdio: "ignore",
    });
    return false;
  } catch {
    return true;
  }
}

function optimizeCatalogFiles(catalog: OptimizeCatalogUpdate[]) {
  if (catalog.length === 0) return [];
  return [
    "src/data/image-manifest.json",
    ...(catalog.some((item) => item.asset)
      ? ["src/data/optimizedImages.generated.ts"]
      : []),
  ];
}

function run(cmd: string, args: string[], cwd: string) {
  try {
    return execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    const err = error as { message?: string; stderr?: string; stdout?: string };
    const detail = [err.stderr, err.stdout, err.message]
      .filter((part) => Boolean(part && part.trim()))
      .join("\n")
      .trim();
    throw new Error(detail || `${cmd} ${args.join(" ")} failed`);
  }
}

function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}

async function withPhotoPullRequest(input: {
  apply: (worktree: string) => Promise<void> | void;
  commitBody: string;
  files: string[];
  prBody: string;
  title: string;
}): Promise<string> {
  const currentBranch = currentBranchName(REPO_ROOT);
  if (!currentBranch) {
    throw new Error("Check out a branch before uploading standalone photos");
  }
  const base =
    currentBranch !== BASE_BRANCH
      ? { branch: currentBranch, ref: "HEAD" }
      : { branch: BASE_BRANCH, ref: BASE_REF };

  if (base.ref === "HEAD") {
    run(
      "git",
      ["push", "-u", "origin", `HEAD:refs/heads/${base.branch}`],
      REPO_ROOT,
    );
  }

  const existing = await findOpenPhotoPullRequest(base.branch);
  const branch = existing?.branch ?? `photos/${STANDALONE_ID}-${stamp()}`;
  const onPhotoBranch =
    Boolean(existing) && currentBranchName(REPO_ROOT) === branch;

  if (onPhotoBranch) {
    try {
      run("git", ["fetch", "origin", branch], REPO_ROOT);
      run("git", ["merge", "--ff-only", `origin/${branch}`], REPO_ROOT);
    } catch {}

    await input.apply(REPO_ROOT);
    run("git", ["add", "--", ...input.files], REPO_ROOT);

    if (!hasStagedChanges(REPO_ROOT)) {
      throw new Error("No gallery changes to open a pull request for");
    }

    run(
      "git",
      ["commit", "-m", input.title, "-m", input.commitBody],
      REPO_ROOT,
    );
    run(
      "git",
      ["push", "-u", "origin", `HEAD:refs/heads/${branch}`],
      REPO_ROOT,
    );

    if (existing) {
      try {
        run(
          "gh",
          ["pr", "edit", existing.url, "--body", input.prBody],
          REPO_ROOT,
        );
      } catch {
        return existing.url;
      }
      return existing.url;
    }

    return createPullRequest({
      baseBranch: base.branch,
      body: input.prBody,
      branch,
      cwd: REPO_ROOT,
      repo: githubRepoName(REPO_ROOT),
      title: input.title,
    });
  }

  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "reptiles-photos-"));
  let addedWorktree = false;
  let pushed = false;

  try {
    try {
      run("git", ["fetch", "origin", base.branch], REPO_ROOT);
    } catch {
      run("git", ["rev-parse", "--verify", base.ref], REPO_ROOT);
    }

    if (existing) {
      run("git", ["fetch", "origin", existing.branch], REPO_ROOT);
      run(
        "git",
        [
          "worktree",
          "add",
          "-B",
          existing.branch,
          worktree,
          `origin/${existing.branch}`,
        ],
        REPO_ROOT,
      );
    } else {
      run(
        "git",
        ["worktree", "add", "-b", branch, worktree, base.ref],
        REPO_ROOT,
      );
    }
    addedWorktree = true;

    await input.apply(worktree);
    run("git", ["add", "--", ...input.files], worktree);

    if (!hasStagedChanges(worktree)) {
      throw new Error("No gallery changes to open a pull request for");
    }

    run("git", ["commit", "-m", input.title, "-m", input.commitBody], worktree);
    run(
      "git",
      ["push", "-u", "origin", `refs/heads/${branch}:refs/heads/${branch}`],
      worktree,
    );
    pushed = true;

    const repo = githubRepoName(worktree);
    if (existing) {
      try {
        run(
          "gh",
          ["pr", "edit", existing.url, "--body", input.prBody],
          worktree,
        );
      } catch {
        return existing.url;
      }
      return existing.url;
    }

    let lastError = "Could not open pull request";
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        return createPullRequest({
          baseBranch: base.branch,
          body: input.prBody,
          branch,
          cwd: worktree,
          repo,
          title: input.title,
        });
      } catch (error) {
        lastError = error instanceof Error ? error.message : lastError;
        if (attempt === 4) break;
        execFileSync("sleep", [String(attempt)], { stdio: "ignore" });
      }
    }
    throw new Error(lastError);
  } finally {
    if (addedWorktree) {
      try {
        run("git", ["worktree", "remove", "--force", worktree], REPO_ROOT);
      } catch {
        fs.rmSync(worktree, { force: true, recursive: true });
        try {
          run("git", ["worktree", "prune"], REPO_ROOT);
        } catch {
          fs.rmSync(worktree, { force: true, recursive: true });
        }
      }
    } else {
      fs.rmSync(worktree, { force: true, recursive: true });
    }
    if (pushed) {
      try {
        run("git", ["branch", "-D", branch], REPO_ROOT);
      } catch {
        fs.rmSync(worktree, { force: true, recursive: true });
      }
    }
  }
}
