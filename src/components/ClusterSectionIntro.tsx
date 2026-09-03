import type { ReactNode } from "react";

export const CLUSTER_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground";
export const CLUSTER_TITLE_GUIDE =
  "mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]";
export const CLUSTER_TITLE_SECTION =
  "mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]";
export const CLUSTER_TITLE_RELATED =
  "mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]";
export const CLUSTER_BODY =
  "mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground";
export const CLUSTER_HERO_EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.32em] text-white/45";
export const CLUSTER_HERO_TITLE =
  "mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.05] text-white";
export const CLUSTER_HERO_BODY =
  "mt-5 max-w-xl text-[15px] leading-relaxed text-white/60";
export const CLUSTER_FAQ_TITLE =
  "mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]";
export const CLUSTER_FAQ_BODY =
  "mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground";

export function ClusterSectionIntro({
  eyebrow,
  title,
  body,
  eyebrowClassName,
  titleClassName,
  bodyClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  eyebrowClassName: string;
  titleClassName: string;
  bodyClassName?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className={eyebrowClassName}>{eyebrow}</p>
      <h2 className={titleClassName}>{title}</h2>
      {body != null && bodyClassName ? (
        <p className={bodyClassName}>{body}</p>
      ) : null}
      {children}
    </>
  );
}

export function ClusterStat({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <div>
      <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-2 text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}
