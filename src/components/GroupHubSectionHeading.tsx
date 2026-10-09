import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export const HUB_CONTAINER = "mx-auto w-full max-w-[1440px] px-6 lg:px-[60px]";
export const HUB_EYEBROW =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";
export const HUB_LEAD =
  "text-[15px] leading-[1.6] text-muted-foreground lg:text-[16px] lg:leading-[1.65]";
export const HUB_TEXT_LINK =
  "inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground lg:min-h-0";
export const HUB_TEXT_LINK_LABEL =
  "border-b border-foreground/30 pb-0.5 transition-colors group-hover:border-foreground";

export function GroupHubSectionHeading({
  aside,
  compact = false,
  eyebrow,
  lead,
  stacked = false,
  title,
}: {
  aside?: ReactNode;
  compact?: boolean;
  eyebrow: string;
  lead?: ReactNode;
  stacked?: boolean;
  title: ReactNode;
}) {
  return (
    <div
      className={
        stacked
          ? undefined
          : "lg:flex lg:items-end lg:justify-between lg:gap-12"
      }
    >
      <div className="min-w-0">
        <p className={HUB_EYEBROW}>{eyebrow}</p>
        <h2
          className={cn(
            "mt-3 font-display text-[30px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-4 lg:leading-[1.1]",
            compact ? "text-[28px] lg:text-[38px]" : "lg:text-[44px]",
          )}
        >
          {title}
        </h2>
      </div>
      {lead ? (
        <p
          className={cn(
            HUB_LEAD,
            stacked
              ? "mt-3 lg:mt-5"
              : "mt-3 lg:mt-0 lg:max-w-[520px] lg:shrink lg:pb-1.5",
          )}
        >
          {lead}
        </p>
      ) : null}
      {aside}
    </div>
  );
}
