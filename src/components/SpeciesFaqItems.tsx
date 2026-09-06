"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import type { SpeciesFaq } from "@/data/species";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { type PageType, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type SpeciesFaqItemsProps = {
  entityId: string;
  items: SpeciesFaq[];
  pageType: PageType;
};

export function SpeciesFaqItems({
  entityId,
  items,
  pageType,
}: SpeciesFaqItemsProps) {
  const [open, setOpen] = useState<null | number>(0);

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            className="border-t border-border last:border-b"
            key={item.question}
          >
            <button
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
              onClick={() => {
                const next = isOpen ? null : index;
                setOpen(next);
                if (next !== null) {
                  trackEvent("faq_open", {
                    entity_id: entityId,
                    faq_index: next,
                    page_type: pageType,
                  });
                }
              }}
              type="button"
            >
              <span className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                {item.question}
              </span>
              <span
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
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pr-12 pb-7 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
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
