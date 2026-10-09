import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import { runSpeciesWorkflow } from "@/lib/speciesPageAnalysis";
import {
  getSpeciesSuperAnalysisJob,
  startSpeciesSuperAnalysisJob,
} from "@/lib/speciesSuperAnalysisJobs";

vi.mock("@/lib/speciesPageAnalysis", () => ({ runSpeciesWorkflow: vi.fn() }));

describe("Super Analysis jobs", () => {
  it("deduplicates concurrent submissions and reconnects to the same progress", async () => {
    let finish!: () => void;
    const gate = new Promise<void>((resolve) => {
      finish = resolve;
    });
    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, _stages, onStep, options) => {
        options?.onStage("analysis");
        await onStep("analysis", "Validated first stage");
        await gate;
        return { error: null, failedStep: null, pullRequestUrl: null };
      },
    );
    const id = `test-${randomUUID()}`;
    const first = startSpeciesSuperAnalysisJob(id, randomUUID());
    expect(startSpeciesSuperAnalysisJob(id, randomUUID())).toBe(first);
    await vi.waitFor(() => expect(first.steps).toHaveLength(1));
    expect(await getSpeciesSuperAnalysisJob(id)).toBe(first);
    expect(first.currentStage).toBe("analysis");
    finish();
    await vi.waitFor(() => expect(first.status).toBe("completed"));
    expect(startSpeciesSuperAnalysisJob(id, first.runId)).toBe(first);
  });

  it("preserves completed reports and exposes a failed stage without a PR", async () => {
    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, _stages, onStep, options) => {
        await onStep("analysis", "Research report");
        options?.onStage("lookalikes");
        return {
          error: "Unverified evidence",
          failedStep: "lookalikes",
          pullRequestUrl: null,
        };
      },
    );
    const job = startSpeciesSuperAnalysisJob(
      `test-${randomUUID()}`,
      randomUUID(),
    );
    await vi.waitFor(() => expect(job.status).toBe("failed"));
    expect(job.steps).toEqual([
      { mode: "analysis", report: "Research report" },
    ]);
    expect(job.pullRequestUrl).toBeNull();
    expect(job.error).toBe("Unverified evidence");
  });
});
