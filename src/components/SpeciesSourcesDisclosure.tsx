"use client";

import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { FaqAnswerPanel } from "@/components/FaqAccordionParts";
import { cn } from "@/lib/cn";

export function SpeciesSourcesDisclosure({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-t border-border">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex min-h-13 w-full items-center justify-between gap-3 text-left text-[14px] font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-14 lg:text-[15px]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
      <div aria-hidden={!open} id={panelId} inert={!open}>
        <FaqAnswerPanel isOpen={open}>
          <div className="border-t border-border">{children}</div>
        </FaqAnswerPanel>
      </div>
    </div>
  );
}
