"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Globe, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
};

function useClipId(suffix: string) {
  const id = useId().replace(/:/g, "");
  return `${suffix}-${id}`;
}

function FlagGeorgia() {
  const clipId = useClipId("flag-ka");

  return (
    <svg
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V16H0V0Z" fill="white" />
        <path d="M8.92578 0H12.0758V16H8.92578V0Z" fill="#FF0000" />
        <path d="M0 6.40002H21V9.60002H0V6.40002Z" fill="#FF0000" />
        <path
          clipRule="evenodd"
          d="M4.81648 12.4367C4.8493 11.8767 4.94773 11.4 4.94773 11.4C4.94773 11.4 4.62617 11.4333 4.46211 11.4333C4.29805 11.4333 3.97648 11.4 3.97648 11.4C3.97648 11.4 4.07492 11.8767 4.10773 12.44C3.5532 12.4067 3.08398 12.3067 3.08398 12.3067C3.08398 12.3067 3.1168 12.5533 3.1168 12.8C3.1168 13.0467 3.08398 13.2933 3.08398 13.2933C3.08398 13.2933 3.5532 13.1933 4.10773 13.16C4.07492 13.7233 3.97648 14.2 3.97648 14.2C3.97648 14.2 4.2193 14.1667 4.46211 14.1667C4.70492 14.1667 4.94773 14.2 4.94773 14.2C4.94773 14.2 4.8493 13.7233 4.81648 13.16C5.37102 13.1933 5.84023 13.2933 5.84023 13.2933C5.84023 13.2933 5.80742 12.9667 5.80742 12.8C5.80742 12.6333 5.84023 12.3067 5.84023 12.3067C5.84023 12.3067 5.37102 12.4067 4.81977 12.44L4.81648 12.4367ZM16.8915 2.83665C16.9243 2.27665 17.0227 1.79999 17.0227 1.79999C17.0227 1.79999 16.7012 1.83332 16.5371 1.83332C16.373 1.83332 16.0515 1.79999 16.0515 1.79999C16.0515 1.79999 16.1499 2.27665 16.1827 2.83665C15.6282 2.80332 15.159 2.70665 15.159 2.70665C15.159 2.70665 15.1918 2.95332 15.1918 3.19999C15.1918 3.44665 15.159 3.69332 15.159 3.69332C15.159 3.69332 15.6282 3.59332 16.1827 3.55999C16.1499 4.12332 16.0515 4.59999 16.0515 4.59999C16.0515 4.59999 16.2943 4.56665 16.5371 4.56665C16.7799 4.56665 17.0227 4.59999 17.0227 4.59999C17.0227 4.59999 16.9243 4.12332 16.8915 3.56332C17.446 3.59665 17.9152 3.69665 17.9152 3.69665C17.9152 3.69665 17.8824 3.36332 17.8824 3.19999C17.8824 3.03665 17.9152 2.70665 17.9152 2.70665C17.9152 2.70665 17.446 2.80665 16.8915 2.83999V2.83665ZM4.81648 2.83665C4.8493 2.27665 4.94773 1.79999 4.94773 1.79999C4.94773 1.79999 4.62617 1.83332 4.46211 1.83332C4.29805 1.83332 3.97648 1.79999 3.97648 1.79999C3.97648 1.79999 4.07492 2.27665 4.10773 2.83999C3.5532 2.80665 3.08398 2.70665 3.08398 2.70665C3.08398 2.70665 3.1168 2.95332 3.1168 3.19999C3.1168 3.44665 3.08398 3.69332 3.08398 3.69332C3.08398 3.69332 3.5532 3.59332 4.10773 3.55999C4.07492 4.12332 3.97648 4.59999 3.97648 4.59999C3.97648 4.59999 4.2193 4.56665 4.46211 4.56665C4.70492 4.56665 4.94773 4.59999 4.94773 4.59999C4.94773 4.59999 4.8493 4.12332 4.81648 3.55999C5.37102 3.59332 5.84023 3.69332 5.84023 3.69332C5.84023 3.69332 5.80742 3.36665 5.80742 3.19999C5.80742 3.03332 5.84023 2.70665 5.84023 2.70665C5.84023 2.70665 5.37102 2.80665 4.81977 2.83999L4.81648 2.83665ZM16.8915 12.4367C16.9243 11.8767 17.0227 11.4 17.0227 11.4C17.0227 11.4 16.7012 11.4333 16.5371 11.4333C16.373 11.4333 16.0515 11.4 16.0515 11.4C16.0515 11.4 16.1499 11.8767 16.1827 12.44C15.6282 12.4067 15.159 12.3067 15.159 12.3067C15.159 12.3067 15.1918 12.5533 15.1918 12.8C15.1918 13.0467 15.159 13.2933 15.159 13.2933C15.159 13.2933 15.6282 13.1933 16.1827 13.16C16.1499 13.7233 16.0515 14.2 16.0515 14.2C16.0515 14.2 16.2943 14.1667 16.5371 14.1667C16.7799 14.1667 17.0227 14.2 17.0227 14.2C17.0227 14.2 16.9243 13.7233 16.8915 13.16C17.446 13.1933 17.9152 13.2933 17.9152 13.2933C17.9152 13.2933 17.8824 12.9667 17.8824 12.8C17.8824 12.6333 17.9152 12.3067 17.9152 12.3067C17.9152 12.3067 17.446 12.4067 16.8915 12.44V12.4367Z"
          fill="#FF0000"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect fill="white" height="16" rx="4" width="21" />
        </clipPath>
      </defs>
    </svg>
  );
}

function FlagUnitedKingdom() {
  const clipId = useClipId("flag-en");

  return (
    <svg
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V16H0V0Z" fill="#012169" />
        <path
          d="M2.46094 0L10.4672 6.03333L18.4406 0H21V2.06667L13.125 8.03333L21 13.9667V16H18.375L10.5 10.0333L2.65781 16H0V14L7.84219 8.06667L0 2.13333V0H2.46094Z"
          fill="white"
        />
        <path
          d="M13.9125 9.36667L21 14.6667V16L12.1078 9.36667H13.9125ZM7.875 10.0333L8.07187 11.2L1.77187 16H0L7.875 10.0333ZM21 0V0.1L12.8297 6.36667L12.8953 4.9L19.3594 0H21ZM0 0L7.84219 5.86667H5.87344L0 1.4V0Z"
          fill="#C8102E"
        />
        <path
          d="M7.90781 0V16H13.1578V0H7.90781ZM0 5.33333V10.6667H21V5.33333H0Z"
          fill="white"
        />
        <path
          d="M0 6.43333V9.63333H21V6.43333H0ZM8.95781 0V16H12.1078V0H8.95781Z"
          fill="#C8102E"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect fill="white" height="16" rx="4" width="21" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LocaleFlag({ code }: { code: AppLocale }) {
  if (code === "ka") return <FlagGeorgia />;
  return <FlagUnitedKingdom />;
}

function LocaleOptions({
  listId,
  title,
  locale,
  labels,
  onSelect,
}: {
  listId: string;
  title: string;
  locale: AppLocale;
  labels: Record<AppLocale, string>;
  onSelect: (code: AppLocale) => void;
}) {
  return (
    <>
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
      </div>
      <ul id={listId} role="listbox" aria-label={title} className="space-y-1.5 p-2">
        {routing.locales.map((code) => {
          const active = locale === code;
          return (
            <li key={code} role="option" aria-selected={active}>
              <button
                type="button"
                className={`group/item flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all duration-200 ${
                  active
                    ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                    : "hover:bg-secondary/80 active:bg-secondary"
                }`}
                onClick={() => onSelect(code)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-secondary">
                  <LocaleFlag code={code} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[15px] font-semibold leading-tight text-foreground">
                    {labels[code]}
                  </span>
                  <span className="mt-0.5 block text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                    {code}
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
        })}
      </ul>
    </>
  );
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const mobileListId = useId();
  const isDark = variant === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        sheetRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const labels: Record<AppLocale, string> = {
    ka: t("ka"),
    en: t("en"),
  };

  function selectLocale(code: AppLocale) {
    router.replace(pathname, { locale: code });
    setOpen(false);
  }

  const shellClass = isDark
    ? "border-white/18 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-white/35 hover:bg-white/14"
    : "border-border/80 bg-card/90 text-foreground shadow-[0_8px_28px_rgba(14,20,17,0.06)] backdrop-blur-xl hover:border-primary/35 hover:shadow-[0_10px_36px_rgba(47,107,79,0.12)]";

  const iconButtonClass = isDark
    ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground";

  const mobileSheet =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[80] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t("switch")}
          >
            <button
              type="button"
              aria-label={t("close")}
              className="absolute inset-0 bg-ink/55 backdrop-blur-[2px] animate-[search-sheet-backdrop-in_220ms_ease-out]"
              onClick={() => setOpen(false)}
            />
            <div
              ref={sheetRef}
              className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-18px_60px_rgba(14,20,17,0.28)] animate-[search-sheet-in_320ms_cubic-bezier(0.22,1,0.36,1)]"
            >
              <div className="flex shrink-0 flex-col items-center px-4 pt-3">
                <span
                  className="mb-3 h-1 w-10 rounded-full bg-border"
                  aria-hidden="true"
                />
                <div className="flex w-full items-center justify-between gap-3 pb-3">
                  <h2 className="font-display text-[18px] font-semibold text-foreground">
                    {t("switch")}
                  </h2>
                  <button
                    type="button"
                    aria-label={t("close")}
                    onClick={() => setOpen(false)}
                    className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="min-h-0 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
                <LocaleOptions
                  listId={mobileListId}
                  title={t("switch")}
                  locale={locale}
                  labels={labels}
                  onSelect={selectLocale}
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
        aria-label={t("switch")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex size-10 items-center justify-center rounded-full border transition-colors md:hidden ${iconButtonClass}`}
      >
        <Globe className="size-3.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label={t("switch")}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={`group hidden items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 md:flex ${shellClass}`}
      >
        <LocaleFlag code={locale} />
        <span className="text-[13px] font-medium uppercase tracking-wider">
          {locale}
        </span>
      </button>

      {open ? (
        <div
          id={listId}
          className="absolute right-0 top-full z-50 mt-3 hidden w-[360px] origin-top overflow-hidden rounded-[22px] border border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(14,20,17,0.16)] backdrop-blur-2xl animate-[search-panel-in_220ms_ease-out] md:block"
        >
          <LocaleOptions
            listId={`${listId}-options`}
            title={t("switch")}
            locale={locale}
            labels={labels}
            onSelect={selectLocale}
          />
        </div>
      ) : null}

      {mobileSheet}
    </div>
  );
}
