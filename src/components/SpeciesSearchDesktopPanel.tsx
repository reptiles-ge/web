"use client";

import { CornerDownLeft } from "lucide-react";

import {
  type SearchFilterLabels,
  SpeciesSearchFilterBar,
} from "@/components/SpeciesSearchFilterBar";
import {
  type SearchGroupTitles,
  SearchResultsList,
} from "@/components/SpeciesSearchResults";
import {
  type SearchDocument,
  type SearchFilter,
  type SearchGroup,
} from "@/lib/siteSearch";

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
  ready,
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
  ready?: boolean;
  selectLabel: string;
  showRecent: boolean;
  suggestions: string[];
  titles: SearchGroupTitles;
  toCloseLabel: string;
}) {
  return (
    <div className="flex max-h-[min(480px,68vh)] flex-col">
      <div className="border-b border-border/60">
        <SpeciesSearchFilterBar
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
          ready={ready}
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
