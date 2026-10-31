"use client";

import { useId, useState } from "react";

import {
  FaqAnswerPanel,
  FaqQuestion,
  FaqToggleIcon,
} from "@/components/FaqAccordionParts";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { faqItemIds } from "@/lib/faqAccordion";

export function GuideFaqItems({
  editable,
  id: articleId,
  items,
}: {
  editable?: boolean;
  id?: string;
  items: { answer: string; question: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(() => items.map((_, index) => index === 0));

  return (
    <div className="mt-7">
      {items.map((item, index) => {
        const isOpen = open[index] ?? false;
        const ids = faqItemIds(id, index);

        return (
          <div
            className="border-t border-border last:border-b"
            key={item.question}
          >
            <FaqQuestion
              className="flex w-full items-start justify-between gap-6 py-6 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-inset"
              ids={ids}
              isOpen={isOpen}
              onToggle={() =>
                setOpen((current) =>
                  current.map((value, itemIndex) =>
                    itemIndex === index ? !value : value,
                  ),
                )
              }
            >
              <span
                className="font-display text-xl font-semibold text-foreground"
                data-content-field={
                  editable ? `faq.${index}.question` : undefined
                }
                data-content-id={editable ? articleId : undefined}
                data-content-kind={editable ? "guide" : undefined}
              >
                {item.question}
              </span>
              <FaqToggleIcon isOpen={isOpen} />
            </FaqQuestion>
            <FaqAnswerPanel ids={ids} isOpen={isOpen}>
              <p
                className="pr-12 pb-7 text-[16px] leading-[1.8] text-muted-foreground"
                data-content-field={
                  editable ? `faq.${index}.answer` : undefined
                }
                data-content-id={editable ? articleId : undefined}
                data-content-kind={editable ? "guide" : undefined}
              >
                <PhoneLinkedText>{item.answer}</PhoneLinkedText>
              </p>
            </FaqAnswerPanel>
          </div>
        );
      })}
    </div>
  );
}
