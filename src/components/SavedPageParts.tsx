"use client";

import { ArrowRight, Bookmark, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import type { DangerLevel } from "@/data/speciesTypes";

import { type SavedItem } from "@/components/useSavedCards";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { RISK_SWATCH, savedAgoMessage } from "@/lib/savedSpeciesFormat";

export function SavedCard({
  item,
  now,
  onRemove,
}: {
  item: SavedItem;
  now: number;
  onRemove: () => void;
}) {
  const t = useTranslations("saved");
  const ago = savedAgoMessage(item.savedAt, now);
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-card shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_32px_rgba(14,20,17,0.05)] transition-[translate,box-shadow] duration-300 hover:translate-y-[-3px] hover:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_24px_52px_rgba(14,20,17,0.12)] motion-reduce:transition-none">
      <Link
        aria-hidden="true"
        className="relative block aspect-4/3 bg-[#151c18]"
        href={item.href}
        tabIndex={-1}
      >
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          loading="lazy"
          src={item.thumb}
        />
        {item.danger ? (
          <RiskChip
            className="absolute top-3 left-3 h-[26px] px-2.5 text-[11.5px]"
            level={item.danger}
          />
        ) : null}
      </Link>
      <button
        aria-label={t("remove", { name: item.commonName })}
        className="absolute top-3 right-3 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#2f6b4f] text-white shadow-[0_6px_16px_rgba(14,20,17,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={onRemove}
        type="button"
      >
        <RemoveIcon />
      </button>
      <div className="flex flex-1 flex-col px-5 py-[18px]">
        <Link
          className="text-[18px] leading-tight font-semibold transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href={item.href}
        >
          {item.commonName}
        </Link>
        <span className="mt-[3px] text-[13.5px] text-muted-foreground italic">
          {item.scientificName}
        </span>
        <span className="min-h-3.5 flex-1" />
        <span className="flex items-center justify-between gap-2.5 border-t border-secondary pt-3.5 text-[12.5px] text-muted-foreground">
          {item.regions.length > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                aria-hidden="true"
                className="size-[13px]"
                strokeWidth={1.75}
              />
              {t("regionCount", { count: item.regions.length })}
            </span>
          ) : (
            <span />
          )}
          <span>{t(ago.key, { count: ago.count })}</span>
        </span>
      </div>
    </article>
  );
}

export function SavedCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-[26px] bg-card"
    >
      <span className="block aspect-4/3 animate-pulse bg-surface" />
      <span className="flex flex-col gap-2.5 px-5 py-[18px]">
        <span className="block h-[18px] w-2/3 animate-pulse rounded-full bg-surface" />
        <span className="block h-3.5 w-1/2 animate-pulse rounded-full bg-surface" />
        <span className="mt-4 block h-3 w-full animate-pulse rounded-full bg-surface" />
      </span>
    </div>
  );
}

export function SavedEmpty({ images }: { images: [string, string] }) {
  const t = useTranslations("saved");
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-6 pb-14 lg:px-[60px] lg:pt-10 lg:pb-28">
      <div className="rounded-[28px] bg-card px-[22px] py-8 text-center lg:grid lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:gap-14 lg:rounded-[36px] lg:px-16 lg:py-14 lg:text-left">
        <div>
          <span className="inline-flex size-[60px] items-center justify-center rounded-[20px] bg-surface text-primary lg:size-16 lg:rounded-[22px]">
            <Bookmark
              aria-hidden="true"
              className="size-[26px] lg:size-7"
              strokeWidth={1.75}
            />
          </span>
          <h2 className="mt-4 text-[22px] font-semibold lg:mt-6 lg:text-[34px] lg:leading-[1.15] lg:tracking-[-0.015em]">
            {t("emptyTitle")}
          </h2>
          <p className="mt-2 text-[14.5px] leading-[1.6] text-muted-foreground lg:hidden">
            {t("emptyTextShort")}
          </p>
          <p className="mt-3 hidden max-w-[460px] text-[16px] leading-[1.65] text-muted-foreground lg:block">
            {t.rich("emptyText", {
              icon: () => (
                <Bookmark
                  aria-hidden="true"
                  className="inline size-3.5 align-[-2px]"
                  strokeWidth={1.75}
                />
              ),
            })}
          </p>
          <Link
            className="mt-5 flex h-[50px] items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-90 lg:mt-7 lg:inline-flex lg:h-[52px] lg:gap-2.5"
            href="/species"
          >
            {t("atlas")}
            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
          </Link>
        </div>
        <div aria-hidden="true" className="relative hidden h-[260px] lg:block">
          <div className="absolute top-9 left-10 h-[180px] w-[240px] -rotate-6 overflow-hidden rounded-[22px] bg-[#151c18] opacity-50">
            <img
              alt=""
              className="size-full object-cover"
              loading="lazy"
              src={images[0]}
            />
          </div>
          <div className="absolute top-2.5 right-[30px] h-[200px] w-[260px] rotate-4 overflow-hidden rounded-3xl bg-[#151c18] shadow-[0_24px_48px_rgba(14,20,17,0.18)]">
            <img
              alt=""
              className="size-full object-cover"
              loading="lazy"
              src={images[1]}
            />
            <span className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-white text-[#1a211c] shadow-[0_0_0_6px_rgba(255,255,255,0.35)]">
              <Bookmark className="size-[18px]" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SavedRow({
  item,
  onRemove,
}: {
  item: SavedItem;
  onRemove: () => void;
}) {
  const t = useTranslations("saved");
  return (
    <li className="flex items-center gap-3 rounded-[20px] bg-card p-2">
      <Link
        className="flex min-w-0 flex-1 items-center gap-3 rounded-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={item.href}
      >
        <span className="relative size-[84px] shrink-0 overflow-hidden rounded-[15px] bg-[#151c18]">
          <img
            alt=""
            className="size-full object-cover"
            decoding="async"
            loading="lazy"
            src={item.thumb}
          />
        </span>
        <span className="min-w-0 flex-1">
          {item.danger ? (
            <RiskChip
              className="h-[22px] px-2 text-[10.5px]"
              level={item.danger}
            />
          ) : null}
          <span className="mt-1.5 block truncate text-[15.5px] font-semibold">
            {item.commonName}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground italic">
            {item.scientificName}
          </span>
        </span>
      </Link>
      <button
        aria-label={t("remove", { name: item.commonName })}
        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-secondary"
        onClick={onRemove}
        type="button"
      >
        <RemoveIcon />
      </button>
    </li>
  );
}

export function SavedRowSkeleton() {
  return (
    <li
      aria-hidden="true"
      className="flex items-center gap-3 rounded-[20px] bg-card p-2"
    >
      <span className="size-[84px] shrink-0 animate-pulse rounded-[15px] bg-surface" />
      <span className="flex-1">
        <span className="block h-[22px] w-24 animate-pulse rounded-full bg-surface" />
        <span className="mt-2 block h-4 w-2/3 animate-pulse rounded-full bg-surface" />
        <span className="mt-2 block h-3 w-1/2 animate-pulse rounded-full bg-surface" />
      </span>
    </li>
  );
}

function RemoveIcon({ className }: { className?: string }) {
  return (
    <Bookmark
      aria-hidden="true"
      className={cn("size-[18px]", className)}
      fill="currentColor"
      strokeWidth={1.75}
    />
  );
}

function RiskChip({
  className,
  level,
}: {
  className?: string;
  level: DangerLevel;
}) {
  const tDanger = useTranslations("danger");
  const swatch = RISK_SWATCH[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        className,
      )}
      style={{ background: swatch.soft, color: swatch.text }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: swatch.dot }}
      />
      {tDanger(level)}
    </span>
  );
}
