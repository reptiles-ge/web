"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

type ClusterFaqItem = {
  answer: string;
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
          <Reveal>
            <ClusterSectionIntro
              body={intro.body}
              bodyClassName={CLUSTER_FAQ_BODY}
              eyebrow={intro.eyebrow}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={intro.title}
              titleClassName={CLUSTER_FAQ_TITLE}
            />
          </Reveal>
          <div>
            {items.map((item, index) => {
              const isOpen = open === index;
              return (
                <Reveal delay={index * 50} key={`${item.question}-${index}`}>
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
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
