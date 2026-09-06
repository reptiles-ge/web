/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AppLocale } from "@/i18n/routing";

import { OverlayPanel } from "@/components/OverlayPanel";
import { SearchDesktopPanel } from "@/components/SpeciesSearchDesktopPanel";
import {
  SpeciesSearchMobileHeader,
  SpeciesSearchTrigger,
} from "@/components/SpeciesSearchField";
import { SearchResultsList } from "@/components/SpeciesSearchResults";
import { useRouter } from "@/i18n/navigation";
import { trackEvent, truncateSearchTerm } from "@/lib/analytics";
import { loadSearchDocuments } from "@/lib/loadSearchIndex";
import {
  flattenGroups,
  readRecent,
  resolveRecent,
  type SearchDocument,
  type SearchFilter,
  type SearchGroup,
  searchIndex,
  writeRecent,
} from "@/lib/siteSearch";

type SpeciesSearchProps = {
  variant?: "dark" | "light";
};

export function SpeciesSearch({ variant = "light" }: SpeciesSearchProps) {
  const t = useTranslations("search");
  const search = useSpeciesSearch();
  const {
    active,
    activeIndex,
    changeFilter,
    closeSearch,
    desktopInputRef,
    filter,
    flat,
    goTo,
    groups,
    listId,
    mobileInputRef,
    mobileListId,
    modKey,
    open,
    openSearch,
    pickSuggestion,
    query,
    ready,
    rootRef,
    setActiveIndex,
    setOpen,
    setQuery,
    showRecent,
    suggestions,
    trimmed,
  } = search;
  const isDark = variant === "dark";

  const filterLabels = {
    all: t("all"),
    filter: t("filter"),
    page: t("pages"),
    region: t("regions"),
    species: t("species"),
  };

  const groupTitles = {
    featured: t("featured"),
    pages: t("pages"),
    recent: t("recent"),
    regions: t("regions"),
    species: t("species"),
    suggested: t("suggested"),
  };

  const resultListProps = {
    activeIndex,
    emptyHint: t("noResultsHint"),
    emptyTitle: t("noResults"),
    groups,
    listLabel: t("title"),
    onHover: setActiveIndex,
    onPickSuggestion: pickSuggestion,
    onSelect: goTo,
    query: trimmed,
    ready,
    showRecent,
    suggestions,
    titles: groupTitles,
  };

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <SpeciesSearchTrigger
        activeOptionId={
          open && active ? `${listId}-option-${active.key}` : undefined
        }
        clearLabel={t("clear")}
        inputRef={desktopInputRef}
        isDark={isDark}
        listId={listId}
        modKey={modKey}
        onBlur={(next) => {
          if (!rootRef.current?.contains(next)) setOpen(false);
        }}
        onChange={(value) => {
          setQuery(value);
          setOpen(true);
        }}
        onClear={() => {
          setQuery("");
          setOpen(true);
          desktopInputRef.current?.focus();
        }}
        onFocus={() => openSearch("click")}
        onKeyDown={(event) =>
          onSearchKeyDown(event, {
            activeIndex,
            closeSearch,
            flat,
            goTo,
            open,
            openSearch,
            setActiveIndex,
          })
        }
        onMobileOpen={() => openSearch("mobile")}
        open={open}
        openLabel={t("open")}
        placeholder={t("placeholder")}
        query={query}
        variant={variant}
      />

      <OverlayPanel
        closeLabel={t("close")}
        desktopClassName="w-[min(26.75rem,calc(100vw-1.5rem))]"
        desktopContent={
          <SearchDesktopPanel
            {...resultListProps}
            filter={filter}
            filterLabels={filterLabels}
            listId={listId}
            navigateLabel={t("navigate")}
            onFilterChange={changeFilter}
            selectLabel={t("select")}
            toCloseLabel={t("toClose")}
          />
        }
        mobileContent={
          <SearchResultsList {...resultListProps} listId={mobileListId} />
        }
        mobileHeader={
          <SpeciesSearchMobileHeader
            activeOptionId={
              active ? `${mobileListId}-option-${active.key}` : undefined
            }
            clearLabel={t("clear")}
            filter={filter}
            filterLabels={filterLabels}
            inputRef={mobileInputRef}
            listId={mobileListId}
            onChange={(value) => {
              setQuery(value);
              setOpen(true);
            }}
            onClear={() => {
              setQuery("");
              mobileInputRef.current?.focus();
            }}
            onFilterChange={changeFilter}
            onKeyDown={(event) =>
              onSearchKeyDown(event, {
                activeIndex,
                closeSearch,
                flat,
                goTo,
                open,
                openSearch,
                setActiveIndex,
              })
            }
            open={open}
            openLabel={t("open")}
            placeholder={t("placeholder")}
            query={query}
          />
        }
        mobileSheetClassName="min-h-[74dvh]"
        onClose={closeSearch}
        open={open}
        rootRef={rootRef}
        title={t("title")}
      />
    </div>
  );
}

function onSearchKeyDown(
  event: ReactKeyboardEvent<HTMLInputElement>,
  {
    activeIndex,
    closeSearch,
    flat,
    goTo,
    open,
    openSearch,
    setActiveIndex,
  }: {
    activeIndex: number;
    closeSearch: () => void;
    flat: SearchDocument[];
    goTo: (item: SearchDocument) => void;
    open: boolean;
    openSearch: (method: "click" | "mobile" | "shortcut") => void;
    setActiveIndex: (updater: (value: number) => number) => void;
  },
) {
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

function useSpeciesSearch() {
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
  const [index, setIndex] = useState<SearchDocument[]>([]);
  const [modKey, setModKey] = useState("");
  const deferredQuery = useDeferredValue(query);
  const lastSearchKey = useRef("");
  const queryEntry = useRef<"suggestion" | "type">("type");
  const indexLocale = useRef<AppLocale | null>(null);
  const loadingLocale = useRef<AppLocale | null>(null);
  const localeRef = useRef(locale);

  const loadIndex = useCallback(async () => {
    if (indexLocale.current === locale || loadingLocale.current === locale) {
      return;
    }
    loadingLocale.current = locale;
    const requested = locale;
    try {
      const documents = await loadSearchDocuments(requested);
      if (localeRef.current !== requested) return;
      indexLocale.current = requested;
      setIndex(documents);
    } finally {
      if (loadingLocale.current === requested) loadingLocale.current = null;
    }
  }, [locale]);
  const searched = useMemo(
    () => searchIndex(index, deferredQuery, filter),
    [index, deferredQuery, filter],
  );

  const trimmed = deferredQuery.trim();
  const showRecent = open && !trimmed && filter === "all" && recent.length > 0;

  const groups = useMemo(() => {
    if (!showRecent) return searched.groups;
    const recentGroup: SearchGroup = {
      items: recent.slice(0, 4).map((item) => ({ ...item, score: 0 })),
      kind: "page",
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

  useEffect(() => {
    localeRef.current = locale;
    if (indexLocale.current === locale) return;
    indexLocale.current = null;
    setIndex([]);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    void loadIndex();
  }, [loadIndex, open]);

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
    (method: "click" | "mobile" | "shortcut") => {
      void loadIndex();
      if (!open) trackEvent("search_open", { entry_method: method });
      setOpen(true);
    },
    [loadIndex, open],
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
        entry_method: queryEntry.current,
        has_results: count > 0,
        result_count: count,
        search_filter: filter,
        search_term: term,
      });
      queryEntry.current = "type";
      if (count === 0) {
        trackEvent("search_no_result", {
          search_filter: filter,
          search_term: term,
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
        is_recent: isRecent,
        result_count: flat.length,
        result_id: item.id,
        result_kind: item.kind,
        result_position: position > 0 ? position : undefined,
        search_filter: filter,
        search_term: term ? truncateSearchTerm(term) : undefined,
      });
      setRecent(
        resolveRecent(index, writeRecent({ id: item.id, kind: item.kind })),
      );
      closeSearch();
      startTransition(() => {
        router.push(item.href);
      });
    },
    [closeSearch, filter, flat, index, query, recent, router],
  );

  const pickSuggestion = useCallback(
    (value: string) => {
      queryEntry.current = "suggestion";
      setQuery(value);
      openSearch("click");
    },
    [openSearch],
  );

  return {
    active: flat[activeIndex],
    activeIndex,
    changeFilter,
    closeSearch,
    desktopInputRef,
    filter,
    flat,
    goTo,
    groups,
    listId,
    mobileInputRef,
    mobileListId,
    modKey,
    open,
    openSearch,
    pickSuggestion,
    query,
    ready: index.length > 0,
    rootRef,
    setActiveIndex,
    setOpen,
    setQuery,
    showRecent,
    suggestions,
    trimmed,
  };
}
