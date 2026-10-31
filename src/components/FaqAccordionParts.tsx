import type { ReactNode } from "react";

import { Plus } from "lucide-react";

import type { FaqItemIds } from "@/lib/faqAccordion";

import { cn } from "@/lib/cn";

export function FaqAnswerPanel({
  children,
  ids,
  isOpen,
}: {
  children: ReactNode;
  ids?: FaqItemIds;
  isOpen: boolean;
}) {
  return (
    <div
      aria-labelledby={ids?.triggerId}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      id={ids?.panelId}
      inert={ids ? !isOpen : undefined}
      role={ids ? "region" : undefined}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function FaqQuestion({
  children,
  className,
  ids,
  isOpen,
  onToggle,
}: {
  children: ReactNode;
  className: string;
  ids: FaqItemIds;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <h3>
      <button
        aria-controls={ids.panelId}
        aria-expanded={isOpen}
        className={className}
        id={ids.triggerId}
        onClick={onToggle}
        type="button"
      >
        {children}
      </button>
    </h3>
  );
}

export function FaqToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300",
        isOpen ? "rotate-45 bg-ink text-ink-foreground" : "text-foreground",
      )}
    >
      <Plus className="size-4" strokeWidth={1.75} />
    </span>
  );
}
