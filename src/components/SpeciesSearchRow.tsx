"use client";

import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Home,
  Info,
  Mail,
  MapPinned,
  Newspaper,
  ScanSearch,
  Search,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { type SearchDocument, type SearchIcon } from "@/lib/siteSearch";

const ICONS: Record<SearchIcon, typeof Search> = {
  atlas: BookMarked,
  contact: Mail,
  guide: BookOpen,
  hub: BookOpen,
  identify: ScanSearch,
  info: Info,
  map: MapPinned,
  news: Newspaper,
  safety: ShieldAlert,
  yard: Home,
};

export function ResultRow({
  active,
  item,
  onActivate,
  onHover,
  optionId,
  query,
}: {
  active: boolean;
  item: SearchDocument;
  onActivate: () => void;
  onHover: () => void;
  optionId: string;
  query: string;
}) {
  const Icon = ICONS[item.icon];
  const overlay = item.kind !== "species";

  return (
    <button
      aria-selected={active}
      className={cn(
        "group/item flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-[background-color,box-shadow] duration-200",
        active
          ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
          : "hover:bg-secondary/80 active:bg-secondary",
      )}
      id={optionId}
      onClick={onActivate}
      onMouseDown={(event) => event.preventDefault()}
      onMouseEnter={onHover}
      ref={(node) => {
        if (active) node?.scrollIntoView({ block: "nearest" });
      }}
      role="option"
      type="button"
    >
      {!item.image ? (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-secondary text-muted-foreground">
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </span>
      ) : (
        <span className="relative size-12 shrink-0 overflow-hidden rounded-[14px] bg-ink">
          <picture>
            <img
              alt=""
              className="size-full object-cover transition-transform duration-500 group-hover/item:scale-105"
              decoding="async"
              height={48}
              src={item.image}
              width={48}
            />
          </picture>
          {overlay ? (
            <span className="absolute right-0.5 bottom-0.5 flex size-4.5 items-center justify-center rounded-md bg-ink/70 text-white backdrop-blur-sm">
              <Icon aria-hidden="true" className="size-2.5" strokeWidth={2} />
            </span>
          ) : null}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] leading-tight font-semibold text-foreground">
          {highlight(item.title, query)}
        </span>
        <span
          className={cn(
            "mt-0.5 block truncate text-[12px] text-muted-foreground",
            item.kind === "species" && "italic",
          )}
        >
          {highlight(item.subtitle, query)}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 transition-opacity",
          active ? "text-primary opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}

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
