"use client";

import { useState } from "react";

type Copy = {
  action: string;
  error: string;
  noChanges: string;
  openPr: string;
  processing: string;
  report: string;
};

export function SpeciesPageAnalysis({ copy, id }: { copy: Copy; id: string }) {
  const [processing, setProcessing] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);
  const [complete, setComplete] = useState(false);

  async function launch() {
    if (processing) return;
    setProcessing(true);
    setReport("");
    setError("");
    setPullRequestUrl(null);
    setComplete(false);
    try {
      const response = await fetch("/api/admin/species-analysis", {
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        pullRequestUrl?: null | string;
        report?: string;
      };
      setReport(result.report ?? "");
      if (!response.ok) throw new Error(result.error ?? copy.error);
      setPullRequestUrl(result.pullRequestUrl ?? null);
      setComplete(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.error);
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
        onClick={() => void launch()}
        type="button"
      >
        {copy.action}
      </button>
      <div
        aria-live="polite"
        className="max-w-[min(22rem,calc(100vw-4rem))] text-sm"
      >
        {processing ? (
          <p className="mt-3 text-muted-foreground">{copy.processing}</p>
        ) : null}
        {error ? <p className="mt-3 text-red-600">{error}</p> : null}
        {complete && !pullRequestUrl ? (
          <p className="mt-3 text-muted-foreground">{copy.noChanges}</p>
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
            <h2 className="font-semibold">{copy.report}</h2>
            <pre className="mt-3 font-sans text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
              {report}
            </pre>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
