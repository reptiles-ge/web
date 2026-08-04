"use client";

import { getFeaturedSpecies, type Species } from "@/data/species";
import { useLocale } from "@/i18n/LocaleProvider";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

type SpeciesSearchProps = {
  variant?: "light" | "dark";
};

type SearchItem = Species & {
  searchText: string;
};

function toSearchItem(raw: Species, locale: "ka" | "en"): SearchItem {
  const localized = localizeSpecies(raw, locale);
  const ka = localizeSpecies(raw, "ka");
  const en = localizeSpecies(raw, "en");

  return {
    ...localized,
    searchText: [
      ka.commonName,
      en.commonName,
      raw.scientificName,
      raw.genus,
      raw.family,
      ka.location,
      en.location,
    ]
      .join(" ")
      .toLowerCase(),
  };
}

function ResultRow({
  item,
  active,
  optionId,
  onActivate,
  onHover,
}: {
  item: SearchItem;
  active: boolean;
  optionId: string;
  onActivate: () => void;
  onHover: () => void;
}) {
  const cover = item.mobileImage ?? item.image;

  return (
    <li role="option" aria-selected={active}>
      <button
        type="button"
        id={optionId}
        onMouseEnter={onHover}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onActivate}
        className={`group/item flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all duration-200 ${
          active
            ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
            : "hover:bg-secondary/80 active:bg-secondary"
        }`}
      >
        <span className="relative size-14 shrink-0 overflow-hidden rounded-[14px] bg-ink">
          <Image
            src={cover}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover/item:scale-105"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] font-semibold leading-tight text-foreground">
            {item.commonName}
          </span>
          <span className="mt-0.5 block truncate text-[12px] italic text-muted-foreground">
            {item.scientificName}
          </span>
          <span className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.location}</span>
          </span>
        </span>
        <span
          className={`mr-1 size-1.5 shrink-0 rounded-full transition-opacity ${
            active ? "bg-primary opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

function ResultsBlock({
  listId,
  title,
  results,
  activeIndex,
  emptyLabel,
  onHover,
  onSelect,
}: {
  listId: string;
  title: string;
  results: SearchItem[];
  activeIndex: number;
  emptyLabel: string;
  onHover: (index: number) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-[13px] text-muted-foreground">{emptyLabel}</p>
        </div>
      ) : (
        <ul className="overflow-y-auto p-2">
          {results.map((item, index) => (
            <ResultRow
              key={item.id}
              item={item}
              active={index === activeIndex}
              optionId={`${listId}-option-${item.id}`}
              onHover={() => onHover(index)}
              onActivate={() => onSelect(item.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export function SpeciesSearch({ variant = "light" }: SpeciesSearchProps) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const mobileListId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const catalog = getFeaturedSpecies().map((item) => toSearchItem(item, locale));

  const trimmed = deferredQuery.trim().toLowerCase();
  const visibleResults = trimmed
    ? catalog.filter((item) => item.searchText.includes(trimmed)).slice(0, 8)
    : catalog.slice(0, 5);

  const isDark = variant === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const media = window.matchMedia("(max-width: 767px)");

    function syncBodyLock() {
      document.body.style.overflow = media.matches ? "hidden" : previousOverflow;
    }

    syncBodyLock();
    media.addEventListener("change", syncBodyLock);

    const frame = window.requestAnimationFrame(() => {
      if (media.matches) {
        mobileInputRef.current?.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", syncBodyLock);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function closeSearch() {
    setOpen(false);
    setQuery("");
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();
  }

  function goToSpecies(id: string) {
    closeSearch();
    startTransition(() => {
      router.push(`/species/${id}`);
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (event.key === "ArrowDown") {
        setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) =>
        visibleResults.length === 0
          ? 0
          : (value + 1) % visibleResults.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) =>
        visibleResults.length === 0
          ? 0
          : (value - 1 + visibleResults.length) % visibleResults.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = visibleResults[activeIndex];
      if (selected) goToSpecies(selected.id);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  }

  const shellClass = isDark
    ? "border-white/18 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl focus-within:border-white/35 focus-within:bg-white/14"
    : "border-border/80 bg-card/90 text-foreground shadow-[0_8px_28px_rgba(14,20,17,0.06)] backdrop-blur-xl focus-within:border-primary/35 focus-within:shadow-[0_10px_36px_rgba(47,107,79,0.12)]";

  const iconButtonClass = isDark
    ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground";

  const iconClass = isDark ? "text-white/55" : "text-muted-foreground";
  const inputClass = isDark
    ? "placeholder:text-white/40"
    : "placeholder:text-muted-foreground/70";

  const resultsTitle = trimmed ? t.nav.species : t.search.featured;

  const mobileSheet =
    mounted && open
      ? createPortal(
          <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true" aria-label={t.search.title}>
            <button
              type="button"
              aria-label={t.search.close}
              className="absolute inset-0 bg-ink/55 backdrop-blur-[2px] animate-[search-sheet-backdrop-in_220ms_ease-out]"
              onClick={closeSearch}
            />
            <div className="absolute inset-x-0 bottom-0 flex min-h-[70dvh] max-h-[92dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-18px_60px_rgba(14,20,17,0.28)] animate-[search-sheet-in_320ms_cubic-bezier(0.22,1,0.36,1)]">
              <div className="flex shrink-0 flex-col items-center px-4 pt-3">
                <span className="mb-3 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
                <div className="flex w-full items-center justify-between gap-3 pb-3">
                  <h2 className="font-display text-[18px] font-semibold text-foreground">
                    {t.search.title}
                  </h2>
                  <button
                    type="button"
                    aria-label={t.search.close}
                    onClick={closeSearch}
                    className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mb-3 flex w-full items-center gap-2.5 rounded-[18px] border border-border bg-background px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <input
                    ref={mobileInputRef}
                    type="search"
                    value={query}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={mobileListId}
                    aria-autocomplete="list"
                    aria-activedescendant={
                      visibleResults[activeIndex]
                        ? `${mobileListId}-option-${visibleResults[activeIndex].id}`
                        : undefined
                    }
                    aria-label={t.search.open}
                    placeholder={t.search.placeholder}
                    autoComplete="off"
                    enterKeyHint="search"
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setOpen(true);
                    }}
                    onKeyDown={onKeyDown}
                    className="min-w-0 flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-muted-foreground/70"
                  />
                  {query ? (
                    <button
                      type="button"
                      aria-label={t.search.clear}
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
              </div>

              <div
                id={mobileListId}
                role="listbox"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
              >
                <ResultsBlock
                  listId={mobileListId}
                  title={resultsTitle}
                  results={visibleResults}
                  activeIndex={activeIndex}
                  emptyLabel={t.search.noResults}
                  onHover={setActiveIndex}
                  onSelect={goToSpecies}
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        aria-label={t.search.open}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex size-10 items-center justify-center rounded-full border transition-colors md:hidden ${iconButtonClass}`}
      >
        <Search className="size-3.5" aria-hidden="true" />
      </button>

      <div
        className={`group hidden w-[280px] items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 md:flex lg:w-[300px] ${shellClass}`}
      >
        <Search className={`size-3.5 shrink-0 ${iconClass}`} aria-hidden="true" />
        <input
          ref={desktopInputRef}
          type="search"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && visibleResults[activeIndex]
              ? `${listId}-option-${visibleResults[activeIndex].id}`
              : undefined
          }
          aria-label={t.search.open}
          placeholder={t.search.placeholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
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
          onKeyDown={onKeyDown}
          className={`min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none ${inputClass}`}
        />
        {query ? (
          <button
            type="button"
            aria-label={t.search.clear}
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
        ) : null}
      </div>

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute right-0 top-full z-50 mt-3 hidden w-[360px] origin-top overflow-hidden rounded-[22px] border border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(14,20,17,0.16)] backdrop-blur-2xl animate-[search-panel-in_220ms_ease-out] md:block"
        >
          <div className="max-h-[min(420px,60vh)] overflow-y-auto">
            <ResultsBlock
              listId={listId}
              title={resultsTitle}
              results={visibleResults}
              activeIndex={activeIndex}
              emptyLabel={t.search.noResults}
              onHover={setActiveIndex}
              onSelect={goToSpecies}
            />
          </div>
        </div>
      ) : null}

      {mobileSheet}
    </div>
  );
}
