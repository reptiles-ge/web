"use client";

import { Check, Copy, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function SpeciesScientificNameCopy({
  className,
  shareTitle,
  speciesId,
  text,
}: {
  className?: string;
  shareTitle?: string;
  speciesId: string;
  text: string;
}) {
  const t = useTranslations("profile");
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
      if (shareTitle && typeof navigator.share === "function") {
        await navigator.share({ text, title: shareTitle });
        return;
      }
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    setCopied(true);
    trackEvent("species_name_copy", { species_id: speciesId });
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const idleLabel = shareTitle ? t("share") : t("copySpecies");
  const label = copied ? t("copiedSpecies") : idleLabel;
  const Icon = shareTitle ? Share : Copy;

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full not-italic transition-colors focus-visible:outline-2",
        className ??
          "size-11 text-white/55 group-hover/sci:text-white/80 hover:bg-white/10 hover:text-white focus-visible:text-white focus-visible:outline-white/50",
        copied && !className && "text-white",
      )}
      onClick={onCopy}
      title={label}
      type="button"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5" strokeWidth={2} />
      ) : (
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? t("copiedSpecies") : ""}
      </span>
    </button>
  );
}
