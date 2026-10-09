import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DangerLevel, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { SpeciesSection } from "@/lib/clusterGuides";
import type { GroupHubId } from "@/lib/groupHubs";

import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
  HUB_EYEBROW,
  HUB_LEAD,
  HUB_TEXT_LINK,
  HUB_TEXT_LINK_LABEL,
} from "@/components/GroupHubSectionHeading";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { cn } from "@/lib/cn";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { dangerPageHref } from "@/lib/dangerLevels";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";

type RiskBucket = {
  color: string;
  key: "unrated" | DangerLevel;
  label: string;
  names: string[];
};

const RISK_ORDER: readonly DangerLevel[] = ["High", "Moderate", "Harmless"];
const RISK_COLOR: Record<RiskBucket["key"], string> = {
  Harmless: "bg-primary",
  High: "bg-destructive",
  Moderate: "bg-gold",
  unrated: "bg-muted-foreground/60",
};
const NAMES_SHOWN = 5;

const INSECT_DEFINITION: Record<AppLocale, string> = {
  en: "Insects are arthropods that, as adults, have six legs, three main body parts, and often one or two pairs of wings.",
  ka: "მწერები არიან ფეხსახსრიანები, რომლებსაც ზრდასრულ სტადიაზე აქვთ ექვსი ფეხი, სამი ძირითადი სხეულის ნაწილი და ხშირად ერთი ან ორი წყვილი ფრთა.",
  ru: "Насекомые — членистоногие, у которых во взрослом состоянии шесть ног, три основные части тела и часто одна или две пары крыльев.",
  tr: "Böcekler, ergin dönemde altı bacağı, üç ana vücut bölümü ve çoğu zaman bir ya da iki çift kanadı olan eklembacaklılardır.",
};

export async function GroupHubOverview({
  contextBlocks,
  hubId,
  locale,
  sections,
  showRisk,
  species,
}: {
  contextBlocks: { body: string; title: string }[];
  hubId: GroupHubId;
  locale: AppLocale;
  sections: SpeciesSection[];
  showRisk: boolean;
  species: Species[];
}) {
  const t = await getTranslations({ locale, namespace: hubId });
  const editable = locale === "ka" && isLocalAdminEnabled();
  const guideP1 =
    hubId === "insects"
      ? `${INSECT_DEFINITION[locale]} ${t("guideP1")}`
      : t("guideP1");

  return (
    <section
      className="scroll-mt-36 bg-background py-11 lg:py-20"
      id="overview"
    >
      <div
        className={cn(HUB_CONTAINER, "lg:flex lg:items-start lg:gap-[72px]")}
      >
        <div className="min-w-0 flex-1">
          <GroupHubSectionHeading
            compact
            eyebrow={t("guideEyebrow")}
            title={t("guideTitle")}
          />
          <div
            className={cn(
              HUB_LEAD,
              "mt-3.5 max-w-[640px] space-y-3 lg:mt-[22px] lg:space-y-3.5",
            )}
          >
            <p
              {...contentEditorAttributes(
                "message",
                editable && hubId !== "insects" ? "messages" : undefined,
                `${hubId}.guideP1`,
              )}
            >
              <PhoneLinkedText>{guideP1}</PhoneLinkedText>
            </p>
            {hubId === "spiders" ? null : (
              <p
                {...contentEditorAttributes(
                  "message",
                  editable ? "messages" : undefined,
                  `${hubId}.guideP2`,
                )}
              >
                <PhoneLinkedText>{t("guideP2")}</PhoneLinkedText>
              </p>
            )}
          </div>
          <OverviewNotes
            blocks={[
              ...sections.map((section) => ({
                body: t(`section.${section.key}.body` as "guideP1"),
                title: t(`section.${section.key}.title` as "speciesTitle", {
                  count: section.items.length,
                }),
              })),
              ...contextBlocks,
            ]}
          />
        </div>
        {showRisk ? (
          <RiskPanel hubId={hubId} locale={locale} species={species} />
        ) : null}
      </div>
    </section>
  );
}

function OverviewNotes({
  blocks,
}: {
  blocks: { body: string; title: string }[];
}) {
  if (blocks.length === 0) return null;

  return (
    <dl className="mt-7 max-w-[640px] divide-y divide-border border-y border-border lg:mt-9">
      {blocks.map((block) => (
        <div className="py-4 lg:py-5" key={block.title}>
          <dt className="font-display text-[16px] leading-snug font-semibold text-foreground lg:text-[17px]">
            {block.title}
          </dt>
          <dd className="mt-1.5 text-[14px] leading-[1.6] text-muted-foreground lg:text-[15px]">
            <PhoneLinkedText>{block.body}</PhoneLinkedText>
          </dd>
        </div>
      ))}
    </dl>
  );
}

async function RiskPanel({
  hubId,
  locale,
  species,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
  species: Species[];
}) {
  const [tShared, tDanger] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "danger" }),
  ]);
  const group = GROUP_HUBS[hubId].group;
  const buckets: RiskBucket[] = [...RISK_ORDER, "unrated" as const]
    .map((key) => ({
      color: RISK_COLOR[key],
      key,
      label: key === "unrated" ? tShared("catalog.riskUnrated") : tDanger(key),
      names: species
        .filter(
          (item) =>
            (getSpeciesRiskChip(item, group)?.level ?? "unrated") === key,
        )
        .map((item) => item.commonName),
    }))
    .filter((bucket) => bucket.names.length > 0);

  return (
    <div className="-mx-2 mt-6 rounded-[30px] bg-card px-5 pt-[22px] pb-4 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_14px_36px_rgba(14,20,17,0.06)] lg:mx-0 lg:mt-0 lg:w-[520px] lg:shrink-0 lg:rounded-[36px] lg:px-8 lg:pt-[30px] lg:pb-[26px]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={HUB_EYEBROW}>{tShared("riskPanelTitle")}</h3>
        <span className="text-[12.5px] text-muted-foreground lg:text-[13px]">
          {tShared("catalog.speciesCount", { count: species.length })}
        </span>
      </div>
      <div
        aria-label={buckets
          .map((bucket) => `${bucket.label} ${bucket.names.length}`)
          .join(", ")}
        className="mt-3.5 flex h-3.5 gap-[3px] lg:mt-[18px] lg:h-4 lg:gap-1"
        role="img"
      >
        {buckets.map((bucket) => (
          <span
            className={cn("rounded-full", bucket.color)}
            key={bucket.key}
            style={{ flex: `${bucket.names.length} 1 0` }}
          />
        ))}
      </div>
      <ul className="mt-4 lg:mt-[22px]">
        {buckets.map((bucket) => (
          <li className="border-t border-border/70" key={bucket.key}>
            <Link
              className="group flex min-h-[52px] items-center gap-3 lg:items-start lg:gap-3.5 lg:py-3.5"
              href={
                bucket.key === "unrated"
                  ? dangerPageHref()
                  : dangerPageHref(bucket.key)
              }
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-[7px] shrink-0 rounded-full lg:mt-2",
                  bucket.color,
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary lg:text-[16px]">
                  {bucket.label}
                </span>
                <span className="mt-[3px] hidden text-[13.5px] leading-[1.45] text-muted-foreground lg:block">
                  {bucket.names.slice(0, NAMES_SHOWN).join(", ")}
                  {bucket.names.length > NAMES_SHOWN
                    ? ` +${bucket.names.length - NAMES_SHOWN}`
                    : ""}
                </span>
              </span>
              <span className="text-[18px] font-semibold text-foreground tabular-nums lg:text-[22px]">
                {bucket.names.length}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        className={cn(HUB_TEXT_LINK, "group mt-1 lg:mt-2.5 lg:py-2.5")}
        href={dangerPageHref()}
      >
        <span className={HUB_TEXT_LINK_LABEL}>{tShared("riskLegendLink")}</span>
        <ArrowUpRight aria-hidden="true" className="size-[15px]" />
      </Link>
    </div>
  );
}
