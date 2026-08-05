"use client";

import type { SpeciesFaq } from "@/data/species";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type SpeciesFaqSectionProps = {
  items: SpeciesFaq[];
  name: string;
};

export function SpeciesFaqSection({ items, name }: SpeciesFaqSectionProps) {
  const t = useTranslations("profile");
  const [open, setOpen] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("faq")}
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              {t("faqTitle")}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("faqIntroBefore")}
              {name}
              {t("faqIntroAfter")}
            </p>
          </div>

          <div>
            {items.map((item, index) => {
              const isOpen = open === index;
              return (
                <div
                  key={item.question}
                  className="border-t border-border last:border-b"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                  >
                    <span className="font-display text-[17px] font-medium leading-snug text-foreground sm:text-[19px]">
                      {item.question}
                    </span>
                    <span
                      className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-ink text-ink-foreground" : "text-foreground"
                      }`}
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-12 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                        {item.answer}
                      </p>
                    </div>
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
