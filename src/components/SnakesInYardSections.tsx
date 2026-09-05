"use client";

import { useTranslations } from "next-intl";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";

const ACTION_KEYS = [1, 2, 3] as const;
const MYTH_KEYS = [1, 2, 3, 4] as const;

export function SnakesInYardSections({ coverSrc }: { coverSrc: string }) {
  return (
    <>
      <SnakesInYardWhy coverSrc={coverSrc} />
      <SnakesInYardActions />
      <SnakesInYardMyths />
    </>
  );
}

function SnakesInYardActions() {
  const t = useTranslations("snakesInYard");

  return (
    <section className="scroll-mt-28 bg-background py-20 lg:py-28" id="actions">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={t("actionsLead")}
            bodyClassName={CLUSTER_BODY}
            eyebrow={t("actionsEyebrow")}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={t("actionsTitle")}
            titleClassName="mt-5 max-w-3xl font-display text-display-title font-semibold"
          />
        </div>

        <ol className="mt-14 space-y-0 divide-y divide-border border-y border-border">
          {ACTION_KEYS.map((n) => (
            <li
              className="grid gap-6 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-10 sm:py-10 lg:grid-cols-[7rem_1fr]"
              key={n}
            >
              <span className="font-display text-display-stat font-semibold text-primary/80">
                {String(n).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-display-card font-semibold text-foreground">
                  {t(`action${n}Title`)}
                </h3>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                  <PhoneLinkedText>{t(`action${n}Body`)}</PhoneLinkedText>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SnakesInYardMyths() {
  const t = useTranslations("snakesInYard");

  return (
    <section
      className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      id="myths"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <ClusterSectionIntro
              body={t("mythsLead")}
              bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
              eyebrow={t("mythsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("mythsTitle")}
              titleClassName={CLUSTER_TITLE_GUIDE}
            />
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {MYTH_KEYS.map((n) => (
              <li
                className="flex items-start gap-4 py-5 sm:gap-5 sm:py-6"
                key={n}
              >
                <span
                  aria-hidden
                  className="mt-0.5 text-[13px] font-medium text-destructive"
                >
                  —
                </span>
                <p className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                  {t(`myth${n}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SnakesInYardWhy({ coverSrc }: { coverSrc: string }) {
  const t = useTranslations("snakesInYard");

  return (
    <section className="border-b border-border bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={t("whyLead")}
            bodyClassName="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]"
            eyebrow={t("whyEyebrow")}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={t("whyTitle")}
            titleClassName="mt-5 font-display text-display-title font-semibold"
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2">
            <div className="bg-card p-7 sm:p-8">
              <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
                01
              </p>
              <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
                {t("whyShelterTitle")}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {t("whyShelterBody")}
              </p>
            </div>
            <div className="bg-card p-7 sm:p-8">
              <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
                02
              </p>
              <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
                {t("whyFoodTitle")}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {t("whyFoodBody")}
              </p>
            </div>
          </div>
        </div>
        <div>
          <figure className="relative aspect-4/5 overflow-hidden rounded-media bg-ink sm:aspect-5/6">
            <CoverImage
              alt={t("coverImageAlt")}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 44vw"
              src={coverSrc}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-6 pt-16 pb-5 text-[13px] leading-snug text-white/75">
              {t("coverCaption")}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
