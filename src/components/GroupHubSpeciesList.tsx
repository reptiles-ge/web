import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { type SpeciesSection } from "@/lib/clusterGuides";

type GroupHubSpeciesListProps = {
  hubId: GroupHubId;
  sections: SpeciesSection[];
  speciesCount: number;
};

export async function GroupHubSpeciesList({
  hubId,
  sections,
  speciesCount,
}: GroupHubSpeciesListProps) {
  const t = await getTranslations(hubId);
  const locale = (await getLocale()) as AppLocale;

  return (
    <section
      className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      id="species"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={t("speciesBody")}
            bodyClassName={CLUSTER_BODY}
            eyebrow={t("speciesEyebrow")}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={t("speciesTitle", { count: speciesCount })}
            titleClassName={CLUSTER_TITLE_SECTION}
          />
        </div>

        <div className="mt-14 space-y-16">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-semibold">
                {t(`section.${section.key}.title` as "speciesTitle", {
                  count: section.items.length,
                })}
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t(`section.${section.key}.body` as Parameters<typeof t>[0])}
              </p>
              <SpeciesGuideList
                locale={locale}
                source="hub"
                species={section.items}
              />
            </div>
          ))}
        </div>

        {hubId === "turtles" ? (
          <div>
            <Link
              className="mt-10 inline-flex items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
              href="/turtles/saxeoebebi"
            >
              {t("speciesIndexCta")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
