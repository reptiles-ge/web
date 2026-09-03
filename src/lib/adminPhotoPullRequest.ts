import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { GalleryImage } from "@/data/speciesTypes";

import {
  appendGalleryItemToSpecies,
  isSpeciesContentId,
} from "@/lib/adminGalleryMdx";
import {
  applyOptimizeCatalog,
  type OptimizeCatalogUpdate,
} from "@/lib/imageOptimize";

const REPO_ROOT = process.cwd();
const BASE_REF = "origin/main";
const BASE_BRANCH = "main";

export async function openPhotoPullRequest(input: {
  catalog?: OptimizeCatalogUpdate[];
  id: string;
  items: Array<{
    ka: GalleryImage;
    overlays?: Partial<Record<"en" | "ru" | "tr", GalleryImage>>;
  }>;
}): Promise<string> {
  if (!isSpeciesContentId(input.id)) {
    throw new Error("Invalid species id");
  }
  if (input.items.length === 0) {
    throw new Error("No gallery changes to open a pull request for");
  }

  const rel = speciesMdxRel(input.id);
  const existing = findOpenPhotoPullRequest(input.id);
  const branch = existing?.branch ?? `photos/${input.id}-${stamp()}`;
  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "reptiles-photos-"));
  let addedWorktree = false;
  let pushed = false;

  try {
    try {
      run("git", ["fetch", "origin", BASE_BRANCH], REPO_ROOT);
    } catch {
      run("git", ["rev-parse", "--verify", BASE_REF], REPO_ROOT);
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
        ["worktree", "add", "-b", branch, worktree, BASE_REF],
        REPO_ROOT,
      );
    }
    addedWorktree = true;

    for (const item of input.items) {
      appendGalleryItemToSpecies(
        input.id,
        item.ka,
        item.overlays ?? {},
        worktree,
      );
    }
    const catalog = input.catalog ?? [];
    await applyOptimizeCatalog(worktree, catalog);
    const catalogFiles =
      catalog.length > 0
        ? [
            "src/data/image-manifest.json",
            ...(catalog.some((item) => item.asset)
              ? ["src/data/optimizedImages.generated.ts"]
              : []),
          ]
        : [];
    const mdxFiles = rel.filter((file) =>
      fs.existsSync(path.join(worktree, file)),
    );
    run("git", ["add", "--", ...mdxFiles, ...catalogFiles], worktree);

    if (!hasStagedChanges(worktree)) {
      throw new Error("No gallery changes to open a pull request for");
    }

    const noun = input.items.length === 1 ? "photo" : "photos";
    const title = `Add gallery ${noun} for ${input.id}`;
    const commitBody =
      "Uploaded from the local admin. Originals and AVIF/WebP derivatives are already on the CDN.";
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
      "- Originals and AVIF/WebP derivatives (400/800/1200/max) are on `cdn.reptiles.ge`",
      "- `image-manifest.json` and `optimizedImages.generated.ts` updated so the gallery uses `<picture>` sources",
      "",
      "## Test plan",
      "- [ ] Species profile gallery shows the new photo(s) in every locale",
      "- [ ] Network panel loads `.avif` (or `.webp`) derivatives, not only the JPEG original",
    ].join("\n");

    const repo = githubRepoName(worktree);
    if (existing) {
      try {
        run("gh", ["pr", "edit", existing.url, "--body", prBody], worktree);
      } catch {
        return existing.url;
      }
      return existing.url;
    }

    let lastError = "Could not open pull request";
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        return createPullRequest({
          body: prBody,
          branch,
          cwd: worktree,
          repo,
          title,
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

function createPullRequest(input: {
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
  try {
    run("gh", ["pr", "edit", url, "--body", input.body], input.cwd);
  } catch {
    return url;
  }
  return url;
}

function findOpenPhotoPullRequest(
  id: string,
): null | { branch: string; url: string } {
  try {
    const raw = run(
      "gh",
      [
        "pr",
        "list",
        "--base",
        BASE_BRANCH,
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
    const prefix = `photos/${id}-`;
    const match = prs.find(
      (pr) =>
        typeof pr.headRefName === "string" &&
        pr.headRefName.startsWith(prefix) &&
        typeof pr.url === "string" &&
        pr.url.startsWith("http"),
    );
    if (!match?.headRefName || !match.url) return null;
    return { branch: match.headRefName, url: match.url };
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

function speciesMdxRel(id: string) {
  return ["ka.mdx", "en.mdx", "ru.mdx", "tr.mdx"].map((file) =>
    path.join("src/content/species", id, file),
  );
}

function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}
