import type { ReactNode } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { paginationPages } from "@/lib/paginationPages";

export type NewsPageControl = (control: {
  "aria-label"?: string;
  children: ReactNode;
  className: string;
  page: number;
}) => ReactNode;

export type NewsPaginationLabels = {
  newer: string;
  older: string;
  page: (page: number) => string;
  pagination: string;
};

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const stepClass =
  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-(--nw-strong) px-5 text-[14px] font-medium text-(--nw-on-strong) focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-2 focus-visible:outline-none";
const numberClass =
  "inline-flex size-11 items-center justify-center rounded-full text-[14px] font-medium tabular-nums";

export function NewsPaginationView({
  current,
  labels,
  pageControl,
  pageCount,
}: {
  current: number;
  labels: NewsPaginationLabels;
  pageControl: NewsPageControl;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const pages = paginationPages(current, pageCount);

  return (
    <nav
      aria-label={labels.pagination}
      className={`${wrapClass} pt-10 md:pt-16`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-(--nw-line) pt-6">
        {current > 1
          ? pageControl({
              children: (
                <>
                  <ArrowLeft
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.75}
                  />
                  {labels.newer}
                </>
              ),
              className: stepClass,
              page: current - 1,
            })
          : null}
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
                    aria-label={labels.page(page)}
                    className={`${numberClass} bg-(--nw-strong) text-(--nw-on-strong)`}
                  >
                    {page}
                  </span>
                ) : (
                  pageControl({
                    "aria-label": labels.page(page),
                    children: page,
                    className: `${numberClass} cursor-pointer bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--nw-line)]`,
                    page,
                  })
                )}
              </li>
            ),
          )}
        </ol>
        {current < pageCount
          ? pageControl({
              children: (
                <>
                  {labels.older}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.75}
                  />
                </>
              ),
              className: stepClass,
              page: current + 1,
            })
          : null}
      </div>
    </nav>
  );
}
