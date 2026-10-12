"use client";

import { useEffect, useState } from "react";

import {
  SUPER_ANALYSIS_STAGES,
  type SuperAnalysisJob,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";

type Copy = {
  action: string;
  completed: string;
  description: string;
  failed: string;
  noChanges: string;
  openPr: string;
  pending: string;
  reconnecting: string;
  report: string;
  resume: string;
  running: string;
  validation: string;
};

export function SpeciesSuperAnalysis({
  copy,
  disabled,
  id,
  labels,
  onBusyChange,
}: {
  copy: Copy;
  disabled: boolean;
  id: string;
  labels: Record<SuperAnalysisStage, string>;
  onBusyChange: (busy: boolean) => void;
}) {
  const [job, setJob] = useState<null | SuperAnalysisJob>(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const response = await fetch(
          `/api/admin/species-super-analysis?id=${encodeURIComponent(id)}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) throw new Error("Progress unavailable");
        const next = (await response.json()) as null | SuperAnalysisJob;
        if (controller.signal.aborted) return;
        setJob(next);
        setError("");
        onBusyChange(next?.status === "running");
        if (next?.status === "running")
          timer = setTimeout(() => void poll(), 2000);
      } catch {
        if (controller.signal.aborted) return;
        setError(copy.reconnecting);
        timer = setTimeout(() => void poll(), 5000);
      }
    };
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [copy.reconnecting, generation, id, onBusyChange]);

  async function launch(resume = false) {
    setStarting(true);
    setError("");
    onBusyChange(true);
    try {
      const response = await fetch("/api/admin/species-super-analysis", {
        body: JSON.stringify({ id, resume, runId: crypto.randomUUID() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as SuperAnalysisJob;
      if (!response.ok) throw new Error(result.error || copy.failed);
      setJob(result);
      setGeneration((value) => value + 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.failed);
      onBusyChange(false);
    } finally {
      setStarting(false);
    }
  }

  return (
    <section className="mb-2 max-w-80 border-b border-border pb-3">
      <button
        className="w-full rounded-lg bg-primary px-4 py-2.5 pr-10 text-sm font-semibold text-white disabled:opacity-60 dark:text-ink"
        disabled={disabled || starting || job?.status === "running"}
        onClick={() => void launch()}
        type="button"
      >
        {copy.action}
      </button>
      <p className="mt-2 max-w-72 text-xs leading-relaxed text-muted-foreground">
        {copy.description}
      </p>
      <div aria-live="polite" className="text-xs">
        {job ? (
          <>
            <ol className="mt-3 space-y-2">
              {SUPER_ANALYSIS_STAGES.map((stage, index) => {
                const done = job.steps.some((step) => step.mode === stage);
                const current = job.currentStage === stage;
                const status = done
                  ? copy.completed
                  : current
                    ? job.status === "failed"
                      ? copy.failed
                      : copy.running
                    : copy.pending;
                return (
                  <li
                    aria-current={
                      current && job.status === "running" ? "step" : undefined
                    }
                    className="flex justify-between gap-3"
                    key={stage}
                  >
                    <span>
                      {index + 1}. {labels[stage]}
                    </span>
                    <span
                      className={
                        done ? "text-primary" : "text-muted-foreground"
                      }
                    >
                      {status}
                    </span>
                  </li>
                );
              })}
            </ol>
            {job.currentStage === "validation" ? (
              <p className="mt-2">
                {copy.validation}:{" "}
                {job.status === "running"
                  ? copy.running
                  : job.status === "failed"
                    ? copy.failed
                    : copy.completed}
              </p>
            ) : null}
            {job.status === "completed" && !job.pullRequestUrl ? (
              <p className="mt-3">{copy.noChanges}</p>
            ) : null}
            {job.pullRequestUrl ? (
              <a
                className="mt-3 block font-medium text-primary underline"
                href={job.pullRequestUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {copy.openPr}
              </a>
            ) : null}
            {job.error ? (
              <p className="mt-3 text-destructive">
                {copy.failed}: {job.error}
              </p>
            ) : null}
            {job.status === "failed" && job.resumable ? (
              <button
                className="mt-3 w-full rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-60"
                disabled={disabled || starting}
                onClick={() => void launch(true)}
                type="button"
              >
                {copy.resume}
              </button>
            ) : null}
          </>
        ) : null}
        {error ? <p className="mt-3 text-destructive">{error}</p> : null}
      </div>
      {job?.steps.map((step) => (
        <details className="mt-3 text-xs" key={step.mode}>
          <summary className="cursor-pointer font-medium">
            {labels[step.mode]} — {copy.report}
          </summary>
          <pre className="mt-2 max-h-80 overflow-y-auto font-sans leading-relaxed whitespace-pre-wrap">
            {step.report}
          </pre>
        </details>
      ))}
    </section>
  );
}
