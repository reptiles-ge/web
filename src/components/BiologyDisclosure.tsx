"use client";

import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { FaqAnswerPanel } from "@/components/FaqAccordionParts";
import { cn } from "@/lib/cn";

export function BiologyDisclosure({
  children,
  defaultOpen,
  title,
}: {
  children: ReactNode;
  defaultOpen: boolean;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="rounded-[22px] bg-card p-5 shadow-[0_10px_26px_rgba(14,20,17,0.05)]">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left font-display text-[17px] font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span>{title}</span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </span>
      </button>
      <div aria-hidden={!open} id={panelId} inert={!open}>
        <FaqAnswerPanel isOpen={open}>{children}</FaqAnswerPanel>
      </div>
    </div>
  );
}
