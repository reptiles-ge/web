"use client";

import {
  ArrowRight,
  Building2,
  Leaf,
  type LucideIcon,
  Mountain,
  Plus,
  TreePine,
  Waves,
  Wheat,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";

import type {
  LocalizedRegionContent,
  RegionRelatedLink,
} from "@/data/regionContent";
import type { RegionHabitatKind } from "@/lib/regionHabitatKind";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { FaqAnswerPanel, FaqQuestion } from "@/components/FaqAccordionParts";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { RegionThumb } from "@/components/regions-index/RegionShapes";
import {
  eyebrowClass,
  focusClass,
  wrapClass,
} from "@/components/regions-index/shared";
import { REGION_IDS } from "@/data/regionIds";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useFaqAccordion } from "@/lib/faqAccordion";
import { regionHref } from "@/lib/regionHref";
import { REGION_SECTION_IDS } from "@/lib/toc";

import { arrowLinkClass, regionH2Class, scrollerClass } from "./classes";

const HABITAT_ICONS: Record<RegionHabitatKind, LucideIcon> = {
  forest: TreePine,
  mountain: Mountain,
  open: Wheat,
  settlement: Building2,
  water: Waves,
};

const HABITAT_COLUMNS: Record<number, string> = {
  2: "lg:grid-cols-2",
  4: "lg:grid-cols-4",
};

const splitClass =
  "lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-x-14 xl:grid-cols-[380px_minmax(0,1fr)]";

export function RegionFaq({
  attribution,
  items,
  regionId,
}: {
  attribution?: ReactNode;
  items: LocalizedRegionContent["faq"];
  regionId: string;
}) {
  const t = useTranslations("regions");
  const accordion = useFaqAccordion((index) =>
    trackEvent("faq_open", {
      entity_id: regionId,
      faq_index: index,
      page_type: "region",
    }),
  );

  return (
    <section className="pt-12 lg:pt-[104px]">
      <div className={cn(wrapClass, splitClass, "lg:grid-rows-[auto_1fr]")}>
        <div>
          <p className={eyebrowClass}>{t("faqEyebrow")}</p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className={regionH2Class}
            id={REGION_SECTION_IDS.faq}
          >
            {t("faqTitle")}
          </AnchoredHeading>
        </div>
        <div className="mt-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-t lg:border-(--nw-rule)">
          {items.map((item, index) => {
            const isOpen = accordion.isOpen(index);
            const ids = accordion.ids(index);
            return (
              <div className="border-b border-(--nw-rule)" key={item.question}>
                <FaqQuestion
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-4 py-[18px] text-left text-[16px] leading-[1.35] font-semibold text-(--nw-ink) lg:gap-6 lg:py-6 lg:text-[19px] lg:tracking-[-0.005em]",
                    focusClass,
                  )}
                  ids={ids}
                  isOpen={isOpen}
                  onToggle={() => accordion.toggle(index)}
                >
                  {item.question}
                  <Plus
                    aria-hidden="true"
                    className={cn(
                      "size-[18px] shrink-0 motion-safe:transition-transform motion-safe:duration-200 lg:size-5",
                      isOpen && "rotate-45",
                    )}
                    strokeWidth={1.75}
                  />
                </FaqQuestion>
                <FaqAnswerPanel ids={ids} isOpen={isOpen}>
                  <p className="pb-[18px] text-[15px] leading-[1.7] whitespace-pre-line text-(--nw-soft) lg:pr-16 lg:pb-[26px] lg:text-[16px]">
                    <PhoneLinkedText>{item.answer}</PhoneLinkedText>
                  </p>
                </FaqAnswerPanel>
              </div>
            );
          })}
        </div>
        {attribution ? (
          <div className="mt-4 lg:col-start-1 lg:row-start-2 lg:mt-7">
            {attribution}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function RegionHabitats({
  description,
  habitats,
  kinds,
}: {
  description: string;
  habitats: string[];
  kinds: LocalizedRegionContent["habitatKinds"];
}) {
  const t = useTranslations("regions");

  return (
    <section className="pt-12 lg:pt-[104px]">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p className={eyebrowClass}>{t("habitatsTitle")}</p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className={regionH2Class}
              id={REGION_SECTION_IDS.habitats}
            >
              {t("habitatsHeading")}
            </AnchoredHeading>
          </div>
          <p className="mt-2.5 text-[14.5px] leading-[1.65] text-(--nw-muted) lg:mt-0 lg:max-w-[440px] lg:text-[14px]">
            {description}
          </p>
        </div>
        <ul
          className={cn(
            "mt-4 flex flex-col gap-2 lg:mt-7 lg:grid lg:gap-4",
            HABITAT_COLUMNS[habitats.length] ?? "lg:grid-cols-3",
          )}
        >
          {habitats.map((habitat, index) => {
            const kind = kinds[index];
            const Icon = kind ? HABITAT_ICONS[kind] : Leaf;
            return (
              <li
                className="flex items-center gap-3.5 rounded-[20px] bg-(--nw-card) p-3.5 lg:flex-col lg:items-start lg:rounded-[26px] lg:p-[26px]"
                key={habitat}
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-(--nw-surface) text-(--nw-accent) lg:size-12 lg:rounded-2xl">
                  <Icon
                    aria-hidden="true"
                    className="size-5 lg:size-[22px]"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="text-[16px] font-semibold text-(--nw-ink) lg:text-[20px] lg:leading-tight">
                  {habitat.trim().replace(/\.$/, "")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function RegionRelated({ related }: { related: RegionRelatedLink[] }) {
  const t = useTranslations("regions");
  const allRegions = t("allRegionsCount", { count: REGION_IDS.size });

  return (
    <section className="pt-12 pb-14 lg:pt-[104px] lg:pb-28">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <p className={eyebrowClass}>{t("relatedEyebrow")}</p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className={regionH2Class}
              id={REGION_SECTION_IDS.related}
            >
              {t("relatedTitle")}
            </AnchoredHeading>
          </div>
          <Link
            className={cn(arrowLinkClass, focusClass, "hidden lg:inline-flex")}
            href="/regions"
          >
            {allRegions}
            <ArrowRight
              aria-hidden="true"
              className="size-[15px]"
              strokeWidth={1.75}
            />
          </Link>
        </div>
        <ul
          className={cn(
            scrollerClass,
            "mt-4 lg:mx-0 lg:mt-7 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0",
          )}
        >
          {related.map((item) => (
            <li
              className="w-[220px] shrink-0 snap-start lg:w-auto"
              key={item.id}
            >
              <Link
                className={cn(
                  "group block h-full rounded-3xl bg-(--nw-card) p-2 lg:rounded-[30px] lg:p-2.5 lg:shadow-(--rg-pill-shadow) lg:hover:shadow-(--rg-card-shadow-hover) lg:motion-safe:transition-[translate,box-shadow] lg:motion-safe:duration-250 lg:motion-safe:hover:translate-y-[-3px]",
                  focusClass,
                )}
                href={regionHref(item.id)}
              >
                <span className="block h-[110px] rounded-[18px] bg-(--nw-surface) p-3.5 lg:h-[150px] lg:rounded-[22px] lg:p-[18px]">
                  <RegionThumb
                    className="size-full fill-(--nw-accent)"
                    id={item.id}
                  />
                </span>
                <span className="block px-1.5 pt-3 pb-1.5 lg:flex lg:items-end lg:justify-between lg:gap-3 lg:pt-4 lg:pb-1">
                  <span className="block min-w-0">
                    <span className="block text-[16px] font-semibold text-(--nw-ink) lg:text-[19px] lg:tracking-[-0.01em]">
                      {item.name}
                    </span>
                    <span className="mt-[3px] block text-[12.5px] text-(--nw-muted) lg:mt-1 lg:text-[13px]">
                      <span className="lg:hidden">
                        {t("speciesCount", { count: item.speciesCount })}
                        {item.biome ? " · " : null}
                      </span>
                      {item.biome}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-right lg:block">
                    <span className="block text-[22px] font-semibold text-(--nw-ink) tabular-nums">
                      {item.speciesCount}
                    </span>
                    <span className="block text-[12px] text-(--nw-muted)">
                      {t("speciesUnit", { count: item.speciesCount })}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          className={cn(
            "mt-3.5 flex h-[50px] items-center justify-center rounded-full border border-(--nw-line) bg-(--nw-card) text-[14.5px] font-medium text-(--nw-ink) lg:hidden",
            focusClass,
          )}
          href="/regions"
        >
          {allRegions}
        </Link>
      </div>
    </section>
  );
}

export function RegionSummary({
  name,
  paragraphs,
}: {
  name: string;
  paragraphs: string[];
}) {
  const t = useTranslations("regions");
  const title = t("summary.title", { name });

  return (
    <section className="pt-12 lg:pt-[104px]">
      <div className={cn(wrapClass, splitClass)}>
        <div>
          <p className={eyebrowClass}>{t("summary.eyebrow")}</p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className={regionH2Class}
            id={REGION_SECTION_IDS.summary}
          >
            {title}
          </AnchoredHeading>
        </div>
        <div className="mt-3 space-y-4 text-[15px] leading-[1.7] text-(--nw-soft) lg:mt-0 lg:space-y-5 lg:text-[16px]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <PhoneLinkedText>{paragraph}</PhoneLinkedText>
            </p>
          ))}
          <p>
            <Link
              className={cn(arrowLinkClass, focusClass, "text-[14.5px]")}
              href="/snakes/gavrtseleba"
            >
              <span className="border-b border-(--nw-ink)/30 pb-0.5">
                {t("snakeRangeLink", { count: REGION_IDS.size })}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
