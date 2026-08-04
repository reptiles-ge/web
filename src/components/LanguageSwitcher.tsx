"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const buttonClass =
    variant === "dark"
      ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
      : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground";

  const labels: Record<AppLocale, string> = {
    ka: t("ka"),
    en: t("en"),
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={t("switch")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${buttonClass}`}
      >
        <Globe className="size-3.5" aria-hidden="true" />
        <span className="uppercase tracking-wider">{locale}</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-2xl border border-border bg-card py-1 shadow-lg">
          {routing.locales.map((code) => (
            <button
              key={code}
              type="button"
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-secondary hover:text-foreground ${
                locale === code
                  ? "bg-secondary text-foreground"
                  : "text-foreground/80"
              }`}
              onClick={() => {
                router.replace(pathname, { locale: code });
                setOpen(false);
              }}
            >
              <span>{labels[code]}</span>
              <span className="uppercase tracking-wider text-muted-foreground">
                {code}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
