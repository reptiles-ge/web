import type { ReactNode } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";

export const CLUSTER_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground";
export const CLUSTER_TITLE_GUIDE =
  "mt-5 font-display text-display-title font-semibold";
export const CLUSTER_TITLE_SECTION =
  "mt-5 max-w-2xl font-display text-display-title font-semibold";
export const CLUSTER_TITLE_RELATED =
  "mt-5 max-w-2xl font-display text-display-title font-semibold";
export const CLUSTER_BODY =
  "mt-5 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground";
export const CLUSTER_HERO_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-white/45";
export const CLUSTER_HERO_TITLE =
  "mt-5 max-w-3xl font-display text-display-lead font-semibold text-white";
export const CLUSTER_HERO_BODY =
  "mt-5 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-white/60";
export const CLUSTER_FAQ_TITLE = "mt-5 font-display text-display-title";
export const CLUSTER_FAQ_BODY =
  "mt-5 max-w-sm whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground";

export function ClusterFamilyStatsBand({
  species,
  t,
}: {
  species: readonly { family: string }[];
  t: (
    key: "statExtra" | "statExtraValue" | "statFamilies" | "statSpecies",
  ) => string;
}) {
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterStatsBand>
      <ClusterStat label={t("statSpecies")} value={species.length} />
      <ClusterStat label={t("statFamilies")} value={familyCount} />
      <ClusterStat label={t("statExtra")} value={t("statExtraValue")} />
    </ClusterStatsBand>
  );
}

export function ClusterIndexSection({
  body,
  children,
  eyebrow,
  intro,
  title,
}: {
  body: string;
  children: ReactNode;
  eyebrow: string;
  intro?: ReactNode;
  title: string;
}) {
  return (
    <section
      className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      id="index"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={body}
            bodyClassName={CLUSTER_BODY}
            eyebrow={eyebrow}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={title}
            titleClassName={CLUSTER_TITLE_SECTION}
          >
            {intro}
          </ClusterSectionIntro>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function ClusterSectionIntro({
  body,
  bodyClassName,
  children,
  eyebrow,
  eyebrowClassName,
  title,
  titleClassName,
}: {
  body?: ReactNode;
  bodyClassName?: string;
  children?: ReactNode;
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  titleClassName: string;
}) {
  return (
    <>
      <p className={eyebrowClassName}>{eyebrow}</p>
      <h2 className={titleClassName}>
        <PhoneLinkedText>{title}</PhoneLinkedText>
      </h2>
      {body != null && bodyClassName ? (
        <p className={bodyClassName}>
          <PhoneLinkedText>{body}</PhoneLinkedText>
        </p>
      ) : null}
      {children ? <PhoneLinkedText>{children}</PhoneLinkedText> : null}
    </>
  );
}

export function ClusterStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="font-display text-display-stat font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-2 text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function ClusterStatsBand({ children }: { children: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface py-10 sm:py-12">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
        {children}
      </div>
    </section>
  );
}
