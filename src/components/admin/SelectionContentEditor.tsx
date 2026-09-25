"use client";

import { useEffect, useRef, useState } from "react";

type EditorCopy = {
  action: string;
  codexError: string;
  error: string;
  gitError: string;
  networkError: string;
  openPr: string;
  processing: string;
  requestError: string;
  retry: string;
  success: string;
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
  const busy = useRef(false);
  const [selection, setSelection] = useState<null | Selection>(null);
  const [status, setStatus] = useState<
    "error" | "idle" | "processing" | "success"
  >("idle");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const update = () => {
      if (busy.current || status === "processing") return;
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || selected.rangeCount !== 1)
        return;
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
      if (!range.toString().trim()) return;
      const rect = range.getBoundingClientRect();
      const above = rect.top > 110;
      setSelection({
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
        top: above ? rect.top - 8 : rect.bottom + 8,
      });
      setStatus(invalid ? "error" : "idle");
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
  }, [copy.requestError, status]);

  async function submit() {
    if (!selection || selection.invalid || status === "processing") return;
    busy.current = true;
    setStatus("processing");
    try {
      const response = await fetch("/api/admin/content-edit", {
        body: JSON.stringify({
          end: selection.end,
          field: selection.field,
          id: selection.id,
          kind: selection.kind,
          renderedText: selection.renderedText,
          start: selection.start,
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
      setUrl(result.pullRequestUrl);
      setStatus("success");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : copy.networkError);
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  if (!selection) return null;
  const number = url.match(/\/pull\/(\d+)$/)?.[1];
  return (
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
          onClick={submit}
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
              onClick={submit}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {copy.retry}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
