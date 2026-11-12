"use client";

import { ArrowRight, Bookmark, Info, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";
import type { ChromeVariant } from "@/lib/chromeStyles";

import { useSavedItems } from "@/components/useSavedCards";
import { Link, usePathname } from "@/i18n/navigation";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
} from "@/lib/chromeStyles";
import { cn } from "@/lib/cn";
import {
  getLastSavedId,
  type SavedEntry,
  unsaveSpecies,
  useSavedEntries,
} from "@/lib/savedSpecies";

const MENU_LIMIT = 5;

const RISK_DOT: Record<DangerLevel, string> = {
  Harmless: "bg-[#2f6b4f]",
  High: "bg-[#b84336]",
  Moderate: "bg-[#7d6224]",
};

export function SavedHeaderButton({ variant }: { variant: ChromeVariant }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const current = pathname === "/saved";
  const entries = useSavedEntries();
  const count = entries.length;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const label = count > 0 ? t("savedCount", { count }) : t("saved");
  const menuAvailable = count > 0 && !current;
  const isOpen = open && menuAvailable;

  useDismiss(isOpen, rootRef, buttonRef, setOpen);

  const badge = (
    <SavedBadge count={count} ring={variant === "dark" && !current} />
  );

  return (
    <div className="relative max-lg:order-first" ref={rootRef}>
      <Link
        aria-current={current ? "page" : undefined}
        aria-label={label}
        className={cn(
          chromeIconButtonBase,
          "relative",
          current
            ? "border-surface bg-surface text-primary"
            : chromeIconButtonClass(variant),
          menuAvailable && "lg:hidden",
        )}
        href="/saved"
      >
        <BookmarkIcon filled={current} />
        {badge}
      </Link>
      {menuAvailable ? (
        <button
          aria-controls={isOpen ? menuId : undefined}
          aria-expanded={isOpen}
          aria-label={label}
          className={cn(
            chromeIconButtonBase,
            "relative hidden cursor-pointer lg:inline-flex",
            openButtonClass(isOpen, variant),
          )}
          onClick={() => setOpen((value) => !value)}
          ref={buttonRef}
          type="button"
        >
          <BookmarkIcon filled={isOpen} />
          {badge}
        </button>
      ) : null}
      {isOpen ? (
        <SavedMenu
          entries={entries}
          id={menuId}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <Bookmark
      aria-hidden="true"
      className="size-[18px]"
      fill={filled ? "currentColor" : "none"}
      strokeWidth={1.75}
    />
  );
}

function openButtonClass(open: boolean, variant: ChromeVariant) {
  if (!open) return chromeIconButtonClass(variant);
  return variant === "dark"
    ? "border-white bg-white text-[#1a211c]"
    : "border-foreground bg-foreground text-background";
}

function SavedBadge({ count, ring }: { count: number; ring: boolean }) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "absolute top-[-5px] right-[-5px] inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2f6b4f] px-[5px] font-brand text-[11px] leading-none font-bold text-white",
        ring && "shadow-[0_0_0_2px_#0e1411]",
      )}
    >
      {count}
    </span>
  );
}

function SavedMenu({
  entries,
  id,
  onClose,
}: {
  entries: SavedEntry[];
  id: string;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const shown = entries.slice(0, MENU_LIMIT);

  return (
    <dialog
      aria-label={t("saved")}
      className="absolute top-[52px] right-[-8px] left-auto z-20 m-0 hidden w-[380px] overflow-hidden rounded-3xl border-0 bg-card p-0 text-foreground shadow-[0_0_0_1px_rgba(14,20,17,0.06),0_30px_70px_rgba(14,20,17,0.35)] lg:block"
      id={id}
      open
    >
      <div className="flex items-center gap-2.5 px-[18px] pt-4 pb-3">
        <span className="text-[17px] font-semibold">{t("saved")}</span>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-surface px-[7px] text-[12px] font-bold text-primary">
          {entries.length}
        </span>
        <span className="flex-1" />
        <button
          aria-label={t("savedClose")}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-background text-foreground hover:bg-surface"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <Suspense fallback={<SavedMenuSkeleton count={shown.length} />}>
        <SavedMenuList entries={shown} onNavigate={onClose} />
      </Suspense>
      <div className="px-3.5 pt-3 pb-3.5">
        <Link
          className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-foreground text-[14.5px] font-semibold text-background transition-opacity hover:opacity-90"
          href="/saved"
          onClick={onClose}
        >
          {t("savedViewAll")}
          <ArrowRight
            aria-hidden="true"
            className="size-[15px]"
            strokeWidth={1.75}
          />
        </Link>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
          <Info aria-hidden="true" className="size-[13px]" strokeWidth={1.75} />
          {t("savedLocal")}
        </div>
      </div>
    </dialog>
  );
}

function SavedMenuList({
  entries,
  onNavigate,
}: {
  entries: SavedEntry[];
  onNavigate: () => void;
}) {
  const t = useTranslations("nav");
  const tDanger = useTranslations("danger");
  const locale = useLocale() as AppLocale;
  const items = useSavedItems(locale, entries);
  const lastSavedId = getLastSavedId();

  return (
    <ul className="flex flex-col gap-0.5 px-2">
      {items.map((item) => {
        const isNew = item.id === lastSavedId;
        return (
          <li
            className={cn(
              "flex items-center gap-3 rounded-2xl p-2",
              isNew && "bg-background",
            )}
            key={item.id}
          >
            <Link
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href={item.href}
              onClick={onNavigate}
            >
              <span className="relative size-[52px] shrink-0 overflow-hidden rounded-[14px] bg-[#151c18]">
                <img
                  alt=""
                  className="size-full object-cover"
                  decoding="async"
                  loading="lazy"
                  src={item.thumb}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-semibold">
                    {item.commonName}
                  </span>
                  {isNew ? (
                    <span className="shrink-0 rounded-full bg-[#2f6b4f] px-[7px] py-0.5 text-[10.5px] font-bold text-white">
                      {t("savedNew")}
                    </span>
                  ) : null}
                </span>
                <span className="mt-[3px] flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground">
                  {item.danger ? (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          RISK_DOT[item.danger],
                        )}
                      />
                      <span className="shrink-0">{tDanger(item.danger)} ·</span>
                    </>
                  ) : null}
                  <i className="truncate">{item.scientificName}</i>
                </span>
              </span>
            </Link>
            <button
              aria-label={t("savedRemove", { name: item.commonName })}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#9aa79e] transition-colors hover:bg-surface hover:text-foreground"
              onClick={() => unsaveSpecies(item.id)}
              type="button"
            >
              <X
                aria-hidden="true"
                className="size-[15px]"
                strokeWidth={1.75}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function SavedMenuSkeleton({ count }: { count: number }) {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-0.5 px-2">
      {Array.from({ length: count }, (_, index) => (
        <li className="flex items-center gap-3 p-2" key={index}>
          <span className="size-[52px] shrink-0 animate-pulse rounded-[14px] bg-surface" />
          <span className="flex-1">
            <span className="block h-3.5 w-2/3 animate-pulse rounded-full bg-surface" />
            <span className="mt-2 block h-3 w-1/2 animate-pulse rounded-full bg-surface" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function useDismiss(
  open: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  buttonRef: RefObject<HTMLButtonElement | null>,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [buttonRef, open, rootRef, setOpen]);
}
