"use client";

import { Check, Star, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

const STORAGE_KEY = "reptiles-rating";
const RATED = "rated";
const SHOW_AFTER_SECONDS = 60;
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
const THANKS_MS = 2600;
const STARS = [1, 2, 3, 4, 5] as const;
const LEVELS = {
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
} as const;

type Phase = "ask" | "hidden" | "thanks";

type Stars = 0 | (typeof STARS)[number];

export function SiteRating() {
  const t = useTranslations("rating");
  const locale = useLocale();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [hovered, setHovered] = useState<Stars>(0);
  const [selected, setSelected] = useState<Stars>(0);

  useEffect(() => {
    if (!canAsk()) return;
    let seconds = 0;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      if (seconds < SHOW_AFTER_SECONDS) return;
      window.clearInterval(timer);
      if (canAsk()) setPhase("ask");
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase !== "thanks") return;
    const timer = window.setTimeout(() => setPhase("hidden"), THANKS_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden") return null;

  const active = hovered || selected;

  function rate(rating: (typeof STARS)[number]) {
    setSelected(rating);
    setPhase("thanks");
    store(RATED);
    void fetch("/api/rating", {
      body: JSON.stringify({
        locale,
        path: window.location.pathname,
        rating,
      }),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  }

  function dismiss() {
    setPhase("hidden");
    store(String(Date.now()));
  }

  return (
    <section
      aria-label={t("title")}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 w-64 max-w-[calc(100vw-2rem)] animate-[rating-in_420ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-card border border-border bg-card p-4 text-foreground shadow-[0_18px_44px_-26px_rgba(14,20,17,0.5)] motion-reduce:animate-none"
    >
      {phase === "thanks" ? (
        <div className="py-2 text-center" role="status">
          <Check
            aria-hidden="true"
            className="mx-auto size-6 text-primary"
            strokeWidth={1.75}
          />
          <p className="mt-1.5 text-sm font-bold">{t("thanksTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("thanksBody")}</p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm leading-snug font-bold">{t("title")}</p>
            <button
              aria-label={t("close")}
              className="-mt-1 -mr-1 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={dismiss}
              type="button"
            >
              <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <div
            className="mt-3 -ml-1 flex gap-1"
            onMouseLeave={() => setHovered(0)}
          >
            {STARS.map((star) => (
              <button
                aria-label={t("star", { count: star })}
                className="rounded-full p-1 transition-transform duration-150 hover:scale-115 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
                key={star}
                onBlur={() => setHovered(0)}
                onClick={() => rate(star)}
                onFocus={() => setHovered(star)}
                onMouseEnter={() => setHovered(star)}
                type="button"
              >
                <Star
                  aria-hidden="true"
                  className={cn(
                    "size-6 transition-colors duration-150",
                    star <= active
                      ? "fill-gold text-gold"
                      : "fill-transparent text-muted-foreground",
                  )}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {active ? t(LEVELS[active]) : t("hint")}
          </p>
        </>
      )}
    </section>
  );
}

function canAsk() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;
    if (stored === RATED) return false;
    return Date.now() - Number(stored) > DISMISS_MS;
  } catch {
    return false;
  }
}

function store(value: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }
}
