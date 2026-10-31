"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import type { GroupHubId } from "@/lib/groupHubs";

import { FaqAnswerPanel } from "@/components/FaqAccordionParts";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export type GroupHubFaqItem = {
  answer: ReactNode;
  n: number;
  question: string;
};

export function GroupHubFaqAccordion({
  hubId,
  items,
}: {
  hubId: GroupHubId;
  items: GroupHubFaqItem[];
}) {
  const [open, setOpen] = useState<null | number>(0);

  return (
    <div className="-mx-2 mt-[22px] flex min-w-0 flex-1 flex-col gap-2 lg:mx-0 lg:mt-0 lg:gap-2.5">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            className="rounded-[22px] bg-card shadow-[0_1px_2px_rgba(14,20,17,0.04),0_10px_26px_rgba(14,20,17,0.05)] lg:rounded-[24px]"
            key={item.n}
          >
            <h3>
              <button
                aria-expanded={isOpen}
                className="flex min-h-16 w-full items-center justify-between gap-3.5 rounded-[22px] py-3 pr-3.5 pl-5 text-left lg:min-h-[72px] lg:gap-5 lg:rounded-[24px] lg:py-4 lg:pr-5 lg:pl-[26px]"
                onClick={() => {
                  const next = isOpen ? null : index;
                  setOpen(next);
                  if (next !== null) {
                    trackEvent("faq_open", {
                      entity_id: hubId,
                      faq_index: next,
                      page_type: "hub",
                    });
                  }
                }}
                type="button"
              >
                <span className="text-[15px] leading-[1.35] font-semibold text-foreground lg:text-[17px]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full transition-[rotate,background-color] duration-200",
                    isOpen
                      ? "rotate-180 bg-[#2f6b4f] text-white"
                      : "bg-background text-foreground",
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </h3>
            <FaqAnswerPanel isOpen={isOpen}>
              <p className="px-5 pb-5 text-[14px] leading-[1.65] text-muted-foreground lg:pr-[76px] lg:pb-6 lg:pl-[26px] lg:text-[15px] lg:leading-[1.7]">
                {item.answer}
              </p>
            </FaqAnswerPanel>
          </div>
        );
      })}
    </div>
  );
}
