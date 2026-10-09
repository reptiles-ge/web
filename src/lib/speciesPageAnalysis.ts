import matter from "gray-matter";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { runCodexProcess } from "@/lib/codexProcess";
import { validateEditorResult } from "@/lib/contentEditor";
import { transformWithCodex } from "@/lib/contentEditorCodex";
import { findSpeciesPullRequest } from "@/lib/contentEditorPullRequest";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import {
  cleanupPullRequestWorktree,
  createOrFindPullRequest,
  isPullRequestUrl,
} from "@/lib/pullRequestGit";
import { lockSpeciesAnalysis } from "@/lib/speciesAnalysisLock";
import { createSuperAnalysisRunner } from "@/lib/speciesSuperAnalysis";
import {
  SUPER_ANALYSIS_STAGES,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";
import { getSpeciesTextFields } from "@/lib/speciesTextProcessing";

const exec = promisify(execFile);
const root = process.cwd();

export type SpeciesAnalysisMode =
  "analysis" | "links" | "lookalikes" | "records";
export type SpeciesWorkflowMode = "texts" | SpeciesAnalysisMode;
const speciesWorkflowModes: SpeciesWorkflowMode[] = [
  "analysis",
  "texts",
  "lookalikes",
  "links",
  "records",
];

export type SpeciesCreationInput = {
  commonName: string;
  id: string;
  scientificName: string;
};

const speciesCreationSharedFiles = [
  "src/data/herpetofauna-checklist.ts",
  "src/data/mapRegions.ts",
  "src/data/speciesAtlasMeta.ts",
  "src/data/speciesPublish.ts",
  "src/lib/speciesRoutes.ts",
  "src/lib/speciesSlugRules.ts",
];

export async function runSpeciesWorkflowSteps<T extends string>(
  steps: T[],
  runStep: (step: T) => Promise<void>,
) {
  const runAt = async (
    index: number,
  ): Promise<null | { error: unknown; step: T }> => {
    const step = steps[index];
    if (step === undefined) return null;
    try {
      await runStep(step);
    } catch (error) {
      return { error, step };
    }
    return runAt(index + 1);
  };
  return runAt(0);
}

export function selectSpeciesCreationFiles(files: string[], id: string) {
  const prefix = `src/content/species/${id}/`;
  return files.filter(
    (file) =>
      (file.startsWith(prefix) &&
        /^(ka|en|ru|tr)\.mdx$/.test(file.slice(prefix.length))) ||
      speciesCreationSharedFiles.includes(file),
  );
}

export async function speciesCreationCodexPrompt(input: SpeciesCreationInput) {
  const { commonName, id, scientificName } = validateSpeciesCreationInput(
    input.commonName,
    input.scientificName,
  );
  if (id !== input.id) throw new Error("Invalid species id");
  const template = await fs.readFile(
    path.join(root, "src/prompts/species-page-create.md"),
    "utf8",
  );
  const prompt = template
    .replaceAll("{{COMMON_NAME}}", commonName)
    .replaceAll("{{SCIENTIFIC_NAME}}", scientificName)
    .replaceAll("{{SPECIES_ID}}", id);
  const allowedFiles = [
    ...["ka", "en", "ru", "tr"].map(
      (locale) => `src/content/species/${id}/${locale}.mdx`,
    ),
    ...speciesCreationSharedFiles,
  ];
  return `${prompt}\n\nშეცვალე მხოლოდ ეს ფაილები: ${allowedFiles.join(", ")}. თუ სახეობა არსებულ ჯგუფურ არქიტექტურაში სანდოდ ვერ თავსდება, არაფერი შეცვალო და ანგარიშში ზუსტად ახსენი მიზეზი. სხვა ფაილის საჭიროების შემთხვევაში არაფერი მოიგონო და ანგარიშში მიუთითე რომელი ფაილი და რატომ არის საჭირო. არ გაუშვა ტესტები, lint, typecheck, build, next dev ან typegen. არ შეასრულო commit, push ან PR-ის შექმნა; ამას აპლიკაცია გააკეთებს. საბოლოო ანგარიში დააბრუნე ქართულად.`;
}

export function validateSpeciesCreationInput(
  commonNameValue: unknown,
  scientificNameValue: unknown,
): SpeciesCreationInput {
  const commonName = normalizeSpeciesCreationValue(
    commonNameValue,
    "დასახელება",
    120,
  );
  const scientificName = normalizeSpeciesCreationValue(
    scientificNameValue,
    "სამეცნიერო სახელი",
    160,
  );
  if (
    !/^[A-Za-z][A-Za-z.-]*(?:\s+(?:×\s*)?[A-Za-z][A-Za-z.-]*){1,3}$/.test(
      scientificName,
    )
  ) {
    throw new Error(
      "სამეცნიერო სახელი ჩაწერე ლათინურად, ავტორისა და წლის გარეშე",
    );
  }
  const id = scientificName
    .normalize("NFKD")
    .toLowerCase()
    .replace(/×/g, "-x-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 100) {
    throw new Error("სამეცნიერო სახელიდან species ID ვერ შეიქმნა");
  }
  return { commonName, id, scientificName };
}

export function validateSpeciesWorkflowModes(
  value: unknown,
): SpeciesWorkflowMode[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.length > speciesWorkflowModes.length ||
    value.some((mode) => !speciesWorkflowModes.includes(mode)) ||
    new Set(value).size !== value.length
  ) {
    throw new Error("Invalid workflow steps");
  }
  return value as SpeciesWorkflowMode[];
}

function normalizeSpeciesCreationValue(
  value: unknown,
  label: string,
  maxLength: number,
) {
  if (typeof value !== "string" || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(`${label} არასწორია`);
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized || normalized.length > maxLength) {
    throw new Error(`${label} არასწორია`);
  }
  return normalized;
}

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
  records: {
    commit: "import field records for",
    prompt: "species-field-records.md",
    title: "Import field records for",
  },
} satisfies Record<
  SpeciesAnalysisMode,
  { commit: string; prompt: string; title: string }
>;

const sharedFiles: Record<SpeciesAnalysisMode, string[]> = {
  analysis: [],
  links: [],
  lookalikes: ["src/lib/speciesRoutes.ts", "src/lib/speciesRoutes.test.ts"],
  records: [
    "src/components/map/SpeciesRangeMap.tsx",
    "src/data/speciesRangeMaps/index.ts",
    "src/data/mapRegions.ts",
    "src/data/regions.test.ts",
    "src/lib/halyomorphaOccurrences.ts",
    "src/lib/halyomorphaOccurrences.test.ts",
  ],
};

export async function analyzeSpeciesPage(
  id: string,
  onReport: (report: string) => void,
  mode: SpeciesAnalysisMode = "analysis",
) {
  const unlock = lockSpeciesAnalysis(id);
  try {
    return await runAnalysis(id, onReport, mode);
  } finally {
    unlock();
  }
}

export function fillSpeciesPrompt(template: string, id: string) {
  return template
    .replace(
      /^სამიზნე გვერდი (?:\/|ან) სახეობა:.*$/m,
      `სამიზნე გვერდი / სახეობა: src/content/species/${id}/ka.mdx (species ID: ${id})`,
    )
    .replace(/^რეჟიმი:.*$/m, "რეჟიმი: რედაქტირება.");
}

export async function runSpeciesWorkflow(
  id: string,
  modes: SpeciesWorkflowMode[],
  onStep: (mode: SpeciesWorkflowMode, report: string) => Promise<void> | void,
  options?: {
    onStage: (stage: "validation" | SuperAnalysisStage) => void;
    superAnalysis: boolean;
  },
) {
  const unlock = lockSpeciesAnalysis(id);
  try {
    if (
      options?.superAnalysis &&
      modes.join(",") !== SUPER_ANALYSIS_STAGES.join(",")
    )
      throw new Error("Invalid Super Analysis order");
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
    if (options?.superAnalysis) {
      const existing = findSpeciesPullRequest(
        JSON.parse(
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
        ),
        id,
        base,
      );
      if (existing)
        throw new Error(
          `Review the existing species PR before starting another analysis: ${existing.url}`,
        );
    }
    const branch = `feature/species-workflow-${id}-${randomUUID().slice(0, 8)}`;
    const allowedFiles = [
      ...["ka", "en", "ru", "tr"].map(
        (locale) => `src/content/species/${id}/${locale}.mdx`,
      ),
      ...new Set(
        modes.flatMap((mode) => (mode === "texts" ? [] : sharedFiles[mode])),
      ),
    ];
    if (await run("git", ["status", "--porcelain", "--", ...allowedFiles]))
      throw new Error(
        "The species has local changes; save them before analysis",
      );
    const directory = await fs.mkdtemp(
      path.join(os.tmpdir(), "reptiles-species-workflow-"),
    );
    const worktree = path.join(directory, "checkout");
    let pullRequestUrl = "";
    let keepLocalBranch = false;
    const completedModes: SpeciesWorkflowMode[] = [];
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
      await assertSpeciesContentMatchesBase(root, worktree, allowedFiles);
      await fs.symlink(
        path.join(root, "node_modules"),
        path.join(worktree, "node_modules"),
        "dir",
      );
      if (options?.superAnalysis)
        await assertSpeciesContentMatchesBase(root, worktree, [
          "src/data/speciesPublish.ts",
          "src/i18n/pathnames.ts",
        ]);
      const superStep = options?.superAnalysis
        ? await createSuperAnalysisRunner(id, worktree, directory)
        : null;
      const reports: string[] = [];
      const failure = await runSpeciesWorkflowSteps(modes, async (mode) => {
        let report: string;
        if (superStep) {
          const stage = mode as SuperAnalysisStage;
          options?.onStage(stage);
          report = await superStep(stage);
          reports.push(`## ${stage}\n\n${report}`);
        } else if (mode === "texts") {
          report = await processWorkflowTexts(id, worktree);
        } else {
          const template = await fs.readFile(
            path.join(root, "src/prompts", modeConfig[mode].prompt),
            "utf8",
          );
          const prompt = fillSpeciesPrompt(template, id);
          const output = path.join(directory, `${mode}-report.md`);
          const shared = new Set(sharedFiles[mode]);
          if (mode === "records")
            shared.add(`src/data/speciesRangeMaps/${id}.ts`);
          const stepFiles = allowedFiles.filter(
            (file) =>
              file.startsWith(`src/content/species/${id}/`) || shared.has(file),
          );
          await runCodex(
            worktree,
            output,
            `${prompt}\n\nშეცვალე მხოლოდ ეს ფაილები: ${stepFiles.join(", ")}. სხვა ფაილების ცვლილებები შედეგში არ მოხვდება. არ გაუშვა ტესტები, lint, typecheck, build ან კონტენტის გენერაციის ბრძანებები; ჩანაწერების იმპორტის სკრიპტი ამ შეზღუდვის გამონაკლისია. არ შეასრულო commit, push ან PR-ის შექმნა; ამას აპლიკაცია გააკეთებს. საბოლოო ანგარიში დააბრუნე ჩატში ქართულად.`,
          );
          const chosenFiles = new Set(stepFiles);
          await repairSpeciesFrontmatter(
            worktree,
            directory,
            (await changedFiles(worktree)).filter((file) =>
              chosenFiles.has(file),
            ),
          );
          report = (await fs.readFile(output, "utf8")).trim();
          if (!report) throw new Error("Codex returned an empty report");
        }
        const changed = await changedFiles(worktree);
        const stepFiles =
          mode === "texts"
            ? changed.filter(
                (file) =>
                  file.startsWith(`src/content/species/${id}/`) &&
                  /\/(ka|en|ru|tr)\.mdx$/.test(file),
              )
            : selectSpeciesAnalysisFiles(changed, id, mode);
        const stepFileSet = new Set(stepFiles);
        const skipped = changed.filter((file) => !stepFileSet.has(file));
        if (skipped.length)
          throw new Error(`Unexpected changed files: ${skipped.join(", ")}`);
        if (stepFiles.length) {
          await run("git", ["diff", "--check", "--", ...stepFiles], worktree);
          await run("git", ["add", "--", ...stepFiles], worktree);
          await run(
            "git",
            [
              "-c",
              "core.hooksPath=/dev/null",
              "commit",
              "-m",
              `content: ${mode} ${id}`,
            ],
            worktree,
          );
        }
        completedModes.push(mode);
        await onStep(mode, report);
      });
      const stepError = failure
        ? failure.error instanceof Error
          ? failure.error.message
          : "Workflow step failed"
        : null;
      if (superStep && failure)
        return {
          error: stepError,
          failedStep: failure.step,
          pullRequestUrl: null,
        };
      if (superStep) {
        options?.onStage("validation");
        await run("pnpm", ["run", "species:compile"], worktree);
        await run("pnpm", ["run", "typecheck"], worktree);
        await run(
          "pnpm",
          [
            "exec",
            "vitest",
            "run",
            "src/lib/speciesRoutes.test.ts",
            "src/lib/speciesRelated.test.ts",
            "src/lib/speciesInlineLinks.test.ts",
            "src/lib/snakeQuiz.test.ts",
          ],
          worktree,
        );
      }
      if (
        (await run(
          "git",
          ["rev-list", "--count", `origin/${base}..HEAD`],
          worktree,
        )) === "0"
      )
        return {
          error: stepError,
          failedStep: failure?.step ?? null,
          pullRequestUrl: null,
        };
      try {
        await run("git", ["push", "-u", "origin", branch], worktree);
      } catch (error) {
        keepLocalBranch = true;
        throw new Error(
          `Could not publish the PR; completed commits remain on local branch ${branch}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      const body = path.join(directory, "pr-body.md");
      await fs.writeFile(
        body,
        superStep
          ? `Super Analysis for ${id}: ${completedModes.join(" → ")}\n\n${reports.join("\n\n")}\n\n## Validation\n\nSchema, evidence references, locale parity, protected fields, links, species compilation, typecheck and route/related/quiz tests passed. Source verification is an AI assessment; this draft still requires editorial review.\n`
          : `## Summary\n\n- Completed ${completedModes.join(" → ")} for ${id}\n${failure ? `- Stopped at ${failure.step}; later steps were not run\n` : ""}\n## Checks\n\n- Automated checks not run; owner will review\n`,
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
            `Review ${id} species page`,
            "--body-file",
            body,
            ...(superStep ? ["--draft", "--label", "content"] : []),
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
          throw new Error(
            `PR creation failed; completed changes remain on ${branch}: ${error instanceof Error ? error.message : String(error)}`,
          );
        });
      }
      if (!isPullRequestUrl(pullRequestUrl))
        throw new Error(
          `Pull request creation failed; completed changes remain on ${branch}`,
        );
      return {
        error: stepError,
        failedStep: failure?.step ?? null,
        pullRequestUrl,
      };
    } finally {
      await run("git", ["worktree", "remove", "--force", worktree]).catch(
        () => undefined,
      );
      if (!keepLocalBranch)
        await run("git", ["branch", "-D", branch]).catch(() => undefined);
      await fs.rm(directory, { force: true, recursive: true });
    }
  } finally {
    unlock();
  }
}

export function selectSpeciesAnalysisFiles(
  files: string[],
  id: string,
  mode: SpeciesAnalysisMode = "analysis",
) {
  const prefix = `src/content/species/${id}/`;
  const shared = new Set(sharedFiles[mode]);
  if (mode === "records") shared.add(`src/data/speciesRangeMaps/${id}.ts`);
  return files.filter(
    (file) =>
      (file.startsWith(prefix) &&
        /^(ka|en|ru|tr)\.mdx$/.test(file.slice(prefix.length))) ||
      shared.has(file),
  );
}

export function speciesFrontmatterError(raw: string) {
  try {
    matter(raw);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

async function assertSpeciesContentMatchesBase(
  root: string,
  worktree: string,
  files: string[],
) {
  const differences = await Promise.all(
    files.map(async (file) => {
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

async function processWorkflowTexts(id: string, worktree: string) {
  const raw = await fs.readFile(
    path.join(worktree, "src/content/species", id, "ka.mdx"),
    "utf8",
  );
  const fields = getSpeciesTextFields(raw);
  if (!fields.length) throw new Error("No page texts to process");
  const report: string[] = [];
  for (const field of fields) {
    const target = await resolveEditorTarget(
      { field, id, kind: "species" },
      worktree,
    );
    const selection = { after: "", before: "", selected: target.source };
    const result = validateEditorResult(
      await transformWithCodex(selection, "xhigh"),
      selection,
    );
    const updated = target.updated(result);
    for (const [index, file] of target.files.entries())
      await fs.writeFile(path.join(worktree, file), updated[index]);
    report.push(`${field}\n${result.ka}`);
  }
  return report.join("\n\n");
}

async function repairSpeciesFrontmatter(
  worktree: string,
  directory: string,
  files: string[],
) {
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
  const errors = async () =>
    (
      await Promise.all(
        mdxFiles.map(async (file) => {
          const error = speciesFrontmatterError(
            await fs.readFile(path.join(worktree, file), "utf8"),
          );
          return error ? `${file}: ${error}` : "";
        }),
      )
    ).filter(Boolean);
  const invalid = await errors();
  if (!invalid.length) return;
  await runCodex(
    worktree,
    path.join(directory, "frontmatter-repair.md"),
    `Fix only the YAML frontmatter syntax errors below. Preserve all values and prose. Quote plain string values containing ": " where needed. Change only these files: ${mdxFiles.join(", ")}. Do not run tests, lint, typecheck, build, or content generation.\n\n${invalid.join("\n")}`,
  );
  const remaining = await errors();
  if (remaining.length)
    throw new Error(`Invalid species frontmatter: ${remaining.join("; ")}`);
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
              !/^(feature\/species-(links|lookalikes|records)-)/.test(
                pullRequest.headRefName,
              ),
          ),
          id,
          base,
        )
      : null);
  const branch = `feature/species-${mode}-${id}-${randomUUID().slice(0, 8)}`;
  const remoteBranch = existing?.headRefName ?? branch;
  const targetPaths = [`src/content/species/${id}`, ...sharedFiles[mode]];
  const allowedFiles = [
    ...["ka", "en", "ru", "tr"].map(
      (locale) => `src/content/species/${id}/${locale}.mdx`,
    ),
    ...sharedFiles[mode],
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
      await assertSpeciesContentMatchesBase(root, worktree, allowedFiles);
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
    const prompt = fillSpeciesPrompt(promptTemplate, id);
    const output = path.join(directory, "report.md");
    await runCodex(
      worktree,
      output,
      `${prompt}\n\nშეცვალე მხოლოდ ეს ფაილები: ${allowedFiles.join(", ")}. სხვა ფაილების ცვლილებები შედეგში არ მოხვდება. არ გაუშვა ტესტები, lint, typecheck, build ან კონტენტის გენერაციის ბრძანებები; ჩანაწერების იმპორტის სკრიპტი ამ შეზღუდვის გამონაკლისია. არ შეასრულო commit, push ან PR-ის შექმნა; ამას აპლიკაცია გააკეთებს. საბოლოო ანგარიში დააბრუნე ჩატში ქართულად.`,
    );
    const allowed = new Set(allowedFiles);
    await repairSpeciesFrontmatter(
      worktree,
      directory,
      (await changedFiles(worktree)).filter((file) => allowed.has(file)),
    );
    let report = (await fs.readFile(output, "utf8")).trim();
    if (!report) throw new Error("Codex returned an empty report");
    const changed = await changedFiles(worktree);
    const files = selectSpeciesAnalysisFiles(changed, id, mode);
    const selected = new Set(files);
    const skipped = changed.filter((file) => !selected.has(file));
    if (skipped.length)
      report += `\n\nდავალების ფარგლებს გარეთ შეცვლილი ფაილები გამოტოვებულია: ${skipped.join(", ")}.`;
    onReport(report);
    if (files.length === 0)
      return { pullRequestUrl: existing?.url ?? null, report };

    await run("git", ["diff", "--check", "--", ...files], worktree);
    await run("git", ["add", "--", ...files], worktree);
    await run(
      "git",
      [
        "-c",
        "core.hooksPath=/dev/null",
        "commit",
        "-m",
        `content: ${modeConfig[mode].commit} ${id}`,
      ],
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
        `## Summary\n\n- ${modeConfig[mode].title} ${id}\n\n## Checks\n\n- Automated checks not run; owner will review\n\n## AI report\n\n${report.slice(0, 55000)}\n`,
      );
      pullRequestUrl = await createOrFindPullRequest(run, {
        base,
        body,
        branch,
        repository,
        title:
          mode === "analysis"
            ? `Analyze ${id} species page`
            : `${modeConfig[mode].title} ${id}`,
        worktree,
      });
    }
    if (!isPullRequestUrl(pullRequestUrl))
      throw new Error("Pull request creation failed");
    return { pullRequestUrl, report };
  } finally {
    await cleanupPullRequestWorktree(run, {
      branch,
      deleteRemoteBranch:
        pushed && !existing && !isPullRequestUrl(pullRequestUrl),
      worktree,
    });
    await fs.rm(directory, { force: true, recursive: true });
  }
}

async function runCodex(worktree: string, output: string, prompt: string) {
  await runCodexProcess({
    args: [
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
      "--output-last-message",
      output,
    ],
    cwd: worktree,
    prompt,
    timeoutMs: 45 * 60 * 1000,
  });
}
