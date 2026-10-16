"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const buttonClass =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-(--nw-line) bg-(--nw-card) text-(--nw-ink) transition-colors hover:border-(--nw-sep) hover:text-(--nw-accent)";

export function NewsShareButtons({
  copiedLabel,
  copyLabel,
  facebookLabel,
  url,
}: {
  copiedLabel: string;
  copyLabel: string;
  facebookLabel: string;
  url: string;
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
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className="inline-flex shrink-0 gap-1.5">
      <button
        aria-label={copied ? copiedLabel : copyLabel}
        className={buttonClass}
        onClick={onCopy}
        title={copied ? copiedLabel : copyLabel}
        type="button"
      >
        {copied ? (
          <Check
            aria-hidden="true"
            className="size-[15px] text-(--nw-accent)"
            strokeWidth={2.4}
          />
        ) : (
          <Link2
            aria-hidden="true"
            className="size-[15px]"
            strokeWidth={1.75}
          />
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
      </button>
      <a
        aria-label={facebookLabel}
        className={buttonClass}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        rel="noopener noreferrer"
        target="_blank"
        title={facebookLabel}
      >
        <svg
          aria-hidden="true"
          className="size-4 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z" />
        </svg>
      </a>
    </span>
  );
}
