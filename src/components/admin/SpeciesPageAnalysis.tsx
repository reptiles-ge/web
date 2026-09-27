"use client";

import { useState } from "react";

type Copy = {
  action: string;
  error: string;
  noChanges: string;
  openPr: string;
  processing: string;
  report: string;
  textsAction: string;
  textsError: string;
  textsNoChanges: string;
  textsProcessing: string;
  textsReport: string;
  textsStale: string;
};

export function SpeciesPageAnalysis({ copy, id }: { copy: Copy; id: string }) {
  const [processing, setProcessing] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);
  const [complete, setComplete] = useState(false);
  const [mode, setMode] = useState<"analysis" | "texts">("analysis");

  async function launch(nextMode: "analysis" | "texts") {
    if (processing) return;
    setMode(nextMode);
    setProcessing(true);
    setReport("");
    setError("");
    setPullRequestUrl(null);
    setComplete(false);
    try {
      const response = await fetch(
        nextMode === "analysis"
          ? "/api/admin/species-analysis"
          : "/api/admin/species-texts",
        {
          body: JSON.stringify({ id }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
      );
      const result = (await response.json()) as {
        error?: string;
        pullRequestUrl?: null | string;
        report?: string;
      };
      setReport(result.report ?? "");
      if (!response.ok)
        throw new Error(
          nextMode === "analysis"
            ? copy.error
            : result.error === "stale"
              ? copy.textsStale
              : copy.textsError,
        );
      setPullRequestUrl(result.pullRequestUrl ?? null);
      setComplete(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : nextMode === "analysis"
            ? copy.error
            : copy.textsError,
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <aside
      aria-label={copy.action}
      className="fixed top-28 right-4 z-80 max-h-[calc(100vh-8rem)] w-fit max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-background p-2 text-foreground shadow-xl"
    >
      <button
        className="w-full min-w-44 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:text-ink"
        disabled={processing}
        onClick={() => void launch("analysis")}
        type="button"
      >
        {copy.action}
      </button>
      <button
        className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
        disabled={processing}
        onClick={() => void launch("texts")}
        type="button"
      >
        {copy.textsAction}
      </button>
      <div
        aria-live="polite"
        className="max-w-[min(22rem,calc(100vw-4rem))] text-sm"
      >
        {processing ? (
          <p className="mt-3 text-muted-foreground">
            {mode === "analysis" ? copy.processing : copy.textsProcessing}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-destructive">{error}</p> : null}
        {complete && !pullRequestUrl ? (
          <p className="mt-3 text-muted-foreground">
            {mode === "analysis" ? copy.noChanges : copy.textsNoChanges}
          </p>
        ) : null}
        {pullRequestUrl ? (
          <a
            className="mt-3 block font-medium text-primary underline"
            href={pullRequestUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {copy.openPr}
          </a>
        ) : null}
        {report ? (
          <div className="mt-4 border-t border-border pt-4">
            <h2 className="font-semibold">
              {mode === "analysis" ? copy.report : copy.textsReport}
            </h2>
            <pre className="mt-3 font-sans text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
              {report}
            </pre>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
