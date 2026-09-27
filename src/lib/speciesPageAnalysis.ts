import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { findSpeciesPullRequest } from "@/lib/contentEditorPullRequest";

const exec = promisify(execFile);
const root = process.cwd();
const running = new Set<string>();
export type SpeciesAnalysisMode = "analysis" | "links" | "lookalikes";

const modeConfig = {
  analysis: {
    commit: "analyze",
    prompt: "species-page-analysis.md",
    title: "Analyze species page for",
  },
  links: {
    commit: "link",
    prompt: "species-internal-links.md",
    title: "Improve internal links on",
  },
  lookalikes: {
    commit: "review lookalikes for",
    prompt: "species-lookalikes.md",
    title: "Review lookalikes for",
  },
} satisfies Record<
  SpeciesAnalysisMode,
  { commit: string; prompt: string; title: string }
>;

export async function analyzeSpeciesPage(
  id: string,
  onReport: (report: string) => void,
  mode: SpeciesAnalysisMode = "analysis",
) {
  if (running.has(id)) throw new Error("Analysis is already running");
  running.add(id);
  try {
    return await runAnalysis(id, onReport, mode);
  } finally {
    running.delete(id);
  }
}

export function assertSpeciesAnalysisFiles(
  files: string[],
  id: string,
  mode: SpeciesAnalysisMode = "analysis",
) {
  const prefix = `src/content/species/${id}/`;
  if (
    files.some(
      (file) =>
        !(
          (file.startsWith(prefix) &&
            /^(ka|en|ru|tr)\.mdx$/.test(file.slice(prefix.length))) ||
          (mode === "lookalikes" &&
            [
              "src/lib/speciesRoutes.test.ts",
              "src/lib/speciesRoutes.ts",
            ].includes(file))
        ),
    )
  ) {
    throw new Error("Codex changed files outside this task's scope");
  }
}

async function changedFiles(worktree: string) {
  return (
    await run(
      "git",
      ["status", "--porcelain", "--untracked-files=all"],
      worktree,
    )
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3));
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

async function runAnalysis(
  id: string,
  onReport: (report: string) => void,
  mode: SpeciesAnalysisMode,
) {
  const repositoryInfo = JSON.parse(
    await run("gh", [
      "repo",
      "view",
      "--json",
      "defaultBranchRef,nameWithOwner",
    ]),
  ) as { defaultBranchRef: { name: string }; nameWithOwner: string };
  const base = repositoryInfo.defaultBranchRef.name;
  const repository = repositoryInfo.nameWithOwner;
  if (!/^[a-zA-Z0-9._/-]+$/.test(base))
    throw new Error("Invalid target branch");
  const pullRequests = JSON.parse(
    await run("gh", [
      "pr",
      "list",
      "--repo",
      repository,
      "--state",
      "open",
      "--base",
      base,
      "--limit",
      "1000",
      "--json",
      "baseRefName,files,headRefName,isCrossRepository,url",
    ]),
  ) as Parameters<typeof findSpeciesPullRequest>[0];
  const taskPullRequests = pullRequests.filter(
    (pullRequest) =>
      pullRequest.baseRefName === base &&
      pullRequest.headRefName.startsWith(`feature/species-${mode}-${id}-`),
  );
  if (taskPullRequests.length > 1)
    throw new Error("Multiple open pull requests exist for this task");
  if (taskPullRequests[0]?.isCrossRepository)
    throw new Error("The existing pull request is from a fork");
  const existing =
    taskPullRequests[0] ??
    (mode === "analysis"
      ? findSpeciesPullRequest(
          pullRequests.filter(
            (pullRequest) =>
              !/^(feature\/species-(links|lookalikes)-)/.test(
                pullRequest.headRefName,
              ),
          ),
          id,
          base,
        )
      : null);
  const branch = `feature/species-${mode}-${id}-${randomUUID().slice(0, 8)}`;
  const remoteBranch = existing?.headRefName ?? branch;
  const targetPaths = [
    `src/content/species/${id}`,
    ...(mode === "lookalikes"
      ? ["src/lib/speciesRoutes.ts", "src/lib/speciesRoutes.test.ts"]
      : []),
  ];
  if (await run("git", ["status", "--porcelain", "--", ...targetPaths])) {
    throw new Error("The species has local changes; save them before analysis");
  }
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "reptiles-species-analysis-"),
  );
  const worktree = path.join(directory, "checkout");
  let pushed = false;
  let pullRequestUrl = existing?.url ?? "";
  try {
    await run("git", [
      "fetch",
      "origin",
      base,
      ...(existing ? [remoteBranch] : []),
    ]);
    await run("git", [
      "worktree",
      "add",
      "-b",
      branch,
      worktree,
      `origin/${existing ? remoteBranch : base}`,
    ]);
    if (!existing) {
      const sourceFiles = [
        ...["ka", "en", "ru", "tr"].map(
          (locale) => `src/content/species/${id}/${locale}.mdx`,
        ),
        ...(mode === "lookalikes"
          ? ["src/lib/speciesRoutes.ts", "src/lib/speciesRoutes.test.ts"]
          : []),
      ];
      const differences = await Promise.all(
        sourceFiles.map(async (file) => {
          const [local, remote] = await Promise.all([
            fs.readFile(path.join(root, file), "utf8").catch(() => ""),
            fs.readFile(path.join(worktree, file), "utf8").catch(() => ""),
          ]);
          return local !== remote;
        }),
      );
      if (differences.some(Boolean))
        throw new Error(
          "Species content differs from the PR base; update the local page first",
        );
    }
    await fs.symlink(
      path.join(root, "node_modules"),
      path.join(worktree, "node_modules"),
      "dir",
    );
    const promptTemplate = await fs.readFile(
      path.join(root, "src/prompts", modeConfig[mode].prompt),
      "utf8",
    );
    const prompt = promptTemplate.replace(
      /^სამიზნე გვერდი \/ სახეობა:.*$/m,
      `სამიზნე გვერდი / სახეობა: src/content/species/${id}/ka.mdx (species ID: ${id})`,
    );
    const output = path.join(directory, "report.md");
    await runCodex(
      worktree,
      output,
      `${prompt}\n\nამ გაშვებაში არ შეასრულო commit, push ან PR-ის შექმნა; ამას აპლიკაცია შემოწმების შემდეგ გააკეთებს. საბოლოო ანგარიში დააბრუნე ჩატში ქართულად.`,
    );
    const report = (await fs.readFile(output, "utf8")).trim();
    if (!report) throw new Error("Codex returned an empty report");
    onReport(report);

    const files = await changedFiles(worktree);
    assertSpeciesAnalysisFiles(files, id, mode);
    if (files.length === 0)
      return { pullRequestUrl: existing?.url ?? null, report };

    await run("pnpm", ["run", "pretest"], worktree);
    await run("pnpm", ["run", "typecheck"], worktree);
    if (mode === "lookalikes")
      await run(
        "pnpm",
        ["exec", "vitest", "run", "src/lib/speciesRoutes.test.ts"],
        worktree,
      );
    const verifiedFiles = await changedFiles(worktree);
    assertSpeciesAnalysisFiles(verifiedFiles, id, mode);
    if (verifiedFiles.sort().join("\0") !== files.sort().join("\0"))
      throw new Error("Validation changed the working tree");
    await run("git", ["diff", "--check", "--", ...files], worktree);
    await run("git", ["add", "--", ...files], worktree);
    await run(
      "git",
      ["commit", "-m", `content: ${modeConfig[mode].commit} ${id}`],
      worktree,
    );
    await run(
      "git",
      existing
        ? ["push", "origin", `HEAD:refs/heads/${remoteBranch}`]
        : ["push", "-u", "origin", branch],
      worktree,
    );
    pushed = true;
    if (!existing) {
      const body = path.join(directory, "pr-body.md");
      await fs.writeFile(
        body,
        `## Summary\n\n- ${modeConfig[mode].title} ${id}\n\n## Validation\n\n- pnpm run pretest\n- pnpm run typecheck\n${mode === "lookalikes" ? "- pnpm exec vitest run src/lib/speciesRoutes.test.ts\n" : ""}\n## AI report\n\n${report.slice(0, 55000)}\n`,
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
            mode === "analysis"
              ? `Analyze ${id} species page`
              : `${modeConfig[mode].title} ${id}`,
            "--body-file",
            body,
          ],
          worktree,
        );
      } catch (error) {
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
        ).catch(() => {
          throw error;
        });
      }
    }
    if (!/^https:\/\/github\.com\/[^\s]+\/pull\/\d+$/.test(pullRequestUrl))
      throw new Error("Pull request creation failed");
    return { pullRequestUrl, report };
  } finally {
    await run("git", ["worktree", "remove", "--force", worktree]).catch(
      () => undefined,
    );
    await run("git", ["branch", "-D", branch]).catch(() => undefined);
    if (
      pushed &&
      !existing &&
      !/^https:\/\/github\.com\/[^\s]+\/pull\/\d+$/.test(pullRequestUrl)
    ) {
      await run("git", ["push", "origin", "--delete", branch]).catch(
        () => undefined,
      );
    }
    await fs.rm(directory, { force: true, recursive: true });
  }
}

async function runCodex(worktree: string, output: string, prompt: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      "codex",
      [
        "exec",
        "--ephemeral",
        "--sandbox",
        "workspace-write",
        "--config",
        'model_reasoning_effort="xhigh"',
        "--config",
        "sandbox_workspace_write.network_access=true",
        "--config",
        'approval_policy="never"',
        "--cd",
        worktree,
        "--output-last-message",
        output,
        "-",
      ],
      {
        cwd: worktree,
        env: {
          CODEX_HOME: process.env.CODEX_HOME,
          HOME: process.env.HOME,
          LANG: process.env.LANG,
          NODE_ENV: process.env.NODE_ENV,
          PATH: process.env.PATH,
          TMPDIR: process.env.TMPDIR,
        },
        signal: AbortSignal.timeout(45 * 60 * 1000),
        stdio: ["pipe", "ignore", "pipe"],
      },
    );
    let errorText = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      errorText = (errorText + chunk).slice(-4000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(`Codex exited with ${code}: ${errorText.slice(-500)}`),
        );
    });
    child.stdin.end(prompt);
  });
}
