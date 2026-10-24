import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { cn } from "@/lib/cn";
import { formatContentDateShort } from "@/lib/formatDate";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";

type SpeciesPageStatsProps = {
  className?: string;
  compact?: boolean;
  locale: AppLocale;
  publishedAt?: string;
  updatedAt?: string;
  views: number;
};

const COUNT_LOCALE: Record<AppLocale, string> = {
  en: "en-US",
  ka: "en-US",
  ru: "ru-RU",
  tr: "tr-TR",
};

export async function SpeciesPageStats({
  className,
  compact = false,
  locale,
  publishedAt,
  updatedAt,
  views,
}: SpeciesPageStatsProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const updated =
    updatedAt && hasMeaningfulUpdate(publishedAt, updatedAt) ? updatedAt : null;
  const showViews = views > 0;
  if (!showViews && !updated) return null;

  const updatedLabel = updated
    ? t("updatedShort", { date: formatContentDateShort(updated, locale) })
    : null;

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap text-muted-foreground tabular-nums",
        compact ? "gap-2 text-[12px]" : "gap-3 text-[13px]",
        className,
      )}
    >
      {showViews ? (
        <span
          className={cn(
            "inline-flex items-center",
            compact ? "gap-2" : "gap-1.5",
          )}
        >
          <svg
            aria-hidden="true"
            className={cn(
              "shrink-0 fill-none stroke-current stroke-[1.75]",
              compact ? "size-3.5" : "size-[15px]",
            )}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span aria-hidden="true">
            {new Intl.NumberFormat(COUNT_LOCALE[locale]).format(views)}
          </span>
          <span className="sr-only">{t("viewCount", { count: views })}</span>
        </span>
      ) : null}
      {showViews && updated ? (
        <span
          aria-hidden="true"
          className="size-[3px] shrink-0 rounded-full bg-muted-foreground/50"
        />
      ) : null}
      {updated && updatedLabel ? (
        compact ? (
          <time dateTime={updated}>
            <span aria-hidden="true">
              {formatContentDateShort(updated, locale, {
                omitCurrentYear: true,
              })}
            </span>
            <span className="sr-only">{updatedLabel}</span>
          </time>
        ) : (
          <time dateTime={updated}>{updatedLabel}</time>
        )
      ) : null}
    </div>
  );
}
