"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

import type { SpeciesFaq } from "@/data/species";

import { FaqAnswerPanel, FaqQuestion } from "@/components/FaqAccordionParts";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { type PageType, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useFaqAccordion } from "@/lib/faqAccordion";

type SpeciesFaqItemsProps = {
  editable: boolean;
  entityId: string;
  items: SpeciesFaq[];
  moreLabel: string;
  pageType: PageType;
  visibleCount: number;
};

export function SpeciesFaqItems({
  editable,
  entityId,
  items,
  moreLabel,
  pageType,
  visibleCount,
}: SpeciesFaqItemsProps) {
  const accordion = useFaqAccordion((index) =>
    trackEvent("faq_open", {
      entity_id: entityId,
      faq_index: index,
      page_type: pageType,
    }),
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 lg:gap-2.5">
      {items.map((item, index) => {
        const isOpen = accordion.isOpen(index);
        const ids = accordion.ids(index);
        return (
          <div
            className="rounded-[22px] bg-card shadow-[0_10px_26px_rgba(14,20,17,0.05)] lg:rounded-[24px]"
            hidden={!expanded && index >= visibleCount}
            key={item.question}
          >
            <FaqQuestion
              className="flex min-h-16 w-full items-center justify-between gap-4 rounded-[22px] py-3 pr-3.5 pl-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-[72px] lg:gap-5 lg:rounded-[24px] lg:pr-5 lg:pl-[26px]"
              ids={ids}
              isOpen={isOpen}
              onToggle={() => accordion.toggle(index)}
            >
              <span
                className="font-display text-[15.5px] leading-snug font-semibold text-foreground lg:text-[17px]"
                data-content-field={
                  editable ? `faq.${index}.question` : undefined
                }
                data-content-id={editable ? entityId : undefined}
                data-content-kind={editable ? "species" : undefined}
              >
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full transition-[background-color,color,rotate] duration-300",
                  isOpen
                    ? "rotate-45 bg-primary text-white dark:text-ink"
                    : "bg-surface text-foreground",
                )}
              >
                <Plus className="size-4" strokeWidth={1.75} />
              </span>
            </FaqQuestion>
            <FaqAnswerPanel ids={ids} isOpen={isOpen}>
              <p
                className="px-5 pb-5 text-[16px] leading-[1.65] whitespace-pre-line text-muted-foreground lg:pr-[76px] lg:pb-6 lg:pl-[26px] lg:text-[16px] lg:leading-[1.7]"
                data-content-field={
                  editable ? `faq.${index}.answer` : undefined
                }
                data-content-id={editable ? entityId : undefined}
                data-content-kind={editable ? "species" : undefined}
              >
                <PhoneLinkedText>{item.answer}</PhoneLinkedText>
              </p>
            </FaqAnswerPanel>
          </div>
        );
      })}
      {!expanded && items.length > visibleCount ? (
        <button
          className="mt-1 inline-flex min-h-[52px] items-center justify-center gap-2 self-stretch rounded-full border border-border bg-card px-6 text-[15px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:self-start"
          onClick={() => setExpanded(true)}
          type="button"
        >
          {moreLabel}
          <ChevronDown aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
