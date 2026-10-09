"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SpeciesSuperAnalysis } from "@/components/admin/SpeciesSuperAnalysis";

type Copy = {
  action: string;
  addStep: string;
  availableSteps: string;
  closeWorkflow: string;
  configureWorkflow: string;
  emptyWorkflow: string;
  error: string;
  linksAction: string;
  linksProcessing: string;
  lookalikesAction: string;
  lookalikesProcessing: string;
  moveDown: string;
  moveUp: string;
  noChanges: string;
  openPr: string;
  processing: string;
  recordsAction: string;
  recordsProcessing: string;
  removeStep: string;
  report: string;
  runWorkflow: string;
  sameBranch: string;
  sameBranchHint: string;
  superAction: string;
  superCompleted: string;
  superDescription: string;
  superFailed: string;
  superPending: string;
  superReconnecting: string;
  superRunning: string;
  superValidation: string;
  textsAction: string;
  textsError: string;
  textsNoChanges: string;
  textsProcessing: string;
  textsReport: string;
  textsStale: string;
  workflowDescription: string;
  workflowError: string;
  workflowProcessing: string;
  workflowTitle: string;
};
type Mode = "analysis" | "links" | "lookalikes" | "records" | "texts";
type Result = { mode: Mode; pullRequestUrl?: null | string; report: string };
const modes: Mode[] = ["analysis", "texts", "lookalikes", "links", "records"];
const storageKey = "species-page-analysis-workflow";

export function SpeciesPageAnalysis({ copy, id }: { copy: Copy; id: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragFrom = useRef<Mode | null>(null);
  const [selected, setSelected] = useState<Mode[]>(modes);
  const [sameBranch, setSameBranch] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [superRunning, setSuperRunning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState<Mode | null>(null);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [sharedResult, setSharedResult] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    let active = true;
    try {
      const saved = JSON.parse(
        localStorage.getItem(storageKey) ?? "null",
      ) as null | {
        sameBranch?: unknown;
        selected?: unknown;
      };
      if (saved && Array.isArray(saved.selected)) {
        const valid = saved.selected.filter(
          (mode): mode is Mode =>
            typeof mode === "string" && modes.includes(mode as Mode),
        );
        queueMicrotask(() => {
          if (active) setSelected([...new Set(valid)]);
        });
      }
      if (saved && typeof saved.sameBranch === "boolean")
        queueMicrotask(() => {
          if (active) setSameBranch(saved.sameBranch as boolean);
        });
    } catch {
      localStorage.removeItem(storageKey);
    }
    queueMicrotask(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (loaded)
      localStorage.setItem(
        storageKey,
        JSON.stringify({ sameBranch, selected }),
      );
  }, [loaded, selected, sameBranch]);

  const labels: Record<Mode, string> = {
    analysis: copy.action,
    links: copy.linksAction,
    lookalikes: copy.lookalikesAction,
    records: copy.recordsAction,
    texts: copy.textsAction,
  };
  const progress: Record<Mode, string> = {
    analysis: copy.processing,
    links: copy.linksProcessing,
    lookalikes: copy.lookalikesProcessing,
    records: copy.recordsProcessing,
    texts: copy.textsProcessing,
  };

  function move(from: Mode, to: Mode) {
    setSelected((current) => {
      const next = [...current];
      const source = next.indexOf(from);
      const target = next.indexOf(to);
      if (source < 0 || target < 0 || source === target) return current;
      next.splice(source, 1);
      next.splice(target, 0, from);
      return next;
    });
  }

  async function requestStep(
    mode: Mode,
    progress?: { current: number; total: number },
  ): Promise<Result> {
    const response = await fetch(
      mode === "texts"
        ? "/api/admin/species-texts"
        : "/api/admin/species-analysis",
      {
        body: JSON.stringify({ id, mode, progress }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
    const result = (await response.json()) as {
      error?: string;
      pullRequestUrl?: null | string;
      report?: string;
    };
    if (!response.ok)
      throw new Error(
        mode === "texts" && result.error === "stale"
          ? copy.textsStale
          : mode === "texts"
            ? copy.textsError
            : copy.error,
      );
    return {
      mode,
      pullRequestUrl: result.pullRequestUrl,
      report: result.report ?? "",
    };
  }

  async function launch(mode: Mode) {
    if (processing) return;
    setProcessing(true);
    setWorkflowRunning(false);
    setSharedResult(false);
    setCurrentMode(mode);
    setResults([]);
    setError("");
    try {
      setResults([await requestStep(mode)]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.error);
    } finally {
      setProcessing(false);
      setCurrentMode(null);
    }
  }

  async function launchWorkflow() {
    if (processing || !selected.length) return;
    dialogRef.current?.close();
    setProcessing(true);
    setWorkflowRunning(true);
    setSharedResult(sameBranch);
    setCurrentMode(null);
    setResults([]);
    setError("");
    try {
      if (sameBranch) {
        const response = await fetch("/api/admin/species-workflow", {
          body: JSON.stringify({ id, modes: selected }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const result = (await response.json()) as {
          error?: string;
          failedStep?: Mode | null;
          pullRequestUrl?: null | string;
          steps?: Array<{ mode: Mode; report: string }>;
        };
        setResults(
          (result.steps ?? []).map((step) => ({
            ...step,
            pullRequestUrl: result.pullRequestUrl,
          })),
        );
        if (result.failedStep)
          setError(
            `${labels[result.failedStep]}: ${result.error ?? copy.workflowError}`,
          );
        else if (!response.ok)
          throw new Error(result.error ?? copy.workflowError);
      } else {
        for (const [index, mode] of selected.entries()) {
          setCurrentMode(mode);
          const result = await requestStep(mode, {
            current: index + 1,
            total: selected.length,
          });
          setResults((current) => [...current, result]);
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.workflowError);
    } finally {
      setProcessing(false);
      setCurrentMode(null);
      setWorkflowRunning(false);
    }
  }

  if (collapsed)
    return (
      <button
        aria-expanded="false"
        aria-label={copy.action}
        className="fixed top-28 right-4 z-100 flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xl transition-colors hover:bg-secondary"
        onClick={(event) => {
          event.stopPropagation();
          setCollapsed(false);
        }}
        type="button"
      >
        <Plus aria-hidden className="size-5" />
      </button>
    );

  return (
    <aside
      aria-label={copy.action}
      className="fixed top-28 right-4 z-80 max-h-[calc(100vh-8rem)] w-fit max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-background p-2 text-foreground shadow-xl"
    >
      <button
        aria-label={copy.closeWorkflow}
        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        onClick={() => setCollapsed(true)}
        type="button"
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <SpeciesSuperAnalysis
        copy={{
          action: copy.superAction,
          completed: copy.superCompleted,
          description: copy.superDescription,
          failed: copy.superFailed,
          noChanges: copy.noChanges,
          openPr: copy.openPr,
          pending: copy.superPending,
          reconnecting: copy.superReconnecting,
          report: copy.report,
          running: copy.superRunning,
          validation: copy.superValidation,
        }}
        disabled={processing}
        id={id}
        labels={labels}
        onBusyChange={setSuperRunning}
      />
      <button
        className="w-full min-w-44 rounded-lg bg-primary px-4 py-2.5 pr-10 text-sm font-medium text-white disabled:opacity-60 dark:text-ink"
        disabled={processing || superRunning || !selected.length}
        onClick={() => void launchWorkflow()}
        type="button"
      >
        {copy.runWorkflow}
      </button>
      <button
        className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
        disabled={processing || superRunning}
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        {copy.configureWorkflow}
      </button>
      {modes.map((mode) => (
        <button
          className="mt-2 w-full min-w-44 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          disabled={processing || superRunning}
          key={mode}
          onClick={() => void launch(mode)}
          type="button"
        >
          {labels[mode]}
        </button>
      ))}
      <div
        aria-live="polite"
        className="max-w-[min(22rem,calc(100vw-4rem))] text-sm"
      >
        {processing ? (
          <p className="mt-3 text-muted-foreground">
            {currentMode ? progress[currentMode] : copy.workflowProcessing}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-destructive">{error}</p> : null}
        {results.map((result, index) => (
          <div className="mt-3 border-t border-border pt-3" key={result.mode}>
            <h2 className="font-semibold">{labels[result.mode]}</h2>
            {result.pullRequestUrl && (!sharedResult || index === 0) ? (
              <a
                className="mt-2 block font-medium text-primary underline"
                href={result.pullRequestUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {copy.openPr}
              </a>
            ) : null}
            {!result.pullRequestUrl && !sharedResult && !workflowRunning ? (
              <p className="mt-2 text-muted-foreground">
                {result.mode === "texts" ? copy.textsNoChanges : copy.noChanges}
              </p>
            ) : null}
            {sharedResult &&
            index === 0 &&
            !result.pullRequestUrl &&
            !workflowRunning &&
            !error ? (
              <p className="mt-2 text-muted-foreground">{copy.noChanges}</p>
            ) : null}
            {result.report ? (
              <div className="mt-2">
                <h3 className="font-medium">
                  {result.mode === "texts" ? copy.textsReport : copy.report}
                </h3>
                <pre className="mt-2 font-sans text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {result.report}
                </pre>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <dialog
        aria-labelledby="species-workflow-title"
        className="fixed inset-0 z-100 m-auto max-h-[min(85vh,48rem)] w-[min(92vw,32rem)] max-w-none rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl backdrop:bg-black/70"
        ref={dialogRef}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold" id="species-workflow-title">
              {copy.workflowTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.workflowDescription}
            </p>
          </div>
          <button
            aria-label={copy.closeWorkflow}
            className="rounded p-1 hover:bg-secondary"
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <ol className="mt-5 space-y-2">
          {selected.map((mode, index) => (
            <li
              className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-sm"
              key={mode}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragFrom.current) move(dragFrom.current, mode);
                dragFrom.current = null;
              }}
            >
              <span className="w-5 text-center text-muted-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">{labels[mode]}</span>
              <button
                aria-label={`${labels[mode]}: ${copy.moveUp}`}
                className="rounded p-1 hover:bg-secondary disabled:opacity-30"
                disabled={index === 0}
                onClick={() => move(mode, selected[index - 1])}
                type="button"
              >
                <ChevronUp aria-hidden className="size-4" />
              </button>
              <button
                aria-label={`${labels[mode]}: ${copy.moveDown}`}
                className="rounded p-1 hover:bg-secondary disabled:opacity-30"
                disabled={index === selected.length - 1}
                onClick={() => move(mode, selected[index + 1])}
                type="button"
              >
                <ChevronDown aria-hidden className="size-4" />
              </button>
              <button
                aria-label={`${labels[mode]}: ${copy.removeStep}`}
                className="rounded p-1 text-destructive hover:bg-secondary"
                onClick={() =>
                  setSelected((current) =>
                    current.filter((item) => item !== mode),
                  )
                }
                type="button"
              >
                <X aria-hidden className="size-4" />
              </button>
              <span
                aria-label={`${labels[mode]}: ${copy.workflowDescription}`}
                className="cursor-grab rounded p-1 text-muted-foreground active:cursor-grabbing"
                draggable
                onDragEnd={() => {
                  dragFrom.current = null;
                }}
                onDragStart={(event) => {
                  dragFrom.current = mode;
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", mode);
                }}
              >
                <GripVertical aria-hidden className="size-4" />
              </span>
            </li>
          ))}
        </ol>
        {!selected.length ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {copy.emptyWorkflow}
          </p>
        ) : null}
        {selected.length < modes.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-medium">{copy.availableSteps}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {modes
                .filter((mode) => !selected.includes(mode))
                .map((mode) => (
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-sm hover:bg-secondary"
                    key={mode}
                    onClick={() => setSelected((current) => [...current, mode])}
                    type="button"
                  >
                    <Plus aria-hidden className="size-4" />
                    {labels[mode]}
                    <span className="sr-only">{copy.addStep}</span>
                  </button>
                ))}
            </div>
          </div>
        ) : null}
        <label className="mt-6 flex items-start gap-3 border-t border-border pt-4 text-sm">
          <input
            checked={sameBranch}
            className="mt-1"
            onChange={(event) => setSameBranch(event.target.checked)}
            type="checkbox"
          />
          <span>
            <span className="font-medium">{copy.sameBranch}</span>
            <span className="mt-1 block text-muted-foreground">
              {copy.sameBranchHint}
            </span>
          </span>
        </label>
        <button
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:text-ink"
          disabled={!selected.length}
          onClick={() => void launchWorkflow()}
          type="button"
        >
          {copy.runWorkflow}
        </button>
      </dialog>
    </aside>
  );
}
