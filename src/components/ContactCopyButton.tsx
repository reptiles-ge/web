"use client";

import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

export function ContactCopyButton({
  copiedLabel,
  copyLabel,
  email,
  failedLabel,
  srLabel,
}: {
  copiedLabel: string;
  copyLabel: string;
  email: string;
  failedLabel: string;
  srLabel: string;
}) {
  const [status, setStatus] = useState<"copied" | "failed" | "idle">("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function onCopy() {
    let next: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(email);
      trackEvent("contact_copy", { page_type: "contact" });
    } catch {
      next = "failed";
    }

    setStatus(next);
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  }

  const statusLabel =
    status === "copied" ? copiedLabel : status === "failed" ? failedLabel : "";

  return (
    <button
      aria-label={statusLabel || srLabel}
      className="inline-flex size-[50px] shrink-0 cursor-pointer items-center justify-center gap-[9px] rounded-full border border-border bg-(--nw-card) text-[15px] font-medium text-(--nw-ink) transition-colors hover:border-(--nw-sep) md:h-[52px] md:w-auto md:px-5"
      onClick={onCopy}
      type="button"
    >
      {status === "copied" ? (
        <span className="inline-flex items-center gap-[9px] text-(--nw-accent)">
          <Check
            aria-hidden="true"
            className="size-[18px] md:size-4"
            strokeWidth={2.4}
          />
          <span className="hidden md:inline">{copiedLabel}</span>
        </span>
      ) : status === "failed" ? (
        <span className="inline-flex items-center gap-[9px] text-(--nw-danger-fg)">
          <X
            aria-hidden="true"
            className="size-[18px] md:size-4"
            strokeWidth={2.4}
          />
          <span className="hidden md:inline">{failedLabel}</span>
        </span>
      ) : (
        <>
          <Copy aria-hidden="true" className="size-[18px] md:size-4" />
          <span className="hidden md:inline">{copyLabel}</span>
        </>
      )}
      <span aria-live="polite" className="sr-only">
        {statusLabel}
      </span>
    </button>
  );
}
