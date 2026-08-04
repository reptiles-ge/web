"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { X } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "reptiles-beta-banner-dismissed";

let dismissed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return dismissed;
}

function getServerSnapshot() {
  return true;
}

function readDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

if (typeof window !== "undefined") {
  dismissed = readDismissed();
}

function dismissBanner() {
  dismissed = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  emit();
}

export function BetaBanner() {
  const { t } = useLocale();
  const isDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const visible = !isDismissed;

  useEffect(() => {
    const root = document.documentElement;
    if (visible) {
      root.style.setProperty("--beta-banner-height", "40px");
    } else {
      root.style.setProperty("--beta-banner-height", "0px");
    }
    return () => {
      root.style.setProperty("--beta-banner-height", "0px");
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-60 flex h-10 items-center justify-center gap-3 bg-ink px-4 text-ink-foreground"
    >
      <p className="max-w-[min(100%,42rem)] pr-8 text-center text-[12px] leading-snug tracking-wide sm:pr-0 sm:text-[13px] sm:leading-none">
        <span className="mr-2 inline-block rounded-sm bg-gold/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
          Beta
        </span>
        {t.beta.text}
      </p>
      <button
        type="button"
        onClick={dismissBanner}
        aria-label={t.beta.dismiss}
        className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/10 hover:text-ink-foreground sm:right-5"
      >
        <X className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
