"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function SpeciesScientificNameCopy({
  speciesId,
  text,
}: {
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

  const label = copied ? t("copiedSpecies") : t("copySpecies");

  return (
    <button
      aria-label={label}
      className={cn(
        "not-italic inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:text-white/80 focus-visible:outline-2 focus-visible:outline-white/50 group-hover/sci:text-white/70",
        copied && "text-white/80",
      )}
      onClick={onCopy}
      title={label}
      type="button"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5" strokeWidth={2} />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" strokeWidth={2} />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? t("copiedSpecies") : ""}
      </span>
    </button>
  );
}
