/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Bookmark, ChevronDown, Info, Printer, Share } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

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
import {
  isVenomousLevel,
  type SavedItem,
  useSavedItems,
} from "@/components/useSavedCards";
import { cn } from "@/lib/cn";
import {
  clearSavedSpecies,
  mergeSavedIds,
  restoreSavedEntries,
  type SavedEntry,
  unsaveSpecies,
} from "@/lib/savedSpecies";

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
  const locale = useLocale() as AppLocale;
  const { count, entries, items, ready } = useSavedItems(locale);
  const [filter, setFilter] = useState<SavedFilter>("all");
  const [sort, setSort] = useState<SavedSort>("recent");
  const [notice, setNotice] = useState<null | SavedNotice>(null);
  const [printing, setPrinting] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    const url = new URL(window.location.href);
    const shared = url.searchParams.get(SHARE_PARAM);
    if (shared === null) return;
    const added = mergeSavedIds(shared.split(",").filter(Boolean));
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(window.history.state, "", url);
    if (added > 0) setNotice({ count: added, kind: "imported" });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
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

  const venomous = items.filter((item) => isVenomousLevel(item.danger));
  const harmless = items.filter((item) => !isVenomousLevel(item.danger));
  const sorted = useMemo(
    () => sortItems(items, sort, locale),
    [items, sort, locale],
  );
  const shown =
    filter === "venomous"
      ? sorted.filter((item) => isVenomousLevel(item.danger))
      : filter === "harmless"
        ? sorted.filter((item) => !isVenomousLevel(item.danger))
        : sorted;
  const hasItems = count > 0;
  const skeletons = ready ? 0 : count;

  const remove = (item: SavedItem) => {
    const entry = entries.find((saved) => saved.id === item.id);
    unsaveSpecies(item.id);
    if (entry) setNotice({ entry, kind: "removed", name: item.commonName });
  };

  const share = async () => {
    const url = new URL(pageUrl);
    url.searchParams.set(
      SHARE_PARAM,
      entries.map((entry) => entry.id).join(","),
    );
    const href = url.toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          text: t("shareText"),
          title: t("title"),
          url: href,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(href);
      setNotice({ kind: "copied" });
    } catch {
      window.prompt(t("share"), href);
    }
  };

  const chips: { count: number; id: SavedFilter; label: string }[] = [
    { count: items.length || count, id: "all", label: t("filterAll") },
    { count: venomous.length, id: "venomous", label: t("filterVenomous") },
    { count: harmless.length, id: "harmless", label: t("filterHarmless") },
  ];

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
              {hasItems ? t("countLabel", { count }) : t("emptyCount")}
            </p>
          </div>
          {hasItems ? (
            <div className="flex items-center gap-2 lg:gap-2.5">
              <button
                className="inline-flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-[22px] text-[15px] font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 lg:flex-none lg:gap-2.5"
                disabled={!ready}
                onClick={() => setPrinting(true)}
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
                onClick={share}
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
          ) : null}
        </div>

        {hasItems ? (
          <>
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
                      onClick={() => setFilter(chip.id)}
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
                        {chip.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <label className="relative hidden h-10 shrink-0 items-center rounded-full bg-card shadow-[inset_0_0_0_1px_var(--border)] lg:inline-flex">
                <span className="sr-only">{t("sortLabel")}</span>
                <select
                  className="h-full cursor-pointer appearance-none rounded-full bg-transparent pr-9 pl-3.5 text-[13.5px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onChange={(event) => setSort(event.target.value as SavedSort)}
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
          </>
        ) : null}
      </section>

      {hasItems ? (
        <section className="mx-auto max-w-[1440px] px-4 pt-4 pb-14 lg:px-[60px] lg:pt-6 lg:pb-28">
          <ul className="flex flex-col gap-2 md:hidden">
            {shown.map((item) => (
              <SavedRow
                item={item}
                key={item.id}
                onRemove={() => remove(item)}
              />
            ))}
            {Array.from({ length: skeletons }, (_, index) => (
              <SavedRowSkeleton key={index} />
            ))}
          </ul>
          <ul className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((item) => (
              <li key={item.id}>
                <SavedCard
                  item={item}
                  now={now}
                  onRemove={() => remove(item)}
                />
              </li>
            ))}
            {Array.from({ length: skeletons }, (_, index) => (
              <li key={index}>
                <SavedCardSkeleton />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <SavedEmpty images={emptyImages} />
      )}

      {notice ? (
        <SavedToast className="lg:w-[460px]">
          <span className="min-w-0 flex-1 truncate pl-1 text-[14px] font-semibold lg:pl-0 lg:text-[14.5px]">
            {notice.kind === "removed"
              ? t("removed", { name: notice.name })
              : notice.kind === "imported"
                ? t("imported", { count: notice.count })
                : t("shareCopied")}
          </span>
          {notice.kind === "removed" ? (
            <button
              className={cn(savedToastButtonClass, "bg-white text-[#1a211c]")}
              onClick={() => {
                restoreSavedEntries([notice.entry]);
                setNotice(null);
              }}
              type="button"
            >
              {t("restore")}
            </button>
          ) : null}
        </SavedToast>
      ) : null}

      {printing ? (
        <SavedPrintSheet
          harmless={harmless.length}
          items={sorted}
          locale={locale}
          pageUrl={pageUrl}
          venomous={venomous.length}
        />
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

function sortItems(items: SavedItem[], sort: SavedSort, locale: AppLocale) {
  if (sort === "recent") return items;
  const collator = new Intl.Collator(locale);
  return [...items].sort((a, b) =>
    collator.compare(a.commonName, b.commonName),
  );
}
