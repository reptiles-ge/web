import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";

import { notifyAdminTelegram } from "@/lib/adminTelegram";
import {
  discardSuperAnalysisCheckpoint,
  runSpeciesWorkflow,
} from "@/lib/speciesPageAnalysis";
import {
  getSpeciesSuperAnalysisJob,
  resumeSpeciesSuperAnalysisJob,
  startSpeciesSuperAnalysisJob,
} from "@/lib/speciesSuperAnalysisJobs";

vi.mock("@/lib/speciesPageAnalysis", () => ({
  discardSuperAnalysisCheckpoint: vi.fn(),
  runSpeciesWorkflow: vi.fn(),
}));
vi.mock("@/lib/adminTelegram", () => ({ notifyAdminTelegram: vi.fn() }));

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
    await vi.waitFor(() =>
      expect(notifyAdminTelegram).toHaveBeenCalledWith(
        expect.stringContaining(`Super Analysis completed: ${id}`),
      ),
    );
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
    await vi.waitFor(() =>
      expect(notifyAdminTelegram).toHaveBeenCalledWith(
        expect.stringContaining(
          "lookalikes; 1/4 completed)\nOpen the admin page for the error details.",
        ),
      ),
    );
  });

  it("notifies on thrown failures without changing the failed job", async () => {
    vi.mocked(runSpeciesWorkflow).mockRejectedValueOnce(
      new Error("Codex unavailable"),
    );
    const id = `test-${randomUUID()}`;
    const job = startSpeciesSuperAnalysisJob(id, randomUUID());
    await vi.waitFor(() =>
      expect(notifyAdminTelegram).toHaveBeenCalledWith(
        expect.stringContaining(
          `Super Analysis failed: ${id} (startup; 0/4 completed)\nOpen the admin page for the error details.`,
        ),
      ),
    );
    expect(job.status).toBe("failed");
    expect(job.error).toBe("Codex unavailable");
    expect(notifyAdminTelegram).not.toHaveBeenCalledWith(
      expect.stringContaining("Codex unavailable"),
    );
  });

  it("reloads a persisted job and reports a non-error failure", async () => {
    const missing = `missing-${randomUUID()}`;
    expect(await getSpeciesSuperAnalysisJob(missing)).toBeNull();
    const readFile = vi.spyOn(fs, "readFile");
    const mkdir = vi.spyOn(fs, "mkdir").mockResolvedValue(undefined);
    const writeFile = vi.spyOn(fs, "writeFile").mockResolvedValue(undefined);
    const rename = vi.spyOn(fs, "rename").mockResolvedValue(undefined);
    readFile.mockRejectedValueOnce(
      Object.assign(new Error("disk"), { code: "EIO" }),
    );
    await expect(getSpeciesSuperAnalysisJob(missing)).rejects.toThrow("disk");

    const id = `resume-${randomUUID()}`;
    readFile.mockResolvedValueOnce(
      JSON.stringify({
        currentStage: "analysis",
        error: null,
        pullRequestUrl: null,
        runId: randomUUID(),
        speciesId: id,
        status: "running",
        steps: [],
      }),
    );
    const resumed = await getSpeciesSuperAnalysisJob(id);
    expect(resumed?.status).toBe("failed");
    expect(resumed?.error).toContain("interrupted");
    readFile.mockRestore();
    mkdir.mockRestore();
    writeFile.mockRestore();
    rename.mockRestore();

    vi.mocked(runSpeciesWorkflow).mockRejectedValueOnce("offline");
    vi.mocked(notifyAdminTelegram).mockRejectedValueOnce(new Error("telegram"));
    const thrown = startSpeciesSuperAnalysisJob(
      `throw-${randomUUID()}`,
      randomUUID(),
    );
    await vi.waitFor(() => expect(thrown.status).toBe("failed"));
    expect(thrown.error).toBe("Super Analysis failed");
  });

  it("resumes a failed run from its saved checkpoint and discards it on a fresh start", async () => {
    const id = `test-${randomUUID()}`;
    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, _stages, onStep, options) => {
        options?.onStage("analysis");
        await options?.onCheckpoint?.({
          baseCommit: "abc",
          branch: `feature/species-workflow-${id}-12345678`,
          reports: ["Research report"],
          results: [],
          worktree: "/tmp/old/checkout",
        });
        await onStep("analysis", "Research report");
        options?.onStage("lookalikes");
        return {
          error: "The operation was aborted",
          failedStep: "lookalikes",
          pullRequestUrl: null,
        };
      },
    );
    const failed = startSpeciesSuperAnalysisJob(id, randomUUID());
    await vi.waitFor(() => expect(failed.status).toBe("failed"));
    expect(failed.resumable).toBe(true);

    vi.mocked(runSpeciesWorkflow).mockResolvedValueOnce({
      error: null,
      failedStep: null,
      pullRequestUrl: "https://github.com/test/reptiles/pull/1",
    });
    const resumed = await resumeSpeciesSuperAnalysisJob(id, randomUUID());
    expect(resumed?.steps).toEqual([
      { mode: "analysis", report: "Research report" },
    ]);
    await vi.waitFor(() => expect(resumed?.status).toBe("completed"));
    expect(vi.mocked(runSpeciesWorkflow).mock.lastCall?.[3]?.resume).toEqual(
      expect.objectContaining({ reports: ["Research report"] }),
    );
    expect(discardSuperAnalysisCheckpoint).not.toHaveBeenCalled();

    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, _stages, _onStep, options) => {
        await options?.onCheckpoint?.({
          baseCommit: "abc",
          branch: `feature/species-workflow-${id}-87654321`,
          reports: ["Again"],
          results: [],
          worktree: "/tmp/old/checkout",
        });
        return {
          error: "boom",
          failedStep: "lookalikes",
          pullRequestUrl: null,
        };
      },
    );
    const second = startSpeciesSuperAnalysisJob(id, randomUUID());
    await vi.waitFor(() => expect(second.status).toBe("failed"));
    vi.mocked(runSpeciesWorkflow).mockResolvedValueOnce({
      error: null,
      failedStep: null,
      pullRequestUrl: null,
    });
    const fresh = startSpeciesSuperAnalysisJob(id, randomUUID());
    await vi.waitFor(() => expect(fresh.status).toBe("completed"));
    expect(discardSuperAnalysisCheckpoint).toHaveBeenCalledWith(
      expect.objectContaining({
        branch: `feature/species-workflow-${id}-87654321`,
      }),
    );
    expect(vi.mocked(runSpeciesWorkflow).mock.lastCall?.[3]?.resume).toBeNull();
  });
});
