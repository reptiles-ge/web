"use client";

import { Star, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type CSSProperties, useEffect, useState } from "react";

import { SiteRatingMascot } from "@/components/SiteRatingMascot";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "reptiles-rating";
const SECONDS_KEY = "reptiles-rating-seconds";
const RATED = "rated";
const SHOW_AFTER_SECONDS = 60;
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
const THANKS_MS = 3400;
const STARS = [1, 2, 3, 4, 5] as const;
const LEVELS = {
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
} as const;

const PAW_TOES = [8, 12.5, 17, 47, 51.5, 56] as const;
const BURST = [
  [-58, -8],
  [-44, -34],
  [-20, -48],
  [6, -52],
  [30, -44],
  [52, -24],
  [62, 2],
  [-30, 10],
] as const;

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
    let seconds = readSeconds();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      storeSeconds(seconds);
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
    trackEvent("site_rating", { rating });
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
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 animate-[rating-in_420ms_cubic-bezier(0.22,1,0.36,1)_both] text-foreground motion-reduce:animate-none sm:left-auto sm:w-64"
    >
      <div className="pointer-events-none absolute right-7 bottom-full -mb-px animate-[rating-peek_560ms_cubic-bezier(0.34,1.56,0.64,1)_420ms_both] motion-reduce:animate-none">
        <SiteRatingMascot
          happy={phase === "thanks" && selected >= 4}
          mood={active}
        />
      </div>
      <div className="relative rounded-card border border-border bg-card p-4 shadow-[0_18px_44px_-26px_rgba(14,20,17,0.5)]">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -top-1.5 right-7 h-2.5 w-16 animate-[rating-pop_260ms_ease-out_860ms_both] motion-reduce:animate-none"
          viewBox="0 0 64 10"
        >
          {PAW_TOES.map((cx) => (
            <circle className="fill-primary" cx={cx} cy="5" key={cx} r="2.7" />
          ))}
        </svg>
        {phase === "thanks" ? (
          <div className="relative py-1 text-center" role="status">
            {selected >= 4
              ? BURST.map(([x, y], index) => (
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-1/2 size-1.5 animate-[rating-burst_900ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-full bg-gold motion-reduce:hidden"
                    key={`${x}-${y}`}
                    style={
                      {
                        "--rating-x": `${x}px`,
                        "--rating-y": `${y}px`,
                        animationDelay: `${180 + index * 25}ms`,
                      } as CSSProperties
                    }
                  />
                ))
              : null}
            <div className="flex justify-center gap-1">
              {STARS.map((star) => (
                <Star
                  aria-hidden="true"
                  className={cn(
                    "size-5 animate-[rating-pop_420ms_cubic-bezier(0.34,1.56,0.64,1)_both] motion-reduce:animate-none",
                    star <= selected
                      ? "fill-gold text-gold"
                      : "fill-transparent text-border",
                  )}
                  key={star}
                  strokeWidth={1.5}
                  style={{ animationDelay: `${star * 70}ms` }}
                />
              ))}
            </div>
            <p className="mt-2 text-sm font-bold">{t("thanksTitle")}</p>
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
                  className="rounded-full p-1 transition-transform duration-150 hover:scale-115 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 motion-reduce:transition-none"
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
            <p
              className={cn(
                "mt-1.5 text-xs transition-colors duration-150",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {active ? t(LEVELS[active]) : t("hint")}
            </p>
          </>
        )}
      </div>
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

function readSeconds() {
  try {
    const stored = Number(window.sessionStorage.getItem(SECONDS_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return 0;
  }
}

function store(value: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }
}

function storeSeconds(seconds: number) {
  try {
    window.sessionStorage.setItem(SECONDS_KEY, String(seconds));
  } catch {
    return;
  }
}
