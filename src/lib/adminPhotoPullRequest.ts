import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";

const REPO_ROOT = process.cwd();
const BASE_REF = "origin/main";
const BASE_BRANCH = "main";

function run(cmd: string, args: string[], cwd: string) {
  try {
    return execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    }).trim();
  } catch (error) {
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const detail = [err.stderr, err.stdout, err.message]
      .filter((part) => Boolean(part && part.trim()))
      .join("\n")
      .trim();
    throw new Error(detail || `${cmd} ${args.join(" ")} failed`);
  }
}

function speciesMdxRel(id: string) {
  return {
    ka: path.join("src/content/species", id, "ka.mdx"),
    en: path.join("src/content/species", id, "en.mdx"),
  };
}

function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}

function hasStagedChanges(cwd: string) {
  try {
    execFileSync("git", ["diff", "--cached", "--quiet"], {
      cwd,
      stdio: "ignore",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    return false;
  } catch {
    return true;
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

function createPullRequest(input: {
  cwd: string;
  repo: string;
  branch: string;
  title: string;
  body: string;
}) {
  const created = run(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      input.repo,
      "--base",
      BASE_BRANCH,
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
  return url;
}

export function openPhotoPullRequest(input: {
  id: string;
  photoCount: number;
}): string {
  if (!isSpeciesContentId(input.id)) {
    throw new Error("Invalid species id");
  }

  const rel = speciesMdxRel(input.id);
  const kaSrc = path.join(REPO_ROOT, rel.ka);
  const enSrc = path.join(REPO_ROOT, rel.en);
  if (!fs.existsSync(kaSrc) || !fs.existsSync(enSrc)) {
    throw new Error(`Missing MDX for ${input.id}`);
  }

  const kaBytes = fs.readFileSync(kaSrc);
  const enBytes = fs.readFileSync(enSrc);
  const branch = `photos/${input.id}-${stamp()}`;
  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "reptiles-photos-"));
  let addedWorktree = false;
  let pushed = false;

  try {
    try {
      run("git", ["fetch", "origin", BASE_BRANCH], REPO_ROOT);
    } catch {
      run("git", ["rev-parse", "--verify", BASE_REF], REPO_ROOT);
    }

    run(
      "git",
      ["worktree", "add", "-b", branch, worktree, BASE_REF],
      REPO_ROOT,
    );
    addedWorktree = true;

    fs.writeFileSync(path.join(worktree, rel.ka), kaBytes);
    fs.writeFileSync(path.join(worktree, rel.en), enBytes);
    run("git", ["add", "--", rel.ka, rel.en], worktree);

    if (!hasStagedChanges(worktree)) {
      throw new Error("No gallery changes to open a pull request for");
    }

    const noun = input.photoCount === 1 ? "photo" : "photos";
    const title = `Add gallery ${noun} for ${input.id}`;
    const commitBody =
      "Uploaded from the local admin. Originals are already on the CDN.";
    run("git", ["commit", "-m", title, "-m", commitBody], worktree);
    run(
      "git",
      ["push", "-u", "origin", `refs/heads/${branch}:refs/heads/${branch}`],
      worktree,
    );
    pushed = true;

    const prBody = [
      "## Summary",
      `- Gallery ${noun} for \`${input.id}\` from local admin`,
      "- Originals are on `cdn.reptiles.ge`",
      "",
      "## Test plan",
      "- [ ] KA and EN profile galleries show the new photo(s)",
    ].join("\n");

    const repo = githubRepoName(worktree);
    let lastError = "Could not open pull request";
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        return createPullRequest({
          cwd: worktree,
          repo,
          branch,
          title,
          body: prBody,
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
        fs.rmSync(worktree, { recursive: true, force: true });
        try {
          run("git", ["worktree", "prune"], REPO_ROOT);
        } catch {
          fs.rmSync(worktree, { recursive: true, force: true });
        }
      }
    } else {
      fs.rmSync(worktree, { recursive: true, force: true });
    }
    if (pushed) {
      try {
        run("git", ["branch", "-D", branch], REPO_ROOT);
      } catch {
        fs.rmSync(worktree, { recursive: true, force: true });
      }
    }
  }
}
