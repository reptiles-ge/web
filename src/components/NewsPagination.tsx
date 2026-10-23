import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { newsPageHref } from "@/lib/newsPages";
import { paginationPages } from "@/lib/paginationPages";

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const stepClass =
  "inline-flex h-11 items-center gap-2 rounded-full bg-(--nw-strong) px-5 text-[14px] font-medium text-(--nw-on-strong) focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-2 focus-visible:outline-none";
const numberClass =
  "inline-flex size-11 items-center justify-center rounded-full text-[14px] font-medium tabular-nums";

export async function NewsPagination({
  current,
  locale,
  pageCount,
}: {
  current: number;
  locale: AppLocale;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const t = await getTranslations({ locale, namespace: "news" });
  const pageLabel = (page: number) => t("pageNumber", { page });
  const pages = paginationPages(current, pageCount);

  return (
    <nav
      aria-label={t("paginationLabel")}
      className={`${wrapClass} pt-10 md:pt-16`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-(--nw-line) pt-6">
        {current > 1 ? (
          <Link className={stepClass} href={newsPageHref(current - 1)}>
            <ArrowLeft
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
            {t("newerArticles")}
          </Link>
        ) : null}
        <ol className="flex flex-wrap items-center gap-1.5">
          {pages.map((page, index) =>
            page === null ? (
              <li
                aria-hidden="true"
                className="px-1 text-(--nw-muted)"
                key={`gap-${index}`}
              >
                …
              </li>
            ) : (
              <li key={page}>
                {page === current ? (
                  <span
                    aria-current="page"
                    aria-label={pageLabel(page)}
                    className={`${numberClass} bg-(--nw-strong) text-(--nw-on-strong)`}
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    aria-label={pageLabel(page)}
                    className={`${numberClass} bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--nw-line)]`}
                    href={newsPageHref(page)}
                  >
                    {page}
                  </Link>
                )}
              </li>
            ),
          )}
        </ol>
        {current < pageCount ? (
          <Link className={stepClass} href={newsPageHref(current + 1)}>
            {t("olderArticles")}
            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
