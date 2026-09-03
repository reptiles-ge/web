"use client";

import { EmptyState } from "@/components/SpeciesSearchEmpty";
import { GroupLabel } from "@/components/SpeciesSearchGroupLabel";
import { ResultRow } from "@/components/SpeciesSearchRow";
import {
  searchGroupHeading,
  type SearchGroupTitles,
} from "@/lib/searchGroupHeading";
import {
  type SearchDocument,
  type SearchGroup,
} from "@/lib/siteSearch";

export type { SearchFilterLabels } from "@/components/SpeciesSearchFilterBar";
export type { SearchGroupTitles } from "@/lib/searchGroupHeading";

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
                {searchGroupHeading(group.kind, isRecentGroup, query, titles)}
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
