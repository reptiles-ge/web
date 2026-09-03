"use client";

import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CornerDownLeft,
  Home,
  Info,
  Mail,
  MapPinned,
  Newspaper,
  ScanSearch,
  Search,
  ShieldAlert,
} from "lucide-react";
import { type ReactNode } from "react";

import { CoverImage } from "@/components/CoverImage";
import { cn } from "@/lib/cn";
import {
  type SearchDocument,
  type SearchFilter,
  type SearchGroup,
  type SearchIcon,
  type SearchKind,
} from "@/lib/siteSearch";

const FILTERS: SearchFilter[] = ["all", "page", "species", "region"];

const ICONS: Record<SearchIcon, typeof Search> = {
  atlas: BookMarked,
  contact: Mail,
  guide: BookOpen,
  hub: BookOpen,
  identify: ScanSearch,
  info: Info,
  map: MapPinned,
  news: Newspaper,
  safety: ShieldAlert,
  yard: Home,
};

export type SearchFilterLabels = Record<SearchFilter, string> & {
  filter: string;
};

export type SearchGroupTitles = {
  featured: string;
  pages: string;
  recent: string;
  regions: string;
  species: string;
  suggested: string;
};

export function FilterBar({
  labels,
  onChange,
  value,
}: {
  labels: SearchFilterLabels;
  onChange: (value: SearchFilter) => void;
  value: SearchFilter;
}) {
  return (
    <div
      aria-label={labels.filter}
      className="flex scrollbar-none gap-1 overflow-x-auto px-3 py-2.5"
      role="radiogroup"
    >
      {FILTERS.map((item) => {
        const active = value === item;
        return (
          <button
            aria-checked={active}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-colors",
              active
                ? "bg-primary text-white dark:text-ink"
                : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            key={item}
            onClick={() => onChange(item)}
            onMouseDown={(event) => event.preventDefault()}
            role="radio"
            type="button"
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}

export function SearchDesktopPanel({
  activeIndex,
  emptyHint,
  emptyTitle,
  filter,
  filterLabels,
  groups,
  listId,
  listLabel,
  navigateLabel,
  onFilterChange,
  onHover,
  onPickSuggestion,
  onSelect,
  query,
  selectLabel,
  showRecent,
  suggestions,
  titles,
  toCloseLabel,
}: {
  activeIndex: number;
  emptyHint: string;
  emptyTitle: string;
  filter: SearchFilter;
  filterLabels: SearchFilterLabels;
  groups: SearchGroup[];
  listId: string;
  listLabel: string;
  navigateLabel: string;
  onFilterChange: (value: SearchFilter) => void;
  onHover: (index: number) => void;
  onPickSuggestion: (value: string) => void;
  onSelect: (item: SearchDocument) => void;
  query: string;
  selectLabel: string;
  showRecent: boolean;
  suggestions: string[];
  titles: SearchGroupTitles;
  toCloseLabel: string;
}) {
  return (
    <div className="flex max-h-[min(480px,68vh)] flex-col">
      <div className="border-b border-border/60">
        <FilterBar
          labels={filterLabels}
          onChange={onFilterChange}
          value={filter}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SearchResultsList
          activeIndex={activeIndex}
          emptyHint={emptyHint}
          emptyTitle={emptyTitle}
          groups={groups}
          listId={listId}
          listLabel={listLabel}
          onHover={onHover}
          onPickSuggestion={onPickSuggestion}
          onSelect={onSelect}
          query={query}
          showRecent={showRecent}
          suggestions={suggestions}
          titles={titles}
        />
      </div>
      <div className="flex items-center gap-4 border-t border-border/70 px-3.5 py-2 text-[10px] font-medium tracking-wide text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-border px-1">↑</kbd>
          <kbd className="rounded border border-border px-1">↓</kbd>
          {navigateLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <CornerDownLeft aria-hidden="true" className="size-3" />
          {selectLabel}
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <kbd className="rounded border border-border px-1">esc</kbd>
          {toCloseLabel}
        </span>
      </div>
    </div>
  );
}

export function SearchResultsList({
  activeIndex,
  emptyHint,
  emptyTitle,
  groups,
  listId,
  listLabel,
  onHover,
  onPickSuggestion,
  onSelect,
  query,
  showRecent,
  suggestions,
  titles,
}: {
  activeIndex: number;
  emptyHint: string;
  emptyTitle: string;
  groups: SearchGroup[];
  listId: string;
  listLabel: string;
  onHover: (index: number) => void;
  onPickSuggestion: (value: string) => void;
  onSelect: (item: SearchDocument) => void;
  query: string;
  showRecent: boolean;
  suggestions: string[];
  titles: SearchGroupTitles;
}) {
  let cursor = 0;
  const empty = groups.every((group) => group.items.length === 0);

  return (
    <div aria-label={listLabel} id={listId} role="listbox">
      {empty ? (
        <EmptyState
          hint={emptyHint}
          onPick={onPickSuggestion}
          suggestions={suggestions}
          title={emptyTitle}
        />
      ) : (
        groups.map((group, groupIndex) => {
          const isRecentGroup = showRecent && groupIndex === 0;
          const start = cursor;
          cursor += group.items.length;
          return (
            <div key={`${group.kind}-${groupIndex}`}>
              <GroupLabel>
                {groupHeading(group.kind, isRecentGroup, query, titles)}
              </GroupLabel>
              <ul className="p-1.5">
                {group.items.map((item, index) => {
                  const globalIndex = start + index;
                  return (
                    <ResultRow
                      active={globalIndex === activeIndex}
                      item={item}
                      key={item.key}
                      onActivate={() => onSelect(item)}
                      onHover={() => onHover(globalIndex)}
                      optionId={`${listId}-option-${item.key}`}
                      query={query}
                    />
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

function EmptyState({
  hint,
  onPick,
  suggestions,
  title,
}: {
  hint: string;
  onPick: (value: string) => void;
  suggestions: string[];
  title: string;
}) {
  return (
    <div className="px-4 py-9 text-center">
      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary">
        <Search aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <p className="text-[13px] font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>
      {suggestions.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {suggestions.map((item) => (
            <button
              className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              key={item}
              onClick={() => onPick(item)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function groupHeading(
  kind: SearchKind,
  isRecent: boolean,
  query: string,
  titles: SearchGroupTitles,
) {
  if (isRecent) return titles.recent;
  if (!query && kind === "page") return titles.suggested;
  if (!query && kind === "species") return titles.featured;
  return kind === "page"
    ? titles.pages
    : kind === "species"
      ? titles.species
      : titles.regions;
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 px-4 py-2.5 backdrop-blur-md">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {children}
      </p>
    </div>
  );
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const nq = q.toLowerCase();
  let index = lower.indexOf(nq);
  let length = nq.length;
  if (index < 0) {
    for (const token of nq.split(/\s+/).filter((item) => item.length > 1)) {
      index = lower.indexOf(token);
      if (index >= 0) {
        length = token.length;
        break;
      }
    }
  }
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[3px] bg-primary/15 text-inherit">
        {text.slice(index, index + length)}
      </mark>
      {text.slice(index + length)}
    </>
  );
}

function ResultRow({
  active,
  item,
  onActivate,
  onHover,
  optionId,
  query,
}: {
  active: boolean;
  item: SearchDocument;
  onActivate: () => void;
  onHover: () => void;
  optionId: string;
  query: string;
}) {
  return (
    <li>
      <button
        aria-selected={active}
        className={cn(
          "group/item flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-[background-color,box-shadow] duration-200",
          active
            ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
            : "hover:bg-secondary/80 active:bg-secondary",
        )}
        id={optionId}
        onClick={onActivate}
        onMouseDown={(event) => event.preventDefault()}
        onMouseEnter={onHover}
        ref={(node) => {
          if (active) node?.scrollIntoView({ block: "nearest" });
        }}
        role="option"
        type="button"
      >
        <Thumb item={item} overlay={item.kind !== "species"} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] leading-tight font-semibold text-foreground">
            {highlight(item.title, query)}
          </span>
          <span
            className={cn(
              "mt-0.5 block truncate text-[12px] text-muted-foreground",
              item.kind === "species" && "italic",
            )}
          >
            {highlight(item.subtitle, query)}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-opacity",
            active ? "text-primary opacity-100" : "opacity-0",
          )}
        />
      </button>
    </li>
  );
}

function Thumb({ item, overlay }: { item: SearchDocument; overlay?: boolean }) {
  const Icon = ICONS[item.icon];

  if (!item.image) {
    return (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-secondary text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
      </span>
    );
  }

  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-[14px] bg-ink">
      <CoverImage
        alt=""
        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
        sizes="48px"
        src={item.image}
      />
      {overlay ? (
        <span className="absolute right-0.5 bottom-0.5 flex size-4.5 items-center justify-center rounded-md bg-ink/70 text-white backdrop-blur-sm">
          <Icon aria-hidden="true" className="size-2.5" strokeWidth={2} />
        </span>
      ) : null}
    </span>
  );
}
