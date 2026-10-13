"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

export function ContactCopyButton({
  copiedLabel,
  copyLabel,
  email,
  srLabel,
}: {
  copiedLabel: string;
  copyLabel: string;
  email: string;
  srLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }

    setCopied(true);
    trackEvent("contact_copy", { page_type: "contact" });
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      aria-label={copied ? copiedLabel : srLabel}
      className="inline-flex size-[50px] shrink-0 cursor-pointer items-center justify-center gap-[9px] rounded-full border border-border bg-(--nw-card) text-[15px] font-medium text-(--nw-ink) transition-colors hover:border-(--nw-sep) md:h-[52px] md:w-auto md:px-5"
      onClick={onCopy}
      type="button"
    >
      {copied ? (
        <span className="inline-flex items-center gap-[9px] text-(--nw-accent)">
          <Check
            aria-hidden="true"
            className="size-[18px] md:size-4"
            strokeWidth={2.4}
          />
          <span className="hidden md:inline">{copiedLabel}</span>
        </span>
      ) : (
        <>
          <Copy aria-hidden="true" className="size-[18px] md:size-4" />
          <span className="hidden md:inline">{copyLabel}</span>
        </>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
