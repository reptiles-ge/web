"use client";

import { Search, X } from "lucide-react";
import { type ReactNode, useDeferredValue, useMemo, useState } from "react";

import { NewsMonthSection } from "@/components/NewsMonthSection";
import { groupNewsByMonth, type NewsMonthItem } from "@/lib/newsMonthGroups";

export type NewsIndexBrowserItem = NewsMonthItem & {
  searchText: string;
  topics: readonly string[];
};

type NewsIndexBrowserLabels = {
  clear: string;
  emptyCta: string;
  emptyText: string;
  emptyTitle: string;
  emptyTitleShort: string;
  resetFilter: string;
  resetFilterShort: string;
  searchLabel: string;
  searchPlaceholder: string;
  topicsLabel: string;
};

type NewsIndexBrowserProps = {
  articleWords: readonly string[];
  chips: ReadonlyArray<{ count: number; id: string; label: string }>;
  featured: ReactNode;
  featuredCount: number;
  items: readonly NewsIndexBrowserItem[];
  labels: NewsIndexBrowserLabels;
  monthLabels: Readonly<Record<string, string>>;
};

const ALL_TOPICS = "all";
const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";

export function NewsIndexBrowser({
  articleWords,
  chips,
  featured,
  featuredCount,
  items,
  labels,
  monthLabels,
}: NewsIndexBrowserProps) {
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const trimmedQuery = deferredQuery.trim();
  const normalizedQuery = trimmedQuery.toLocaleLowerCase();
  const filtering = topic !== ALL_TOPICS || normalizedQuery.length > 0;

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (topic === ALL_TOPICS || item.topics.includes(topic)) &&
          (!normalizedQuery || item.searchText.includes(normalizedQuery)),
      ),
    [items, topic, normalizedQuery],
  );

  const months = useMemo(
    () => groupNewsByMonth(filtering ? filtered : items.slice(featuredCount)),
    [featuredCount, filtered, filtering, items],
  );

  const topicLabel = chips.find((chip) => chip.id === topic)?.label;
  const resultContext =
    (topic !== ALL_TOPICS && topicLabel ? ` · ${topicLabel}` : "") +
    (trimmedQuery ? ` · „${trimmedQuery}“` : "");

  function resetAll() {
    setQuery("");
    setTopic(ALL_TOPICS);
  }

  return (
    <>
      <div className="sticky top-[75px] z-30 mt-[18px] border-b border-(--nw-line) bg-background/92 pt-3.5 pb-3 backdrop-blur-[14px] transition-[top] duration-300 ease-out md:mt-0 md:bg-background/90 md:py-0 max-lg:header-hidden:top-0">
        <div className="flex flex-col md:mx-auto md:box-content md:h-[76px] md:max-w-[1320px] md:flex-row md:items-center md:gap-4 md:px-10 lg:px-[60px]">
          <div
            aria-label={labels.topicsLabel}
            className="order-2 mt-2.5 flex min-w-0 snap-x snap-proximity scroll-px-5 scrollbar-none gap-1.5 overflow-x-auto px-5 md:order-1 md:mt-0 md:flex-1 md:snap-none md:px-0 [&::-webkit-scrollbar]:hidden"
            role="group"
          >
            {chips.map((chip) => {
              const on = topic === chip.id;
              return (
                <button
                  aria-pressed={on}
                  className={`inline-flex h-11 shrink-0 cursor-pointer snap-start items-center gap-[7px] rounded-full pr-[7px] pl-3.5 text-[14px] font-medium whitespace-nowrap transition-[background,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-2 focus-visible:outline-none md:h-10 md:gap-2 md:pr-2 md:pl-4 ${
                    on
                      ? "bg-(--nw-strong) text-(--nw-on-strong)"
                      : "bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--nw-line)]"
                  }`}
                  key={chip.id}
                  onClick={() => setTopic(chip.id)}
                  type="button"
                >
                  {chip.label}
                  <span
                    className={`inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11.5px] font-semibold tabular-nums md:h-6 md:min-w-6 md:text-[12px] ${
                      on
                        ? "bg-white/16 text-(--nw-on-strong) dark:bg-black/12"
                        : "bg-(--nw-wash) text-(--nw-muted)"
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="order-1 px-5 md:order-2 md:w-[300px] md:shrink-0 md:px-0">
            <label className="flex h-12 items-center gap-2.5 rounded-full border border-(--nw-line) bg-(--nw-card) pr-2 pl-4 focus-within:border-(--nw-accent) md:h-11">
              <Search
                aria-hidden="true"
                className="size-4 shrink-0 text-(--nw-muted)"
                strokeWidth={1.75}
              />
              <input
                aria-label={labels.searchLabel}
                autoComplete="off"
                className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[16px] font-medium text-(--nw-ink) outline-none placeholder:text-(--nw-muted) placeholder:opacity-100 md:text-[14.5px]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label={labels.clear}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--nw-wash) text-(--nw-ink) md:size-[30px]"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                </button>
              ) : null}
            </label>
          </div>
        </div>
      </div>

      {filtering ? null : featured}

      {filtering && filtered.length > 0 ? (
        <div
          className={`${wrapClass} flex items-center justify-between gap-3 pt-5 md:justify-start md:gap-3.5 md:pt-9`}
          role="status"
        >
          <span className="text-[14px] text-(--nw-muted) md:text-[15px]">
            <b className="font-semibold text-(--nw-ink)">{filtered.length}</b>{" "}
            {articleWords[filtered.length]}
            {resultContext}
          </span>
          <button
            className="h-8 shrink-0 cursor-pointer rounded-full bg-(--nw-surface) px-3 text-[13px] font-medium text-(--nw-ink) dark:bg-(--nw-wash)"
            onClick={resetAll}
            type="button"
          >
            <span className="md:hidden">{labels.resetFilterShort}</span>
            <span className="hidden md:inline">{labels.resetFilter}</span>
          </button>
        </div>
      ) : null}

      {months.map((month) => (
        <NewsMonthSection
          countLabel={articleWords[month.items.length]}
          heading={monthLabels[month.key]}
          items={month.items}
          key={month.key}
        />
      ))}

      {filtering && filtered.length === 0 ? (
        <section className={`${wrapClass} pt-8 md:pt-14`}>
          <div className="flex flex-col items-center gap-2.5 rounded-[28px] bg-(--nw-card) px-5 py-11 text-center md:gap-3.5 md:rounded-[32px] md:px-6 md:py-[72px]">
            <span className="hidden size-14 items-center justify-center rounded-full bg-(--nw-line-soft) text-(--nw-accent) md:inline-flex">
              <Search
                aria-hidden="true"
                className="size-[22px]"
                strokeWidth={1.75}
              />
            </span>
            <p className="text-[19px] font-semibold text-(--nw-ink) md:text-[22px]">
              <span className="md:hidden">{labels.emptyTitleShort}</span>
              <span className="hidden md:inline">{labels.emptyTitle}</span>
            </p>
            <p className="text-[14px] text-(--nw-muted) md:text-[15px]">
              {labels.emptyText}
            </p>
            <button
              className="mt-2 h-11 cursor-pointer rounded-full bg-(--nw-strong) px-5 text-[14px] font-medium text-(--nw-on-strong) md:mt-1.5"
              onClick={resetAll}
              type="button"
            >
              {labels.emptyCta}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
