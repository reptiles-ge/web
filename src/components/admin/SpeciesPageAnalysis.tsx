"use client";

import { useState } from "react";

type Copy = {
  action: string;
  error: string;
  linksAction: string;
  linksProcessing: string;
  lookalikesAction: string;
  lookalikesProcessing: string;
  noChanges: string;
  openPr: string;
  processing: string;
  recordsAction: string;
  recordsProcessing: string;
  report: string;
  textsAction: string;
  textsError: string;
  textsNoChanges: string;
  textsProcessing: string;
  textsReport: string;
  textsStale: string;
};

type Mode = "analysis" | "links" | "lookalikes" | "records" | "texts";

export function SpeciesPageAnalysis({ copy, id }: { copy: Copy; id: string }) {
  const [processing, setProcessing] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);
  const [complete, setComplete] = useState(false);
  const [mode, setMode] = useState<Mode>("analysis");

  async function launch(nextMode: Mode) {
    if (processing) return;
    setMode(nextMode);
    setProcessing(true);
    setReport("");
    setError("");
    setPullRequestUrl(null);
    setComplete(false);
    try {
      const response = await fetch(
        nextMode === "texts"
          ? "/api/admin/species-texts"
          : "/api/admin/species-analysis",
        {
          body: JSON.stringify({ id, mode: nextMode }),
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
          nextMode === "texts" && result.error === "stale"
            ? copy.textsStale
            : nextMode === "texts"
              ? copy.textsError
              : copy.error,
        );
      setPullRequestUrl(result.pullRequestUrl ?? null);
      setComplete(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : nextMode === "texts"
            ? copy.textsError
            : copy.error,
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
      <button
        className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
        disabled={processing}
        onClick={() => void launch("lookalikes")}
        type="button"
      >
        {copy.lookalikesAction}
      </button>
      <button
        className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
        disabled={processing}
        onClick={() => void launch("links")}
        type="button"
      >
        {copy.linksAction}
      </button>
      <button
        className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
        disabled={processing}
        onClick={() => void launch("records")}
        type="button"
      >
        {copy.recordsAction}
      </button>
      <div
        aria-live="polite"
        className="max-w-[min(22rem,calc(100vw-4rem))] text-sm"
      >
        {processing ? (
          <p className="mt-3 text-muted-foreground">
            {mode === "analysis"
              ? copy.processing
              : mode === "texts"
                ? copy.textsProcessing
                : mode === "lookalikes"
                  ? copy.lookalikesProcessing
                  : mode === "links"
                    ? copy.linksProcessing
                    : copy.recordsProcessing}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-destructive">{error}</p> : null}
        {complete && !pullRequestUrl ? (
          <p className="mt-3 text-muted-foreground">
            {mode === "texts" ? copy.textsNoChanges : copy.noChanges}
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
              {mode === "texts" ? copy.textsReport : copy.report}
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
