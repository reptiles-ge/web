"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";

import type { GroupHubId } from "@/lib/groupHubs";

import { FaqAnswerPanel } from "@/components/FaqAccordionParts";
import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
} from "@/components/GroupHubSectionHeading";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { hubFaqLinks } from "@/lib/groupHubFaq";

const faqLinkClassName = "text-foreground underline-offset-4 hover:underline";

export function GroupHubFaqSection({
  hubId,
  speciesCount,
}: {
  hubId: GroupHubId;
  speciesCount: number;
}) {
  const t = useTranslations(hubId);
  const [open, setOpen] = useState<null | number>(0);
  const items = useMemo(() => hubFaqIndices(hubId, t), [hubId, t]);

  return (
    <section className="scroll-mt-36 bg-surface py-11 lg:py-20" id="faq">
      <div
        className={cn(HUB_CONTAINER, "lg:flex lg:items-start lg:gap-[72px]")}
      >
        <div className="lg:w-[400px] lg:shrink-0">
          <GroupHubSectionHeading
            compact
            eyebrow={t("faqEyebrow")}
            lead={t("faqIntro")}
            stacked
            title={t("faqTitle")}
          />
        </div>
        <div className="-mx-2 mt-[22px] flex min-w-0 flex-1 flex-col gap-2 lg:mx-0 lg:mt-0 lg:gap-2.5">
          {items.map((n, index) => {
            const isOpen = open === index;
            return (
              <div
                className="rounded-[22px] bg-card shadow-[0_1px_2px_rgba(14,20,17,0.04),0_10px_26px_rgba(14,20,17,0.05)] lg:rounded-[24px]"
                key={n}
              >
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
                    {t(`faq${n}Q`)}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-200",
                      isOpen
                        ? "rotate-180 bg-[#2f6b4f] text-white"
                        : "bg-background text-foreground",
                    )}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>
                <FaqAnswerPanel isOpen={isOpen}>
                  <p className="px-5 pb-5 text-[14px] leading-[1.65] text-muted-foreground lg:pr-[76px] lg:pb-6 lg:pl-[26px] lg:text-[15px] lg:leading-[1.7]">
                    <HubFaqAnswer count={speciesCount} hubId={hubId} n={n} />
                  </p>
                </FaqAnswerPanel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HubFaqAnswer({
  count,
  hubId,
  n,
}: {
  count: number;
  hubId: GroupHubId;
  n: number;
}) {
  const t = useTranslations(hubId);
  const links = hubFaqLinks(hubId, n);

  if (!links) {
    return (
      <PhoneLinkedText>{t(`faq${n}A` as "faq1A", { count })}</PhoneLinkedText>
    );
  }

  return (
    <PhoneLinkedText>
      {t.rich(`faq${n}A` as "faq1A", {
        count,
        ...Object.fromEntries(
          Object.entries(links).map(([tag, href]) => [
            tag,
            (chunks: ReactNode) => (
              <Link className={faqLinkClassName} href={href}>
                {chunks}
              </Link>
            ),
          ]),
        ),
      })}
    </PhoneLinkedText>
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
