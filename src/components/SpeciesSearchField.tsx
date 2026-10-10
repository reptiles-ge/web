"use client";

import { ArrowRight, Search, X } from "lucide-react";
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

type SearchTriggerVariant = "dark" | "hero" | "light";

const searchInputClass =
  "min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";

const heroShellClass =
  "items-center rounded-full bg-white text-[#1a211c] shadow-[0_18px_44px_rgba(0,0,0,0.45)] transition-shadow focus-within:ring-4 focus-within:ring-[#6fad88]/60 focus-visible:ring-4 focus-visible:ring-[#6fad88]/60 focus-visible:outline-none";

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
  listId,
  modKey,
  onBlur,
  onChange,
  onClear,
  onFocus,
  onKeyDown,
  onMobileOpen,
  onSubmit,
  open,
  openLabel,
  placeholder,
  query,
  variant,
}: {
  activeOptionId?: string;
  clearLabel: string;
  inputRef: RefObject<HTMLInputElement | null>;
  listId: string;
  modKey: string;
  onBlur: (relatedTarget: Node | null) => void;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  onMobileOpen: () => void;
  onSubmit: () => void;
  open: boolean;
  openLabel: string;
  placeholder: string;
  query: string;
  variant: SearchTriggerVariant;
}) {
  const isHero = variant === "hero";
  const classes = searchTriggerClasses(variant);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={openLabel}
        className={cn("md:hidden", classes.mobile)}
        onClick={onMobileOpen}
        type="button"
      >
        <Search
          aria-hidden="true"
          className={classes.mobileIcon}
          strokeWidth={1.75}
        />
        {isHero ? (
          <>
            <span className="min-w-0 flex-1 truncate text-left text-[16px] font-medium text-[#5c665f]">
              {placeholder}
            </span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2f6b4f] text-white">
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            </span>
          </>
        ) : null}
      </button>

      <div className={cn("group hidden items-center md:flex", classes.shell)}>
        <Search aria-hidden="true" className={cn("shrink-0", classes.icon)} />
        <input
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          aria-keyshortcuts="Meta+K Control+K"
          aria-label={openLabel}
          autoComplete="off"
          className={cn(searchInputClass, classes.input)}
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
              classes.clear,
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
              classes.kbd,
            )}
          >
            {modKey}K
          </kbd>
        ) : null}
        {isHero ? (
          <button
            className="h-12 shrink-0 rounded-full bg-[#2f6b4f] px-[26px] text-[15px] font-medium text-white transition-colors hover:bg-[#255940] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]"
            onClick={onSubmit}
            onMouseDown={(event) => event.preventDefault()}
            type="button"
          >
            {openLabel}
          </button>
        ) : null}
      </div>
    </>
  );
}

function searchTriggerClasses(variant: SearchTriggerVariant) {
  if (variant === "hero") {
    return {
      clear: "p-1.5 text-[#5c665f] hover:bg-[#e9eee6]",
      icon: "size-5 text-[#5c665f]",
      input: "text-[17px] placeholder:text-[#5c665f]",
      kbd: "border-[#d5ddd4] bg-[#f4f6f2] px-[7px] py-1 text-[11px] text-[#5c665f]",
      mobile: cn(heroShellClass, "flex h-14 w-full gap-2.5 pr-1.5 pl-[18px]"),
      mobileIcon: "size-[18px] shrink-0 text-[#5c665f]",
      shell: cn(heroShellClass, "h-16 gap-3 pr-2 pl-[22px]"),
    };
  }
  const isDark = variant === "dark";
  return {
    clear: isDark
      ? "text-white/50 hover:bg-white/10 hover:text-white"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    icon: cn("size-3.5", isDark ? "text-white/55" : "text-muted-foreground"),
    input: isDark
      ? "placeholder:text-white/50"
      : "placeholder:text-muted-foreground/70",
    kbd: isDark
      ? "border-white/18 bg-white/8 text-white/45"
      : "border-border bg-secondary/80 text-muted-foreground",
    mobile: cn(chromeIconButtonBase, chromeIconButtonClass(variant)),
    mobileIcon: "size-3.5",
    shell: cn(
      "w-[280px] gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 lg:w-[320px]",
      chromeShellClass(variant),
    ),
  };
}
