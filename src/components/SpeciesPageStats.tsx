import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ViewCount } from "@/components/ViewCount";
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

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap text-muted-foreground tabular-nums",
        compact ? "gap-2 text-[12px]" : "gap-3 text-[13px]",
        className,
      )}
    >
      {showViews ? (
        <ViewCount
          className={compact ? "gap-2" : "gap-1.5"}
          count={views}
          iconClassName={compact ? "size-3.5" : "size-[15px]"}
          locale={locale}
          noun={t("viewCountNoun", { count: views })}
        />
      ) : null}
      {showViews && updated ? (
        <span
          aria-hidden="true"
          className="size-[3px] shrink-0 rounded-full bg-muted-foreground/50"
        />
      ) : null}
      {updated ? (
        <UpdatedDate
          compact={compact}
          label={t("updatedShort", {
            date: formatContentDateShort(updated, locale),
          })}
          locale={locale}
          updated={updated}
          word={t("updatedWord")}
        />
      ) : null}
    </div>
  );
}

function UpdatedDate({
  compact,
  label,
  locale,
  updated,
  word,
}: {
  compact: boolean;
  label: string;
  locale: AppLocale;
  updated: string;
  word: string;
}) {
  if (!compact) return <time dateTime={updated}>{label}</time>;
  const shown = formatContentDateShort(updated, locale, {
    omitCurrentYear: true,
  });
  const full = formatContentDateShort(updated, locale);
  const rest = full.startsWith(shown) ? full.slice(shown.length) : "";
  return (
    <time dateTime={updated}>
      <span className="sr-only">{word} </span>
      {shown}
      {rest ? <span className="sr-only">{rest}</span> : null}
    </time>
  );
}
