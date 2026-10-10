import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { readAdminSpeciesGallery } from "@/lib/adminGalleryMdx";
import { notifyAdminTelegram } from "@/lib/adminTelegram";
import { runSpeciesWorkflow } from "@/lib/speciesPageAnalysis";
import {
  SUPER_ANALYSIS_STAGES,
  type SuperAnalysisJob,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";

const state = globalThis as typeof globalThis & {
  speciesSuperJobs?: Map<string, SuperAnalysisJob>;
};
const jobs = (state.speciesSuperJobs ??= new Map<string, SuperAnalysisJob>());
const directory = path.join(
  os.tmpdir(),
  `reptiles-super-analysis-${createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12)}`,
);

export async function getSpeciesSuperAnalysisJob(id: string) {
  const running = jobs.get(id);
  if (running) return running;
  let job: SuperAnalysisJob;
  try {
    job = JSON.parse(
      await fs.readFile(path.join(directory, `${id}.json`), "utf8"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  if (job.status === "running") {
    job.status = "failed";
    job.error =
      "Local server restarted. The run was interrupted; start a new analysis after reviewing any existing PR.";
    await save(job);
    await notifyResult(job);
  }
  return job;
}

export function startSpeciesSuperAnalysisJob(id: string, runId: string) {
  const current = jobs.get(id);
  if (current?.status === "running" || current?.runId === runId) return current;
  const job: SuperAnalysisJob = {
    currentStage: null,
    error: null,
    pullRequestUrl: null,
    runId,
    speciesId: id,
    status: "running",
    steps: [],
  };
  jobs.set(id, job);
  void execute(job);
  return job;
}

async function execute(job: SuperAnalysisJob) {
  let persistence = Promise.resolve();
  const checkpoint = () => {
    const snapshot = structuredClone(job);
    persistence = persistence.then(() => save(snapshot));
    return persistence;
  };
  try {
    await checkpoint();
    const result = await runSpeciesWorkflow(
      job.speciesId,
      [...SUPER_ANALYSIS_STAGES],
      async (mode, report) => {
        job.steps.push({ mode: mode as SuperAnalysisStage, report });
        await checkpoint();
      },
      {
        onStage: (stage) => {
          job.currentStage = stage;
          void checkpoint().catch(() => undefined);
        },
        superAnalysis: true,
      },
    );
    job.pullRequestUrl = result.pullRequestUrl;
    job.error = result.error;
    job.status = result.error ? "failed" : "completed";
  } catch (error) {
    job.status = "failed";
    job.error =
      error instanceof Error ? error.message : "Super Analysis failed";
  } finally {
    await checkpoint().catch((error: unknown) => {
      console.error("species-super-analysis-checkpoint", error);
    });
    await notifyResult(job);
  }
}

async function notifyResult(job: SuperAnalysisJob) {
  try {
    let name = job.speciesId;
    try {
      name = readAdminSpeciesGallery(job.speciesId).commonName;
    } catch {
      name = job.speciesId;
    }
    await notifyAdminTelegram(
      job.status === "failed"
        ? `❌ Super Analysis failed: ${name} (${job.currentStage ?? "startup"}; ${job.steps.length}/4 completed)\n${job.error?.slice(0, 1000) ?? "Unknown error"}`
        : `✅ Super Analysis completed: ${name} (4/4)\n${job.pullRequestUrl ?? "No content changes; no PR created."}`,
    );
  } catch {
    console.error("species-super-analysis-telegram", "Notification failed");
  }
}

async function save(job: SuperAnalysisJob) {
  await fs.mkdir(directory, { mode: 0o700, recursive: true });
  const file = path.join(directory, `${job.speciesId}.json`);
  await fs.writeFile(`${file}.tmp`, JSON.stringify(job), { mode: 0o600 });
  await fs.rename(`${file}.tmp`, file);
}
