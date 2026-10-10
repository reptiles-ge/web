import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type AgentRun, type AgentTask, runAgent } from "@/lib/aiAgent";
import {
  buildSpeciesAnalysisContext,
  readSpeciesAnalysisContent,
  speciesAnalysisSurfaces,
} from "@/lib/speciesAnalysisInventory";
import { createSuperAnalysisRunner } from "@/lib/speciesSuperAnalysis";
import {
  ANALYSIS_LOCALES,
  SUPER_ANALYSIS_STAGES,
  type SuperAnalysisResult,
} from "@/lib/speciesSuperAnalysisSchema";

vi.mock("@/lib/aiAgent", async (original) => ({
  ...(await original<typeof import("@/lib/aiAgent")>()),
  runAgent: vi.fn(),
}));

const agentRun: AgentRun = {
  backend: "claude",
  costUsd: 0.42,
  effort: "high",
  model: "claude-opus-5-5",
};

function mockAgent(handler: (task: AgentTask) => Promise<void>) {
  vi.mocked(runAgent).mockImplementation(async (task) => {
    await handler(task);
    return agentRun;
  });
}
vi.mock("@/lib/speciesAnalysisInventory", async (original) => ({
  ...(await original<typeof import("@/lib/speciesAnalysisInventory")>()),
  buildSpeciesAnalysisContext: vi.fn(),
}));

let directory: string;
let worktree: string;
const id = "test-species";
const original =
  '---\nid: test-species\ncommonName: Test\nscientificName: Test species\nfamily: Testidae\ngenus: Test\noverview: "A bird is 20 cm."\nsources:\n  - name: Original\n    url: https://example.org/paper\n---\n';
const values = (text: string) => ({ en: text, ka: text, ru: text, tr: text });

beforeEach(async () => {
  vi.clearAllMocks();
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "super-runner-test-"));
  worktree = path.join(directory, "checkout");
  await fs.mkdir(path.join(worktree, `src/content/species/${id}`), {
    recursive: true,
  });
  await fs.mkdir(path.join(worktree, "src/lib"), { recursive: true });
  for (const locale of ANALYSIS_LOCALES)
    await fs.writeFile(
      path.join(worktree, `src/content/species/${id}/${locale}.mdx`),
      original,
    );
  await fs.writeFile(
    path.join(worktree, "src/lib/speciesRoutes.ts"),
    'const LOOKALIKES: Record<string, string[]> = {"test-species": []};',
  );
  vi.mocked(buildSpeciesAnalysisContext).mockImplementation(async () => {
    const content = await readSpeciesAnalysisContent(id, worktree);
    return {
      catalog: [
        { id: "other-species", scientificName: "Other species" },
        { id, scientificName: "Test species" },
      ],
      content: Object.fromEntries(
        ANALYSIS_LOCALES.map((locale) => [locale, content[locale].data]),
      ),
      id,
      internalPaths: [],
      surfaces: speciesAnalysisSurfaces,
    } as unknown as Awaited<ReturnType<typeof buildSpeciesAnalysisContext>>;
  });
});
afterEach(async () => {
  await fs.rm(directory, { force: true, recursive: true });
});

describe("four-stage Super Analysis runner", () => {
  it("hands off validated evidence and fresh content in the mandatory order", async () => {
    const contexts: Array<{
      content: { ka: { overview: string } };
      previous: SuperAnalysisResult[];
    }> = [];
    const tasks: AgentTask[] = [];
    mockAgent(async (task) => {
      const { access, output, prompt } = task;
      tasks.push(task);
      expect(access).toBe("read-only");
      const stage = SUPER_ANALYSIS_STAGES[contexts.length];
      const contextFile = /SHARED CONTEXT FILE: (.+)\n/.exec(prompt)![1];
      const context = JSON.parse(await fs.readFile(contextFile, "utf8"));
      contexts.push(context);
      const result: SuperAnalysisResult = {
        coverage: speciesAnalysisSurfaces.map((surface) => surface.id),
        edits: [],
        evidence: [],
        findings: [],
        lookalikes: [],
        sources: [],
        stage,
        summary: stage,
      };
      if (stage === "analysis") {
        result.evidence = [
          {
            claim: "Size",
            excerpt: "25 cm",
            id: "analysis-size",
            locator: "Table 1",
            scope: "Species",
            status: "verified",
            taxon: "Test species",
            url: "https://example.org/paper",
          },
        ];
        result.edits = [
          {
            after: values("A bird is 25 cm."),
            before: values("A bird is 20 cm."),
            evidenceIds: ["analysis-size"],
            field: "overview",
            reason: "Verified size",
          },
        ];
      }
      if (stage === "links")
        result.edits = [
          {
            after: values("A [bird](other-species) is 25 cm."),
            before: values("A bird is 25 cm."),
            evidenceIds: [],
            field: "overview",
            reason: "Useful comparison",
          },
        ];
      if (stage === "texts")
        result.edits = [
          {
            after: values("A [bird](other-species) measures 25 cm."),
            before: values("A [bird](other-species) is 25 cm."),
            evidenceIds: [],
            field: "overview",
            reason: "Clearer wording",
          },
        ];
      await fs.writeFile(output, JSON.stringify(result));
    });
    const run = await createSuperAnalysisRunner(id, worktree, directory);
    const reports: string[] = [];
    for (const stage of SUPER_ANALYSIS_STAGES) reports.push(await run(stage));
    expect(tasks.map(({ profile, webSearch }) => [profile, webSearch])).toEqual(
      [
        ["super:analysis", true],
        ["super:lookalikes", true],
        ["super:links", false],
        ["super:texts", false],
      ],
    );
    expect(tasks.every((task) => task.attempt === 0)).toBe(true);
    expect(tasks[0].readDirectories).toEqual([directory]);
    expect(reports[0]).toContain("AI: claude-opus-5-5 (high) · $0.42");
    expect(
      contexts.map((context) => context.previous.map((result) => result.stage)),
    ).toEqual([
      [],
      ["analysis"],
      ["analysis", "lookalikes"],
      ["analysis", "lookalikes", "links"],
    ]);
    expect(contexts[1].previous[0].evidence[0].id).toBe("analysis-size");
    expect(contexts[3].content.ka.overview).toBe(
      "A [bird](other-species) is 25 cm.",
    );
    expect(
      (await readSpeciesAnalysisContent(id, worktree)).ka.data.overview,
    ).toBe("A [bird](other-species) measures 25 cm.");
  });

  it("does not call AI for an out-of-order step", async () => {
    const run = await createSuperAnalysisRunner(id, worktree, directory);
    await expect(run("texts")).rejects.toThrow("order");
    expect(runAgent).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "repairs missing evidence once, applying only a validated response (%s)",
    async (repairSucceeds) => {
      let calls = 0;
      mockAgent(async ({ attempt, output, prompt }) => {
        calls++;
        expect(attempt).toBe(calls - 1);
        if (calls === 2) {
          expect(prompt).toContain("field overview");
          expect(prompt).toContain("never change a status to verified");
          expect((await readSpeciesAnalysisContent(id, worktree)).ka.raw).toBe(
            original,
          );
        }
        await fs.writeFile(
          output,
          JSON.stringify({
            coverage: speciesAnalysisSurfaces.map((surface) => surface.id),
            edits:
              calls === 2 && repairSucceeds
                ? []
                : [
                    {
                      after: values("A bird is 25 cm."),
                      before: values("A bird is 20 cm."),
                      evidenceIds: [],
                      field: "overview",
                      reason: "Correct size",
                    },
                  ],
            evidence: [],
            findings: [],
            lookalikes: [],
            sources: [],
            stage: "analysis",
            summary: "Unverified correction requires review",
          }),
        );
      });
      const run = await createSuperAnalysisRunner(id, worktree, directory);
      if (repairSucceeds)
        await expect(run("analysis")).resolves.toContain("requires review");
      else await expect(run("analysis")).rejects.toThrow("field overview");
      expect(calls).toBe(2);
      for (const locale of ANALYSIS_LOCALES)
        expect(
          (await readSpeciesAnalysisContent(id, worktree))[locale].raw,
        ).toBe(original);
    },
  );

  it("leaves all files unchanged when a model response fails validation", async () => {
    mockAgent(async ({ output }) => {
      await fs.writeFile(output, '{"stage":"analysis"}');
    });
    const run = await createSuperAnalysisRunner(id, worktree, directory);
    await expect(run("analysis")).rejects.toThrow();
    expect(runAgent).toHaveBeenCalledTimes(1);
    for (const locale of ANALYSIS_LOCALES)
      expect((await readSpeciesAnalysisContent(id, worktree))[locale].raw).toBe(
        original,
      );
    await expect(run("lookalikes")).rejects.toThrow("order");
  });

  it.each([true, false])(
    "repairs incomplete coverage once with a detailed error (%s)",
    async (repairSucceeds) => {
      const all = speciesAnalysisSurfaces.map((surface) => surface.id);
      let calls = 0;
      mockAgent(async ({ output, prompt }) => {
        calls++;
        expect(prompt).toContain(
          `REQUIRED COVERAGE IDS (every one must appear in coverage): ${all.join(", ")}`,
        );
        if (calls === 2) {
          expect(prompt).toContain("Missing: media, navigation");
          expect(prompt).toContain("Remove unknown IDs: faq.0");
        }
        await fs.writeFile(
          output,
          JSON.stringify({
            coverage:
              calls === 2 && repairSucceeds
                ? all
                : [
                    ...all.filter(
                      (surface) =>
                        surface !== "media" && surface !== "navigation",
                    ),
                    "faq.0",
                  ],
            edits: [],
            evidence: [],
            findings: [],
            lookalikes: [],
            sources: [],
            stage: "analysis",
            summary: "Reviewed",
          }),
        );
      });
      const run = await createSuperAnalysisRunner(id, worktree, directory);
      if (repairSucceeds)
        await expect(run("analysis")).resolves.toContain("Reviewed");
      else
        await expect(run("analysis")).rejects.toThrow(
          `[analysis, attempt 2/2, after validation repair] Incomplete page surface coverage (stage analysis) | missing 2/${all.length}: media, navigation | unknown 1: "faq.0"`,
        );
      expect(calls).toBe(2);
    },
  );

  it.each([true, false])(
    "repairs scientific-name loss or preserves the original field (%s)",
    async (repairSucceeds) => {
      const initial = original.replace(
        "overview:",
        'description: "Test species is a bird."\noverview:',
      );
      for (const locale of ANALYSIS_LOCALES)
        await fs.writeFile(
          path.join(worktree, `src/content/species/${id}/${locale}.mdx`),
          initial,
        );
      let calls = 0;
      mockAgent(async ({ output, prompt }) => {
        const stage = SUPER_ANALYSIS_STAGES[Math.min(calls, 3)];
        calls++;
        if (calls === 5)
          expect(prompt).toContain("Preserve every original scientific name");
        const response: SuperAnalysisResult = {
          coverage: speciesAnalysisSurfaces.map((surface) => surface.id),
          edits: [],
          evidence: [],
          findings: [],
          lookalikes: [],
          sources: [],
          stage,
          summary: "Reviewed",
        };
        if (stage === "texts")
          response.edits = [
            {
              after: values(
                calls === 5 && repairSucceeds
                  ? "Test species is a ground bird."
                  : "A ground bird.",
              ),
              before: values("Test species is a bird."),
              evidenceIds: [],
              field: "description",
              reason: "Clearer introduction",
            },
            {
              after: values("A bird measures 20 cm."),
              before: values("A bird is 20 cm."),
              evidenceIds: [],
              field: "overview",
              reason: "Clearer phrasing",
            },
          ];
        await fs.writeFile(output, JSON.stringify(response));
      });
      const run = await createSuperAnalysisRunner(id, worktree, directory);
      for (const stage of SUPER_ANALYSIS_STAGES.slice(0, 3)) await run(stage);
      const report = await run("texts");
      expect(calls).toBe(5);
      for (const locale of ANALYSIS_LOCALES) {
        const saved = (await readSpeciesAnalysisContent(id, worktree))[locale]
          .data;
        expect(saved.description).toBe(
          repairSucceeds
            ? "Test species is a ground bird."
            : "Test species is a bird.",
        );
        expect(saved.overview).toBe("A bird measures 20 cm.");
      }
      if (!repairSucceeds)
        expect(report).toContain("სამეცნიერო სახელის ცვლილება უარყოფილია");
    },
  );

  it.each([true, false])(
    "repairs changed numbers or preserves every affected field (%s)",
    async (repairSucceeds) => {
      const initial = original.replace(
        "overview:",
        'habitat: "Recorded at two sites."\ndiet: "Eats insects."\noverview:',
      );
      for (const locale of ANALYSIS_LOCALES)
        await fs.writeFile(
          path.join(worktree, `src/content/species/${id}/${locale}.mdx`),
          initial,
        );
      let calls = 0;
      mockAgent(async ({ output, prompt }) => {
        const stage = SUPER_ANALYSIS_STAGES[Math.min(calls, 3)];
        calls++;
        if (calls === 5) expect(prompt).toContain("original number");
        const response: SuperAnalysisResult = {
          coverage: speciesAnalysisSurfaces.map((surface) => surface.id),
          edits: [],
          evidence: [],
          findings: [],
          lookalikes: [],
          sources: [],
          stage,
          summary: "Reviewed",
        };
        if (stage === "texts")
          response.edits = [
            {
              after: values(
                calls === 5 && repairSucceeds
                  ? "Noted at two sites."
                  : "Recorded at 3 sites.",
              ),
              before: values("Recorded at two sites."),
              evidenceIds: [],
              field: "habitat",
              reason: "Clearer habitat",
            },
            {
              after: values(
                calls === 5 && repairSucceeds
                  ? "A bird measures 20 cm."
                  : "A bird is 25 cm.",
              ),
              before: values("A bird is 20 cm."),
              evidenceIds: [],
              field: "overview",
              reason: "Clearer overview",
            },
            {
              after: values("Feeds on insects."),
              before: values("Eats insects."),
              evidenceIds: [],
              field: "diet",
              reason: "Clearer diet",
            },
          ];
        await fs.writeFile(output, JSON.stringify(response));
      });
      const run = await createSuperAnalysisRunner(id, worktree, directory);
      for (const stage of SUPER_ANALYSIS_STAGES.slice(0, 3)) await run(stage);
      const report = await run("texts");
      expect(calls).toBe(5);
      for (const locale of ANALYSIS_LOCALES) {
        const saved = (await readSpeciesAnalysisContent(id, worktree))[locale]
          .data;
        expect(saved.habitat).toBe(
          repairSucceeds ? "Noted at two sites." : "Recorded at two sites.",
        );
        expect(saved.overview).toBe(
          repairSucceeds ? "A bird measures 20 cm." : "A bird is 20 cm.",
        );
        expect(saved.diet).toBe("Feeds on insects.");
      }
      if (!repairSucceeds) {
        expect(report).toContain("habitat: რიცხვების ცვლილება უარყოფილია");
        expect(report).toContain("overview: რიცხვების ცვლილება უარყოფილია");
      }
    },
  );
});
