import type { ReactNode } from "react";

import { Plus } from "lucide-react";

import { cn } from "@/lib/cn";

export function FaqAnswerPanel({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function FaqToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300",
        isOpen ? "rotate-45 bg-ink text-ink-foreground" : "text-foreground",
      )}
    >
      <Plus className="size-4" strokeWidth={1.75} />
    </span>
  );
}
