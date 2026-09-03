"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { GroupHubId } from "@/lib/groupHubs";

import {
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const faqLinkClassName = "text-foreground underline-offset-4 hover:underline";

export function GroupHubFaqSection({ hubId }: { hubId: GroupHubId }) {
  const t = useTranslations(hubId);
  const [open, setOpen] = useState<null | number>(0);
  const items = useMemo(() => hubFaqIndices(hubId, t), [hubId, t]);

  return (
    <section className="border-t border-border bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <ClusterSectionIntro
              body={t("faqIntro")}
              bodyClassName={CLUSTER_FAQ_BODY}
              eyebrow={t("faqEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("faqTitle")}
              titleClassName={CLUSTER_FAQ_TITLE}
            />
          </Reveal>
          <div>
            {items.map((n, index) => {
              const isOpen = open === index;
              return (
                <Reveal delay={index * 50} key={n}>
                  <div className="border-t border-border last:border-b">
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
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
                      <span className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                        {t(`faq${n}Q`)}
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
                          {hubId === "snakes" && n === 5 ? (
                            <SnakesFaq5Answer />
                          ) : hubId === "turtles" && n === 4 ? (
                            <TurtlesFaq4Answer />
                          ) : (
                            t(`faq${n}A`)
                          )}
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

function hubFaqIndices(
  hubId: GroupHubId,
  t: ReturnType<typeof useTranslations>,
) {
  const max = hubId === "turtles" ? 8 : 5;
  const indices: number[] = [];
  for (let n = 1; n <= max; n += 1) {
    if (t.has(`faq${n}Q`)) indices.push(n);
  }
  return indices;
}

function SnakesFaq5Answer() {
  const t = useTranslations("snakes");

  return t.rich("faq5A", {
    bite: (chunks) => (
      <Link className={faqLinkClassName} href="/snakes/gvelis-nakbeni">
        {chunks}
      </Link>
    ),
    yard: (chunks) => (
      <Link className={faqLinkClassName} href="/snakes-in-the-yard">
        {chunks}
      </Link>
    ),
  });
}

function TurtlesFaq4Answer() {
  const t = useTranslations("turtles");

  return t.rich("faq4A", {
    identify: (chunks) => (
      <Link className={faqLinkClassName} href="/turtles/identifikacia">
        {chunks}
      </Link>
    ),
  });
}
