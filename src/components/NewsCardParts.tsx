import type { ComponentType, ReactNode } from "react";

import { FileText } from "lucide-react";

import type { CoverImageProps } from "@/components/CoverPicture";

import { Link } from "@/i18n/navigation";
import { newsArticleHref } from "@/lib/news";

export type NewsCoverImage = ComponentType<CoverImageProps>;

export type NewsIndexEntry = {
  alt: string;
  dateLabel: string;
  dek: string;
  illustrated: boolean;
  publishedAt: string;
  readLabel: string;
  slug: string;
  source: null | string;
  sourceMore: number;
  src: string;
  title: string;
  topicLabel: null | string;
};

export const metaClass =
  "flex items-center gap-[7px] text-[12px] font-medium whitespace-nowrap text-(--nw-muted) tabular-nums md:gap-2 md:text-[12.5px]";
const zoomClass =
  "object-cover motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:scale-[1.04]";
export const focusClass =
  "focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none";

export function NewsCover({
  children,
  className,
  entry,
  image: Image,
  priority,
  sizes,
}: {
  children?: ReactNode;
  className: string;
  entry: NewsIndexEntry;
  image: NewsCoverImage;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-(--nw-cover) ${
        entry.illustrated ? "news-ill" : ""
      } ${className}`}
    >
      <Image
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

export function NewsCoverTag({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-3.5 left-3.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-white/92 px-[11px] text-[12px] font-semibold text-[#1a211c] backdrop-blur-sm md:top-4 md:left-4 md:px-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2f6b4f]" />
      {children}
    </span>
  );
}

export function NewsListCardView({
  entry,
  image,
}: {
  entry: NewsIndexEntry;
  image: NewsCoverImage;
}) {
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
          image={image}
          sizes="(max-width: 767px) 104px, (max-width: 1023px) 50vw, 440px"
        >
          {entry.topicLabel ? (
            <span className="hidden md:contents">
              <NewsCoverTag>{entry.topicLabel}</NewsCoverTag>
            </span>
          ) : null}
        </NewsCover>
        <span className="flex min-w-0 flex-col gap-1.5 pt-0.5 md:flex-1 md:gap-0 md:px-6 md:py-[22px]">
          <span
            className={`${metaClass} min-w-0 flex-wrap gap-y-0.5 overflow-hidden`}
          >
            {entry.topicLabel ? (
              <span className="contents md:hidden">
                <span className="font-semibold text-(--nw-accent)">
                  {entry.topicLabel}
                </span>
                <NewsMetaSep />
              </span>
            ) : null}
            <time dateTime={entry.publishedAt}>{entry.dateLabel}</time>
            <span className="hidden md:contents">
              <NewsMetaSep />
              <span>{entry.readLabel}</span>
            </span>
          </span>
          <h3 className="line-clamp-3 text-[16px] leading-[1.3] font-semibold tracking-[-0.005em] text-(--nw-ink) md:mt-3 md:line-clamp-none md:text-[21px] md:leading-[1.28] md:tracking-[-0.012em] md:transition-colors md:duration-200 md:group-hover:text-(--nw-accent)">
            {entry.title}
          </h3>
          <span className="mt-2.5 hidden text-[14.5px] leading-[1.6] text-(--nw-muted) md:line-clamp-3">
            {entry.dek}
          </span>
          <span className="hidden min-h-[18px] flex-1 md:block" />
          {entry.source ? (
            <span className="flex min-w-0 items-center gap-2 text-[12px] text-(--nw-muted) md:border-t md:border-(--nw-line-soft) md:pt-4 md:text-[12.5px]">
              <FileText
                aria-hidden="true"
                className="hidden size-3.5 shrink-0 text-(--nw-accent) md:block"
                strokeWidth={1.75}
              />
              <b className="truncate font-normal md:font-semibold md:text-(--nw-soft)">
                {entry.source}
              </b>
              {entry.sourceMore > 0 ? (
                <span className="hidden whitespace-nowrap md:inline">
                  +{entry.sourceMore}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
      </Link>
    </article>
  );
}

export function NewsMetaSep() {
  return (
    <span
      aria-hidden="true"
      className="size-[3px] shrink-0 rounded-full bg-(--nw-sep)"
    />
  );
}
