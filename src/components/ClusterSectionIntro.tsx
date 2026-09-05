import type { ReactNode } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";

export const CLUSTER_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground";
export const CLUSTER_TITLE_GUIDE =
  "mt-5 font-display text-display-title font-semibold";
export const CLUSTER_TITLE_SECTION =
  "mt-5 max-w-2xl font-display text-display-title font-semibold";
export const CLUSTER_TITLE_RELATED =
  "mt-5 max-w-2xl font-display text-display-title font-semibold";
export const CLUSTER_BODY =
  "mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground";
export const CLUSTER_HERO_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.32em] text-white/45";
export const CLUSTER_HERO_TITLE =
  "mt-5 max-w-3xl font-display text-display-lead font-semibold text-white";
export const CLUSTER_HERO_BODY =
  "mt-5 max-w-xl text-[15px] leading-relaxed text-white/60";
export const CLUSTER_FAQ_TITLE = "mt-5 font-display text-display-title";
export const CLUSTER_FAQ_BODY =
  "mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground";

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
