"use client";

import type { ReactNode } from "react";

import {
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import {
  FaqAnswerPanel,
  FaqQuestion,
  FaqToggleIcon,
} from "@/components/FaqAccordionParts";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";
import { useFaqAccordion } from "@/lib/faqAccordion";

type ClusterFaqEditable = {
  id: string;
  kind: string;
};

type ClusterFaqItem = {
  answer: ReactNode;
  question: string;
};

type ClusterFaqSectionProps = {
  intro: {
    body: string;
    eyebrow: string;
    title: string;
  };
  items: ClusterFaqItem[];
  surface?: "background" | "surface";
};

export function ClusterFaqList({
  editable,
  items,
  onOpen,
}: {
  editable?: ClusterFaqEditable;
  items: ClusterFaqItem[];
  onOpen?: (index: number) => void;
}) {
  const accordion = useFaqAccordion(onOpen);
  const contentAttributes = (index: number, part: "answer" | "question") =>
    editable
      ? {
          "data-content-field": `faq.${index}.${part}`,
          "data-content-id": editable.id,
          "data-content-kind": editable.kind,
        }
      : {};

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = accordion.isOpen(index);
        const ids = accordion.ids(index);
        return (
          <div key={item.question}>
            <div className="border-t border-border last:border-b">
              <FaqQuestion
                className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                ids={ids}
                isOpen={isOpen}
                onToggle={() => accordion.toggle(index)}
              >
                <span
                  className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]"
                  {...contentAttributes(index, "question")}
                >
                  {item.question}
                </span>
                <FaqToggleIcon isOpen={isOpen} />
              </FaqQuestion>
              <FaqAnswerPanel ids={ids} isOpen={isOpen}>
                <p
                  className="pr-12 pb-7 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground sm:text-[16px]"
                  {...contentAttributes(index, "answer")}
                >
                  <PhoneLinkedText>{item.answer}</PhoneLinkedText>
                </p>
              </FaqAnswerPanel>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ClusterFaqSection({
  intro,
  items,
  surface = "surface",
}: ClusterFaqSectionProps) {
  return (
    <section
      className={cn(
        "border-t border-border py-24 lg:py-32",
        surface === "surface" ? "bg-surface" : "bg-background",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <ClusterSectionIntro
              body={intro.body}
              bodyClassName={CLUSTER_FAQ_BODY}
              eyebrow={intro.eyebrow}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={intro.title}
              titleClassName={CLUSTER_FAQ_TITLE}
            />
          </div>
          <ClusterFaqList items={items} />
        </div>
      </div>
    </section>
  );
}
