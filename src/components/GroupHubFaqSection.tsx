import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { HubFaqValues } from "@/lib/groupHubFaqValues";
import type { GroupHubId } from "@/lib/groupHubs";

import { GroupHubFaqAccordion } from "@/components/GroupHubFaqAccordion";
import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
} from "@/components/GroupHubSectionHeading";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { hubFaqLinks } from "@/lib/groupHubFaq";

const faqLinkClassName = "text-foreground underline-offset-4 hover:underline";

type HubTranslator = Awaited<ReturnType<typeof getTranslations<GroupHubId>>>;

export async function GroupHubFaqSection({
  hubId,
  locale,
  values,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
  values: HubFaqValues;
}) {
  const t = await getTranslations({ locale, namespace: hubId });
  const items = hubFaqIndices(hubId, t).map((n) => ({
    answer: hubFaqAnswer(hubId, n, t, values),
    n,
    question: t(`faq${n}Q` as "faq1Q"),
  }));

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
        <GroupHubFaqAccordion hubId={hubId} items={items} />
      </div>
    </section>
  );
}

function hubFaqAnswer(
  hubId: GroupHubId,
  n: number,
  t: HubTranslator,
  values: HubFaqValues,
) {
  const links = hubFaqLinks(hubId, n);

  if (!links) {
    return (
      <PhoneLinkedText>{t(`faq${n}A` as "faq1A", values)}</PhoneLinkedText>
    );
  }

  return (
    <PhoneLinkedText>
      {t.rich(`faq${n}A` as "faq1A", {
        ...values,
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

function hubFaqIndices(hubId: GroupHubId, t: HubTranslator) {
  const max = hubId === "turtles" ? 8 : 5;
  const indices: number[] = [];
  for (let n = 1; n <= max; n += 1) {
    if (t.has(`faq${n}Q` as "faq1Q")) indices.push(n);
  }
  return indices;
}
