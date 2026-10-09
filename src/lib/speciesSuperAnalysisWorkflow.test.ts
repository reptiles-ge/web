import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runSpeciesWorkflow } from "@/lib/speciesPageAnalysis";
import { createSuperAnalysisRunner } from "@/lib/speciesSuperAnalysis";
import { SUPER_ANALYSIS_STAGES } from "@/lib/speciesSuperAnalysisSchema";

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
let failChecks: boolean;
let checkout: string;
const step = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  commits = 0;
  changed = false;
  failChecks = false;
  vi.mocked(createSuperAnalysisRunner).mockImplementation(
    async (_id, worktree) => {
      checkout = worktree;
      return step;
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
          const target = args[4];
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
        if (command === "pnpm" && failChecks)
          throw new Error("Validation failed");
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

  it("blocks publishing if compile or tests fail", async () => {
    failChecks = true;
    await expect(run()).rejects.toThrow("Validation failed");
    expect(published()).toEqual([]);
  });

  it("publishes only after four stages and validation, as a content-labeled draft", async () => {
    const result = await run();
    expect(result.pullRequestUrl).toContain("/pull/999");
    const calls = mocks.command.mock.calls.map(
      ([command, args]) => `${command} ${args.join(" ")}`,
    );
    expect(
      calls.findIndex((line) => line.includes("pnpm exec vitest")),
    ).toBeLessThan(calls.findIndex((line) => line.includes("git push")));
    expect(calls.find((line) => line.includes("gh pr create"))).toContain(
      "--draft --label content",
    );
    expect(step.mock.calls.map(([mode]) => mode)).toEqual([
      ...SUPER_ANALYSIS_STAGES,
    ]);
  });
});
