"use client";

import { type ReactNode, useState } from "react";

import {
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { FaqAnswerPanel, FaqToggleIcon } from "@/components/FaqAccordionParts";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

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

export function ClusterFaqSection({
  intro,
  items,
  surface = "surface",
}: ClusterFaqSectionProps) {
  const [open, setOpen] = useState<null | number>(0);

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
          <div>
            {items.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.question}>
                  <div className="border-t border-border last:border-b">
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                      onClick={() => setOpen(isOpen ? null : index)}
                      type="button"
                    >
                      <span className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                        {item.question}
                      </span>
                      <FaqToggleIcon isOpen={isOpen} />
                    </button>
                    <FaqAnswerPanel isOpen={isOpen}>
                      <p className="pr-12 pb-7 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground sm:text-[16px]">
                        <PhoneLinkedText>{item.answer}</PhoneLinkedText>
                      </p>
                    </FaqAnswerPanel>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
