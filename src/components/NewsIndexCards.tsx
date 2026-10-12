import type { ReactNode } from "react";

import { ArrowRight, FileText } from "lucide-react";

import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { newsArticleHref } from "@/lib/news";

export type NewsIndexEntry = {
  alt: string;
  dateLabel: string;
  dateShort: string;
  dek: string;
  illustrated: boolean;
  publishedAt: string;
  readLabel: string;
  readShortLabel: string;
  slug: string;
  source: null | string;
  sourceMore: number;
  src: string;
  title: string;
  topicLabel: null | string;
};

type NewsLeadCardLabels = {
  featured: string;
  readArticle: string;
  source: string;
};

const metaClass =
  "flex items-center gap-[7px] text-[12px] font-medium whitespace-nowrap text-(--nw-muted) tabular-nums md:gap-2 md:text-[12.5px]";
const zoomClass =
  "object-cover motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:scale-[1.04]";
const focusClass =
  "focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none";

export function NewsLeadCard({
  entry,
  labels,
}: {
  entry: NewsIndexEntry;
  labels: NewsLeadCardLabels;
}) {
  return (
    <article>
      <Link
        className={`group flex flex-col overflow-hidden rounded-[28px] bg-(--nw-card) shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_32px_rgba(14,20,17,0.06)] md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none ${focusClass}`}
        href={newsArticleHref(entry.slug)}
      >
        <NewsCover
          className="aspect-16/10 md:rounded-[32px]"
          entry={entry}
          priority
          sizes="(max-width: 1023px) 100vw, 60vw"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden h-[45%] bg-linear-to-t from-[rgba(14,20,17,0.55)] to-transparent md:block"
          />
          <NewsCoverTag>
            {labels.featured}
            {entry.topicLabel ? (
              <span className="md:hidden"> · {entry.topicLabel}</span>
            ) : null}
          </NewsCoverTag>
          {entry.topicLabel ? (
            <span className="absolute bottom-[22px] left-6 hidden h-[30px] items-center rounded-full bg-[rgba(14,20,17,0.5)] px-[13px] text-[12.5px] font-semibold text-white backdrop-blur-sm md:inline-flex">
              {entry.topicLabel}
            </span>
          ) : null}
        </NewsCover>
        <div className="min-w-0 px-5 pt-[18px] pb-5 md:px-2 md:pt-[26px] md:pb-0">
          <div className={metaClass}>
            <time dateTime={entry.publishedAt}>{entry.dateLabel}</time>
            <NewsMetaSep />
            <span>{entry.readLabel}</span>
          </div>
          <h3 className="mt-2.5 max-w-[760px] text-[25px] leading-[1.18] font-semibold tracking-[-0.015em] text-(--nw-ink) transition-colors duration-200 md:mt-3.5 md:text-[42px] md:leading-[1.1] md:tracking-[-0.02em] md:group-hover:text-(--nw-accent)">
            {entry.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 max-w-[680px] text-[15px] leading-[1.55] text-(--nw-muted) md:mt-4 md:text-[17px] md:leading-[1.6]">
            {entry.dek}
          </p>
          <div className="mt-[18px] flex items-center justify-between gap-3 border-t border-(--nw-line-soft) pt-3.5 md:hidden">
            {entry.source ? (
              <span className="min-w-0 truncate text-[12.5px] text-(--nw-muted)">
                {labels.source}{" "}
                <b className="font-semibold text-(--nw-soft)">{entry.source}</b>
              </span>
            ) : (
              <span />
            )}
            <span
              aria-hidden="true"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-(--nw-strong) text-(--nw-on-strong)"
            >
              <ArrowRight className="size-[15px]" strokeWidth={1.75} />
            </span>
          </div>
          <div className="mt-6 hidden items-center justify-between gap-6 md:flex">
            <span className="inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold whitespace-nowrap text-(--nw-ink)">
              {labels.readArticle}
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center rounded-full bg-(--nw-strong) text-(--nw-on-strong) motion-safe:transition-transform motion-safe:duration-250 motion-safe:group-hover:translate-x-[3px]"
              >
                <ArrowRight className="size-[15px]" strokeWidth={1.75} />
              </span>
            </span>
            {entry.source ? (
              <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-(--nw-muted)">
                {labels.source}
                <b className="truncate font-semibold text-(--nw-soft)">
                  {entry.source}
                </b>
                {entry.sourceMore > 0 ? <span>+{entry.sourceMore}</span> : null}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function NewsListCard({ entry }: { entry: NewsIndexEntry }) {
  return (
    <article className="h-full">
      <Link
        className={`group grid grid-cols-[104px_minmax(0,1fr)] items-start gap-3.5 border-t border-(--nw-line) py-3.5 active:opacity-70 md:flex md:h-full md:flex-col md:items-stretch md:gap-0 md:overflow-hidden md:rounded-[28px] md:border-0 md:bg-(--nw-card) md:py-0 md:shadow-(--nw-shadow) md:hover:shadow-(--nw-shadow-hover) md:active:opacity-100 md:motion-safe:transition-[translate,box-shadow] md:motion-safe:duration-300 md:motion-safe:hover:-translate-y-1 ${focusClass}`}
        href={newsArticleHref(entry.slug)}
        prefetch={false}
      >
        <NewsCover
          className="size-[104px] rounded-[18px] md:aspect-16/10 md:size-auto md:w-full md:rounded-none"
          entry={entry}
          sizes="(max-width: 767px) 104px, (max-width: 1023px) 50vw, 440px"
        >
          {entry.topicLabel ? (
            <span className="hidden md:contents">
              <NewsCoverTag>{entry.topicLabel}</NewsCoverTag>
            </span>
          ) : null}
        </NewsCover>
        <span className="flex min-w-0 flex-col gap-1.5 pt-0.5 md:hidden">
          <span className={metaClass}>
            {entry.topicLabel ? (
              <>
                <span className="font-semibold text-(--nw-accent)">
                  {entry.topicLabel}
                </span>
                <NewsMetaSep />
              </>
            ) : null}
            <time dateTime={entry.publishedAt}>{entry.dateShort}</time>
            <NewsMetaSep />
            <span>{entry.readShortLabel}</span>
          </span>
          <h3 className="line-clamp-3 text-[16px] leading-[1.3] font-semibold tracking-[-0.005em] text-(--nw-ink)">
            {entry.title}
          </h3>
          {entry.source ? (
            <span className="truncate text-[12px] text-(--nw-muted)">
              {entry.source}
            </span>
          ) : null}
        </span>
        <span className="hidden min-w-0 flex-1 flex-col px-6 py-[22px] md:flex">
          <span className={metaClass}>
            <time dateTime={entry.publishedAt}>{entry.dateLabel}</time>
            <NewsMetaSep />
            <span>{entry.readLabel}</span>
          </span>
          <span className="mt-3 text-[21px] leading-[1.28] font-semibold tracking-[-0.012em] text-(--nw-ink) transition-colors duration-200 group-hover:text-(--nw-accent)">
            {entry.title}
          </span>
          <span className="mt-2.5 line-clamp-3 text-[14.5px] leading-[1.6] text-(--nw-muted)">
            {entry.dek}
          </span>
          <span className="min-h-[18px] flex-1" />
          {entry.source ? (
            <span className="flex min-w-0 items-center gap-2 border-t border-(--nw-line-soft) pt-4 text-[12.5px] text-(--nw-muted)">
              <FileText
                aria-hidden="true"
                className="size-3.5 shrink-0 text-(--nw-accent)"
                strokeWidth={1.75}
              />
              <b className="truncate font-semibold text-(--nw-soft)">
                {entry.source}
              </b>
              {entry.sourceMore > 0 ? (
                <span className="whitespace-nowrap">+{entry.sourceMore}</span>
              ) : null}
            </span>
          ) : null}
        </span>
      </Link>
    </article>
  );
}

export function NewsSideCard({ entry }: { entry: NewsIndexEntry }) {
  return (
    <article className="w-[290px] shrink-0 snap-start md:w-auto">
      <Link
        className={`group grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3 rounded-[22px] bg-(--nw-card) p-2.5 shadow-[0_1px_2px_rgba(14,20,17,0.04)] md:grid-cols-[200px_minmax(0,1fr)] md:gap-[22px] md:rounded-[28px] md:p-3.5 md:shadow-(--nw-shadow) md:hover:shadow-(--nw-shadow-side-hover) md:motion-safe:transition-[translate,box-shadow] md:motion-safe:duration-300 md:motion-safe:hover:translate-y-[-3px] ${focusClass}`}
        href={newsArticleHref(entry.slug)}
      >
        <NewsCover
          className="size-[84px] rounded-[14px] md:aspect-square md:size-auto md:rounded-[20px]"
          entry={entry}
          sizes="(max-width: 767px) 84px, 200px"
        />
        <span className="flex min-w-0 flex-col md:gap-2.5 md:pr-2.5">
          <span className={metaClass}>
            {entry.topicLabel ? (
              <>
                <span className="font-semibold text-(--nw-accent)">
                  {entry.topicLabel}
                </span>
                <NewsMetaSep />
              </>
            ) : null}
            <time dateTime={entry.publishedAt}>
              <span className="md:hidden">{entry.dateShort}</span>
              <span className="hidden md:inline">{entry.dateLabel}</span>
            </time>
          </span>
          <h3 className="mt-[5px] line-clamp-3 text-[14.5px] leading-[1.3] font-semibold text-(--nw-ink) transition-colors duration-200 md:mt-0 md:line-clamp-none md:text-[20px] md:leading-tight md:tracking-[-0.012em] md:group-hover:text-(--nw-accent)">
            {entry.title}
          </h3>
          <span className={`${metaClass} hidden md:flex`}>
            {entry.readLabel}
          </span>
        </span>
      </Link>
    </article>
  );
}

function NewsCover({
  children,
  className,
  entry,
  priority,
  sizes,
}: {
  children?: ReactNode;
  className: string;
  entry: NewsIndexEntry;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-(--nw-cover) ${
        entry.illustrated ? "news-ill" : ""
      } ${className}`}
    >
      <CoverImage
        alt={entry.alt}
        className={zoomClass}
        priority={priority}
        sizes={sizes}
        src={entry.src}
      />
      {children}
    </span>
  );
}

function NewsCoverTag({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-3.5 left-3.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-white/92 px-[11px] text-[12px] font-semibold text-[#1a211c] backdrop-blur-sm md:top-4 md:left-4 md:px-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2f6b4f]" />
      {children}
    </span>
  );
}

function NewsMetaSep() {
  return (
    <span
      aria-hidden="true"
      className="size-[3px] shrink-0 rounded-full bg-(--nw-sep)"
    />
  );
}
