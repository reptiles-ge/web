"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

export function WaspNestFaqItems({
  items,
}: {
  items: { answer: string; question: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(() =>
    items.map((_, index) => index === 0),
  );

  return (
    <div className="mt-7">
      {items.map((item, index) => {
        const isOpen = open[index];
        const triggerId = `${id}-question-${index}`;
        const panelId = `${id}-answer-${index}`;

        return (
          <div
            className="border-t border-border last:border-b"
            key={item.question}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-6 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-inset"
                id={triggerId}
                onClick={() =>
                  setOpen((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  )
                }
                type="button"
              >
                <span className="font-display text-xl font-semibold text-foreground">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300",
                    isOpen
                      ? "rotate-45 bg-ink text-ink-foreground"
                      : "text-foreground",
                  )}
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                </span>
              </button>
            </h3>
            <div
              aria-hidden={!isOpen}
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              id={panelId}
              inert={!isOpen}
              role="region"
            >
              <div className="overflow-hidden">
                <p className="pr-12 pb-7 text-[16px] leading-[1.8] text-muted-foreground">
                  <PhoneLinkedText>{item.answer}</PhoneLinkedText>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
