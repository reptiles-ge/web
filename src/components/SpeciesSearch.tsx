/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CoverImage } from "@/components/CoverImage";
import { OverlayPanel } from "@/components/OverlayPanel";
import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackEvent, truncateSearchTerm } from "@/lib/analytics";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
  chromeShellClass,
} from "@/lib/chromeStyles";
import {
  buildSearchIndex,
  flattenGroups,
  readRecent,
  resolveRecent,
  searchIndex,
  writeRecent,
  type SearchDocument,
  type SearchFilter,
  type SearchGroup,
  type SearchIcon,
  type SearchKind,
} from "@/lib/siteSearch";
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
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

type SpeciesSearchProps = {
  variant?: "light" | "dark";
};

const FILTERS: SearchFilter[] = ["all", "page", "species", "region"];

const ICONS: Record<SearchIcon, typeof Search> = {
  atlas: BookMarked,
  hub: BookOpen,
  guide: BookOpen,
  identify: ScanSearch,
  safety: ShieldAlert,
  map: MapPinned,
  yard: Home,
  info: Info,
  contact: Mail,
  news: Newspaper,
};

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

function FilterBar({
  value,
  onChange,
  labels,
}: {
  value: SearchFilter;
  onChange: (value: SearchFilter) => void;
  labels: Record<SearchFilter, string> & { filter: string };
}) {
  return (
    <div
      role="radiogroup"
      aria-label={labels.filter}
      className="flex scrollbar-none gap-1 overflow-x-auto px-3 py-2.5"
    >
      {FILTERS.map((item) => {
        const active = value === item;
        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange(item)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-colors ${
              active
                ? "bg-primary text-white dark:text-ink"
                : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}

function Thumb({ item, overlay }: { item: SearchDocument; overlay?: boolean }) {
  const Icon = ICONS[item.icon];

  if (!item.image) {
    return (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-secondary text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-[14px] bg-ink">
      <CoverImage
        src={item.image}
        alt=""
        sizes="48px"
        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
      />
      {overlay ? (
        <span className="absolute right-0.5 bottom-0.5 flex size-4.5 items-center justify-center rounded-md bg-ink/70 text-white backdrop-blur-sm">
          <Icon className="size-2.5" strokeWidth={2} aria-hidden="true" />
        </span>
      ) : null}
    </span>
  );
}

function ResultRow({
  item,
  active,
  optionId,
  query,
  onActivate,
  onHover,
}: {
  item: SearchDocument;
  active: boolean;
  optionId: string;
  query: string;
  onActivate: () => void;
  onHover: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        id={optionId}
        ref={(node) => {
          if (active) node?.scrollIntoView({ block: "nearest" });
        }}
        onMouseEnter={onHover}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onActivate}
        className={`group/item flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-[background-color,box-shadow] duration-200 ${
          active
            ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
            : "hover:bg-secondary/80 active:bg-secondary"
        }`}
      >
        <Thumb item={item} overlay={item.kind !== "species"} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] leading-tight font-semibold text-foreground">
            {highlight(item.title, query)}
          </span>
          <span
            className={`mt-0.5 block truncate text-[12px] text-muted-foreground ${
              item.kind === "species" ? "italic" : ""
            }`}
          >
            {highlight(item.subtitle, query)}
          </span>
        </span>
        <ArrowUpRight
          className={`size-3.5 shrink-0 transition-opacity ${
            active ? "text-primary opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

function EmptyState({
  title,
  hint,
  suggestions,
  onPick,
}: {
  title: string;
  hint: string;
  suggestions: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="px-4 py-9 text-center">
      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-[13px] font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>
      {suggestions.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPick(item)}
              className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
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

export function SpeciesSearch({ variant = "light" }: SpeciesSearchProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("search");
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const mobileListId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<SearchDocument[]>([]);
  const [modKey, setModKey] = useState("");
  const deferredQuery = useDeferredValue(query);
  const lastSearchKey = useRef("");
  const queryEntry = useRef<"type" | "suggestion">("type");

  const index = useMemo(() => buildSearchIndex(locale), [locale]);
  const searched = useMemo(
    () => searchIndex(index, deferredQuery, filter),
    [index, deferredQuery, filter],
  );

  const trimmed = deferredQuery.trim();
  const showRecent = open && !trimmed && filter === "all" && recent.length > 0;

  const groups = useMemo(() => {
    if (!showRecent) return searched.groups;
    const recentGroup: SearchGroup = {
      kind: "page",
      items: recent.slice(0, 4).map((item) => ({ ...item, score: 0 })),
    };
    const rest: SearchGroup[] = [];
    for (const group of searched.groups) {
      const items = group.items.filter(
        (item) => !recent.some((entry) => entry.key === item.key),
      );
      if (items.length > 0) rest.push({ ...group, items });
    }
    return [recentGroup, ...rest];
  }, [searched.groups, showRecent, recent]);

  const flat = useMemo(() => flattenGroups(groups), [groups]);
  const suggestions = Array.isArray(t.raw("suggestions"))
    ? (t.raw("suggestions") as string[])
    : [];

  const isDark = variant === "dark";

  useEffect(() => {
    setRecent(resolveRecent(index, readRecent()));
  }, [index]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery, open, filter]);

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    setModKey(mac ? "⌘" : "Ctrl");
  }, []);

  useEffect(() => {
    if (open) return;
    lastSearchKey.current = "";
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const frame = window.requestAnimationFrame(() => {
      mobileInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setFilter("all");
  }, []);

  const openSearch = useCallback(
    (method: "click" | "shortcut" | "mobile") => {
      if (!open) trackEvent("search_open", { entry_method: method });
      setOpen(true);
    },
    [open],
  );

  function changeFilter(value: SearchFilter) {
    if (value !== filter) {
      trackEvent("search_filter", {
        search_filter: value,
        search_term: query.trim() ? truncateSearchTerm(query) : undefined,
      });
    }
    setFilter(value);
  }

  const openSearchRef = useRef(openSearch);
  const closeSearchRef = useRef(closeSearch);
  const openRef = useRef(open);

  useEffect(() => {
    openSearchRef.current = openSearch;
    closeSearchRef.current = closeSearch;
    openRef.current = open;
  }, [openSearch, closeSearch, open]);

  useEffect(() => {
    function onShortcut(event: globalThis.KeyboardEvent) {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }
      event.preventDefault();
      if (openRef.current) {
        closeSearchRef.current();
        return;
      }
      openSearchRef.current("shortcut");
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      window.requestAnimationFrame(() => {
        (mobile ? mobileInputRef : desktopInputRef).current?.focus();
      });
    }

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const q = deferredQuery.trim();
    if (q.length < 2) return;
    const count = flattenGroups(searched.groups).length;
    const key = `${q}|${filter}|${count}`;
    const timer = window.setTimeout(() => {
      if (lastSearchKey.current === key) return;
      lastSearchKey.current = key;
      const term = truncateSearchTerm(q);
      trackEvent("search_query", {
        search_term: term,
        search_filter: filter,
        result_count: count,
        has_results: count > 0,
        entry_method: queryEntry.current,
      });
      queryEntry.current = "type";
      if (count === 0) {
        trackEvent("search_no_result", {
          search_term: term,
          search_filter: filter,
        });
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [open, deferredQuery, filter, searched.groups]);

  const goTo = useCallback(
    (item: SearchDocument) => {
      const term = query.trim();
      const isRecent = !term && recent.some((entry) => entry.key === item.key);
      const position = flat.findIndex((entry) => entry.key === item.key) + 1;
      trackEvent("search_result_click", {
        search_term: term ? truncateSearchTerm(term) : undefined,
        search_filter: filter,
        result_kind: item.kind,
        result_id: item.id,
        result_position: position > 0 ? position : undefined,
        result_count: flat.length,
        is_recent: isRecent,
      });
      setRecent(
        resolveRecent(index, writeRecent({ kind: item.kind, id: item.id })),
      );
      closeSearch();
      startTransition(() => {
        router.push(item.href);
      });
    },
    [closeSearch, filter, flat, index, query, recent, router],
  );

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.key === "Process") return;

    if (!open) {
      if (event.key === "ArrowDown") openSearch("click");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) =>
        flat.length === 0 ? 0 : (value + 1) % flat.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) =>
        flat.length === 0 ? 0 : (value - 1 + flat.length) % flat.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = flat[activeIndex];
      if (selected) goTo(selected);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  }

  const shellClass = chromeShellClass(variant);
  const iconButtonClass = chromeIconButtonClass(variant);
  const iconClass = isDark ? "text-white/55" : "text-muted-foreground";
  const inputClass = isDark
    ? "placeholder:text-white/40"
    : "placeholder:text-muted-foreground/70";

  const filterLabels = {
    filter: t("filter"),
    all: t("all"),
    page: t("pages"),
    species: t("species"),
    region: t("regions"),
  };

  const groupTitle = (kind: SearchKind, isRecent: boolean) => {
    if (isRecent) return t("recent");
    if (!trimmed && kind === "page") return t("suggested");
    if (!trimmed && kind === "species") return t("featured");
    return t(
      kind === "page" ? "pages" : kind === "species" ? "species" : "regions",
    );
  };

  const results = (surfaceListId: string) => {
    let cursor = 0;
    const empty = flat.length === 0;

    return (
      <div id={surfaceListId} role="listbox" aria-label={t("title")}>
        {empty ? (
          <EmptyState
            title={t("noResults")}
            hint={t("noResultsHint")}
            suggestions={suggestions}
            onPick={(value) => {
              queryEntry.current = "suggestion";
              setQuery(value);
              openSearch("click");
            }}
          />
        ) : (
          groups.map((group, groupIndex) => {
            const isRecentGroup = showRecent && groupIndex === 0;
            const start = cursor;
            cursor += group.items.length;
            return (
              <div key={`${group.kind}-${groupIndex}`}>
                <GroupLabel>{groupTitle(group.kind, isRecentGroup)}</GroupLabel>
                <ul className="p-1.5">
                  {group.items.map((item, index) => {
                    const globalIndex = start + index;
                    return (
                      <ResultRow
                        key={item.key}
                        item={item}
                        active={globalIndex === activeIndex}
                        optionId={`${surfaceListId}-option-${item.key}`}
                        query={trimmed}
                        onHover={() => setActiveIndex(globalIndex)}
                        onActivate={() => goTo(item)}
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
  };

  const active = flat[activeIndex];
  const kbdClass = isDark
    ? "border-white/18 bg-white/8 text-white/45"
    : "border-border bg-secondary/80 text-muted-foreground";

  const searchInputClass =
    "min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        aria-label={t("open")}
        aria-expanded={open}
        onClick={() => openSearch("mobile")}
        className={`${chromeIconButtonBase} md:hidden ${iconButtonClass}`}
      >
        <Search className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div
        className={`group hidden w-[280px] items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 md:flex lg:w-[320px] ${shellClass}`}
      >
        <Search
          className={`size-3.5 shrink-0 ${iconClass}`}
          aria-hidden="true"
        />
        <input
          ref={desktopInputRef}
          type="search"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && active ? `${listId}-option-${active.key}` : undefined
          }
          aria-keyshortcuts="Meta+K Control+K"
          aria-label={t("open")}
          placeholder={t("placeholder")}
          autoComplete="off"
          onFocus={() => openSearch("click")}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null;
            if (!rootRef.current?.contains(next)) {
              setOpen(false);
            }
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            onKeyDown(event);
          }}
          className={`${searchInputClass} ${inputClass}`}
        />
        {query ? (
          <button
            type="button"
            aria-label={t("clear")}
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              setOpen(true);
              desktopInputRef.current?.focus();
            }}
            className={`rounded-full p-0.5 transition-colors ${
              isDark
                ? "text-white/50 hover:bg-white/10 hover:text-white"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : modKey ? (
          <kbd
            className={`hidden rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide lg:inline ${kbdClass}`}
          >
            {modKey}K
          </kbd>
        ) : null}
      </div>

      <OverlayPanel
        open={open}
        onClose={closeSearch}
        title={t("title")}
        closeLabel={t("close")}
        rootRef={rootRef}
        desktopClassName="w-[min(26.75rem,calc(100vw-1.5rem))]"
        mobileSheetClassName="min-h-[74dvh]"
        mobileHeader={
          <>
            <div className="mb-2 flex w-full items-center gap-2.5 rounded-[18px] border border-border bg-background px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={mobileInputRef}
                type="search"
                value={query}
                role="combobox"
                aria-expanded={open}
                aria-controls={mobileListId}
                aria-autocomplete="list"
                aria-activedescendant={
                  active ? `${mobileListId}-option-${active.key}` : undefined
                }
                aria-label={t("open")}
                placeholder={t("placeholder")}
                autoComplete="off"
                enterKeyHint="search"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing || event.keyCode === 229)
                    return;
                  onKeyDown(event);
                }}
                className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-[16px] font-medium outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  aria-label={t("clear")}
                  onClick={() => {
                    setQuery("");
                    mobileInputRef.current?.focus();
                  }}
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div className="-mx-4 w-[calc(100%+2rem)]">
              <FilterBar
                value={filter}
                onChange={changeFilter}
                labels={filterLabels}
              />
            </div>
          </>
        }
        desktopContent={
          <div className="flex max-h-[min(480px,68vh)] flex-col">
            <div className="border-b border-border/60">
              <FilterBar
                value={filter}
                onChange={changeFilter}
                labels={filterLabels}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {results(listId)}
            </div>
            <div className="flex items-center gap-4 border-t border-border/70 px-3.5 py-2 text-[10px] font-medium tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border px-1">↑</kbd>
                <kbd className="rounded border border-border px-1">↓</kbd>
                {t("navigate")}
              </span>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="size-3" aria-hidden="true" />
                {t("select")}
              </span>
              <span className="ml-auto inline-flex items-center gap-1">
                <kbd className="rounded border border-border px-1">esc</kbd>
                {t("toClose")}
              </span>
            </div>
          </div>
        }
        mobileContent={results(mobileListId)}
      />
    </div>
  );
}
