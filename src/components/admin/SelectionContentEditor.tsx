"use client";

import { useEffect, useRef, useState } from "react";

type EditorCopy = {
  action: string;
  close: string;
  codexError: string;
  error: string;
  gitError: string;
  jobs: string;
  networkError: string;
  openPr: string;
  processing: string;
  requestError: string;
  retry: string;
  success: string;
};

type Job = {
  error: string;
  id: string;
  selection: Selection;
  status: "error" | "processing" | "success";
  url: string;
};

type Selection = {
  above: boolean;
  end: number;
  field: string;
  id: string;
  invalid: boolean;
  kind: "guide" | "message" | "news" | "region" | "species";
  left: number;
  renderedText: string;
  start: number;
  top: number;
};

export function SelectionContentEditor({ copy }: { copy: EditorCopy }) {
  const pending = useRef(new Set<string>());
  const activeJob = useRef<null | string>(null);
  const audio = useRef<AudioContext | null>(null);
  const allSucceeded = useRef(false);
  const [selection, setSelection] = useState<null | Selection>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState<
    "error" | "idle" | "processing" | "success"
  >("idle");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const complete =
      jobs.length > 0 && jobs.every((job) => job.status === "success");
    if (complete && !allSucceeded.current)
      playStatusSound(audio.current, "success");
    allSucceeded.current = complete;
  }, [jobs]);

  useEffect(
    () => () => {
      void audio.current?.close().catch(() => {});
      audio.current = null;
    },
    [],
  );

  useEffect(() => {
    const update = () => {
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || selected.rangeCount !== 1) {
        setSelection(null);
        return;
      }
      const range = selected.getRangeAt(0);
      const startNode =
        range.startContainer.nodeType === Node.ELEMENT_NODE
          ? (range.startContainer as Element)
          : range.startContainer.parentElement;
      const endNode =
        range.endContainer.nodeType === Node.ELEMENT_NODE
          ? (range.endContainer as Element)
          : range.endContainer.parentElement;
      const fieldElement =
        startNode?.closest<HTMLElement>("[data-content-field]") ??
        startNode?.closest<HTMLElement>(
          "p,h1,h2,h3,h4,h5,h6,li,blockquote,figcaption,span,a,td,th,dt,dd",
        );
      if (
        !fieldElement ||
        !endNode ||
        !fieldElement.closest("#main") ||
        fieldElement.closest("nav,footer,[role='navigation']") ||
        (fieldElement.closest("button") && !fieldElement.dataset.contentField)
      ) {
        setSelection(null);
        return;
      }
      const field = fieldElement.dataset.contentField ?? "auto";
      const id = fieldElement.dataset.contentId ?? "messages";
      const kind = (fieldElement.dataset.contentKind ??
        (field === "auto" ? "message" : "species")) as Selection["kind"];
      const invalid = !fieldElement.contains(endNode);
      const before = range.cloneRange();
      if (!invalid) {
        before.selectNodeContents(fieldElement);
        before.setEnd(range.startContainer, range.startOffset);
      }
      const start = invalid ? 0 : before.toString().length;
      const end = start + range.toString().length;
      if (!range.toString().trim()) {
        setSelection(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      const above = rect.top > 110 || rect.bottom > window.innerHeight - 90;
      const next = {
        above,
        end,
        field,
        id,
        invalid,
        kind,
        left: Math.max(
          140,
          Math.min(window.innerWidth - 140, rect.left + rect.width / 2),
        ),
        renderedText: fieldElement.textContent ?? "",
        start,
        top: above
          ? Math.max(90, Math.min(window.innerHeight - 8, rect.top - 8))
          : Math.max(8, Math.min(window.innerHeight - 90, rect.bottom + 8)),
      };
      activeJob.current = null;
      setSelection(next);
      setStatus(
        invalid
          ? "error"
          : pending.current.has(selectionKey(next))
            ? "processing"
            : "idle",
      );
      setError(invalid ? copy.requestError : "");
      setUrl("");
    };
    const handleMouseUp = () => window.setTimeout(update, 0);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", update);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", update);
    };
  }, [copy.requestError]);

  async function launch(target: Selection, retryId?: string) {
    if (target.invalid) return;
    const key = selectionKey(target);
    if (pending.current.has(key)) return;
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
    } catch {
      audio.current = null;
    }
    pending.current.add(key);
    allSucceeded.current = false;
    const id = retryId ?? crypto.randomUUID();
    const nextJob: Job = {
      error: "",
      id,
      selection: target,
      status: "processing",
      url: "",
    };
    setJobs((current) =>
      retryId
        ? current.map((job) => (job.id === retryId ? nextJob : job))
        : [nextJob, ...current],
    );
    if (!retryId) {
      activeJob.current = id;
      setStatus("processing");
    }
    try {
      const response = await fetch("/api/admin/content-edit", {
        body: JSON.stringify({
          end: target.end,
          field: target.field,
          id: target.id,
          kind: target.kind,
          renderedText: target.renderedText,
          start: target.start,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok || !result.pullRequestUrl) {
        throw new Error(
          result.error === "request"
            ? copy.requestError
            : result.error === "codex"
              ? copy.codexError
              : copy.gitError,
        );
      }
      setJobs((current) =>
        current.map((job) =>
          job.id === id
            ? { ...job, status: "success", url: result.pullRequestUrl! }
            : job,
        ),
      );
      if (activeJob.current === id) {
        setUrl(result.pullRequestUrl);
        setStatus("success");
      }
    } catch (failure) {
      const message =
        failure instanceof Error ? failure.message : copy.networkError;
      setJobs((current) =>
        current.map((job) =>
          job.id === id ? { ...job, error: message, status: "error" } : job,
        ),
      );
      if (activeJob.current === id) {
        setError(message);
        setStatus("error");
      }
      playStatusSound(audio.current, "error");
    } finally {
      pending.current.delete(key);
    }
  }

  const number = url.match(/\/pull\/(\d+)$/)?.[1];
  return (
    <>
      {jobs.length ? (
        <aside
          aria-label={copy.jobs}
          className="fixed top-24 right-4 z-90 max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-border bg-background p-3 text-sm text-foreground shadow-xl"
          onMouseUp={(event) => event.stopPropagation()}
        >
          <h2 className="mb-3 font-semibold">
            {copy.jobs} · {jobs.length}
          </h2>
          <ul aria-live="polite" className="space-y-2">
            {jobs.map((job) => {
              const jobNumber = job.url.match(/\/pull\/(\d+)$/)?.[1];
              return (
                <li
                  className="rounded-lg border border-border p-2"
                  key={job.id}
                >
                  <p className="font-medium wrap-break-word">
                    {job.selection.renderedText
                      .slice(job.selection.start, job.selection.end)
                      .trim()
                      .slice(0, 80)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.status === "processing"
                      ? `◌ ${copy.processing}`
                      : job.status === "success"
                        ? `✓ ${copy.success}${jobNumber ? ` · PR #${jobNumber}` : ""}`
                        : `✕ ${copy.error}`}
                  </p>
                  {job.status === "success" ? (
                    <a
                      className="mt-1 block font-medium text-primary underline"
                      href={job.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {copy.openPr}
                    </a>
                  ) : job.status === "error" ? (
                    <>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {job.error}
                      </p>
                      <button
                        className="mt-1 font-medium text-primary underline"
                        onClick={() => void launch(job.selection, job.id)}
                        onMouseDown={(event) => event.preventDefault()}
                        type="button"
                      >
                        {copy.retry}
                      </button>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}
      {selection ? (
        <div
          className="fixed z-100 w-64 rounded-xl border border-border bg-background p-3 text-sm text-foreground shadow-xl"
          onMouseUp={(event) => event.stopPropagation()}
          role="status"
          style={{
            left: selection.left,
            top: selection.top,
            transform: selection.above
              ? "translate(-50%, -100%)"
              : "translate(-50%, 0)",
          }}
        >
          {status === "idle" ? (
            <button
              className="w-full rounded-lg bg-primary px-3 py-2 font-medium text-white dark:text-ink"
              onClick={() => void launch(selection)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {copy.action}
            </button>
          ) : status === "processing" ? (
            <div className="flex items-center gap-2 px-2 py-1">
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              {copy.processing}
            </div>
          ) : status === "success" ? (
            <div className="space-y-2">
              <p>
                ✓ {copy.success}
                {number ? ` · PR #${number}` : ""}
              </p>
              <a
                className="block font-medium text-primary underline"
                href={url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {copy.openPr}
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <p>✕ {copy.error}</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              {!selection.invalid ? (
                <button
                  className="font-medium text-primary underline"
                  onClick={() => void launch(selection)}
                  onMouseDown={(event) => event.preventDefault()}
                  type="button"
                >
                  {copy.retry}
                </button>
              ) : null}
            </div>
          )}
          <button
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 font-medium text-foreground hover:bg-secondary"
            onClick={() => {
              activeJob.current = null;
              window.getSelection()?.removeAllRanges();
              setSelection(null);
            }}
            onMouseDown={(event) => event.preventDefault()}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      ) : null}
    </>
  );
}

function playStatusSound(
  context: AudioContext | null,
  status: "error" | "success",
) {
  if (!context || context.state === "closed") return;
  try {
    void context.resume().catch(() => {});
    const notes = status === "success" ? [660, 880] : [440, 330];
    notes.forEach((frequency, index) => {
      const start = context.currentTime + index * 0.14;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.12);
    });
  } catch {
    return;
  }
}

function selectionKey(selection: Selection) {
  return `${selection.kind}:${selection.id}:${selection.field}:${selection.start}:${selection.end}:${selection.renderedText}`;
}
