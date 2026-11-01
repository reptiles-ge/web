"use client";

import { Star, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { BrandText } from "@/components/BrandName";
import { SiteRatingMascot } from "@/components/SiteRatingMascot";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  MAX_FEEDBACK_LENGTH,
  needsFeedback,
  normalizeFeedback,
} from "@/lib/ratingFeedback";

const STORAGE_KEY = "reptiles-rating";
const SECONDS_KEY = "reptiles-rating-seconds";
const PAGES_KEY = "reptiles-rating-pages";
const RATED = "rated";
const SHOW_AFTER_SECONDS = 60;
const SHOW_AFTER_PAGES = 2;
const QUIZ_PATH = /^(?:\/(?:en|ru|tr))?\/quiz(?:\/|$)/;
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

type Phase = "ask" | "feedback" | "hidden" | "thanks";

type Stars = 0 | (typeof STARS)[number];

export function SiteRating() {
  const t = useTranslations("rating");
  const locale = useLocale();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [hovered, setHovered] = useState<Stars>(0);
  const [selected, setSelected] = useState<Stars>(0);
  const [ducks, setDucks] = useState(0);
  const [feedback, setFeedback] = useState("");
  const pathname = usePathname();
  const seconds = useRef(0);
  const pages = useRef(0);
  const onQuiz = QUIZ_PATH.test(pathname);
  const blocked = useRef(onQuiz);
  const lastPathname = useRef<null | string>(null);
  const feedbackField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    blocked.current = onQuiz;
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    pages.current = readCount(PAGES_KEY) + 1;
    storeCount(PAGES_KEY, pages.current);
  }, [onQuiz, pathname]);

  useEffect(() => {
    if (!canAsk()) return;
    seconds.current = readCount(SECONDS_KEY);
    let asked = false;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds.current += 1;
      storeCount(SECONDS_KEY, seconds.current);
      if (asked) {
        if (!canAsk()) window.clearInterval(timer);
        return;
      }
      if (
        seconds.current < SHOW_AFTER_SECONDS ||
        pages.current < SHOW_AFTER_PAGES ||
        blocked.current
      ) {
        return;
      }
      asked = true;
      if (!canAsk()) {
        window.clearInterval(timer);
        return;
      }
      setPhase("ask");
      trackEvent("site_rating_shown");
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase === "feedback") feedbackField.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "thanks") return;
    const timer = window.setTimeout(() => setPhase("hidden"), THANKS_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden" || onQuiz) return null;

  const active = hovered || selected;

  function choose(rating: (typeof STARS)[number]) {
    setSelected(rating);
    if (needsFeedback(rating)) {
      setPhase("feedback");
      return;
    }
    send(rating, null);
  }

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = normalizeFeedback(feedback);
    if (!selected || !text) return;
    send(selected, text);
  }

  function send(rating: (typeof STARS)[number], text: null | string) {
    setPhase("thanks");
    store(RATED);
    trackEvent("site_rating", { rating });
    void fetch("/api/rating", {
      body: JSON.stringify({
        feedback: text ?? undefined,
        locale,
        pages: pages.current,
        path: window.location.pathname,
        rating,
        referrer: externalReferrer(),
        seconds: seconds.current,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => undefined);
  }

  function dismiss() {
    setPhase("hidden");
    store(String(Date.now()));
    trackEvent("site_rating_dismissed");
  }

  return (
    <section
      aria-label={t("title")}
      className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-auto z-40 w-[min(15rem,calc(100vw-1.5rem))] animate-[rating-in_420ms_cubic-bezier(0.22,1,0.36,1)_both] text-foreground motion-reduce:animate-none sm:right-4 sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:w-64"
    >
      <button
        aria-hidden="true"
        className={cn(
          "absolute right-7 bottom-full -mb-px hidden cursor-pointer motion-reduce:animate-none sm:block",
          ducks
            ? "animate-[rating-duck_1200ms_cubic-bezier(0.45,0,0.3,1)_both]"
            : "animate-[rating-peek_560ms_cubic-bezier(0.34,1.56,0.64,1)_420ms_both]",
        )}
        key={ducks}
        onClick={() => setDucks((count) => count + 1)}
        tabIndex={-1}
        type="button"
      >
        <SiteRatingMascot
          happy={phase === "thanks" && selected >= 4}
          mood={active}
        />
      </button>
      <div className="relative rounded-card border border-border bg-card px-3 py-2.5 shadow-[0_18px_44px_-26px_rgba(14,20,17,0.5)] sm:p-4">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -top-1.5 right-7 hidden h-2.5 w-16 animate-[rating-pop_260ms_ease-out_860ms_both] motion-reduce:animate-none sm:block"
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
              <p className="text-[13px] leading-snug font-bold sm:text-sm">
                <BrandText text={t("title")} />
              </p>
              <button
                aria-label={t("close")}
                className="-my-3 -mr-3 grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={dismiss}
                type="button"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <div
              className="mt-1 -ml-1 flex gap-1 sm:mt-3"
              onMouseLeave={() => setHovered(0)}
            >
              {STARS.map((star) => (
                <button
                  aria-label={t("star", { count: star })}
                  className="rounded-full p-1 transition-transform duration-150 hover:scale-115 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 motion-reduce:transition-none"
                  key={star}
                  onBlur={() => setHovered(0)}
                  onClick={() => choose(star)}
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
                "mt-1.5 hidden text-xs transition-colors duration-150 sm:block",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {active ? t(LEVELS[active]) : t("hint")}
            </p>
            {phase === "feedback" ? (
              <form className="mt-2" onSubmit={submitFeedback}>
                <label
                  className="text-xs font-bold"
                  htmlFor="site-rating-feedback"
                >
                  {t("feedbackLabel")}
                </label>
                <textarea
                  className="mt-1 block w-full resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                  id="site-rating-feedback"
                  maxLength={MAX_FEEDBACK_LENGTH}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder={t("feedbackPlaceholder")}
                  ref={feedbackField}
                  rows={3}
                  value={feedback}
                />
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {t("feedbackPrivacy")}
                </p>
                <button
                  className="mt-2 w-full rounded-full bg-primary px-3 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-ink"
                  disabled={!normalizeFeedback(feedback)}
                  type="submit"
                >
                  {t("feedbackSend")}
                </button>
              </form>
            ) : null}
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

function externalReferrer() {
  try {
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? host : undefined;
  } catch {
    return undefined;
  }
}

function readCount(key: string) {
  try {
    const stored = Number(window.sessionStorage.getItem(key));
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

function storeCount(key: string, value: number) {
  try {
    window.sessionStorage.setItem(key, String(value));
  } catch {
    return;
  }
}
