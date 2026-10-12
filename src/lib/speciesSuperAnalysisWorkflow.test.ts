import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runSpeciesWorkflow } from "@/lib/speciesPageAnalysis";
import { createSuperAnalysisRunner } from "@/lib/speciesSuperAnalysis";
import {
  SUPER_ANALYSIS_STAGES,
  type SuperAnalysisCheckpoint,
} from "@/lib/speciesSuperAnalysisSchema";

const mocks = vi.hoisted(() => ({ command: vi.fn() }));
vi.mock("node:child_process", async (original) => ({
  ...(await original<typeof import("node:child_process")>()),
  execFile: (...args: unknown[]) => mocks.command(...args),
}));
vi.mock("@/lib/speciesSuperAnalysis", () => ({
  createSuperAnalysisRunner: vi.fn(),
}));
const id = "phasianus-colchicus";
let commits: number;
let changed: boolean;
let checkout: string;
const step = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  commits = 0;
  changed = false;
  vi.mocked(createSuperAnalysisRunner).mockImplementation(
    async (_id, worktree, _directory, previous = []) => {
      checkout = worktree;
      return async (stage) => {
        const report = await step(stage);
        previous.push({ stage } as (typeof previous)[number]);
        return report;
      };
    },
  );
  step.mockImplementation(async (mode: string) => {
    changed = mode === "analysis";
    return `${mode} complete`;
  });
  mocks.command.mockImplementation(
    (
      command: string,
      args: string[],
      options: { cwd: string },
      callback: (error: Error | null, result: { stdout: string }) => void,
    ) => {
      void (async () => {
        const line = args.join(" ");
        let stdout = "";
        if (command === "gh") {
          if (args[0] === "repo")
            stdout = JSON.stringify({
              defaultBranchRef: { name: "main" },
              nameWithOwner: "test/reptiles",
            });
          if (args[0] === "pr" && args[1] === "list") stdout = "[]";
          if (args[0] === "pr" && args[1] === "create")
            stdout = "https://github.com/test/reptiles/pull/999";
        }
        if (command === "git" && args[0] === "worktree" && args[1] === "add") {
          const target = args[2] === "-b" ? args[4] : args[2];
          const files = [
            ...["ka", "en", "ru", "tr"].map(
              (locale) => `src/content/species/${id}/${locale}.mdx`,
            ),
            "src/lib/speciesRoutes.ts",
            "src/lib/speciesRoutes.test.ts",
            "src/data/speciesPublish.ts",
            "src/i18n/pathnames.ts",
          ];
          for (const file of files) {
            await fs.mkdir(path.dirname(path.join(target, file)), {
              recursive: true,
            });
            await fs.copyFile(
              path.join(process.cwd(), file),
              path.join(target, file),
            );
          }
        }
        if (
          command === "git" &&
          args[0] === "status" &&
          options.cwd !== process.cwd() &&
          changed
        )
          stdout = ` M src/content/species/${id}/ka.mdx`;
        if (command === "git" && line.includes("commit")) {
          commits++;
          changed = false;
        }
        if (command === "git" && args[0] === "rev-list")
          stdout = String(commits);
        callback(null, { stdout });
      })().catch((error) => callback(error as Error, { stdout: "" }));
    },
  );
});
afterEach(async () => {
  if (checkout)
    await fs.rm(path.dirname(checkout), { force: true, recursive: true });
});
const run = () =>
  runSpeciesWorkflow(id, [...SUPER_ANALYSIS_STAGES], vi.fn(), {
    onStage: vi.fn(),
    superAnalysis: true,
  });
const published = () =>
  mocks.command.mock.calls.filter(
    ([command, args]) =>
      (command === "git" && args[0] === "push") ||
      (command === "gh" && args[0] === "pr" && args[1] === "create"),
  );

describe("Super Analysis publishing boundary", () => {
  it("does not publish completed commits when a later stage fails", async () => {
    step.mockImplementation(async (mode: string) => {
      if (mode === "lookalikes") throw new Error("Invalid evidence");
      changed = true;
      return "Research";
    });
    const result = await run();
    expect(result).toMatchObject({
      error: "Invalid evidence",
      failedStep: "lookalikes",
      pullRequestUrl: null,
    });
    expect(step.mock.calls.map(([mode]) => mode)).toEqual([
      "analysis",
      "lookalikes",
    ]);
    expect(published()).toEqual([]);
  });

  it("does not run package-manager or project-check commands", async () => {
    await run();
    expect(
      mocks.command.mock.calls.every(([command]) =>
        ["gh", "git"].includes(command),
      ),
    ).toBe(true);
  });

  it("publishes after four validated stages, as a content-labeled draft", async () => {
    const result = await run();
    expect(result.pullRequestUrl).toContain("/pull/999");
    const calls = mocks.command.mock.calls.map(
      ([command, args]) => `${command} ${args.join(" ")}`,
    );
    expect(calls.find((line) => line.includes("gh pr create"))).toContain(
      "--draft --label content",
    );
    expect(step.mock.calls.map(([mode]) => mode)).toEqual([
      ...SUPER_ANALYSIS_STAGES,
    ]);
  });

  it("saves a checkpoint after each stage and resumes from the next one", async () => {
    step.mockImplementation(async (mode: string) => {
      if (mode === "links") throw new Error("The operation was aborted");
      changed = true;
      return `${mode} report`;
    });
    const onCheckpoint = vi.fn<
      (checkpoint: SuperAnalysisCheckpoint) => Promise<void>
    >(async () => undefined);
    const failed = await runSpeciesWorkflow(
      id,
      [...SUPER_ANALYSIS_STAGES],
      vi.fn(),
      { onCheckpoint, onStage: vi.fn(), superAnalysis: true },
    );
    expect(failed).toMatchObject({ failedStep: "links", pullRequestUrl: null });
    expect(onCheckpoint).toHaveBeenCalledTimes(2);
    const saved = structuredClone(onCheckpoint.mock.calls[1][0]);
    expect(saved.reports).toEqual(["analysis report", "lookalikes report"]);
    const commands = () =>
      mocks.command.mock.calls.map(
        ([command, args]) => `${command} ${args.join(" ")}`,
      );
    expect(commands()).not.toContain(`git branch -D ${saved.branch}`);

    await fs.rm(path.dirname(checkout), { force: true, recursive: true });
    vi.clearAllMocks();
    step.mockImplementation(async (mode: string) => {
      changed = true;
      return `${mode} report`;
    });
    const resumed = await runSpeciesWorkflow(
      id,
      [...SUPER_ANALYSIS_STAGES],
      vi.fn(),
      { onStage: vi.fn(), resume: saved, superAnalysis: true },
    );
    expect(resumed.pullRequestUrl).toContain("/pull/999");
    expect(step.mock.calls.map(([mode]) => mode)).toEqual(["links", "texts"]);
    expect(commands()).toContain(
      `git worktree add ${checkout} ${saved.branch}`,
    );
    expect(commands().some((line) => line.includes("worktree add -b"))).toBe(
      false,
    );
  });
});
