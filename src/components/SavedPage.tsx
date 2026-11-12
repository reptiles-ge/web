/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Bookmark, ChevronDown, Info, Printer, Share } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useEffectEvent, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  SavedCard,
  SavedCardSkeleton,
  SavedEmpty,
  SavedRow,
  SavedRowSkeleton,
} from "@/components/SavedPageParts";
import { SavedPrintSheet } from "@/components/SavedPrintSheet";
import { SavedToast, savedToastButtonClass } from "@/components/SavedToast";
import { type SavedItem, useSavedItems } from "@/components/useSavedCards";
import { cn } from "@/lib/cn";
import {
  clearSavedSpecies,
  mergeSavedIds,
  restoreSavedEntries,
  type SavedEntry,
  unsaveSpecies,
  useSavedEntries,
} from "@/lib/savedSpecies";
import { isVenomousLevel } from "@/lib/savedSpeciesFormat";

type SavedFilter = "all" | "harmless" | "venomous";
type SavedNotice =
  | { count: number; kind: "imported" }
  | { entry: SavedEntry; kind: "removed"; name: string }
  | { kind: "copied" };
type SavedSort = "az" | "recent";

const NOTICE_MS = 6000;
const SHARE_PARAM = "ids";
const PRINT_IMAGE_WAIT_MS = 3000;

export function SavedPage({
  emptyImages,
  pageUrl,
}: {
  emptyImages: [string, string];
  pageUrl: string;
}) {
  const t = useTranslations("saved");
  const entries = useSavedEntries();
  const count = entries.length;
  const [notice, setNotice] = useState<null | SavedNotice>(null);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const added = importSharedIds();
    if (added > 0) setNotice({ count: added, kind: "imported" });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const remove = (item: SavedItem) => {
    const entry = entries.find((saved) => saved.id === item.id);
    unsaveSpecies(item.id);
    if (entry) setNotice({ entry, kind: "removed", name: item.commonName });
  };

  const share = async () => {
    const copied = await shareSaved(
      pageUrl,
      entries,
      t("share"),
      t("shareText"),
      t("title"),
    );
    if (copied) setNotice({ kind: "copied" });
  };

  return (
    <div className="min-h-screen bg-background pt-16 text-foreground print:hidden">
      <section className="mx-auto max-w-[1440px] px-5 pt-7 lg:px-[60px] lg:pt-14">
        <div className="flex flex-col gap-[18px] lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <div className="hidden items-center gap-2.5 text-primary lg:flex">
              <Bookmark
                aria-hidden="true"
                className="size-[18px]"
                fill="currentColor"
                strokeWidth={1.75}
              />
              <span className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground">
                {t("kicker")}
              </span>
            </div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight lg:mt-4 lg:text-[64px] lg:leading-none lg:tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="mt-2.5 text-[15px] text-muted-foreground lg:mt-3.5 lg:text-[17px]">
              {count > 0 ? t("countLabel", { count }) : t("emptyCount")}
            </p>
          </div>
          {count > 0 ? (
            <SavedActions onPrint={() => setPrinting(true)} onShare={share} />
          ) : null}
        </div>
        {count > 0 ? <SavedLocalNote /> : null}
      </section>

      {count > 0 ? (
        <Suspense fallback={<SavedListSkeleton count={count} />}>
          <SavedList
            entries={entries}
            onPrinted={() => setPrinting(false)}
            onRemove={remove}
            pageUrl={pageUrl}
            printing={printing}
          />
        </Suspense>
      ) : (
        <SavedEmpty images={emptyImages} />
      )}

      {notice ? (
        <SavedNoticeToast notice={notice} onDone={() => setNotice(null)} />
      ) : null}
    </div>
  );
}

function imageReady(image: HTMLImageElement) {
  if (image.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });
}

function importSharedIds() {
  const url = new URL(window.location.href);
  const shared = url.searchParams.get(SHARE_PARAM);
  if (shared === null) return 0;
  const added = mergeSavedIds(shared.split(",").filter(Boolean));
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState(window.history.state, "", url);
  return added;
}

function matchesFilter(item: SavedItem, filter: SavedFilter) {
  if (filter === "all") return true;
  return isVenomousLevel(item.danger) === (filter === "venomous");
}

function noticeText(
  notice: SavedNotice,
  t: ReturnType<typeof useTranslations<"saved">>,
) {
  if (notice.kind === "removed") return t("removed", { name: notice.name });
  if (notice.kind === "imported") return t("imported", { count: notice.count });
  return t("shareCopied");
}

function SavedActions({
  onPrint,
  onShare,
}: {
  onPrint: () => void;
  onShare: () => void;
}) {
  const t = useTranslations("saved");
  return (
    <div className="flex items-center gap-2 lg:gap-2.5">
      <button
        className="inline-flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-[22px] text-[15px] font-semibold text-background transition-opacity hover:opacity-90 lg:flex-none lg:gap-2.5"
        onClick={onPrint}
        type="button"
      >
        <Printer
          aria-hidden="true"
          className="size-[17px]"
          strokeWidth={1.75}
        />
        {t("print")}
      </button>
      <button
        aria-label={t("share")}
        className="inline-flex size-[50px] shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-border bg-card text-[15px] font-medium text-foreground transition-colors hover:border-primary/35 lg:w-auto lg:px-5"
        onClick={onShare}
        type="button"
      >
        <Share
          aria-hidden="true"
          className="size-[18px] lg:size-[17px]"
          strokeWidth={1.75}
        />
        <span className="hidden lg:inline">{t("share")}</span>
      </button>
    </div>
  );
}

function SavedList({
  entries,
  onPrinted,
  onRemove,
  pageUrl,
  printing,
}: {
  entries: SavedEntry[];
  onPrinted: () => void;
  onRemove: (item: SavedItem) => void;
  pageUrl: string;
  printing: boolean;
}) {
  const locale = useLocale() as AppLocale;
  const items = useSavedItems(locale, entries);
  const [filter, setFilter] = useState<SavedFilter>("all");
  const [sort, setSort] = useState<SavedSort>("recent");
  const [now] = useState(() => Date.now());

  usePrintWhenReady(printing, onPrinted);

  const sorted = useMemo(
    () => sortItems(items, sort, locale),
    [items, sort, locale],
  );
  const venomous = items.filter((item) => isVenomousLevel(item.danger)).length;
  const shown = sorted.filter((item) => matchesFilter(item, filter));

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
        <SavedToolbar
          counts={{
            all: items.length,
            harmless: items.length - venomous,
            venomous,
          }}
          filter={filter}
          onFilter={setFilter}
          onSort={setSort}
          sort={sort}
        />
      </div>
      <section className="mx-auto max-w-[1440px] px-4 pt-4 pb-14 lg:px-[60px] lg:pt-6 lg:pb-28">
        <ul className="flex flex-col gap-2 md:hidden">
          {shown.map((item) => (
            <SavedRow
              item={item}
              key={item.id}
              onRemove={() => onRemove(item)}
            />
          ))}
        </ul>
        <ul className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((item) => (
            <li key={item.id}>
              <SavedCard
                item={item}
                now={now}
                onRemove={() => onRemove(item)}
              />
            </li>
          ))}
        </ul>
      </section>
      {printing ? (
        <SavedPrintSheet
          harmless={items.length - venomous}
          items={sorted}
          locale={locale}
          pageUrl={pageUrl}
          venomous={venomous}
        />
      ) : null}
    </>
  );
}

function SavedListSkeleton({ count }: { count: number }) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-[70px] pb-14 lg:px-[60px] lg:pt-[88px] lg:pb-28">
      <ul aria-hidden="true" className="flex flex-col gap-2 md:hidden">
        {Array.from({ length: count }, (_, index) => (
          <SavedRowSkeleton key={index} />
        ))}
      </ul>
      <ul
        aria-hidden="true"
        className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <SavedCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SavedLocalNote() {
  const t = useTranslations("saved");
  return (
    <div className="mt-3.5 flex items-start gap-2.5 rounded-2xl bg-surface px-3.5 py-3 text-[13px] leading-normal text-foreground/85 lg:mt-7 lg:items-center lg:gap-3 lg:rounded-[18px] lg:px-[18px] lg:py-3.5 lg:text-[14px]">
      <Info
        aria-hidden="true"
        className="size-4 shrink-0 text-primary lg:size-[18px]"
        strokeWidth={1.75}
      />
      <span className="flex-1 lg:hidden">{t("localNoteShort")}</span>
      <span className="hidden flex-1 lg:inline">{t("localNote")}</span>
      <button
        className="hidden h-[34px] shrink-0 cursor-pointer rounded-full px-3.5 text-[13.5px] font-medium text-destructive transition-colors hover:bg-destructive/10 lg:inline-flex lg:items-center"
        onClick={clearSavedSpecies}
        type="button"
      >
        {t("clear")}
      </button>
    </div>
  );
}

function SavedNoticeToast({
  notice,
  onDone,
}: {
  notice: SavedNotice;
  onDone: () => void;
}) {
  const t = useTranslations("saved");
  return (
    <SavedToast className="lg:w-[460px]">
      <span className="min-w-0 flex-1 truncate pl-1 text-[14px] font-semibold lg:pl-0 lg:text-[14.5px]">
        {noticeText(notice, t)}
      </span>
      {notice.kind === "removed" ? (
        <button
          className={cn(savedToastButtonClass, "bg-white text-[#1a211c]")}
          onClick={() => {
            restoreSavedEntries([notice.entry]);
            onDone();
          }}
          type="button"
        >
          {t("restore")}
        </button>
      ) : null}
    </SavedToast>
  );
}

function SavedToolbar({
  counts,
  filter,
  onFilter,
  onSort,
  sort,
}: {
  counts: Record<SavedFilter, number>;
  filter: SavedFilter;
  onFilter: (filter: SavedFilter) => void;
  onSort: (sort: SavedSort) => void;
  sort: SavedSort;
}) {
  const t = useTranslations("saved");
  const chips: { id: SavedFilter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "venomous", label: t("filterVenomous") },
    { id: "harmless", label: t("filterHarmless") },
  ];

  return (
    <div className="mt-4 flex items-center justify-between gap-4 lg:mt-6">
      <div
        aria-label={t("filterLabel")}
        className="-mx-5 flex scrollbar-none gap-1.5 overflow-x-auto px-5 lg:mx-0 lg:px-0"
        role="tablist"
      >
        {chips.map((chip) => {
          const active = filter === chip.id;
          return (
            <button
              aria-selected={active}
              className={cn(
                "inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-full pr-2 pl-4 text-[13.5px] font-medium whitespace-nowrap transition-colors lg:h-10 lg:text-[14px]",
                active
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
              )}
              key={chip.id}
              onClick={() => onFilter(chip.id)}
              role="tab"
              type="button"
            >
              {chip.label}
              <span
                className={cn(
                  "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold",
                  active
                    ? "bg-background/16 text-background"
                    : "bg-background text-muted-foreground",
                )}
              >
                {counts[chip.id]}
              </span>
            </button>
          );
        })}
      </div>
      <label className="relative hidden h-10 shrink-0 items-center rounded-full bg-card shadow-[inset_0_0_0_1px_var(--border)] lg:inline-flex">
        <span className="sr-only">{t("sortLabel")}</span>
        <select
          className="h-full cursor-pointer appearance-none rounded-full bg-transparent pr-9 pl-3.5 text-[13.5px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onChange={(event) => onSort(event.target.value as SavedSort)}
          value={sort}
        >
          <option value="recent">{t("sortRecent")}</option>
          <option value="az">{t("sortAz")}</option>
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 size-3.5"
          strokeWidth={1.75}
        />
      </label>
    </div>
  );
}

async function shareSaved(
  pageUrl: string,
  entries: SavedEntry[],
  promptLabel: string,
  text: string,
  title: string,
) {
  const url = new URL(pageUrl);
  url.searchParams.set(SHARE_PARAM, entries.map((entry) => entry.id).join(","));
  const href = url.toString();
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text, title, url: href });
      return false;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return false;
    }
  }
  try {
    await navigator.clipboard.writeText(href);
    return true;
  } catch {
    window.prompt(promptLabel, href);
    return false;
  }
}

function sortItems(items: SavedItem[], sort: SavedSort, locale: AppLocale) {
  if (sort === "recent") return items;
  const collator = new Intl.Collator(locale);
  return [...items].sort((a, b) =>
    collator.compare(a.commonName, b.commonName),
  );
}

function usePrintWhenReady(printing: boolean, onPrinted: () => void) {
  const done = useEffectEvent(onPrinted);
  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    window.addEventListener("afterprint", done);
    const images = [
      ...document.querySelectorAll<HTMLImageElement>("[data-print-sheet] img"),
    ];
    const timeout = new Promise((resolve) =>
      window.setTimeout(resolve, PRINT_IMAGE_WAIT_MS),
    );
    void Promise.race([Promise.all(images.map(imageReady)), timeout]).then(
      () => {
        if (!cancelled) window.print();
      },
    );
    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);
}
