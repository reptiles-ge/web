"use client";

import { ChevronUp, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useSelectLocale } from "@/components/LanguageSwitcher";
import { type AppLocale, routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function BackToTop({ label, text }: { label: string; text: string }) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/14 px-4 text-[13.5px] text-white/82 transition-colors hover:bg-white/8 hover:text-white lg:h-10 lg:px-3.5 lg:text-[13px]"
      onClick={() => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ behavior: reduce ? "auto" : "smooth", top: 0 });
      }}
      type="button"
    >
      <ChevronUp aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      {text}
    </button>
  );
}

export function FooterLanguageSwitch() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const selectLocale = useSelectLocale();

  return (
    <div className="flex items-center gap-3.5">
      <Globe
        aria-hidden="true"
        className="hidden size-[15px] text-white/50 lg:block"
        strokeWidth={1.75}
      />
      <div
        aria-label={t("switch")}
        className="flex flex-1 gap-0.5 rounded-full bg-white/7 p-1 lg:gap-3.5 lg:bg-transparent lg:p-0"
        role="radiogroup"
      >
        {routing.locales.map((code) => {
          const active = code === locale;
          return (
            <button
              aria-checked={active}
              aria-label={t(code)}
              className={cn(
                "h-[42px] flex-1 cursor-pointer rounded-full text-[13.5px] font-semibold transition-colors lg:h-auto lg:flex-none lg:rounded-none lg:px-0.5 lg:py-1.5 lg:text-[13px] lg:underline-offset-[6px]",
                active
                  ? "bg-white text-ink lg:bg-transparent lg:text-white lg:underline"
                  : "text-white/70 hover:text-white lg:font-normal lg:text-white/56",
              )}
              key={code}
              onClick={() => selectLocale(code)}
              role="radio"
              type="button"
            >
              <span className="lg:hidden">
                {code === "ka" ? "ქა" : code.toUpperCase()}
              </span>
              <span className="hidden lg:inline">{t(code)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
