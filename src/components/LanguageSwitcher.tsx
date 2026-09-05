"use client";

import { OverlayPanel } from "@/components/OverlayPanel";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";

const STATIC_LOCALE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/species",
  "/snakes",
  "/lizards",
  "/turtles",
  "/amphibians",
  "/birds",
  "/mammals",
  "/spiders",
  "/spiders/shxamiani-obobebi",
  "/spiders/obobis-nakbeni",
  "/venomous-snakes",
  "/snakes-in-the-yard",
  "/risk-to-humans",
  "/amphibians/bayayi",
  "/snakes/saxeoebebi",
  "/snakes/shxamiani-gvelis-amocnoba",
  "/snakes/gvelis-nakbeni",
  "/snakes/gavrtseleba",
  "/snakes/didi-gvelebi",
  "/lizards/saxeoebebi",
  "/lizards/identifikacia",
  "/lizards/darevskia",
  "/lizards/xvliki-saxlshi",
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
  "/turtles/saxeoebebi",
  "/turtles/xmelis-kuebi",
  "/turtles/tsqlis-kuebi",
  "/turtles/identifikacia",
  "/amphibians/saxeoebebi",
  "/amphibians/bayayi/saxeoebebi",
  "/amphibians/tritoni-salamandra",
  "/birds/saxeoebebi",
  "/mammals/saxeoebebi",
  "/mammals/tura-ezoshi",
  "/mammals/datvi-shekhvedra",
  "/regions",
  "/quiz",
  "/news",
] as const;

type LanguageSwitcherProps = {
  switchIndex: LocaleSwitchIndex;
  variant?: "dark" | "light";
};

type LocaleOptionsProps = {
  labels: Record<AppLocale, string>;
  listId: string;
  locale: AppLocale;
  onSelect: (code: AppLocale) => void;
  title: string;
};
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";

import { pushPageContext, trackEvent } from "@/lib/analytics";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
  chromeShellClass,
} from "@/lib/chromeStyles";
import { cn } from "@/lib/cn";
import {
  quizHrefFromIndex,
  resolvePageContextFromIndex,
  resolveSpeciesIdFromIndex,
  speciesHrefFromIndex,
  type LocaleSwitchIndex,
} from "@/lib/localeSwitch";

type StaticLocalePath = (typeof STATIC_LOCALE_PATHS)[number];

export function LanguageSwitcher({
  switchIndex,
  variant = "light",
}: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const mobileListId = useId();

  const close = useCallback(() => setOpen(false), []);

  const labels: Record<AppLocale, string> = {
    en: t("en"),
    ka: t("ka"),
    ru: t("ru"),
    tr: t("tr"),
  };

  function selectLocale(code: AppLocale) {
    const slug = typeof params.slug === "string" ? params.slug : undefined;
    const id = typeof params.id === "string" ? params.id : undefined;
    if (code !== locale) {
      const context = resolvePageContextFromIndex(switchIndex, pathname, locale, {
        id,
        slug,
      });
      trackEvent("language_change", {
        entity_id: context.entity_id,
        language: code,
        page_type: context.page_type,
        previous_language: locale,
      });
      pushPageContext({
        entity_id: context.entity_id,
        group: context.group,
        language: code,
        page_type: context.page_type,
      });
    }
    const hub = (
      [
        "snakes",
        "lizards",
        "turtles",
        "amphibians",
        "birds",
        "mammals",
        "spiders",
      ] as const
    ).find((item) => pathname === `/${item}/[slug]`);

    if (hub && slug) {
      const speciesId = resolveSpeciesIdFromIndex(switchIndex, slug);
      if (speciesId && switchIndex.hubById[speciesId] === hub) {
        router.replace(speciesHrefFromIndex(switchIndex, speciesId, code), {
          locale: code,
        });
        close();
        return;
      }
    }

    if (pathname === "/quiz/[slug]" && slug) {
      const quiz = switchIndex.quizzes.find(
        (item) => item.slugs[locale] === slug,
      );
      if (quiz) {
        router.replace(quizHrefFromIndex(switchIndex, quiz.id, code), {
          locale: code,
        });
        close();
        return;
      }
    }

    if (pathname === "/regions/[id]" && id) {
      router.replace({ params: { id }, pathname: "/regions/[id]" }, { locale: code });
      close();
      return;
    }

    if (pathname === "/news/[slug]" && slug) {
      router.replace(
        { params: { slug }, pathname: "/news/[slug]" },
        { locale: code },
      );
      close();
      return;
    }

    if (pathname === "/species/[id]" && id) {
      const speciesId = resolveSpeciesIdFromIndex(switchIndex, id);
      if (speciesId) {
        router.replace(speciesHrefFromIndex(switchIndex, speciesId, code), {
          locale: code,
        });
        close();
        return;
      }
    }

    if (isStaticLocalePath(pathname)) {
      router.replace(pathname, { locale: code });
    }
    close();
  }

  const shellClass = chromeShellClass(variant);
  const iconButtonClass = chromeIconButtonClass(variant);

  const options = (listKey: string) => (
    <LocaleOptions
      labels={labels}
      listId={listKey}
      locale={locale}
      onSelect={selectLocale}
      title={t("switch")}
    />
  );

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-label={t("switch")}
        className={cn(chromeIconButtonBase, "md:hidden", iconButtonClass)}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Globe aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      </button>

      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-label={t("switch")}
        className={cn(
          "group hidden items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 md:flex",
          shellClass,
        )}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <LocaleFlag code={locale} />
        <span className="text-[13px] font-medium tracking-wide">
          {labels[locale]}
        </span>
      </button>

      <OverlayPanel
        closeLabel={t("close")}
        desktopContent={options(`${listId}-options`)}
        mobileContent={options(mobileListId)}
        onClose={close}
        open={open}
        panelId={listId}
        rootRef={rootRef}
        title={t("switch")}
      />
    </div>
  );
}

function FlagGeorgia() {
  const clipId = useClipId("flag-ka");

  return (
    <svg
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V16H0V0Z" fill="white" />
        <path d="M8.93 0H12.08V16H8.93V0Z" fill="#FF0000" />
        <path d="M0 6.4H21V9.6H0V6.4Z" fill="#FF0000" />
        <path
          clipRule="evenodd"
          d="M4.82 12.44C4.85 11.88 4.95 11.4 4.95 11.4C4.95 11.4 4.63 11.43 4.46 11.43C4.3 11.43 3.98 11.4 3.98 11.4C3.98 11.4 4.07 11.88 4.11 12.44C3.55 12.41 3.08 12.31 3.08 12.31C3.08 12.31 3.12 12.55 3.12 12.8C3.12 13.05 3.08 13.29 3.08 13.29C3.08 13.29 3.55 13.19 4.11 13.16C4.07 13.72 3.98 14.2 3.98 14.2C3.98 14.2 4.22 14.17 4.46 14.17C4.7 14.17 4.95 14.2 4.95 14.2C4.95 14.2 4.85 13.72 4.82 13.16C5.37 13.19 5.84 13.29 5.84 13.29C5.84 13.29 5.81 12.97 5.81 12.8C5.81 12.63 5.84 12.31 5.84 12.31C5.84 12.31 5.37 12.41 4.82 12.44L4.82 12.44ZM16.89 2.84C16.92 2.28 17.02 1.8 17.02 1.8C17.02 1.8 16.7 1.83 16.54 1.83C16.37 1.83 16.05 1.8 16.05 1.8C16.05 1.8 16.15 2.28 16.18 2.84C15.63 2.8 15.16 2.71 15.16 2.71C15.16 2.71 15.19 2.95 15.19 3.2C15.19 3.45 15.16 3.69 15.16 3.69C15.16 3.69 15.63 3.59 16.18 3.56C16.15 4.12 16.05 4.6 16.05 4.6C16.05 4.6 16.29 4.57 16.54 4.57C16.78 4.57 17.02 4.6 17.02 4.6C17.02 4.6 16.92 4.12 16.89 3.56C17.45 3.6 17.92 3.7 17.92 3.7C17.92 3.7 17.88 3.36 17.88 3.2C17.88 3.04 17.92 2.71 17.92 2.71C17.92 2.71 17.45 2.81 16.89 2.84V2.84ZM4.82 2.84C4.85 2.28 4.95 1.8 4.95 1.8C4.95 1.8 4.63 1.83 4.46 1.83C4.3 1.83 3.98 1.8 3.98 1.8C3.98 1.8 4.07 2.28 4.11 2.84C3.55 2.81 3.08 2.71 3.08 2.71C3.08 2.71 3.12 2.95 3.12 3.2C3.12 3.45 3.08 3.69 3.08 3.69C3.08 3.69 3.55 3.59 4.11 3.56C4.07 4.12 3.98 4.6 3.98 4.6C3.98 4.6 4.22 4.57 4.46 4.57C4.7 4.57 4.95 4.6 4.95 4.6C4.95 4.6 4.85 4.12 4.82 3.56C5.37 3.59 5.84 3.69 5.84 3.69C5.84 3.69 5.81 3.37 5.81 3.2C5.81 3.03 5.84 2.71 5.84 2.71C5.84 2.71 5.37 2.81 4.82 2.84L4.82 2.84ZM16.89 12.44C16.92 11.88 17.02 11.4 17.02 11.4C17.02 11.4 16.7 11.43 16.54 11.43C16.37 11.43 16.05 11.4 16.05 11.4C16.05 11.4 16.15 11.88 16.18 12.44C15.63 12.41 15.16 12.31 15.16 12.31C15.16 12.31 15.19 12.55 15.19 12.8C15.19 13.05 15.16 13.29 15.16 13.29C15.16 13.29 15.63 13.19 16.18 13.16C16.15 13.72 16.05 14.2 16.05 14.2C16.05 14.2 16.29 14.17 16.54 14.17C16.78 14.17 17.02 14.2 17.02 14.2C17.02 14.2 16.92 13.72 16.89 13.16C17.45 13.19 17.92 13.29 17.92 13.29C17.92 13.29 17.88 12.97 17.88 12.8C17.88 12.63 17.92 12.31 17.92 12.31C17.92 12.31 17.45 12.41 16.89 12.44V12.44Z"
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

function FlagRussia() {
  const clipId = useClipId("flag-ru");

  return (
    <svg
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V5.33H0V0Z" fill="white" />
        <path d="M0 5.33H21V10.67H0V5.33Z" fill="#0039A6" />
        <path d="M0 10.67H21V16H0V10.67Z" fill="#D52B1E" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect fill="white" height="16" rx="4" width="21" />
        </clipPath>
      </defs>
    </svg>
  );
}

function FlagTurkey() {
  const clipId = useClipId("flag-tr");

  return (
    <svg
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V16H0V0Z" fill="#E30A17" />
        <circle cx="8.4" cy="8" fill="white" r="3.35" />
        <circle cx="9.35" cy="8" fill="#E30A17" r="2.65" />
        <path
          d="M12.55 8L14.85 8.95L14.05 6.55L15.75 5.05L13.25 4.95L12.55 2.6L11.85 4.95L9.35 5.05L11.05 6.55L10.25 8.95L12.55 8Z"
          fill="white"
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
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px]"
      fill="none"
      height="16"
      viewBox="0 0 21 16"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 0H21V16H0V0Z" fill="#012169" />
        <path
          d="M2.46 0L10.47 6.03L18.44 0H21V2.07L13.12 8.03L21 13.97V16H18.38L10.5 10.03L2.66 16H0V14L7.84 8.07L0 2.13V0H2.46Z"
          fill="white"
        />
        <path
          d="M13.91 9.37L21 14.67V16L12.11 9.37H13.91ZM7.88 10.03L8.07 11.2L1.77 16H0L7.88 10.03ZM21 0V0.1L12.83 6.37L12.9 4.9L19.36 0H21ZM0 0L7.84 5.87H5.87L0 1.4V0Z"
          fill="#C8102E"
        />
        <path
          d="M7.91 0V16H13.16V0H7.91ZM0 5.33V10.67H21V5.33H0Z"
          fill="white"
        />
        <path
          d="M0 6.43V9.63H21V6.43H0ZM8.96 0V16H12.11V0H8.96Z"
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

function isStaticLocalePath(pathname: string): pathname is StaticLocalePath {
  return (STATIC_LOCALE_PATHS as readonly string[]).includes(pathname);
}

function LocaleFlag({ code }: { code: AppLocale }) {
  if (code === "ka") return <FlagGeorgia />;
  if (code === "ru") return <FlagRussia />;
  if (code === "tr") return <FlagTurkey />;

  return <FlagUnitedKingdom />;
}

function LocaleOptions({
  labels,
  listId,
  locale,
  onSelect,
  title,
}: LocaleOptionsProps) {
  return (
    <>
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {title}
        </p>
      </div>
      <ul
        aria-label={title}
        className="space-y-1.5 p-2"
        id={listId}
        role="listbox"
      >
        {routing.locales.map((code) => {
          const active = locale === code;
          return (
            <li key={code}>
              <button
                aria-selected={active}
                className={cn(
                  "group/item flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-[background-color,box-shadow] duration-200",
                  active
                    ? "bg-primary/9 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                    : "hover:bg-secondary/80 active:bg-secondary",
                )}
                onClick={() => onSelect(code)}
                role="option"
                type="button"
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-secondary">
                  <LocaleFlag code={code} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[15px] leading-tight font-semibold text-foreground">
                    {labels[code]}
                  </span>
                  <span className="mt-0.5 block text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
                    {code}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mr-1 size-1.5 shrink-0 rounded-full transition-opacity",
                    active ? "bg-primary opacity-100" : "opacity-0",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function useClipId(suffix: string) {
  const id = useId().replace(/:/g, "");
  return `${suffix}-${id}`;
}
