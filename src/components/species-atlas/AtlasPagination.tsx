"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import { paginationPages } from "@/lib/paginationPages";

const stepClass =
  "inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-[14px] font-medium text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none";
const numberClass =
  "inline-flex size-11 items-center justify-center rounded-full text-[14px] font-medium tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function AtlasPagination({
  current,
  first,
  last,
  onChange,
  pageCount,
  total,
}: {
  current: number;
  first: number;
  last: number;
  onChange: (page: number) => void;
  pageCount: number;
  total: number;
}) {
  const t = useTranslations("speciesAtlas");
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={t("paginationLabel")}
      className="mt-[22px] flex flex-col items-center gap-3 lg:mt-8"
    >
      <p className="text-[12.5px] text-muted-foreground lg:text-[13px]">
        {t("showingRange", { first, last, total })}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          className={stepClass}
          disabled={current <= 1}
          onClick={() => onChange(current - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          <span className="max-sm:sr-only">{t("previousPage")}</span>
        </button>
        <ol className="flex items-center gap-1">
          {paginationPages(current, pageCount).map((page, index) =>
            page === null ? (
              <li
                aria-hidden="true"
                className="px-1 text-muted-foreground"
                key={`gap-${index}`}
              >
                …
              </li>
            ) : (
              <li key={page}>
                <button
                  aria-current={page === current ? "page" : undefined}
                  aria-label={t("pageNumber", { page })}
                  className={cn(
                    numberClass,
                    page === current
                      ? "bg-primary text-white dark:text-ink"
                      : "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
                  )}
                  onClick={() => onChange(page)}
                  type="button"
                >
                  {page}
                </button>
              </li>
            ),
          )}
        </ol>
        <button
          className={stepClass}
          disabled={current >= pageCount}
          onClick={() => onChange(current + 1)}
          type="button"
        >
          <span className="max-sm:sr-only">{t("nextPage")}</span>
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
