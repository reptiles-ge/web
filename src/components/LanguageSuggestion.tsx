"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { useSelectLocale } from "@/components/LanguageSwitcher";
import { trackEvent } from "@/lib/analytics";
import {
  isLikelyBot,
  LANGUAGE_SUGGESTION_COPY,
  LANGUAGE_SUGGESTION_KEY,
  needsCountry,
  suggestLocale,
} from "@/lib/languageSuggestion";

type Suggestion = { from: AppLocale; to: AppLocale };

export function LanguageSuggestion() {
  const locale = useLocale() as AppLocale;
  const selectLocale = useSelectLocale();
  const [suggestion, setSuggestion] = useState<null | Suggestion>(null);

  useEffect(() => {
    if (!canSuggest()) return;
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    const controller = new AbortController();

    function show(country: null | string) {
      if (controller.signal.aborted) return;
      const to = suggestLocale({ country, current: locale, languages });
      if (!to || !hasAlternate(to)) return;
      setSuggestion({ from: locale, to });
      trackEvent("language_suggestion_shown", {
        language: to,
        previous_language: locale,
      });
    }

    if (!needsCountry(locale, languages)) {
      show(null);
    } else {
      fetch("/api/geo", { cache: "no-store", signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: null | { country?: null | string }) => {
          if (data) show(data.country ?? null);
        })
        .catch(() => undefined);
    }

    return () => controller.abort();
  }, [locale]);

  if (!suggestion || suggestion.from !== locale) return null;

  const copy = LANGUAGE_SUGGESTION_COPY[suggestion.to];

  function accept(to: AppLocale) {
    store();
    setSuggestion(null);
    trackEvent("language_suggestion_accepted", {
      language: to,
      previous_language: locale,
    });
    selectLocale(to);
  }

  function dismiss(to: AppLocale) {
    store();
    setSuggestion(null);
    trackEvent("language_suggestion_dismissed", {
      language: to,
      previous_language: locale,
    });
  }

  return (
    <section
      aria-label={copy.text}
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 text-foreground sm:right-auto sm:w-80"
      lang={suggestion.to}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug">{copy.text}</p>
          <button
            className="mt-3 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
            onClick={() => accept(suggestion.to)}
            type="button"
          >
            {copy.action}
          </button>
        </div>
        <button
          aria-label={copy.close}
          className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => dismiss(suggestion.to)}
          type="button"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </section>
  );
}

function canSuggest() {
  if (isLikelyBot(navigator.userAgent, navigator.webdriver === true)) {
    return false;
  }
  try {
    return window.localStorage.getItem(LANGUAGE_SUGGESTION_KEY) === null;
  } catch {
    return false;
  }
}

function hasAlternate(locale: AppLocale) {
  return (
    document.querySelector(`link[rel="alternate"][hreflang="${locale}"]`) !==
    null
  );
}

function store() {
  try {
    window.localStorage.setItem(LANGUAGE_SUGGESTION_KEY, "1");
  } catch {
    return;
  }
}
