"use client";

import { Search, X } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";

import type { SearchFilter } from "@/lib/siteSearch";

import {
  type SearchFilterLabels,
  SpeciesSearchFilterBar,
} from "@/components/SpeciesSearchFilterBar";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
  chromeShellClass,
} from "@/lib/chromeStyles";
import { cn } from "@/lib/cn";

const searchInputClass =
  "min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";

export function SpeciesSearchMobileHeader({
  activeOptionId,
  clearLabel,
  filter,
  filterLabels,
  inputRef,
  listId,
  onChange,
  onClear,
  onFilterChange,
  onKeyDown,
  open,
  openLabel,
  placeholder,
  query,
}: {
  activeOptionId?: string;
  clearLabel: string;
  filter: SearchFilter;
  filterLabels: SearchFilterLabels;
  inputRef: RefObject<HTMLInputElement | null>;
  listId: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onFilterChange: (value: SearchFilter) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  open: boolean;
  openLabel: string;
  placeholder: string;
  query: string;
}) {
  return (
    <>
      <div className="mb-2 flex w-full items-center gap-2.5 rounded-[18px] border border-border bg-background px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <Search
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
        <input
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          aria-label={openLabel}
          autoComplete="off"
          className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-[16px] font-medium outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          enterKeyHint="search"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            onKeyDown(event);
          }}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label={clearLabel}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            onClick={onClear}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
      <div className="-mx-4 w-[calc(100%+2rem)]">
        <SpeciesSearchFilterBar
          labels={filterLabels}
          onChange={onFilterChange}
          value={filter}
        />
      </div>
    </>
  );
}

export function SpeciesSearchTrigger({
  activeOptionId,
  clearLabel,
  inputRef,
  isDark,
  listId,
  modKey,
  onBlur,
  onChange,
  onClear,
  onFocus,
  onKeyDown,
  onMobileOpen,
  open,
  openLabel,
  placeholder,
  query,
  variant,
}: {
  activeOptionId?: string;
  clearLabel: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isDark: boolean;
  listId: string;
  modKey: string;
  onBlur: (relatedTarget: Node | null) => void;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  onMobileOpen: () => void;
  open: boolean;
  openLabel: string;
  placeholder: string;
  query: string;
  variant: "dark" | "light";
}) {
  const shellClass = chromeShellClass(variant);
  const iconButtonClass = chromeIconButtonClass(variant);
  const iconClass = isDark ? "text-white/55" : "text-muted-foreground";
  const inputClass = isDark
    ? "placeholder:text-white/40"
    : "placeholder:text-muted-foreground/70";
  const kbdClass = isDark
    ? "border-white/18 bg-white/8 text-white/45"
    : "border-border bg-secondary/80 text-muted-foreground";

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={openLabel}
        className={cn(chromeIconButtonBase, "md:hidden", iconButtonClass)}
        onClick={onMobileOpen}
        type="button"
      >
        <Search aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      </button>

      <div
        className={cn(
          "group hidden w-[280px] items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 md:flex lg:w-[320px]",
          shellClass,
        )}
      >
        <Search
          aria-hidden="true"
          className={cn("size-3.5 shrink-0", iconClass)}
        />
        <input
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          aria-keyshortcuts="Meta+K Control+K"
          aria-label={openLabel}
          autoComplete="off"
          className={cn(searchInputClass, inputClass)}
          onBlur={(event) => {
            onBlur(event.relatedTarget as Node | null);
          }}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            onKeyDown(event);
          }}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label={clearLabel}
            className={cn(
              "rounded-full p-0.5 transition-colors",
              isDark
                ? "text-white/50 hover:bg-white/10 hover:text-white"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            onClick={onClear}
            onMouseDown={(event) => event.preventDefault()}
            tabIndex={-1}
            type="button"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        ) : modKey ? (
          <kbd
            className={cn(
              "hidden rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide lg:inline",
              kbdClass,
            )}
          >
            {modKey}K
          </kbd>
        ) : null}
      </div>
    </>
  );
}
