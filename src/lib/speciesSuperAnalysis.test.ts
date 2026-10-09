import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runCodexProcess } from "@/lib/codexProcess";
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

vi.mock("@/lib/codexProcess", () => ({ runCodexProcess: vi.fn() }));
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
    vi.mocked(runCodexProcess).mockImplementation(async ({ args, prompt }) => {
      expect(args).toContain("read-only");
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
      await fs.writeFile(
        args[args.indexOf("--output-last-message") + 1],
        JSON.stringify(result),
      );
    });
    const run = await createSuperAnalysisRunner(id, worktree, directory);
    for (const stage of SUPER_ANALYSIS_STAGES) await run(stage);
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
    expect(runCodexProcess).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "repairs missing evidence once, applying only a validated response (%s)",
    async (repairSucceeds) => {
      let calls = 0;
      vi.mocked(runCodexProcess).mockImplementation(
        async ({ args, prompt }) => {
          calls++;
          if (calls === 2) {
            expect(prompt).toContain("field overview");
            expect(prompt).toContain("Never change a status to verified");
            expect(
              (await readSpeciesAnalysisContent(id, worktree)).ka.raw,
            ).toBe(original);
          }
          await fs.writeFile(
            args[args.indexOf("--output-last-message") + 1],
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
        },
      );
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
    vi.mocked(runCodexProcess).mockImplementation(async ({ args }) => {
      await fs.writeFile(
        args[args.indexOf("--output-last-message") + 1],
        '{"stage":"analysis"}',
      );
    });
    const run = await createSuperAnalysisRunner(id, worktree, directory);
    await expect(run("analysis")).rejects.toThrow();
    expect(runCodexProcess).toHaveBeenCalledTimes(1);
    for (const locale of ANALYSIS_LOCALES)
      expect((await readSpeciesAnalysisContent(id, worktree))[locale].raw).toBe(
        original,
      );
    await expect(run("lookalikes")).rejects.toThrow("order");
  });
});
