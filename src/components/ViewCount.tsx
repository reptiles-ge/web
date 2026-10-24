import type { AppLocale } from "@/i18n/routing";

import { cn } from "@/lib/cn";

type ViewCountProps = {
  className?: string;
  count: number;
  iconClassName?: string;
  label: string;
  locale: AppLocale;
};

const COUNT_FORMATS: Record<AppLocale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-US"),
  ka: new Intl.NumberFormat("en-US"),
  ru: new Intl.NumberFormat("ru-RU"),
  tr: new Intl.NumberFormat("tr-TR"),
};

export function ViewCount({
  className,
  count,
  iconClassName,
  label,
  locale,
}: ViewCountProps) {
  return (
    <span className={cn("inline-flex items-center tabular-nums", className)}>
      <svg
        aria-hidden="true"
        className={cn(
          "shrink-0 fill-none stroke-current stroke-[1.75]",
          iconClassName,
        )}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span aria-hidden="true">{COUNT_FORMATS[locale].format(count)}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
